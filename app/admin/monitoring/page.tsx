"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Monitor, Users, AlertTriangle, Eye, Camera, Clock, Activity, Search, Download, RefreshCw } from "lucide-react"
import RealtimeMonitoring from "@/components/realtime-monitoring"

interface MonitoringSession {
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  startTime: string
  sessionTime: number
  violations: any[]
  tabSwitches: number
  status: "active" | "ended"
  faceDetected: boolean
}

export default function AdminMonitoringPage() {
  const [sessions, setSessions] = useState<MonitoringSession[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadMonitoringSessions()
    const interval = setInterval(loadMonitoringSessions, 5000) // 5秒ごとに更新
    return () => clearInterval(interval)
  }, [])

  const loadMonitoringSessions = () => {
    const allSessions: MonitoringSession[] = []

    // ローカルストレージから監視データを読み込み
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("monitoring_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}")

          // モックデータで補完
          const session: MonitoringSession = {
            studentId: data.studentId || "student_001",
            studentName: getStudentName(data.studentId),
            courseId: data.courseId || "data-science",
            courseName: getCourseName(data.courseId),
            startTime: data.startTime || data.timestamp || new Date().toISOString(),
            sessionTime: data.sessionTime || Math.floor(Math.random() * 3600),
            violations: data.violations || [],
            tabSwitches: data.tabSwitches || Math.floor(Math.random() * 5),
            status: data.status || "active",
            faceDetected: Math.random() > 0.3,
          }

          allSessions.push(session)
        } catch (error) {
          console.error("監視データの読み込みエラー:", error)
        }
      }
    }

    // モックデータを追加（デモ用）
    const mockSessions: MonitoringSession[] = [
      {
        studentId: "student_001",
        studentName: "田中太郎",
        courseId: "data-science",
        courseName: "データサイエンス基礎",
        startTime: new Date(Date.now() - 1800000).toISOString(),
        sessionTime: 1800,
        violations: [{ type: "tab_switch", timestamp: new Date().toISOString(), description: "別タブに切り替え" }],
        tabSwitches: 2,
        status: "active",
        faceDetected: true,
      },
      {
        studentId: "student_002",
        studentName: "佐藤花子",
        courseId: "programming-basics",
        courseName: "プログラミング基礎",
        startTime: new Date(Date.now() - 2700000).toISOString(),
        sessionTime: 2700,
        violations: [],
        tabSwitches: 0,
        status: "active",
        faceDetected: true,
      },
      {
        studentId: "student_003",
        studentName: "山田次郎",
        courseId: "machine-learning",
        courseName: "機械学習応用",
        startTime: new Date(Date.now() - 900000).toISOString(),
        sessionTime: 900,
        violations: [
          { type: "face_not_detected", timestamp: new Date().toISOString(), description: "顔が検出されない" },
          { type: "tab_switch", timestamp: new Date().toISOString(), description: "別タブに切り替え" },
        ],
        tabSwitches: 3,
        status: "active",
        faceDetected: false,
      },
    ]

    setSessions([...allSessions, ...mockSessions])
  }

  const getStudentName = (studentId: string) => {
    const names = {
      student_001: "田中太郎",
      student_002: "佐藤花子",
      student_003: "山田次郎",
    }
    return names[studentId as keyof typeof names] || `受講生${studentId}`
  }

  const getCourseName = (courseId: string) => {
    const courses = {
      "data-science": "データサイエンス基礎",
      "programming-basics": "プログラミング基礎",
      "machine-learning": "機械学習応用",
    }
    return courses[courseId as keyof typeof courses] || `コース${courseId}`
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || session.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const activeSessions = sessions.filter((s) => s.status === "active").length
  const totalViolations = sessions.reduce((sum, s) => sum + s.violations.length, 0)
  const averageSessionTime =
    sessions.length > 0 ? Math.floor(sessions.reduce((sum, s) => sum + s.sessionTime, 0) / sessions.length) : 0

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">リアルタイム監視ダッシュボード</h1>
          <p className="text-gray-600">受講生のカメラ監視とアクティビティをリアルタイムで確認</p>
        </div>

        <RealtimeMonitoring />

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">アクティブセッション</p>
                  <p className="text-3xl font-bold text-blue-600">{activeSessions}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総受講生数</p>
                  <p className="text-3xl font-bold text-blue-600">{sessions.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">違反検出数</p>
                  <p className="text-3xl font-bold text-blue-600">{totalViolations}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均学習時間</p>
                  <p className="text-3xl font-bold text-purple-600">{formatTime(averageSessionTime)}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フィルターとコントロール */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="受講生名またはコース名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">全ステータス</option>
                  <option value="active">アクティブ</option>
                  <option value="ended">終了</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadMonitoringSessions}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  更新
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  レポート出力
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 監視セッション一覧 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSessions.map((session) => (
            <Card key={`${session.studentId}_${session.courseId}`} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{session.studentName}</CardTitle>
                    <p className="text-gray-600">{session.courseName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.status === "active" ? "default" : "secondary"}>
                      {session.status === "active" ? "アクティブ" : "終了"}
                    </Badge>
                    <Badge variant={session.faceDetected ? "default" : "destructive"}>
                      {session.faceDetected ? "顔検出OK" : "顔未検出"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 監視統計 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{formatTime(session.sessionTime)}</div>
                      <div className="text-xs text-gray-600">学習時間</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">{session.tabSwitches}</div>
                      <div className="text-xs text-gray-600">タブ切り替え</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{session.violations.length}</div>
                      <div className="text-xs text-gray-600">違反検出</div>
                    </div>
                  </div>

                  {/* 最新の違反 */}
                  {session.violations.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        最新の違反
                      </h4>
                      <div className="space-y-1">
                        {session.violations.slice(-2).map((violation, index) => (
                          <div key={index} className="text-sm text-blue-700">
                            • {violation.description} ({new Date(violation.timestamp).toLocaleTimeString()})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* アクション */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 mr-1" />
                      詳細表示
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Camera className="w-4 h-4 mr-1" />
                      ライブ映像
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">監視セッションがありません</h3>
              <p className="text-gray-600">現在アクティブな監視セッションはありません。</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
