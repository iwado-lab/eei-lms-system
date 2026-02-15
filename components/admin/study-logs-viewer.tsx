"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Camera,
  Clock,
  Eye,
  Search,
  RefreshCw,
  User,
  AlertTriangle,
  CheckCircle,
  ImageIcon,
  Pause,
  Ban,
} from "lucide-react"
import { getStudyLogs, issueRemoteCommand, type StudyLog } from "@/lib/remote-control"

interface StudyLogsViewerProps {
  userId?: string
}

export function StudyLogsViewer({ userId }: StudyLogsViewerProps) {
  const [logs, setLogs] = useState<StudyLog[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<StudyLog | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadLogs = () => {
    setIsRefreshing(true)
    
    // 全ユーザーのログを取得
    const allLogs: StudyLog[] = []
    
    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("studyLogs_")) {
          const userLogs = JSON.parse(localStorage.getItem(key) || "[]")
          allLogs.push(...userLogs)
        }
      }
    }
    
    // ユーザーIDでフィルター
    const filteredLogs = userId
      ? allLogs.filter((log) => log.userId === userId)
      : allLogs
    
    // タイムスタンプで降順ソート
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    setLogs(filteredLogs)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  useEffect(() => {
    loadLogs()
    const interval = setInterval(loadLogs, 10000) // 10秒ごとに更新
    return () => clearInterval(interval)
  }, [userId])

  // リモート動画停止
  const handleStopVideo = (log: StudyLog) => {
    issueRemoteCommand({
      userId: log.userId,
      type: "stop_video",
      courseId: log.courseId,
    })
    alert(`${log.userId} の動画再生を停止しました`)
  }

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true
    return (
      log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.courseId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            受講中ログ（静止画像）
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="ユーザーID・コースで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
            <Button variant="outline" size="sm" onClick={loadLogs} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              更新
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>受講中ログがありません</p>
            <p className="text-sm mt-2">受講者が講義を視聴すると、30秒ごとにスクリーンショットが保存されます。</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredLogs.slice(0, 20).map((log) => (
              <Dialog key={log.id}>
                <DialogTrigger asChild>
                  <div
                    className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                      !log.faceDetected ? "border-blue-300 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    {/* サムネイル */}
                    <div className="relative aspect-video bg-gray-100">
                      {log.screenshot ? (
                        <img
                          src={log.screenshot || "/placeholder.svg"}
                          alt="受講中スクリーンショット"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      {/* ステータスバッジ */}
                      <div className="absolute top-2 left-2">
                        {log.faceDetected ? (
                          <Badge className="bg-blue-500 text-white text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            顔検出OK
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            顔未検出
                          </Badge>
                        )}
                      </div>
                      
                      {/* 信頼度 */}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {(log.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    
                    {/* 情報 */}
                    <div className="p-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="w-3 h-3" />
                        {log.userId}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString("ja-JP")}
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>受講中ログ詳細</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* 大きい画像 */}
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {log.screenshot ? (
                        <img
                          src={log.screenshot || "/placeholder.svg"}
                          alt="受講中スクリーンショット"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* 詳細情報 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ユーザーID</p>
                        <p className="font-medium">{log.userId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">コースID</p>
                        <p className="font-medium">{log.courseId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">日時</p>
                        <p className="font-medium">{new Date(log.timestamp).toLocaleString("ja-JP")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">顔認証状況</p>
                        {log.faceDetected ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            検出OK ({(log.confidence * 100).toFixed(1)}%)
                          </Badge>
                        ) : (
                          <Badge variant="destructive">未検出</Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* アクションボタン */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => handleStopVideo(log)}>
                        <Pause className="w-4 h-4 mr-2" />
                        動画停止
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          issueRemoteCommand({
                            userId: log.userId,
                            type: "block_certificate",
                          })
                          alert("証明書発行を停止しました")
                        }}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        認定証発行停止
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
