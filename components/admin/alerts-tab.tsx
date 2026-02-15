"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertTriangle,
  UserX,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Mail,
  Eye,
  Trash2,
  RefreshCw,
  Download,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Alert {
  id: string
  type: "absence" | "identity_mismatch" | "multiple_faces" | "no_face"
  userId: string
  userName: string
  courseId: string
  courseName: string
  partId: string
  partName: string
  timestamp: Date
  status: "unread" | "read" | "resolved" | "dismissed"
  screenshot?: string
  confidence?: number
  details?: string
}

// サンプルデータ
const sampleAlerts: Alert[] = [
  {
    id: "1",
    type: "absence",
    userId: "user-001",
    userName: "山田 太郎",
    courseId: "course-1",
    courseName: "派遣元責任者講習",
    partId: "1",
    partName: "Part 1: 派遣制度の仕組み",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: "unread",
    details: "受講者がカメラ前から5分以上離席しています",
  },
  {
    id: "2",
    type: "identity_mismatch",
    userId: "user-002",
    userName: "佐藤 花子",
    courseId: "course-1",
    courseName: "派遣元責任者講習",
    partId: "2",
    partName: "Part 2: 派遣労働者の雇用管理",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: "unread",
    confidence: 45,
    details: "登録された本人画像との一致率が低いです（45%）",
  },
  {
    id: "3",
    type: "multiple_faces",
    userId: "user-003",
    userName: "鈴木 一郎",
    courseId: "course-1",
    courseName: "派遣元責任者講習",
    partId: "3",
    partName: "Part 3: 派遣先責任者の役割",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "read",
    details: "カメラに複数の人物が検出されました",
  },
  {
    id: "4",
    type: "no_face",
    userId: "user-004",
    userName: "田中 美咲",
    courseId: "course-1",
    courseName: "派遣元責任者講習",
    partId: "1",
    partName: "Part 1: 派遣制度の仕組み",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "resolved",
    details: "顔が検出できませんでした",
  },
]

export function AlertsTab() {
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [notificationEmail, setNotificationEmail] = useState("admin@example.com")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "absence":
        return <UserX className="h-5 w-5" />
      case "identity_mismatch":
        return <AlertTriangle className="h-5 w-5" />
      case "multiple_faces":
        return <Users className="h-5 w-5" />
      case "no_face":
        return <XCircle className="h-5 w-5" />
    }
  }

  const getAlertLabel = (type: Alert["type"]) => {
    switch (type) {
      case "absence":
        return "離席検知"
      case "identity_mismatch":
        return "本人不一致"
      case "multiple_faces":
        return "複数人検知"
      case "no_face":
        return "顔未検出"
    }
  }

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "absence":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "identity_mismatch":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "multiple_faces":
        return "bg-blue-50 text-blue-600 border-blue-200"
      case "no_face":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusBadge = (status: Alert["status"]) => {
    switch (status) {
      case "unread":
        return <Badge variant="destructive">未読</Badge>
      case "read":
        return <Badge variant="secondary">確認済</Badge>
      case "resolved":
        return <Badge className="bg-blue-100 text-blue-800">解決済</Badge>
      case "dismissed":
        return <Badge variant="outline">却下</Badge>
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) return `${minutes}分前`
    if (hours < 24) return `${hours}時間前`
    return `${days}日前`
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || alert.type === filterType
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const unreadCount = alerts.filter((a) => a.status === "unread").length

  const handleMarkAsRead = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: "read" as const } : a)))
  }

  const handleResolve = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" as const } : a)))
  }

  const handleDismiss = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: "dismissed" as const } : a)))
  }

  const handleViewDetail = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsDetailOpen(true)
    if (alert.status === "unread") {
      handleMarkAsRead(alert.id)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // 実際にはAPIからアラートを再取得
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExportCSV = () => {
    const headers = ["日時", "種別", "受講者", "コース", "パート", "ステータス", "詳細"]
    const rows = filteredAlerts.map((a) => [
      a.timestamp.toISOString(),
      getAlertLabel(a.type),
      a.userName,
      a.courseName,
      a.partName,
      a.status,
      a.details || "",
    ])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `alerts_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const handleSendTestEmail = async () => {
    try {
      const response = await fetch("/api/send-alert-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: notificationEmail,
          subject: "【テスト】アラート通知テスト",
          alertType: "test",
          userName: "テストユーザー",
          courseName: "テストコース",
          partName: "テストパート",
          details: "これはテスト通知です",
        }),
      })
      if (response.ok) {
        alert("テストメールを送信しました")
      } else {
        alert("メール送信に失敗しました")
      }
    } catch {
      alert("メール送信エラーが発生しました")
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">アラート管理</h2>
          <p className="text-sm text-gray-500">受講中の不正行為や異常を検知したアラートを管理します</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-lg px-3 py-1">
              {unreadCount}件の未読
            </Badge>
          )}
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            更新
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV出力
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">アラート一覧</TabsTrigger>
          <TabsTrigger value="settings">通知設定</TabsTrigger>
          <TabsTrigger value="statistics">統計</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* フィルター */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="受講者名またはコース名で検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="種別で絞り込み" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべての種別</SelectItem>
                    <SelectItem value="absence">離席検知</SelectItem>
                    <SelectItem value="identity_mismatch">本人不一致</SelectItem>
                    <SelectItem value="multiple_faces">複数人検知</SelectItem>
                    <SelectItem value="no_face">顔未検出</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="ステータスで絞り込み" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのステータス</SelectItem>
                    <SelectItem value="unread">未読</SelectItem>
                    <SelectItem value="read">確認済</SelectItem>
                    <SelectItem value="resolved">解決済</SelectItem>
                    <SelectItem value="dismissed">却下</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* アラート一覧 */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                  <p className="text-gray-500">該当するアラートはありません</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    alert.status === "unread" ? "border-l-4 border-l-blue-500" : ""
                  }`}
                  onClick={() => handleViewDetail(alert)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getAlertColor(alert.type)}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{alert.userName}</span>
                            <Badge variant="outline" className={getAlertColor(alert.type)}>
                              {getAlertLabel(alert.type)}
                            </Badge>
                            {getStatusBadge(alert.status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            {alert.courseName} - {alert.partName}
                          </p>
                          <p className="text-sm text-gray-400">{alert.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTimestamp(alert.timestamp)}
                          </div>
                          {alert.confidence !== undefined && (
                            <p className="text-sm text-gray-400">一致率: {alert.confidence}%</p>
                          )}
                        </div>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" onClick={() => handleViewDetail(alert)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {alert.status !== "resolved" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600"
                              onClick={() => handleResolve(alert.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {alert.status !== "dismissed" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400"
                              onClick={() => handleDismiss(alert.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>アラート発生時の通知方法を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">メール通知</Label>
                  <p className="text-sm text-gray-500">アラート発生時にメールで通知を受け取ります</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              {emailNotifications && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                  <div className="space-y-2">
                    <Label>通知先メールアドレス</Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleSendTestEmail}>
                        <Mail className="h-4 w-4 mr-2" />
                        テスト送信
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>通知するアラートの種別</Label>
                    <div className="space-y-2">
                      {[
                        { id: "absence", label: "離席検知" },
                        { id: "identity_mismatch", label: "本人不一致" },
                        { id: "multiple_faces", label: "複数人検知" },
                        { id: "no_face", label: "顔未検出" },
                      ].map((type) => (
                        <div key={type.id} className="flex items-center gap-2">
                          <input type="checkbox" id={type.id} defaultChecked className="rounded border-gray-300" />
                          <Label htmlFor={type.id} className="font-normal">
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label className="text-base">リアルタイム通知</Label>
                  <p className="text-sm text-gray-500">管理画面にリアルタイムで通知を表示します</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">本日のアラート</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {
                    alerts.filter((a) => {
                      const today = new Date()
                      return a.timestamp.toDateString() === today.toDateString()
                    }).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">未対応</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {alerts.filter((a) => a.status === "unread" || a.status === "read").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">解決済</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {alerts.filter((a) => a.status === "resolved").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">最多アラート種別</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">本人不一致</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>種別別アラート件数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "absence" as const, label: "離席検知", color: "bg-blue-500" },
                  { type: "identity_mismatch" as const, label: "本人不一致", color: "bg-blue-500" },
                  { type: "multiple_faces" as const, label: "複数人検知", color: "bg-orange-500" },
                  { type: "no_face" as const, label: "顔未検出", color: "bg-gray-500" },
                ].map((item) => {
                  const count = alerts.filter((a) => a.type === item.type).length
                  const percentage = alerts.length > 0 ? (count / alerts.length) * 100 : 0
                  return (
                    <div key={item.type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{count}件</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 詳細ダイアログ */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>アラート詳細</DialogTitle>
            <DialogDescription>アラートの詳細情報を確認し、対応を行ってください</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${getAlertColor(selectedAlert.type)}`}>
                  {getAlertIcon(selectedAlert.type)}
                </div>
                <div>
                  <Badge variant="outline" className={getAlertColor(selectedAlert.type)}>
                    {getAlertLabel(selectedAlert.type)}
                  </Badge>
                  {getStatusBadge(selectedAlert.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">受講者</Label>
                  <p className="font-medium">{selectedAlert.userName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">ユーザーID</Label>
                  <p className="font-medium">{selectedAlert.userId}</p>
                </div>
                <div>
                  <Label className="text-gray-500">コース</Label>
                  <p className="font-medium">{selectedAlert.courseName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">パート</Label>
                  <p className="font-medium">{selectedAlert.partName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">発生日時</Label>
                  <p className="font-medium">{selectedAlert.timestamp.toLocaleString("ja-JP")}</p>
                </div>
                {selectedAlert.confidence !== undefined && (
                  <div>
                    <Label className="text-gray-500">一致率</Label>
                    <p className="font-medium">{selectedAlert.confidence}%</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-500">詳細</Label>
                <p className="font-medium">{selectedAlert.details}</p>
              </div>

              {selectedAlert.screenshot && (
                <div>
                  <Label className="text-gray-500">スクリーンショット</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={selectedAlert.screenshot || "/placeholder.svg"}
                      alt="アラート発生時のスクリーンショット"
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {selectedAlert.status !== "resolved" && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleResolve(selectedAlert.id)
                      setIsDetailOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    解決済みにする
                  </Button>
                )}
                {selectedAlert.status !== "dismissed" && (
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      handleDismiss(selectedAlert.id)
                      setIsDetailOpen(false)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    却下する
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
