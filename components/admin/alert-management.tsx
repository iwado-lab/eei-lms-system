"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  UserX,
  Camera,
  MonitorOff,
  Clock,
  CheckCircle,
  Eye,
  Filter,
  RefreshCw,
  Bell,
  PauseCircle,
  Ban,
  RotateCcw
} from "lucide-react"
import { getAlerts, updateAlertStatus, sendAdminMessage, type AlertData } from "@/lib/face-recognition"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send } from "lucide-react"

export function AlertManagement() {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const loadAlerts = () => {
    setIsRefreshing(true)
    const loadedAlerts = getAlerts()
    setAlerts(loadedAlerts)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  useEffect(() => {
    loadAlerts()
    // 5秒ごとに自動更新
    const interval = setInterval(loadAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = (alertId: string, status: AlertData["status"]) => {
    updateAlertStatus(alertId, status)
    loadAlerts()
  }

  const getAlertIcon = (type: AlertData["type"]) => {
    switch (type) {
      case "absence":
        return <UserX className="w-5 h-5 text-blue-600" />
      case "different_person":
        return <AlertTriangle className="w-5 h-5 text-blue-600" />
      case "camera_off":
        return <Camera className="w-5 h-5 text-orange-600" />
      case "tab_switch":
        return <MonitorOff className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getAlertTypeLabel = (type: AlertData["type"]) => {
    switch (type) {
      case "absence":
        return "離席検知"
      case "different_person":
        return "別人検知"
      case "camera_off":
        return "カメラオフ"
      case "tab_switch":
        return "別タブ検知"
      default:
        return "不明"
    }
  }

  const getAlertTypeBadgeColor = (type: AlertData["type"]) => {
    switch (type) {
      case "absence":
        return "bg-blue-100 text-blue-800"
      case "different_person":
        return "bg-blue-100 text-blue-800"
      case "camera_off":
        return "bg-orange-100 text-orange-800"
      case "tab_switch":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: AlertData["status"]) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "acknowledged":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: AlertData["status"]) => {
    switch (status) {
      case "pending":
        return "未対応"
      case "acknowledged":
        return "対応中"
      case "resolved":
        return "解決済み"
      default:
        return "不明"
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType !== "all" && alert.type !== filterType) return false
    if (filterStatus !== "all" && alert.status !== filterStatus) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        alert.userName.toLowerCase().includes(query) ||
        alert.courseName.toLowerCase().includes(query) ||
        alert.details.toLowerCase().includes(query)
      )
    }
    return true
  })

  const pendingCount = alerts.filter((a) => a.status === "pending").length
  const todayAlerts = alerts.filter((a) => {
    const alertDate = new Date(a.timestamp).toDateString()
    return alertDate === new Date().toDateString()
  }).length

  return (
    <div className="space-y-6">
      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={pendingCount > 0 ? "border-red-200 bg-blue-50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">未対応アラート</p>
                <p className="text-2xl font-bold text-blue-600">{pendingCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">本日のアラート</p>
                <p className="text-2xl font-bold">{todayAlerts}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">別人検知</p>
                <p className="text-2xl font-bold text-blue-600">
                  {alerts.filter((a) => a.type === "different_person").length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">解決済み</p>
                <p className="text-2xl font-bold text-blue-600">
                  {alerts.filter((a) => a.status === "resolved").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルターと検索 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">フィルター:</span>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="all">全タイプ</option>
              <option value="absence">離席検知</option>
              <option value="different_person">別人検知</option>
              <option value="camera_off">カメラオフ</option>
              <option value="tab_switch">別タブ検知</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="all">全ステータス</option>
              <option value="pending">未対応</option>
              <option value="acknowledged">対応中</option>
              <option value="resolved">解決済み</option>
            </select>
            <Input
              placeholder="ユーザー名・コース名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="sm" onClick={loadAlerts} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              更新
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* アラート一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>アラート一覧</span>
            <Badge variant="outline">{filteredAlerts.length}件</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>アラートはありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    alert.status === "pending"
                      ? "border-red-200 bg-blue-50 hover:bg-blue-100"
                      : alert.status === "acknowledged"
                        ? "border-blue-200 bg-blue-50 hover:bg-blue-100"
                        : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getAlertIcon(alert.type)}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{alert.userName}</span>
                          <Badge className={`text-xs ${getAlertTypeBadgeColor(alert.type)}`}>
                            {getAlertTypeLabel(alert.type)}
                          </Badge>
                          <Badge className={`text-xs ${getStatusBadgeColor(alert.status)}`}>
                            {getStatusLabel(alert.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{alert.courseName}</p>
                        <p className="text-sm text-gray-500">{alert.details}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.timestamp).toLocaleString("ja-JP")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedAlert(alert)}>
                            <Eye className="w-4 h-4 mr-1" />
                            詳細
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getAlertIcon(alert.type)}
                              アラート詳細
                            </DialogTitle>
                            <DialogDescription>アラートID: {alert.id}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">受講者</p>
                                <p className="font-medium">{alert.userName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">コース</p>
                                <p className="font-medium">{alert.courseName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">アラートタイプ</p>
                                <Badge className={getAlertTypeBadgeColor(alert.type)}>
                                  {getAlertTypeLabel(alert.type)}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">ステータス</p>
                                <Badge className={getStatusBadgeColor(alert.status)}>
                                  {getStatusLabel(alert.status)}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">詳細</p>
                              <p className="mt-1">{alert.details}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">発生日時</p>
                              <p className="mt-1">{new Date(alert.timestamp).toLocaleString("ja-JP")}</p>
                            </div>
                            {alert.screenshot && (
                              <div>
                                <p className="text-sm text-gray-500 mb-2">スクリーンショット</p>
                                <img
                                  src={alert.screenshot || "/placeholder.svg"}
                                  alt="Screenshot"
                                  className="w-full rounded-lg border"
                                />
                              </div>
                            )}
                            
                            {/* 送信済みメッセージ表示 */}
                            {alert.adminMessage && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <MessageSquare className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">送信済みメッセージ</span>
                                </div>
                                <p className="text-sm text-blue-700">{alert.adminMessage}</p>
                                {alert.adminMessageSentAt && (
                                  <p className="text-xs text-blue-500 mt-1">
                                    送信日時: {new Date(alert.adminMessageSentAt).toLocaleString("ja-JP")}
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {/* メッセージ送信フォーム */}
                            <div className="border-t pt-4">
                              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                受講者にメッセージを送信
                              </p>
                              <Textarea
                                placeholder="受講者に表示するメッセージを入力してください..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                rows={3}
                                className="mb-2"
                              />
                              <Button
                                onClick={() => {
                                  if (messageText.trim()) {
                                    setIsSendingMessage(true)
                                    sendAdminMessage(alert.id, alert.userId, messageText)
                                    setMessageText("")
                                    loadAlerts()
                                    setTimeout(() => setIsSendingMessage(false), 500)
                                  }
                                }}
                                disabled={!messageText.trim() || isSendingMessage}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                {isSendingMessage ? "送信中..." : "メッセージを送信"}
                              </Button>
                            </div>
                          </div>
                          {/* 不正対応アクションボタン */}
                          <div className="border-t pt-4">
                            <p className="text-sm font-medium mb-3 text-blue-700">不正対応アクション</p>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                onClick={() => window.open(`/admin/user-details/${alert.userId}`, "_blank")}
                                className="bg-transparent justify-start"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                画像確認
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // 動画停止命令を送信（管理者メッセージとして実装）
                                  sendAdminMessage(alert.id, alert.userId, "[システム] 管理者により動画の再生が停止されました。管理者の指示があるまでお待ちください。")
                                  loadAlerts()
                                  alert("動画停止命令を送信しました")
                                }}
                                className="bg-transparent justify-start text-orange-700 border-orange-300 hover:bg-orange-50"
                              >
                                <PauseCircle className="w-4 h-4 mr-2" />
                                動画停止
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  if (confirm("この受講者の認定証・修了書の発行を停止しますか？")) {
                                    // LocalStorageのユーザーデータのcertificateBlockedを更新
                                    const students = JSON.parse(localStorage.getItem("glx_students") || "[]")
                                    const updated = students.map((s: { id: string; certificateBlocked?: boolean }) => 
                                      s.id === alert.userId ? { ...s, certificateBlocked: true } : s
                                    )
                                    localStorage.setItem("glx_students", JSON.stringify(updated))
                                    alert("認定証の発行を停止しました")
                                  }
                                }}
                                className="bg-transparent justify-start text-blue-700 border-red-300 hover:bg-blue-50"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                認定証発行停止
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  if (confirm("この受講者の該当パートを未受講に戻しますか？")) {
                                    // 受講進捗をリセット
                                    const students = JSON.parse(localStorage.getItem("glx_students") || "[]")
                                    const updated = students.map((s: { id: string; progress?: number; attendanceStatus?: string }) => 
                                      s.id === alert.userId ? { ...s, progress: 0, attendanceStatus: "not_started" } : s
                                    )
                                    localStorage.setItem("glx_students", JSON.stringify(updated))
                                    alert("該当パートを未受講に戻しました")
                                  }
                                }}
                                className="bg-transparent justify-start text-blue-700 border-red-300 hover:bg-blue-50"
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                未受講に戻す
                              </Button>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 border-t pt-4">
                            {alert.status === "pending" && (
                              <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate(alert.id, "acknowledged")}
                                className="bg-transparent"
                              >
                                対応中にする
                              </Button>
                            )}
                            {alert.status !== "resolved" && (
                              <Button
                                onClick={() => handleStatusUpdate(alert.id, "resolved")}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                解決済みにする
                              </Button>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      {alert.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(alert.id, "acknowledged")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          対応
                        </Button>
                      )}
                      {alert.status === "acknowledged" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(alert.id, "resolved")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          解決
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
