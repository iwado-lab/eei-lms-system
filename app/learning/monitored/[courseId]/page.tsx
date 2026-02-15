"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, Camera, AlertTriangle } from "lucide-react"
import UnifiedCourseLayout from "@/components/unified-course-layout"
import CameraMonitoring from "@/components/camera-monitoring"

export default function MonitoredCoursePage({ params }: { params: { courseId: string } }) {
  const [monitoringAccepted, setMonitoringAccepted] = useState(false)
  const [monitoringActive, setMonitoringActive] = useState(false)

  const courseData = {
    title: "データサイエンス基礎 - 統計学入門",
    lesson: "第3章: 確率分布",
    instructor: "田中講師",
    description: "統計学の基本概念から実践的な分析手法まで学習します。",
  }

  const handleMonitoringStart = (stream: MediaStream) => {
    setMonitoringActive(true)
    console.log("[v0] 監視開始:", stream)
  }

  const handleViolationDetected = (violation: any) => {
    console.log("[v0] 違反検出:", violation)
    // 管理者への通知処理
  }

  const handleBack = () => {
    window.history.back()
  }

  if (!monitoringAccepted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-white">カメラ監視システム</CardTitle>
            <p className="text-gray-400">このコースは監視システムが有効です</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>重要な注意事項</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• 学習中はカメラで顔認証を行います</li>
                  <li>• 別タブでの作業や画面離脱が記録されます</li>
                  <li>• 不正行為が検出された場合、管理者に通知されます</li>
                  <li>• 監視データは学習評価に使用される場合があります</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-3">監視内容</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">カメラによる顔認証</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">画面アクティビティ監視</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">タブ切り替え検出</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">学習時間記録</span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">監視システムに同意して学習を開始しますか？</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
                <Button onClick={() => setMonitoringAccepted(true)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Shield className="w-4 h-4 mr-2" />
                  同意して開始
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 監視システムヘッダー */}
      <div className="bg-blue-600 text-white p-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
            <span className="text-sm font-medium">監視システム稼働中</span>
          </div>
          <Badge variant="secondary" className="bg-blue-700 text-blue-100">
            {monitoringActive ? "監視アクティブ" : "監視準備中"}
          </Badge>
        </div>
      </div>

      <div className="flex">
        {/* メインコンテンツ */}
        <div className="flex-1">
          <UnifiedCourseLayout
            courseData={courseData}
            courseType="video"
            pdfUrl="/statistics-textbook-page-with-probability-distribu.jpg"
            onBack={handleBack}
          />
        </div>

        {/* 監視サイドバー */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <CameraMonitoring
            studentId="current_user"
            courseId={params.courseId}
            onMonitoringStart={handleMonitoringStart}
            onViolationDetected={handleViolationDetected}
          />
        </div>
      </div>
    </div>
  )
}
