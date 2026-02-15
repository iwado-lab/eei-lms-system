"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, CheckCircle, AlertTriangle, UserX, Clock } from "lucide-react"
import {
  getFaceDescriptor,
  saveAlert,
  queueEmailNotification,
  type AlertData,
  type FaceMatchResult,
} from "@/lib/face-recognition"

interface FaceVerificationProps {
  userId: string
  userName: string
  courseId: string
  courseName: string
  onVerificationComplete?: (result: FaceMatchResult) => void
  onAlert?: (alert: AlertData) => void
  monitoringInterval?: number
}

export function FaceVerification({
  userId,
  userName,
  courseId,
  courseName,
  onVerificationComplete,
  onAlert,
  monitoringInterval = 30000,
}: FaceVerificationProps) {
  const [status, setStatus] = useState<"idle" | "verifying" | "matched" | "mismatch" | "absent">("idle")
  const [confidence, setConfidence] = useState(0)
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null)
  const [alertCount, setAlertCount] = useState(0)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [faceDetected, setFaceDetected] = useState(true)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [currentFrame, setCurrentFrame] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const registeredFace = getFaceDescriptor(userId)

  const createAlert = useCallback(
    (type: AlertData["type"], details: string, screenshotUrl?: string) => {
      const alert: AlertData = {
        id: `alert_${Date.now()}`,
        type,
        userId,
        userName,
        courseId,
        courseName,
        timestamp: new Date().toISOString(),
        status: "pending",
        details,
        screenshotUrl,
      }

      saveAlert(alert)
      queueEmailNotification(alert)
      setAlertCount((prev) => prev + 1)

      if (onAlert) {
        onAlert(alert)
      }
    },
    [userId, userName, courseId, courseName, onAlert],
  )

  const compareImages = useCallback((currentImage: string, registeredImage: string): number => {
    // 実際のプロダクションではface-api.jsやTensorFlow.jsを使用
    // ここでは画像データの一部を比較して類似度を算出
    if (!currentImage || !registeredImage) return 0

    // 画像データの中間部分を抽出して比較
    const current = currentImage.slice(200, 500)
    const registered = registeredImage.slice(200, 500)

    let matchCount = 0
    const compareLength = Math.min(current.length, registered.length)

    for (let i = 0; i < compareLength; i++) {
      if (current[i] === registered[i]) {
        matchCount++
      }
    }

    // 基本的な類似度 + ランダム要素（デモ用）
    const baseSimilarity = matchCount / compareLength
    const randomFactor = Math.random() * 0.3

    return Math.min(0.95, baseSimilarity * 0.5 + 0.4 + randomFactor)
  }, [])

  const verifyFace = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !registeredFace) return

    setStatus("verifying")

    const canvas = canvasRef.current
    const video = videoRef.current

    const videoWidth = video.videoWidth || 640
    const videoHeight = video.videoHeight || 480

    canvas.width = videoWidth
    canvas.height = videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, videoWidth, videoHeight)

    const currentImageData = canvas.toDataURL("image/jpeg", 0.8)
    setCurrentFrame(currentImageData)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const similarity = compareImages(currentImageData, registeredFace.imageUrl || "")

    let result: FaceMatchResult

    // 類似度に基づいて判定
    if (similarity > 0.7) {
      // 一致
      result = {
        isMatch: true,
        confidence: similarity,
        matchedUser: registeredFace,
      }
      setStatus("matched")
      setFaceDetected(true)
    } else if (similarity > 0.3) {
      // 別人の可能性
      result = {
        isMatch: false,
        confidence: similarity,
      }
      setStatus("mismatch")
      setFaceDetected(true)
      createAlert("different_person", "登録された本人と異なる人物が検出されました", currentImageData)
    } else {
      // 離席または顔検出できず
      result = {
        isMatch: false,
        confidence: 0,
      }
      setStatus("absent")
      setFaceDetected(false)
      createAlert("absence", "受講者が画面から離れています", currentImageData)
    }

    setConfidence(result.confidence)
    setLastCheckTime(new Date())

    if (onVerificationComplete) {
      onVerificationComplete(result)
    }

    setTimeout(() => {
      if (isMonitoring) {
        setStatus("idle")
      }
    }, 3000)
  }, [registeredFace, createAlert, onVerificationComplete, isMonitoring, compareImages])

  const startMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play()
            setIsCameraReady(true)
            console.log("[v0] 監視カメラ起動成功")
          } catch (playError) {
            console.error("[v0] 再生エラー:", playError)
          }
        }
      }

      setIsMonitoring(true)

      // 初回チェック
      setTimeout(verifyFace, 2000)

      // 定期チェック開始
      monitoringIntervalRef.current = setInterval(verifyFace, monitoringInterval)
    } catch (error) {
      console.error("[v0] カメラアクセスエラー:", error)
      createAlert("camera_off", "カメラへのアクセスが拒否されました")
    }
  }, [verifyFace, monitoringInterval, createAlert])

  const stopMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current)
      monitoringIntervalRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setIsMonitoring(false)
    setIsCameraReady(false)
    setStatus("idle")
  }, [])

  useEffect(() => {
    return () => {
      stopMonitoring()
    }
  }, [stopMonitoring])

  const getStatusColor = () => {
    switch (status) {
      case "matched":
        return "border-blue-500 bg-blue-50"
      case "mismatch":
        return "border-blue-500 bg-blue-50"
      case "absent":
        return "border-yellow-500 bg-yellow-50"
      case "verifying":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-gray-300"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "matched":
        return <CheckCircle className="w-6 h-6 text-blue-600" />
      case "mismatch":
        return <UserX className="w-6 h-6 text-blue-600" />
      case "absent":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      case "verifying":
        return <Camera className="w-6 h-6 text-blue-600 animate-pulse" />
      default:
        return <Camera className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "matched":
        return "本人確認OK"
      case "mismatch":
        return "別人を検出"
      case "absent":
        return "離席中"
      case "verifying":
        return "確認中..."
      default:
        return "待機中"
    }
  }

  if (!registeredFace) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">本人画像が登録されていません</p>
              <p className="text-xs text-yellow-700">先に顔登録を行ってから受講を開始してください。</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all duration-300 ${getStatusColor()}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getStatusIcon()}
            本人認証モニタリング
          </span>
          <div className="flex items-center gap-2">
            {alertCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                アラート {alertCount}件
              </Badge>
            )}
            <Badge variant={isMonitoring ? "default" : "secondary"} className="text-xs">
              {isMonitoring ? "監視中" : "停止"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* カメラ映像 */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            {/* カメラ準備中の表示 */}
            {!isCameraReady && isMonitoring && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <Camera className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs">カメラ起動中...</p>
                </div>
              </div>
            )}
            {!isMonitoring && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Camera className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge variant={faceDetected ? "default" : "destructive"} className="text-xs">
                {faceDetected ? "顔検出OK" : "顔未検出"}
              </Badge>
            </div>
          </div>

          {/* 登録画像との比較 */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500">登録画像</p>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={registeredFace.imageUrl || "/placeholder.svg"}
                alt="Registered face"
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
          </div>
        </div>

        {/* ステータス表示 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{getStatusText()}</span>
            {confidence > 0 && <span className="text-gray-500">一致度: {Math.round(confidence * 100)}%</span>}
          </div>
          {status === "verifying" && <Progress value={50} className="h-1" />}
          {confidence > 0 && status !== "verifying" && (
            <Progress
              value={confidence * 100}
              className={`h-1 ${
                confidence > 0.7
                  ? "[&>div]:bg-blue-500"
                  : confidence > 0.4
                    ? "[&>div]:bg-yellow-500"
                    : "[&>div]:bg-blue-500"
              }`}
            />
          )}
        </div>

        {/* 最終チェック時刻 */}
        {lastCheckTime && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            最終確認: {lastCheckTime.toLocaleTimeString("ja-JP")}
          </div>
        )}

        {/* 操作ボタン */}
        <div className="flex gap-2">
          {!isMonitoring ? (
            <button
              onClick={startMonitoring}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              監視開始
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              監視停止
            </button>
          )}
          <button
            onClick={verifyFace}
            disabled={!isMonitoring || !isCameraReady}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            今すぐ確認
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}
