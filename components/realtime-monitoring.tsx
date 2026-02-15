"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Mic, MicOff, Video, VideoOff, AlertTriangle, Eye } from "lucide-react"

interface StudentStream {
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  stream: MediaStream | null
  violations: Array<{
    type: string
    timestamp: string
    description: string
  }>
  sessionTime: number
  tabSwitches: number
  faceDetected: boolean
  audioEnabled: boolean
  videoEnabled: boolean
  streamActive: boolean
}

export default function RealtimeMonitoring() {
  const [studentStreams, setStudentStreams] = useState<StudentStream[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  useEffect(() => {
    // WebSocket接続をシミュレート
    const connectToStudents = async () => {
      try {
        // 実際の実装では、WebSocketサーバーに接続
        setIsConnected(true)

        // デモ用のモックストリームを作成
        const mockStreams = await createMockStreams()
        setStudentStreams(mockStreams)

        // 定期的に監視データを更新
        const interval = setInterval(() => {
          updateMonitoringData()
        }, 2000)

        return () => clearInterval(interval)
      } catch (error) {
        console.error("監視システム接続エラー:", error)
      }
    }

    connectToStudents()
  }, [])

  const createMockStreams = async (): Promise<StudentStream[]> => {
    const mockStudents = [
      {
        studentId: "student_001",
        studentName: "田中太郎",
        courseId: "programming-basics",
        courseName: "プログラミング基礎",
      },
      {
        studentId: "student_002",
        studentName: "佐藤花子",
        courseId: "data-science",
        courseName: "データサイエンス基礎",
      },
      {
        studentId: "student_003",
        studentName: "山田次郎",
        courseId: "web-security",
        courseName: "Webセキュリティ",
      },
    ]

    const streams: StudentStream[] = []

    for (const student of mockStudents) {
      try {
        // 実際の実装では受講生のカメラストリームを受信
        // ここではデモ用にローカルカメラを使用
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        streams.push({
          ...student,
          stream,
          violations: [],
          sessionTime: Math.floor(Math.random() * 3600),
          tabSwitches: Math.floor(Math.random() * 5),
          faceDetected: Math.random() > 0.3,
          audioEnabled: true,
          videoEnabled: true,
          streamActive: true,
        })
      } catch (error) {
        console.error(`${student.studentName}のストリーム取得エラー:`, error)
        // カメラアクセスできない場合のフォールバック
        streams.push({
          ...student,
          stream: null,
          violations: [
            {
              type: "camera_access_denied",
              timestamp: new Date().toISOString(),
              description: "カメラアクセスが拒否されました",
            },
          ],
          sessionTime: 0,
          tabSwitches: 0,
          faceDetected: false,
          audioEnabled: false,
          videoEnabled: false,
          streamActive: false,
        })
      }
    }

    return streams
  }

  const updateMonitoringData = () => {
    setStudentStreams((prev) =>
      prev.map((student) => ({
        ...student,
        sessionTime: student.sessionTime + 2,
        faceDetected: Math.random() > 0.2, // 80%の確率で顔検出
        tabSwitches: Math.random() > 0.95 ? student.tabSwitches + 1 : student.tabSwitches,
        violations:
          Math.random() > 0.98
            ? [
                ...student.violations,
                {
                  type: Math.random() > 0.5 ? "tab_switch" : "face_not_detected",
                  timestamp: new Date().toISOString(),
                  description: Math.random() > 0.5 ? "別タブに切り替え" : "顔が検出されない",
                },
              ]
            : student.violations,
      })),
    )
  }

  useEffect(() => {
    // ビデオ要素にストリームを設定
    studentStreams.forEach((student) => {
      const videoElement = videoRefs.current[student.studentId]
      if (videoElement && student.stream) {
        videoElement.srcObject = student.stream
      }
    })
  }, [studentStreams])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (student: StudentStream) => {
    if (!student.videoEnabled) return "bg-gray-500"
    if (student.violations.length > 2) return "bg-blue-500"
    if (!student.faceDetected) return "bg-blue-500"
    return "bg-blue-500"
  }

  const getStatusText = (student: StudentStream) => {
    if (!student.videoEnabled) return "カメラオフ"
    if (student.violations.length > 2) return "アラート"
    if (!student.faceDetected) return "警告"
    return "正常"
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">リアルタイム監視システム</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-blue-500 animate-pulse" : "bg-blue-500"}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? `接続中 (${studentStreams.length}名)` : "切断"}
            </span>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          ライブ監視映像 ({studentStreams.length}名) 最終更新: {new Date().toLocaleTimeString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentStreams.map((student) => (
          <Card key={student.studentId} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{student.studentName}</CardTitle>
                  <p className="text-sm text-gray-600">{student.courseName}</p>
                </div>
                <Badge className={`${getStatusColor(student)} text-white`}>{getStatusText(student)}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* ビデオストリーム */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {student.streamActive ? (
                  <>
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">ライブストリーム</p>
                        <p className="text-xs opacity-50">{student.studentName}</p>
                      </div>
                    </div>
                    {/* 録画インジケーター */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      REC
                    </div>
                    {/* 顔検出ステータス */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <Badge variant={student.faceDetected ? "default" : "destructive"} className="text-xs">
                        {student.faceDetected ? "顔検出OK" : "顔未検出"}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <Camera className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">カメラオフ</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 学習統計 */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm font-bold text-blue-600">{formatTime(student.sessionTime)}</div>
                  <div className="text-xs text-gray-600">学習時間</div>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <div className="text-sm font-bold text-orange-600">{student.tabSwitches}</div>
                  <div className="text-xs text-gray-600">タブ切替</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm font-bold text-blue-600">{student.violations.length}</div>
                  <div className="text-xs text-gray-600">違反</div>
                </div>
              </div>

              {/* 最新の違反 */}
              {student.violations.length > 0 && (
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <div className="flex items-center gap-1 text-blue-800 font-medium mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    最新違反
                  </div>
                  <div className="text-blue-700">
                    {student.violations[student.violations.length - 1]?.description || "違反が検出されました"}
                  </div>
                </div>
              )}

              {/* コントロール */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Eye className="w-3 h-3 mr-1" />
                  詳細
                </Button>
                <Button size="sm" variant="outline">
                  {student.audioEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                </Button>
                <Button size="sm" variant="outline">
                  {student.videoEnabled ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {studentStreams.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">アクティブな監視セッションがありません</h3>
            <p className="text-gray-600">
              受講生が監視システム付きで学習を開始すると、ここにリアルタイム映像が表示されます。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
