"use client"

import { PopoverContent } from "@/components/ui/popover"
import { PopoverTrigger } from "@/components/ui/popover"
import { Popover } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import type React from "react"
import { useMemo } from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  EyeOff,
  Eye,
  Loader2,
  FileText,
  PanelRight,
  PanelBottom,
  AlertTriangle,
  GripVertical,
  Camera,
  ExternalLink,
  Columns,
  Rows,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowLeft,
  UserCircle,
} from "lucide-react"
import { ensureModelsLoaded, compareFaces, detectFaceFromVideo } from "@/lib/model-loader"
import { getFaceDescriptor, getUnreadMessagesForUser, markMessageAsRead, type AdminMessage } from "@/lib/face-recognition"
import { getRemoteCommands, markCommandExecuted, executeAutoProcessing, saveStudyLog } from "@/lib/remote-control"
import { useCourseProgress } from "@/hooks/use-course-progress"
import { useCourseProgress as useCourseProgressContext } from "@/contexts/course-progress-context"
import { getDemoVideo, getPartVideo } from "@/lib/video-data"
import { VideoPlayer, type VideoPlayerHandle } from "@/components/video-player"
import {
  getCurrentUser,
  startMonitoringSession,
  updateMonitoringSession,
  endMonitoringSession,
  addAlert,
  addCaptureLog,
  getStudentAuthThreshold,
  updateDrowsinessState,
  resetDrowsinessState,
  getActiveAlertMessage,
  addDrowsinessAlert,
  type RegisteredStudent,
} from "@/lib/store"

const threshold = 70; // Declare the threshold variable here

function convertToEmbedUrl(url: string): string {
  if (!url) return url

  // Google Drive URLからファイルIDを抽出
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch) {
    const fileId = driveMatch[1]
    // Google Docs Viewer を使用してPDFを表示（スクロール可能）
    // 方法1: Google Drive の /preview（埋め込み用）
    // 方法2: Google Docs Viewer（より互換性が高い）
    // return `https://docs.google.com/viewer?url=https://drive.google.com/uc?id=${fileId}&embedded=true`
    
    // Google Drive の標準プレビューを使用
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  // Google Drive /view を /preview に変換
  if (url.includes("drive.google.com") && url.includes("/view")) {
    return url.replace("/view", "/preview")
  }

  return url
}

// Google DriveのPDFをダウンロード可能なURLに変換
function convertToDownloadUrl(url: string): string {
  if (!url) return url
  
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch) {
    const fileId = driveMatch[1]
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  }
  
  return url
}

// courseIdに基づいて動画情報を取得する関数
function getCourseInfo(id: string | string[] | undefined): {
  id: number
  title: string
  description: string
  videoUrl: string
  pdfUrl: string
} {
  console.log("[v0] getCourseInfo called with courseId:", id)

  // "demo"の場合はデモ動画
  if (id === "demo") {
    const demoData = getDemoVideo()
    console.log("[v0] getDemoVideo returned:", JSON.stringify(demoData, null, 2))
    console.log("[v0] textUrl value:", demoData.textUrl)
    const pdfUrl = convertToEmbedUrl(demoData.textUrl || "")
    console.log("[v0] converted pdfUrl:", pdfUrl)
    return {
      id: 0,
      title: demoData.title,
      description: demoData.description,
      videoUrl: demoData.videoUrl,
      pdfUrl: pdfUrl,
    }
  }

  // Part番号を取得（"part1" -> 1, "1" -> 1）
  const partMatch = id?.match(/part(\d+)/i) || id?.match(/^(\d+)$/)
  if (partMatch) {
    const partNumber = Number.parseInt(partMatch[1], 10)
    const partData = getPartVideo(partNumber)
    console.log("[v0] getPartVideo returned for part", partNumber, ":", JSON.stringify(partData, null, 2))
    if (partData) {
      // Part用のtextUrlが未設定の場合、デモ動画のtextUrlを使用
      let textUrl = partData.textUrl || ""
      if (!textUrl) {
        const demoData = getDemoVideo()
        textUrl = demoData.textUrl || ""
        console.log("[v0] Part textUrl is empty, using demo textUrl:", textUrl)
      }
      const pdfUrl = convertToEmbedUrl(textUrl)
      console.log("[v0] converted pdfUrl for part", partNumber, ":", pdfUrl)
      return {
        id: partNumber,
        title: partData.title,
        description: partData.description,
        videoUrl: partData.videoUrl,
        pdfUrl: pdfUrl,
      }
    }
  }

  // デフォルトはデモ動画
  const demoData = getDemoVideo()
  console.log("[v0] Falling back to demo:", JSON.stringify(demoData, null, 2))
  return {
    id: 0,
    title: "デモ動画",
    description: demoData.description,
    videoUrl: demoData.videoUrl,
    pdfUrl: convertToEmbedUrl(demoData.textUrl || ""),
  }
}

type VerificationStatus = "idle" | "verifying" | "verified" | "mismatch" | "absent"

export default function LecturePage() {
  const params = useParams()
  const router = useRouter()
  const { markPartComplete, isPartCompleted, startStudyingPart, stopStudyingPart } = useCourseProgress()
  const { updateStudyTime } = useCourseProgressContext()

  // コース情報
  const courseId = params.courseId
  const [courseInfo, setCourseInfo] = useState(() => getCourseInfo(courseId))

  useEffect(() => {
    setCourseInfo(getCourseInfo(courseId))
  }, [courseId])

  // 認証状態
  const [showAuthModal, setShowAuthModal] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authProgress, setAuthProgress] = useState(0)
  const [authStatusMessage, setAuthStatusMessage] = useState("認証を開始してください")
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle")
  const verificationStatusRef = useRef<VerificationStatus>("idle")
  // refを常に最新のstateと同期
  useEffect(() => {
    verificationStatusRef.current = verificationStatus
  }, [verificationStatus])
  const [matchConfidence, setMatchConfidence] = useState(0)
  const [violationCount, setViolationCount] = useState(0)
  const [showViolationDialog, setShowViolationDialog] = useState(false)
  const [violationType, setViolationType] = useState<"mismatch" | "drowsiness" | "away" | "tab_switch" | "camera_off">("mismatch")
  const [isPausedForViolation, setIsPausedForViolation] = useState(false)
  const isPausedForViolationRef = useRef(false)
  useEffect(() => {
    isPausedForViolationRef.current = isPausedForViolation
  }, [isPausedForViolation])
  const [isAuthenticated, setIsAuthenticated] = useState(false) // 新しいステート

  // ビデオ状態
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [videoUrl, setVideoUrl] = useState("")
  const [isIframeVideo, setIsIframeVideo] = useState(false) // iframeかどうかを追跡するstate
  const iframeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // iframe動画用: 自前タイマーで経過時間をカウント
  useEffect(() => {
    if (isIframeVideo && isPlaying && !isPausedForViolation) {
      iframeTimerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
    } else {
      if (iframeTimerRef.current) {
        clearInterval(iframeTimerRef.current)
        iframeTimerRef.current = null
      }
    }
    return () => {
      if (iframeTimerRef.current) {
        clearInterval(iframeTimerRef.current)
        iframeTimerRef.current = null
      }
    }
  }, [isIframeVideo, isPlaying, isPausedForViolation])

  // カメラ状態
  const [showCamera, setShowCamera] = useState(true)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  // PDF状態
  const [showPdf, setShowPdf] = useState(true)
  const [pdfPosition, setPdfPosition] = useState<"side" | "bottom">("side")
  const [pdfLoadError, setPdfLoadError] = useState(false) // PDF読み込みエラー状態を追加
  const [pdfCurrentPage, setPdfCurrentPage] = useState(1)
  const [pdfTotalPages, setPdfTotalPages] = useState(100) // デフォルト値、実際のPDFページ数に応じて調整
  const [pdfPageInput, setPdfPageInput] = useState("")
  const [showPdfSearch, setShowPdfSearch] = useState(false)

  // 管理者メッセージ状態
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([])
  const [showAdminMessageDialog, setShowAdminMessageDialog] = useState(false)
  const [currentAdminMessage, setCurrentAdminMessage] = useState<AdminMessage | null>(null)

  // カメラウィンドウの位置（ドラッグ用）- 初期位置をページ右下に変更
  const [cameraPosition, setCameraPosition] = useState({ x: -1, y: -1 }) // -1は未初期化
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (cameraPosition.x === -1 && cameraPosition.y === -1) {
      // ページの右下に配置（動画エリアの外）
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      setCameraPosition({
        x: windowWidth - 220, // 右端から220px
        y: windowHeight - 200, // 下端から200px
      })
    }
  }, [cameraPosition])

  // refs
  const videoPlayerRef = useRef<VideoPlayerHandle>(null)
  const authVideoRef = useRef<HTMLVideoElement>(null)
  const normalCameraVideoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const cameraWindowRef = useRef<HTMLDivElement>(null)
  const periodicCheckRef = useRef<NodeJS.Timeout | null>(null)
  const isAuthStartingRef = useRef(false)
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 登録済み顔データ
  const [registeredFace, setRegisteredFace] = useState<Float32Array | null>(null)

  // 監視連携: 現在のユーザー
  const [currentUser, setCurrentUser] = useState<RegisteredStudent | null>(null)
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null)
  const [capturedPhotos, setCapturedPhotos] = useState<{ timestamp: string; imageData: string }[]>([])

  // 監視連携: ユーザー情報取得と監視セッション開始
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      // 監視セッションを開始（動画視聴開始）
      startMonitoringSession(user)
      setStudyStartTime(new Date())

    }

    // クリーンアップ（ページ離脱時に監視セッション終了）
    return () => {
      if (user) {
        endMonitoringSession(user.id)

      }
    }
  }, [])

  // アラート発生追跡用（重複防止）
  const lastAlertRef = useRef<{
    cameraOff: number;
    tabSwitch: number;
    away: number;
  }>({ cameraOff: 0, tabSwitch: 0, away: 0 })

  // 別タブ移動を即座に検知（visibilitychangeイベント）
  useEffect(() => {
    if (!currentUser || !isAuthenticated) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const now = Date.now()
        if (now - lastAlertRef.current.tabSwitch > 10000) {
          // 動画を確実に停止
          if (videoPlayerRef.current) {
            videoPlayerRef.current.pause()
          }
          setIsPlaying(false)

          // アラート送信
          addAlert({
            studentId: currentUser.id,
            studentName: currentUser.name,
            type: "tab_switch",
            message: `${currentUser.name}が別のタブに移動しました`,
            timestamp: new Date().toISOString(),
          })
          lastAlertRef.current.tabSwitch = now

          // ダイアログ表示
          setViolationType("tab_switch")
          setIsPausedForViolation(true)
          setShowViolationDialog(true)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [currentUser, isAuthenticated])

  // 監視状態をリアルタイム更新（3秒ごと）
  useEffect(() => {
    if (!currentUser) return

    const updateMonitoring = () => {
      const studyMinutes = studyStartTime 
        ? Math.floor((new Date().getTime() - studyStartTime.getTime()) / 60000)
        : 0

      const isCameraOn = showCamera && cameraStream
      const isTabActive = document.visibilityState === "visible"
      const currentVerificationStatus = verificationStatusRef.current
      const isVerified = currentVerificationStatus === "verified" || currentVerificationStatus === "idle"
      
      // 状態を判定
      const currentStatus = isCameraOn && isTabActive && isVerified ? "normal" : "warning"
      const screenStatus = isTabActive ? "active" : "tab_switch"

      // 監視セッションを更新
      updateMonitoringSession(currentUser.id, {
        cameraStatus: isCameraOn ? "on" : "off",
        screenStatus: screenStatus,
        status: currentStatus,
        studyTimeMinutes: studyMinutes,
        courseName: courseInfo.title,
      })

      // 受講時間をcontextに保存（ダッシュボードに反映するため）
      if (studyMinutes > 0 && typeof courseId === "string" && courseId !== "demo") {
        updateStudyTime(courseId, studyMinutes)
      }

      const now = Date.now()
      const ALERT_COOLDOWN = 60000 // 60秒間は同じ種類のアラートを出さない

      // 動画を確実に停止するヘルパー（iframe動画にも対応）
      const pauseVideo = () => {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.pause()
        }
        // iframe動画はpause()が効かないため、isPlayingをfalseにしてタイマーも停止
        setIsPlaying(false)
      }

      // カメラOFFアラート → 動画停止 + 受講者にダイアログ表示
      if (!isCameraOn && now - lastAlertRef.current.cameraOff > ALERT_COOLDOWN) {
        addAlert({
          studentId: currentUser.id,
          studentName: currentUser.name,
          type: "camera_off",
          message: `${currentUser.name}がカメラをOFFにしました`,
          timestamp: new Date().toISOString(),
        })
        lastAlertRef.current.cameraOff = now
        pauseVideo()
        setViolationType("camera_off")
        setIsPausedForViolation(true)
        setShowViolationDialog(true)
      }

      // 別タブ検知アラート → 動画停止 + 受講者にダイアログ表示
      if (!isTabActive && now - lastAlertRef.current.tabSwitch > ALERT_COOLDOWN) {
        addAlert({
          studentId: currentUser.id,
          studentName: currentUser.name,
          type: "tab_switch",
          message: `${currentUser.name}が別のタブに移動しました`,
          timestamp: new Date().toISOString(),
        })
        lastAlertRef.current.tabSwitch = now
        pauseVideo()
        setViolationType("tab_switch")
        setIsPausedForViolation(true)
        setShowViolationDialog(true)
      }

      // 離席検知アラート（顔認証失敗時） → 動画停止 + 受講者にダイアログ表示
      if (currentVerificationStatus === "absent" && now - lastAlertRef.current.away > ALERT_COOLDOWN) {
        addAlert({
          studentId: currentUser.id,
          studentName: currentUser.name,
          type: "away",
          message: `${currentUser.name}が離席しています（顔が検出されません）`,
          timestamp: new Date().toISOString(),
        })
        lastAlertRef.current.away = now
        pauseVideo()
        setViolationType("drowsiness")
        setIsPausedForViolation(true)
        setShowViolationDialog(true)
      }


    }

    // 即時更新
    updateMonitoring()

    // 3秒ごとに更新
    monitoringIntervalRef.current = setInterval(updateMonitoring, 3000)

    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current)
      }
    }
  }, [currentUser, showCamera, cameraStream, studyStartTime, courseInfo.title])

  // 定期撮影機能（5分ごと）
  useEffect(() => {
    if (!currentUser || !cameraStream || !normalCameraVideoRef.current) return

    const capturePhoto = () => {
      const video = normalCameraVideoRef.current
      if (!video) return

      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth || 320
      canvas.height = video.videoHeight || 240
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL("image/jpeg", 0.7)
        const timestamp = new Date().toISOString()
        
        setCapturedPhotos(prev => [...prev, { timestamp, imageData }])
        
        // localStorageにログを保存
        const logKey = `glx_capture_log_${currentUser.id}`
        const existingLogs = JSON.parse(localStorage.getItem(logKey) || "[]")
        existingLogs.push({ timestamp, imageData: imageData.substring(0, 100) + "..." }) // 画像は短縮して保存
        localStorage.setItem(logKey, JSON.stringify(existingLogs.slice(-100))) // 最新100件のみ保持
        
        console.log("[v0] Photo captured at:", timestamp)
      }
    }

    // 5分（300秒）ごとに撮影
    captureIntervalRef.current = setInterval(capturePhoto, 300000)
    
    // 初回撮影（10秒後）
    setTimeout(capturePhoto, 10000)

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current)
      }
    }
  }, [currentUser, cameraStream])

  const embedPdfUrl = useMemo(() => {
    return convertToEmbedUrl(courseInfo.pdfUrl)
  }, [courseInfo.pdfUrl])

  // ビデオURLを設定
  useEffect(() => {
    setVideoUrl(courseInfo.videoUrl)
  }, [courseInfo])

  // 動画コントロール
  const togglePlay = () => {
    if (videoPlayerRef.current) {
      if (isPlaying) {
        videoPlayerRef.current.pause()
      } else {
        videoPlayerRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.setMuted(!isMuted)
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (seconds: number) => {
    // 巻き戻し（負の値）のみ許可。早送り・スキップは不可。
    if (seconds > 0) return
    if (videoPlayerRef.current) {
      const newTime = Math.max(0, videoPlayerRef.current.getCurrentTime() + seconds)
      videoPlayerRef.current.setCurrentTime(newTime)
    }
  }

  const handleProgressClick = (_e: React.MouseEvent<HTMLDivElement>) => {
    // プログレスバーのクリックによるスキップは不可
    return
  }

  const toggleFullscreen = async () => {
    if (videoContainerRef.current) {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen()
        } else {
          await videoContainerRef.current.requestFullscreen()
        }
      } catch (error) {
        console.error("Fullscreen error:", error)
      }
    }
  }

  const handleTimeUpdate = (time: number, dur: number) => {
    setCurrentTime(time)
    if (dur && !isNaN(dur)) {
      setDuration(dur)
    }
  }

  const handleLoadedMetadata = (dur: number) => {
    if (dur && !isNaN(dur)) {
      setDuration(dur)
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
    markPartComplete(courseInfo.id.toString())
  }

  // 管理者メッセージのポーリング + storageイベントリスナー
  useEffect(() => {
    if (!isAuthenticated) return

    const checkForMessages = () => {
      const user = getCurrentUser()
      if (!user) return
      const messages = getUnreadMessagesForUser(user.id)
      console.log("[v0] checkForMessages userId:", user.id, "unread:", messages.length)
      if (messages.length > 0) {
        const latestMessage = messages[0]
        console.log("[v0] New message detected:", latestMessage.message, "for userId:", latestMessage.userId)
        if (!currentAdminMessage || currentAdminMessage.id !== latestMessage.id) {
          setCurrentAdminMessage(latestMessage)
          setShowAdminMessageDialog(true)
          // 動画を停止（iframe対応）
          if (videoPlayerRef.current) {
            videoPlayerRef.current.pause()
          }
          setIsPlaying(false)
        }
      }
      setAdminMessages(messages)
    }

    // 初回チェック
    checkForMessages()

    // 3秒ごとにチェック
    const interval = setInterval(checkForMessages, 3000)

    // storageイベント: 管理者が別タブ/別ウィンドウからメッセージを送信した場合に即座に検知
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminMessages") {
        checkForMessages()
      }
    }
    window.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [isAuthenticated, currentAdminMessage])

  // カメラの初期化
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      })
      setCameraStream(stream)
      return stream
    } catch (error) {
      console.error("[v0] カメラ初期化エラー:", error)
      return null
    }
  }

  // カメラストリームの設定 - より確実に設定
  useEffect(() => {
    const setupCamera = () => {
      if (cameraStream && normalCameraVideoRef.current) {
        console.log("[v0] Setting camera stream to normalCameraVideoRef, stream active:", cameraStream.active)
        normalCameraVideoRef.current.srcObject = cameraStream
        normalCameraVideoRef.current.play().catch((err) => {
          console.error("[v0] Failed to play camera video:", err)
        })
      }
    }
    
    setupCamera()
    
    // 少し遅延してから再度設定（DOM更新のタイミング対策）
    const timeout = setTimeout(setupCamera, 100)
    return () => clearTimeout(timeout)
  }, [cameraStream, showCamera, isAuthenticated])

  // 顔認証処理
  const startAuthentication = async () => {
    console.log("[v0] startAuthentication called")

    if (isAuthStartingRef.current) {
      console.log("[v0] Auth already starting, returning")
      return
    }
    isAuthStartingRef.current = true

    setIsAuthenticating(true)
    setAuthProgress(0)
    setAuthStatusMessage("カメラを起動中...")
    console.log("[v0] Starting camera...")

    try {
      // カメラ起動
      let stream = cameraStream
      if (!stream) {
        console.log("[v0] No existing stream, initializing camera...")
        stream = await initCamera()
        if (!stream) {
          console.log("[v0] Failed to initialize camera")
          setAuthStatusMessage("カメラを起動できませんでした")
          setIsAuthenticating(false)
          isAuthStartingRef.current = false
          return
        }
      }
      console.log("[v0] Camera stream obtained")

      // 認証用カメラプレビュー
      if (authVideoRef.current) {
        authVideoRef.current.srcObject = stream
        console.log("[v0] Stream set to authVideoRef, waiting for ready...")
        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (authVideoRef.current && authVideoRef.current.readyState >= 2) {
              console.log("[v0] authVideoRef ready, readyState:", authVideoRef.current.readyState)
              resolve()
            } else {
              setTimeout(checkReady, 100)
            }
          }
          authVideoRef.current
            ?.play()
            .then(checkReady)
            .catch(() => setTimeout(checkReady, 100))
        })
      }

      setAuthProgress(20)
      setAuthStatusMessage("顔認識モデルを読み込み中...")
      console.log("[v0] Loading face recognition models...")

      // モデルロード
      await ensureModelsLoaded()
      console.log("[v0] Models loaded successfully")

      setAuthProgress(40)
      setAuthStatusMessage("登録済み顔データを確認中...")

      // 登録済み顔データを取得（ログイン中ユーザーのIDを使用）
      const loggedInUser = getCurrentUser()
      const userId = loggedInUser?.id || "current_user_001"
      console.log("[v0] Getting face descriptor for userId:", userId, "user:", loggedInUser?.name)
      // まずログインユーザーIDで検索、なければ旧ID(current_user_001)でフォールバック
      let savedFace = getFaceDescriptor(userId)
      if (!savedFace && userId !== "current_user_001") {
        savedFace = getFaceDescriptor("current_user_001")
        console.log("[v0] Fallback to current_user_001:", savedFace ? "found" : "not found")
      }
      console.log("[v0] Saved face data:", savedFace ? "found" : "not found", savedFace)

      if (!savedFace) {
        console.log("[v0] No registered face found for user")
        setAuthStatusMessage("登録済み顔データがありません。プロフィールから顔を登録してください。")
        setIsAuthenticating(false)
        isAuthStartingRef.current = false
        return
      }

      console.log("[v0] Creating Float32Array from descriptor, length:", savedFace.descriptor.length)
      const savedDescriptor = new Float32Array(savedFace.descriptor)
      setRegisteredFace(savedDescriptor)
      console.log("[v0] Registered face set")

      setAuthProgress(60)
      setAuthStatusMessage("顔認証を実行中...")

      // 顔認証
      if (authVideoRef.current) {
        console.log("[v0] Detecting face from video...")
        const currentFace = await detectFaceFromVideo(authVideoRef.current)
        console.log("[v0] Current face detected:", currentFace ? "yes" : "no")

        if (!currentFace) {
          console.log("[v0] No face detected in video")
          setAuthStatusMessage("顔を検出できませんでした。カメラに顔を向けてください。")
          setIsAuthenticating(false)
          isAuthStartingRef.current = false
          return
        }

        setAuthProgress(80)

        const result = compareFaces(savedDescriptor, currentFace)
        // 個人閾値を考慮（管理者が設定した閾値があれば、それも適用）
        const personalThreshold = threshold / 100 // state変数thresholdは0-100
        const isVerifiedByThreshold = result.confidence >= personalThreshold
        
        console.log("[v0] 初回認証結果:", { 
          distance: result.distance, 
          confidence: result.confidence,
          isMatch: result.isMatch,
          personalThreshold,
          isVerifiedByThreshold 
        })

        setAuthProgress(100)

        if (result.isMatch || isVerifiedByThreshold) {
          setVerificationStatus("verified")
          setMatchConfidence(result.confidence)
          setAuthStatusMessage("本人確認完了")

          // 認証成功後、モーダルを閉じて動画再生開始
          setTimeout(() => {
            setShowAuthModal(false)
            setIsAuthenticating(false)
            isAuthStartingRef.current = false
            setIsAuthenticated(true) // 認証成功

            setCameraStream(stream)
            if (normalCameraVideoRef.current && stream) {
              normalCameraVideoRef.current.srcObject = stream
              normalCameraVideoRef.current.play().catch(console.error)
            }

            // 定期的な顔認証を開始
            startPeriodicVerification()
          }, 1000)
        } else {
          setVerificationStatus("mismatch")
          setAuthStatusMessage("本人確認に失敗しました。登録画像と一致しません。")
          setIsAuthenticating(false)
          isAuthStartingRef.current = false
        }
      }
    } catch (error) {
      console.error("[v0] 認証エラー:", error)
      setAuthStatusMessage("認証中にエラーが発生しました")
      setIsAuthenticating(false)
      isAuthStartingRef.current = false
    }
  }

  // 定期的な顔認証
  const startPeriodicVerification = useCallback(() => {
    if (periodicCheckRef.current) {
      clearInterval(periodicCheckRef.current)
    }

    periodicCheckRef.current = setInterval(async () => {
      if (isPausedForViolationRef.current) return
      if (!normalCameraVideoRef.current) return

      const video = normalCameraVideoRef.current
      if (video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < 2) {
        return
      }

      try {
        const currentFace = await detectFaceFromVideo(normalCameraVideoRef.current)

        if (!currentFace) {
          setVerificationStatus("absent")
          console.log("[v0] 顔未検出 - absent設定")
          
          // 顔が検出できない = 離席の可能性をチェック
          if (currentUser) {
            const drowsinessResult = updateDrowsinessState(currentUser.id, true)
            console.log("[v0] 離席カウント:", drowsinessResult.closedFrameCount, "alert:", drowsinessResult.shouldAlert)
            if (drowsinessResult.shouldAlert) {
              // 離席検知アラート → 管理者に通知
              addDrowsinessAlert(currentUser.id, currentUser.name)
              addAlert({
                studentId: currentUser.id,
                studentName: currentUser.name,
                type: "away",
                message: `${currentUser.name}が離席しています（顔が検出されません）`,
                timestamp: new Date().toISOString(),
              })
              
              // 動画を確実に停止（iframe対応）
              if (videoPlayerRef.current) {
                videoPlayerRef.current.pause()
              }
              setIsPlaying(false)
              setViolationType("drowsiness")
              setIsPausedForViolation(true)
              setShowViolationDialog(true)
              
              // 居眠り状態をリセット
              resetDrowsinessState(currentUser.id)
            }
          }
          return
        }

        // 顔が検出できた場合は離席カウントをリセット
        if (currentUser) {
          resetDrowsinessState(currentUser.id)
        }

        // registeredFaceがない場合は顔検出のみ（離席検知のみ有効）
        if (!registeredFace) {
          setVerificationStatus("verified")
          return
        }

        // 個人別認証閾値を取得
        const personalThreshold = currentUser ? getStudentAuthThreshold(currentUser.id) : threshold / 100
        const result = compareFaces(registeredFace, currentFace)

        // 撮影ログを保存
        if (currentUser) {
          addCaptureLog({
            studentId: currentUser.id,
            studentName: currentUser.name,
            timestamp: new Date().toISOString(),
            imageData: "", // 画像データは重いので省略
            authResult: result.isMatch ? "verified" : "failed",
            confidence: result.confidence,
          })
        }

        // 閾値を0-1のスケールに変換して比較（thresholdは0-100、confidenceは0-1）
        const thresholdNormalized = personalThreshold / 100
        const isVerified = result.isMatch || result.confidence >= thresholdNormalized
        
        if (isVerified) {
          setVerificationStatus("verified")
          setMatchConfidence(result.confidence)
        } else {
          // 別人検出 - 連続で発生した場合にダイアログ表示
          setVerificationStatus("mismatch")
          setViolationCount((prev) => {
            const newCount = prev + 1

            // 違反回数が3回以上で管理者に通知＆ダイアログ表示
            if (newCount >= 3) {
              // 管理者通知用のアラートを作成
              const alertData = {
                id: `violation-${Date.now()}`,
                type: "different_person",
                level: "critical",
                userId: currentUser?.id || "unknown",
                userName: currentUser?.name || "受講者",
                courseId: courseInfo.id.toString(),
                courseName: courseInfo.title,
                violationCount: newCount,
                timestamp: new Date().toISOString(),
                resolved: false,
              }

              // LocalStorageに保存
              const existingAlerts = JSON.parse(localStorage.getItem("monitoringAlerts") || "[]")
              existingAlerts.unshift(alertData)
              localStorage.setItem("monitoringAlerts", JSON.stringify(existingAlerts))

              // 緊急アラートとして保存（管理者ページで即時表示用）
              localStorage.setItem("urgentAlert", JSON.stringify(alertData))
              
              // 動画を一時停止してダイアログ表示（3回連続で不一致の場合のみ）
              if (videoPlayerRef.current) {
                videoPlayerRef.current.pause()
              }
              setViolationType("mismatch")
              setIsPausedForViolation(true)
              setShowViolationDialog(true)
            }

            return newCount
          })
        }
        
        // 認証成功したら違反カウントをリセット
        if (isVerified) {
          setViolationCount(0)
        }
      } catch (error) {
        console.error("[v0] 定期認証エラー:", error)
      }
    }, 5000) // 5秒ごとにチェック
  }, [registeredFace, courseInfo])

  // カメラが有効 + 認証完了時に定期チェックを自動開始（認証スキップ時のフォールバック）
  useEffect(() => {
    if (isAuthenticated && cameraStream && normalCameraVideoRef.current && !periodicCheckRef.current) {
      console.log("[v0] 定期認証をフォールバック開始")
      startPeriodicVerification()
    }
  }, [isAuthenticated, cameraStream, startPeriodicVerification])

  // 独立した離席検知（カメラに依存しない）: マウス/キーボード無操作で60秒経過したら離席判定
  const lastActivityRef = useRef(Date.now())
  const absenceCheckRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!currentUser || !isAuthenticated) return

    const updateActivity = () => {
      lastActivityRef.current = Date.now()
    }
    window.addEventListener("mousemove", updateActivity)
    window.addEventListener("keydown", updateActivity)
    window.addEventListener("click", updateActivity)
    window.addEventListener("scroll", updateActivity)

    absenceCheckRef.current = setInterval(() => {
      if (isPausedForViolationRef.current) return
      const idleTime = Date.now() - lastActivityRef.current
      // 60秒間操作なし → 離席アラート
      if (idleTime > 60000) {
        const now = Date.now()
        if (now - lastAlertRef.current.away > 60000) {
          console.log("[v0] 無操作離席検知: idleTime=", Math.round(idleTime / 1000), "秒")
          addAlert({
            studentId: currentUser.id,
            studentName: currentUser.name,
            type: "away",
            message: `${currentUser.name}が離席しています（60秒間操作がありません）`,
            timestamp: new Date().toISOString(),
          })
          lastAlertRef.current.away = now

          if (videoPlayerRef.current) {
            videoPlayerRef.current.pause()
          }
          setIsPlaying(false)
          setViolationType("drowsiness")
          setIsPausedForViolation(true)
          setShowViolationDialog(true)

          // 操作タイマーをリセット
          lastActivityRef.current = Date.now()
        }
      }
    }, 10000) // 10秒ごとにチェック

    return () => {
      window.removeEventListener("mousemove", updateActivity)
      window.removeEventListener("keydown", updateActivity)
      window.removeEventListener("click", updateActivity)
      window.removeEventListener("scroll", updateActivity)
      if (absenceCheckRef.current) {
        clearInterval(absenceCheckRef.current)
      }
    }
  }, [currentUser, isAuthenticated])

  // 違反ダイアログを閉じて再開
  const handleResumeViewing = () => {
    setShowViolationDialog(false)
    setIsPausedForViolation(false)
    setVerificationStatus("verified")
    // 動画を再開（iframe対応: isPlayingをtrueにしてタイマーも再開）
    if (videoPlayerRef.current) {
      videoPlayerRef.current.play()
    }
    setIsPlaying(true)
  }

  // 再認証
  const handleReauthenticate = () => {
    setShowViolationDialog(false)
    setIsPausedForViolation(false)
    setShowAuthModal(true)
    setVerificationStatus("idle")
    setAuthProgress(0)
    setAuthStatusMessage("認証を開始してください")
  }

  // カメラ表示/非表示の切り替え
  const toggleCamera = () => {
    setShowCamera(!showCamera)
  }

  // ドラッグ処理 - ページ全体でドラッグできるように修正
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - cameraPosition.x,
      y: e.clientY - cameraPosition.y,
    }
    e.preventDefault() // テキスト選択を防ぐ
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragStartPos.current.x))
        const newY = Math.max(0, Math.min(window.innerHeight - 180, e.clientY - dragStartPos.current.y))
        setCameraPosition({ x: newX, y: newY })
      }
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // リモートコマンドの監視
  useEffect(() => {
    const checkRemoteCommands = () => {
      const userId = "current_user_001"
      const commands = getRemoteCommands(userId)
      
      for (const cmd of commands) {
        if (cmd.type === "stop_video" && (!cmd.courseId || cmd.courseId === courseInfo.id.toString())) {
          // リモートで動画停止
          if (videoPlayerRef.current) {
            videoPlayerRef.current.pause()
          }
          setIsPausedForViolation(true)
          setShowViolationDialog(true)
          markCommandExecuted(cmd.id)
        }
      }
    }

    // 定期的にコマンドをチェック
    const interval = setInterval(checkRemoteCommands, 2000)
    
    // カスタムイベントでも受信
    const handleRemoteCommand = (e: CustomEvent) => {
      const cmd = e.detail
      if (cmd.userId === "current_user_001" && cmd.type === "stop_video") {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.pause()
        }
        setIsPausedForViolation(true)
        setShowViolationDialog(true)
      }
    }
    
    window.addEventListener("remoteCommand", handleRemoteCommand as EventListener)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("remoteCommand", handleRemoteCommand as EventListener)
    }
  }, [courseInfo])

  // 定期的なスクリーンショット保存（受講中ログ）
  useEffect(() => {
    if (!isAuthenticated || !cameraStream) return

    const saveScreenshot = async () => {
      if (!normalCameraVideoRef.current) return
      
      try {
        const video = normalCameraVideoRef.current
        if (video.videoWidth === 0 || video.videoHeight === 0) return
        
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const screenshot = canvas.toDataURL("image/jpeg", 0.5)
          
          saveStudyLog({
            userId: "current_user_001",
            courseId: courseInfo.id.toString(),
            timestamp: new Date().toISOString(),
            screenshot,
            faceDetected: verificationStatus === "verified" || verificationStatus === "mismatch",
            confidence: matchConfidence,
          })
        }
      } catch (error) {
        console.error("[v0] スクリーンショット保存エラー:", error)
      }
    }

    // 30秒ごとにスクリーンショット保存
    const interval = setInterval(saveScreenshot, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, cameraStream, courseInfo, verificationStatus, matchConfidence])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (periodicCheckRef.current) {
        clearInterval(periodicCheckRef.current)
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  // 時間フォーマット
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (!videoUrl) {
      setIsIframeVideo(false)
      return
    }
    const url = videoUrl.trim()
    const isIframe =
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("vimeo.com") ||
      url.includes("drive.google.com/file/d/") ||
      url.includes("<iframe")
    setIsIframeVideo(isIframe)
    // iframe動画は読み込み時点で自動再生されるため、isPlayingをtrueにしてタイマーを開始
    if (isIframe) {
      setIsPlaying(true)
      setCurrentTime(0)
    }
  }, [videoUrl])

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* ヘッダー */}
      <header className="bg-[#0d2137] border-b border-[#1e3a5f] px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-[#94a3b0]">
              戻る
            </Button>
            <h1 className="text-white font-semibold">{courseInfo.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* PDF表示切り替え */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPdf(!showPdf)}
              className={showPdf ? "text-blue-400" : "text-[#94a3b0]"}
            >
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
            {showPdf && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPdfPosition("side")}
                  className={pdfPosition === "side" ? "text-blue-400" : "text-[#94a3b0]"}
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPdfPosition("bottom")}
                  className={pdfPosition === "bottom" ? "text-blue-400" : "text-[#94a3b0]"}
                >
                  <PanelBottom className="h-4 w-4" />
                </Button>
              </>
            )}
            {/* 認証ステータス */}
            <Badge
              variant="outline"
              className={
                verificationStatus === "verified"
                  ? "border-blue-500 text-blue-500"
                  : verificationStatus === "mismatch"
                    ? "border-blue-500 text-blue-500"
                    : "border-blue-500 text-blue-500"
              }
            >
              {verificationStatus === "verified" && <ShieldCheck className="h-3 w-3 mr-1" />}
              {verificationStatus === "mismatch" && <ShieldX className="h-3 w-3 mr-1" />}
              {verificationStatus === "absent" && <ShieldAlert className="h-3 w-3 mr-1" />}
              {verificationStatus === "verified"
                ? `認証OK ${Math.round(matchConfidence * 100)}%`
                : verificationStatus === "mismatch"
                  ? "別人検出"
                  : verificationStatus === "absent"
                    ? "顔未検出"
                    : "未認証"}
            </Badge>
          </div>
        </div>
      </header>

      {/* 認証モーダル */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl bg-[#0d2137] border-[#1e3a5f]">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">本人認証</h2>
              <p className="text-[#94a3b0] mb-6">
                カメラ映像と登録した顔画像との突合を行います。認証が完了すると、授業の視聴が開始されます。
              </p>

              {/* 認証用カメラプレビュー */}
              <div className="relative w-80 h-60 mx-auto bg-black rounded-lg overflow-hidden mb-4">
                <video ref={authVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>

              <Progress value={authProgress} className="w-full max-w-md mx-auto mt-4" />
              <p className="mt-2 text-sm text-[#94a3b0]">{authStatusMessage}</p>
            </CardContent>
            <div className="flex flex-col items-center gap-3 pb-6">
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.back()} className="border-[#1e3a5f] text-[#94a3b0] hover:bg-[#1e3a5f] hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  戻る
                </Button>
                <Button variant="default" onClick={startAuthentication} disabled={isAuthenticating}>
                  {isAuthenticating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  )}
                  {isAuthenticating ? "認証中..." : "認証する"}
                </Button>
              </div>
              {authStatusMessage.includes("登録済み顔データがありません") && (
                <Button
                  variant="link"
                  onClick={() => router.push("/profile/face-registration")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  顔を登録する
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ビデオ画面 */}
      {!showAuthModal && (
        <div className="p-4">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-white">{courseInfo.title}</h1>
            <p className="text-[#94a3b0]">{courseInfo.description}</p>
          </div>

          {/* レイアウト切り替えボタン */}
          {showPdf && embedPdfUrl && (
            <div className="flex justify-end mb-2">
              <div className="flex bg-slate-700 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={pdfPosition === "side" ? "default" : "ghost"}
                  onClick={() => setPdfPosition("side")}
                  className={`${pdfPosition === "side" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white bg-transparent"}`}
                >
                  <Columns className="h-4 w-4 mr-1" />
                  左右
                </Button>
                <Button
                  size="sm"
                  variant={pdfPosition === "bottom" ? "default" : "ghost"}
                  onClick={() => setPdfPosition("bottom")}
                  className={`${pdfPosition === "bottom" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white bg-transparent"}`}
                >
                  <Rows className="h-4 w-4 mr-1" />
                  上下
                </Button>
              </div>
            </div>
          )}

          <div
            className={`flex gap-4 ${pdfPosition === "bottom" ? "flex-col" : "flex-row"}`}
            style={{ height: pdfPosition === "side" ? "calc(100vh - 220px)" : "auto" }}
          >
            {/* 動画エリア */}
            <div className={`${showPdf && pdfPosition === "side" ? "flex-1" : "w-full"}`}>
              <div
                ref={videoContainerRef}
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <VideoPlayer
                  ref={videoPlayerRef}
                  src={videoUrl}
                  autoPlay
                  muted={isMuted}
                  className="w-full h-full object-contain"
                  hideNativeControls={true}
                  onReady={(isIframe) => {
                    setIsIframeVideo(isIframe)
                  }}
                  onPlay={() => {
                    setIsPlaying(true)
                  }}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={(duration) => {
                    handleLoadedMetadata(duration)
                  }}
                  onEnded={handleVideoEnded}
                />

                {/* 違反時オーバーレイ: iframe動画でもpauseが効かないため、上から覆い隠す */}
                {isPausedForViolation && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
                    <AlertTriangle className="h-12 w-12 text-blue-500 mb-4" />
                    <p className="text-white text-lg font-bold">動画が一時停止されています</p>
                    <p className="text-gray-400 text-sm mt-2">ダイアログを確認して操作を再開してください</p>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* プログレスバー（表示のみ、クリック不可） */}
                  <div className="mb-2">
                    <Progress value={duration > 0 ? (currentTime / duration) * 100 : 0} className="h-1 pointer-events-none" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* 一時停止/再開ボタン */}
                      <Button size="icon" variant="ghost" className="text-white" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      {/* 5秒巻き戻しのみ許可 */}
                      {!isIframeVideo && (
                        <Button size="icon" variant="ghost" className="text-white" onClick={() => handleSeek(-5)}>
                          <SkipBack className="h-4 w-4" />
                        </Button>
                      )}
                      <span className="text-white text-xs opacity-70">
                        {isIframeVideo ? "" : "5秒戻し"}
                      </span>
                      <Button size="icon" variant="ghost" className="text-white" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <span className="text-white text-sm">
                        {formatTime(currentTime)}
                        {duration > 0 ? ` / ${formatTime(duration)}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PDFエリア */}
            {showPdf && embedPdfUrl && (
              <div
                className={`bg-white rounded-lg overflow-hidden flex flex-col ${pdfPosition === "side" ? "flex-1" : "w-full"}`}
                style={{ 
                  minHeight: pdfPosition === "side" ? "100%" : "500px",
                  height: pdfPosition === "bottom" ? "60vh" : "auto"
                }}
              >
                {/* PDFナビゲーションバー */}
                <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPdfCurrentPage(Math.max(1, pdfCurrentPage - 1))}
                      disabled={pdfCurrentPage <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={pdfPageInput || pdfCurrentPage}
                        onChange={(e) => setPdfPageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const page = parseInt(pdfPageInput)
                            if (page >= 1 && page <= pdfTotalPages) {
                              setPdfCurrentPage(page)
                            }
                            setPdfPageInput("")
                          }
                        }}
                        onBlur={() => {
                          const page = parseInt(pdfPageInput)
                          if (page >= 1 && page <= pdfTotalPages) {
                            setPdfCurrentPage(page)
                          }
                          setPdfPageInput("")
                        }}
                        className="w-16 h-8 text-center text-sm"
                        min={1}
                        max={pdfTotalPages}
                      />
                      <span className="text-sm text-gray-600">/ {pdfTotalPages}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPdfCurrentPage(Math.min(pdfTotalPages, pdfCurrentPage + 1))}
                      disabled={pdfCurrentPage >= pdfTotalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* ページジャンプボタン */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 bg-transparent">
                          <Search className="h-4 w-4 mr-1" />
                          ページ移動
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3">
                        <div className="space-y-3">
                          <p className="text-sm font-medium">ページ番号を入力</p>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="ページ番号"
                              min={1}
                              max={pdfTotalPages}
                              className="flex-1"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = (e.target as HTMLInputElement)
                                  const page = parseInt(input.value)
                                  if (page >= 1 && page <= pdfTotalPages) {
                                    setPdfCurrentPage(page)
                                  }
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                                const page = parseInt(input.value)
                                if (page >= 1 && page <= pdfTotalPages) {
                                  setPdfCurrentPage(page)
                                }
                              }}
                            >
                              移動
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {[1, 10, 20, 50, 100].filter(p => p <= pdfTotalPages).map((page) => (
                              <Button
                                key={page}
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs bg-transparent"
                                onClick={() => setPdfCurrentPage(page)}
                              >
                                P.{page}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(courseInfo.pdfUrl, "_blank")}
                      className="h-8"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      新タブ
                    </Button>
                  </div>
                </div>
                {/* PDF表示エリア */}
                <div className="flex-1 relative">
                  <iframe
                    src={`${embedPdfUrl}#page=${pdfCurrentPage}`}
                    className="absolute inset-0 w-full h-full border-0"
                    title="講義資料PDF"
                    allow="autoplay; fullscreen"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 違反検出ダイアログ（タイプ別表示） */}
      <Dialog open={showViolationDialog} onOpenChange={setShowViolationDialog}>
        <DialogContent className="bg-[#0d2137] border-[#1e3a5f]">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${violationType === "drowsiness" ? "text-blue-500" : "text-blue-500"}`}>
              <AlertTriangle className="h-5 w-5" />
              {violationType === "mismatch" && "別人が検出されました"}
              {violationType === "drowsiness" && "居眠りの可能性を検知しました"}
              {violationType === "away" && "離席を検知しました"}
              {violationType === "tab_switch" && "別タブへの移動を検知しました"}
              {violationType === "camera_off" && "カメラがOFFになっています"}
            </DialogTitle>
            <DialogDescription className="text-[#94a3b0]">
              {violationType === "mismatch" && "カメラに映っている人物が登録された受講者と一致しません。"}
              {violationType === "drowsiness" && "顔が検出できない状態が続いています。視聴を続けるには画面をご確認ください。"}
              {violationType === "away" && "カメラに顔が映っていません。受講を続けるには画面の前に戻ってください。"}
              {violationType === "tab_switch" && "受講中は動画画面に集中してください。"}
              {violationType === "camera_off" && "本人確認のためカメラをONにしてください。"}
              {violationCount >= 3 && violationType === "mismatch" && (
                <span className="block mt-2 text-blue-400">
                  警告: 違反回数が{violationCount}回に達しました。管理者に通知されます。
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            {violationType === "mismatch" && (
              <Button variant="outline" className="bg-transparent" onClick={handleReauthenticate}>
                再認証する
              </Button>
            )}
            <Button onClick={handleResumeViewing}>
              {violationType === "mismatch" ? "視聴を再開" : "確認しました"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 管理者からのメッセージダイアログ */}
      <Dialog open={showAdminMessageDialog} onOpenChange={setShowAdminMessageDialog}>
        <DialogContent className="bg-blue-900 border-blue-500 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-300">
              <ShieldAlert className="h-5 w-5" />
              管理者からのメッセージ
            </DialogTitle>
            <DialogDescription className="text-blue-200">
              講習管理者からメッセージが届いています。内容を確認してください。
            </DialogDescription>
          </DialogHeader>
          {currentAdminMessage && (
            <div className="bg-blue-800 rounded-lg p-4 my-4">
              <p className="text-white whitespace-pre-wrap">{currentAdminMessage.message}</p>
              <p className="text-blue-300 text-xs mt-2">
                送信日時: {new Date(currentAdminMessage.sentAt).toLocaleString("ja-JP")}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (currentAdminMessage) {
                  markMessageAsRead(currentAdminMessage.id)
                }
                setShowAdminMessageDialog(false)
                setCurrentAdminMessage(null)
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-black font-medium"
            >
              確認しました
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* カメラウィンドウ */}
      {isAuthenticated && showCamera && (
        <div
          ref={cameraWindowRef}
          className="fixed z-50 rounded-lg overflow-hidden shadow-2xl border-2 border-blue-500"
          style={{
            left: `${cameraPosition.x}px`,
            top: `${cameraPosition.y}px`,
            width: "240px",
            cursor: isDragging ? "grabbing" : "default",
            backgroundColor: "#0f172a",
          }}
        >
          {/* ヘッダー部分 */}
          <div
            className="drag-handle flex items-center justify-between px-2 py-1"
            style={{ backgroundColor: "#22c55e", cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={handleMouseDown}
          >
            <Badge className="bg-white text-blue-600 text-xs">本人確認OK</Badge>
            <div className="flex items-center gap-1 drag-handle">
              <GripVertical className="h-4 w-4 text-white/70" />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation() // ドラッグイベントを防ぐ
                  setShowCamera(false)
                }}
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* カメラ映像エリア */}
          <div className="relative" style={{ height: "144px", backgroundColor: "#0f172a" }}>
            {cameraStream ? (
              <video
                ref={normalCameraVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ backgroundColor: "#0f172a" }}
                onLoadedMetadata={() => {
                  console.log("[v0] Camera video loaded metadata")
                  if (normalCameraVideoRef.current) {
                    normalCameraVideoRef.current.play().catch(console.error)
                  }
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white/70 text-sm">
                <Camera className="h-8 w-8 mb-2 opacity-50" />
                <span>認証後に表示</span>
              </div>
            )}
            {/* 信頼度バッジ */}
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                {Math.round(matchConfidence * 100)}%
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* カメラ非表示時の表示ボタン（ページ右下に固定） */}
      {!showCamera && isAuthenticated && (
        <Button
          size="icon"
          variant="ghost"
          className="fixed bottom-4 right-4 h-10 w-10 bg-slate-800 text-white/70 hover:text-white z-50 rounded-full shadow-lg"
          onClick={toggleCamera}
        >
          <Eye className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
