"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CameraOff, AlertTriangle, Eye, Shield, User, Clock } from "lucide-react"

interface CameraMonitoringProps {
  studentId: string
  courseId: string
  onMonitoringStart?: (stream: MediaStream) => void
  onViolationDetected?: (violation: any) => void
}

export default function CameraMonitoring({
  studentId,
  courseId,
  onMonitoringStart,
  onViolationDetected,
}: CameraMonitoringProps) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [violations, setViolations] = useState<any[]>([])
  const [faceDetected, setFaceDetected] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [isConnectedToAdmin, setIsConnectedToAdmin] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const faceDetectionRef = useRef<NodeJS.Timeout | null>(null)
  const streamBroadcastRef = useRef<NodeJS.Timeout | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  const setupRealtimeCommunication = async (stream: MediaStream) => {
    try {
      // WebRTCピア接続を設定（実際の実装ではシグナリングサーバーが必要）
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })

      // ストリームをピア接続に追加
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      peerConnectionRef.current = peerConnection
      setIsConnectedToAdmin(true)

      // 管理者画面用のデータを定期的に更新
      streamBroadcastRef.current = setInterval(() => {
        const monitoringData = {
          studentId,
          studentName: getStudentName(studentId),
          courseId,
          courseName: getCourseName(courseId),
          violations,
          sessionTime,
          tabSwitches,
          faceDetected,
          status: "active",
          timestamp: new Date().toISOString(),
          streamActive: true,
        }

        // リアルタイムデータをローカルストレージに保存（実際の実装ではWebSocketで送信）
        localStorage.setItem(`realtime_monitoring_${studentId}`, JSON.stringify(monitoringData))

        // カスタムイベントを発火して管理画面に通知
        window.dispatchEvent(
          new CustomEvent("monitoringUpdate", {
            detail: monitoringData,
          }),
        )
      }, 1000)
    } catch (error) {
      console.error("リアルタイム通信設定エラー:", error)
    }
  }

  const getStudentName = (id: string) => {
    const names: { [key: string]: string } = {
      current_user: "田中太郎",
      student_001: "田中太郎",
      student_002: "佐藤花子",
      student_003: "山田次郎",
    }
    return names[id] || `受講生${id}`
  }

  const getCourseName = (id: string) => {
    const courses: { [key: string]: string } = {
      "programming-basics": "プログラミング基礎",
      "data-science": "データサイエンス基礎",
      "web-security": "Webセキュリティ",
    }
    return courses[id] || `コース${id}`
  }

  useEffect(() => {
    // タブ切り替え監視
    const handleVisibilityChange = () => {
      if (document.hidden && isMonitoring) {
        const violation = {
          id: Date.now(),
          type: "tab_switch",
          timestamp: new Date().toISOString(),
          description: "別タブに切り替えました",
        }
        setViolations((prev) => [...prev, violation])
        setTabSwitches((prev) => prev + 1)
        onViolationDetected?.(violation)

        // 監視データをローカルストレージに保存
        const monitoringData = {
          studentId,
          courseId,
          violations: [...violations, violation],
          sessionTime,
          tabSwitches: tabSwitches + 1,
          timestamp: new Date().toISOString(),
        }
        localStorage.setItem(`monitoring_${studentId}_${courseId}`, JSON.stringify(monitoringData))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [isMonitoring, violations, sessionTime, tabSwitches, studentId, courseId, onViolationDetected])

  useEffect(() => {
    if (isMonitoring) {
      // セッション時間カウンター
      sessionTimerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)

      // 顔検出シミュレーション（実際のAI顔検出に置き換え可能）
      faceDetectionRef.current = setInterval(() => {
        if (cameraStream) {
          // ランダムに顔検出状態を変更（実際の実装では顔検出AIを使用）
          const detected = Math.random() > 0.3
          setFaceDetected(detected)

          if (!detected) {
            const violation = {
              id: Date.now(),
              type: "face_not_detected",
              timestamp: new Date().toISOString(),
              description: "顔が検出されませんでした",
            }
            setViolations((prev) => [...prev, violation])
            onViolationDetected?.(violation)
          }
        }
      }, 5000)
    }

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current)
      if (faceDetectionRef.current) clearInterval(faceDetectionRef.current)
      if (streamBroadcastRef.current) clearInterval(streamBroadcastRef.current)
    }
  }, [isMonitoring, cameraStream, onViolationDetected])

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
        audio: false,
      })

      setCameraStream(stream)
      setIsMonitoring(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      await setupRealtimeCommunication(stream)

      onMonitoringStart?.(stream)

      // 監視開始をローカルストレージに記録
      const startData = {
        studentId,
        courseId,
        startTime: new Date().toISOString(),
        status: "active",
      }
      localStorage.setItem(`monitoring_${studentId}_${courseId}`, JSON.stringify(startData))
    } catch (error) {
      console.error("カメラアクセスエラー:", error)
      alert("カメラへのアクセスが拒否されました。監視機能を使用するにはカメラを有効にしてください。")
    }
  }

  const stopMonitoring = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (streamBroadcastRef.current) {
      clearInterval(streamBroadcastRef.current)
      streamBroadcastRef.current = null
    }

    setIsMonitoring(false)
    setIsConnectedToAdmin(false)
    setSessionTime(0)
    setTabSwitches(0)
    setViolations([])

    // 監視終了をローカルストレージに記録
    const endData = {
      studentId,
      courseId,
      endTime: new Date().toISOString(),
      status: "ended",
      totalSessionTime: sessionTime,
      totalViolations: violations.length,
    }
    localStorage.setItem(`monitoring_${studentId}_${courseId}_ended`, JSON.stringify(endData))

    // リアルタイムデータを削除
    localStorage.removeItem(`realtime_monitoring_${studentId}`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      {/* 監視コントロール */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            カメラ監視システム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant={isMonitoring ? "destructive" : "secondary"} className="flex items-center gap-1">
                {isMonitoring ? <Eye className="w-3 h-3" /> : <CameraOff className="w-3 h-3" />}
                {isMonitoring ? "監視中" : "監視停止"}
              </Badge>
              {isMonitoring && (
                <>
                  <Badge variant={isConnectedToAdmin ? "default" : "secondary"} className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${isConnectedToAdmin ? "bg-blue-400 animate-pulse" : "bg-gray-400"}`}
                    />
                    {isConnectedToAdmin ? "管理者接続中" : "接続待機"}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(sessionTime)}
                  </Badge>
                  <Badge variant={faceDetected ? "default" : "destructive"} className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {faceDetected ? "顔検出OK" : "顔未検出"}
                  </Badge>
                </>
              )}
            </div>
            <Button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isMonitoring ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              {isMonitoring ? "監視停止" : "監視開始"}
            </Button>
          </div>

          {/* カメラプレビュー */}
          {isMonitoring && (
            <div className="relative">
              <video ref={videoRef} autoPlay muted className="w-full max-w-sm rounded-lg border-2 border-blue-300" />
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                LIVE
              </div>
              {isConnectedToAdmin && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  管理者監視中
                </div>
              )}
            </div>
          )}

          {/* 監視統計 */}
          {isMonitoring && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{formatTime(sessionTime)}</div>
                <div className="text-sm text-gray-600">学習時間</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">{tabSwitches}</div>
                <div className="text-sm text-gray-600">タブ切り替え</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{violations.length}</div>
                <div className="text-sm text-gray-600">違反検出</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 違反アラート */}
      {violations.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              監視アラート
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {violations.slice(-5).map((violation) => (
                <Alert key={violation.id} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex justify-between items-center">
                    <span>{violation.description}</span>
                    <span className="text-xs">{new Date(violation.timestamp).toLocaleTimeString()}</span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}
