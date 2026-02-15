"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Eye,
  Mail,
  MailCheck,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  User,
  Video,
  X,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Alert {
  id: string
  type:
    | "face_not_detected"
    | "tab_switch"
    | "camera_off"
    | "session_timeout"
    | "suspicious_activity"
    | "different_person"
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  timestamp: string
  description: string
  status: "pending" | "acknowledged" | "resolved" | "dismissed"
  severity: "low" | "medium" | "high" | "critical"
  emailSent: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
  resolvedAt?: string
  notes?: string
  violationCount?: number
}

interface NotificationSettings {
  emailEnabled: boolean
  emailRecipients: string[]
  alertTypes: {
    face_not_detected: boolean
    tab_switch: boolean
    camera_off: boolean
    session_timeout: boolean
    suspicious_activity: boolean
    different_person: boolean
  }
  severityThreshold: "low" | "medium" | "high" | "critical"
  instantNotification: boolean
  digestEnabled: boolean
  digestFrequency: "hourly" | "daily" | "weekly"
}

export default function AdminAlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    emailRecipients: ["admin@example.com", "supervisor@example.com"],
    alertTypes: {
      face_not_detected: true,
      tab_switch: true,
      camera_off: true,
      session_timeout: false,
      suspicious_activity: true,
      different_person: true,
    },
    severityThreshold: "medium",
    instantNotification: true,
    digestEnabled: true,
    digestFrequency: "daily",
  })
  const [newRecipient, setNewRecipient] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [responseNotes, setResponseNotes] = useState("")

  useEffect(() => {
    loadAlerts()
    loadNotificationSettings()
    const interval = setInterval(loadAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterAlerts()
  }, [alerts, searchQuery, statusFilter, severityFilter])

  const loadAlerts = () => {
    // Load from localStorage
    const storedAlerts = JSON.parse(localStorage.getItem("monitoringAlerts") || "[]")

    // Generate mock data if empty
    if (storedAlerts.length === 0) {
      const mockAlerts: Alert[] = [
        {
          id: "alert_001",
          type: "face_not_detected",
          studentId: "student_001",
          studentName: "田中太郎",
          courseId: "part-1",
          courseName: "Part 1: 派遣制度の仕組み",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          description: "受講中に顔が検出されませんでした（30秒以上）",
          status: "pending",
          severity: "high",
          emailSent: false,
        },
        {
          id: "alert_006",
          type: "different_person",
          studentId: "student_006",
          studentName: "渡辺健太",
          courseId: "part-2",
          courseName: "Part 2: 派遣労働者の雇用管理",
          timestamp: new Date(Date.now() - 60000).toISOString(),
          description: "登録者以外の人物が検出されました（別人検出）",
          status: "pending",
          severity: "critical",
          emailSent: false,
          violationCount: 3,
        },
        {
          id: "alert_002",
          type: "tab_switch",
          studentId: "student_002",
          studentName: "佐藤花子",
          courseId: "part-2",
          courseName: "Part 2: 派遣労働者の雇用管理",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          description: "動画再生中に別タブへ切り替えが検出されました",
          status: "acknowledged",
          severity: "medium",
          emailSent: true,
          acknowledgedBy: "管理者A",
          acknowledgedAt: new Date(Date.now() - 500000).toISOString(),
        },
        {
          id: "alert_003",
          type: "camera_off",
          studentId: "student_003",
          studentName: "山田次郎",
          courseId: "part-3",
          courseName: "Part 3: 派遣先責任者の役割",
          timestamp: new Date(Date.now() - 900000).toISOString(),
          description: "カメラがオフになりました",
          status: "resolved",
          severity: "high",
          emailSent: true,
          acknowledgedBy: "管理者B",
          acknowledgedAt: new Date(Date.now() - 800000).toISOString(),
          resolvedAt: new Date(Date.now() - 700000).toISOString(),
          notes: "学生に連絡し、カメラを再起動してもらいました",
        },
        {
          id: "alert_004",
          type: "suspicious_activity",
          studentId: "student_004",
          studentName: "鈴木一郎",
          courseId: "part-4",
          courseName: "Part 4: 個人情報の保護等",
          timestamp: new Date(Date.now() - 120000).toISOString(),
          description: "短時間で複数回のタブ切り替えが検出されました（不正の可能性）",
          status: "pending",
          severity: "critical",
          emailSent: true,
        },
        {
          id: "alert_005",
          type: "session_timeout",
          studentId: "student_005",
          studentName: "高橋美咲",
          courseId: "part-5",
          courseName: "Part 5: 労働者派遣契約",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          description: "セッションがタイムアウトしました（30分間アクティビティなし）",
          status: "dismissed",
          severity: "low",
          emailSent: false,
        },
      ]
      setAlerts(mockAlerts)
      localStorage.setItem("monitoringAlerts", JSON.stringify(mockAlerts))
    } else {
      setAlerts(storedAlerts)
    }

    const urgentAlert = localStorage.getItem("urgentAlert")
    if (urgentAlert) {
      console.log("[v0] 緊急アラートを検出:", urgentAlert)
      localStorage.removeItem("urgentAlert")
    }
  }

  const loadNotificationSettings = () => {
    const stored = localStorage.getItem("notificationSettings")
    if (stored) {
      setNotificationSettings(JSON.parse(stored))
    }
  }

  const saveNotificationSettings = () => {
    localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
    setShowSettingsDialog(false)
  }

  const filterAlerts = () => {
    let filtered = [...alerts]

    if (searchQuery) {
      filtered = filtered.filter(
        (alert) =>
          alert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.severity === severityFilter)
    }

    filtered.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      if (a.status === "pending" && b.status !== "pending") return -1
      if (b.status === "pending" && a.status !== "pending") return 1
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    setFilteredAlerts(filtered)
  }

  const handleAcknowledge = async (alertId: string) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId
        ? {
            ...alert,
            status: "acknowledged" as const,
            acknowledgedBy: "管理者",
            acknowledgedAt: new Date().toISOString(),
          }
        : alert,
    )
    setAlerts(updatedAlerts)
    localStorage.setItem("monitoringAlerts", JSON.stringify(updatedAlerts))

    await sendEmailNotification(alertId, "acknowledged")
  }

  const handleResolve = async (alertId: string, notes: string) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId
        ? {
            ...alert,
            status: "resolved" as const,
            resolvedAt: new Date().toISOString(),
            notes,
          }
        : alert,
    )
    setAlerts(updatedAlerts)
    localStorage.setItem("monitoringAlerts", JSON.stringify(updatedAlerts))
    setShowAlertDialog(false)
    setResponseNotes("")
  }

  const handleDismiss = (alertId: string) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, status: "dismissed" as const } : alert,
    )
    setAlerts(updatedAlerts)
    localStorage.setItem("monitoringAlerts", JSON.stringify(updatedAlerts))
  }

  const handleDelete = (alertId: string) => {
    const updatedAlerts = alerts.filter((alert) => alert.id !== alertId)
    setAlerts(updatedAlerts)
    localStorage.setItem("monitoringAlerts", JSON.stringify(updatedAlerts))
  }

  const sendEmailNotification = async (alertId: string, action: string) => {
    setIsSendingEmail(true)
    try {
      const alert = alerts.find((a) => a.id === alertId)
      if (!alert) return

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedAlerts = alerts.map((a) => (a.id === alertId ? { ...a, emailSent: true } : a))
      setAlerts(updatedAlerts)
      localStorage.setItem("monitoringAlerts", JSON.stringify(updatedAlerts))

      console.log(`[v0] Email notification sent for alert ${alertId}: ${action}`)
    } catch (error) {
      console.error("Email notification error:", error)
    } finally {
      setIsSendingEmail(false)
    }
  }

  const addEmailRecipient = () => {
    if (newRecipient && !notificationSettings.emailRecipients.includes(newRecipient)) {
      setNotificationSettings({
        ...notificationSettings,
        emailRecipients: [...notificationSettings.emailRecipients, newRecipient],
      })
      setNewRecipient("")
    }
  }

  const removeEmailRecipient = (email: string) => {
    setNotificationSettings({
      ...notificationSettings,
      emailRecipients: notificationSettings.emailRecipients.filter((e) => e !== email),
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-blue-600 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-blue-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "緊急"
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return severity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "acknowledged":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "dismissed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "未対応"
      case "acknowledged":
        return "対応中"
      case "resolved":
        return "解決済み"
      case "dismissed":
        return "却下"
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "face_not_detected":
        return <User className="w-4 h-4" />
      case "tab_switch":
        return <Eye className="w-4 h-4" />
      case "camera_off":
        return <Video className="w-4 h-4" />
      case "session_timeout":
        return <Clock className="w-4 h-4" />
      case "suspicious_activity":
        return <AlertTriangle className="w-4 h-4" />
      case "different_person":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "face_not_detected":
        return "顔未検出"
      case "tab_switch":
        return "タブ切り替え"
      case "camera_off":
        return "カメラオフ"
      case "session_timeout":
        return "セッションタイムアウト"
      case "suspicious_activity":
        return "不審な活動"
      case "different_person":
        return "別人検出"
      default:
        return type
    }
  }

  const pendingCount = alerts.filter((a) => a.status === "pending").length
  const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" onClick={() => router.push("/admin")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                管理画面に戻る
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">アラート管理</h1>
            <p className="text-gray-600 mt-1">監視システムからのアラートを確認・対応します</p>
          </div>
          <div className="flex items-center gap-4">
            {criticalCount > 0 && (
              <Badge className="bg-blue-600 text-white animate-pulse">緊急アラート: {criticalCount}件</Badge>
            )}
            <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
              <Settings className="w-4 h-4 mr-2" />
              通知設定
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">未対応アラート</p>
                  <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">対応中</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {alerts.filter((a) => a.status === "acknowledged").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">解決済み</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {alerts.filter((a) => a.status === "resolved").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">メール送信済</p>
                  <p className="text-3xl font-bold text-blue-600">{alerts.filter((a) => a.emailSent).length}</p>
                </div>
                <MailCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="受講生名、コース名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全ステータス</SelectItem>
                    <SelectItem value="pending">未対応</SelectItem>
                    <SelectItem value="acknowledged">対応中</SelectItem>
                    <SelectItem value="resolved">解決済み</SelectItem>
                    <SelectItem value="dismissed">却下</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="重要度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全重要度</SelectItem>
                    <SelectItem value="critical">緊急</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={loadAlerts}>
                <RefreshCw className="w-4 h-4 mr-2" />
                更新
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`border-l-4 ${
                alert.status === "pending"
                  ? alert.severity === "critical"
                    ? "border-l-blue-600 bg-blue-50"
                    : "border-l-orange-500"
                  : alert.status === "acknowledged"
                    ? "border-l-blue-500"
                    : alert.status === "resolved"
                      ? "border-l-blue-500"
                      : "border-l-gray-300"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        alert.severity === "critical"
                          ? "bg-blue-100 text-blue-600"
                          : alert.severity === "high"
                            ? "bg-orange-100 text-orange-600"
                            : alert.severity === "medium"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {getTypeIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{alert.studentName}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>{getSeverityLabel(alert.severity)}</Badge>
                        <Badge variant="outline" className={getStatusColor(alert.status)}>
                          {getStatusLabel(alert.status)}
                        </Badge>
                        {alert.emailSent && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Mail className="w-3 h-3 mr-1" />
                            通知済
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{alert.courseName}</p>
                      <p className="text-sm text-gray-800">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.timestamp).toLocaleString("ja-JP")}
                        </span>
                        <span className="flex items-center gap-1">
                          {getTypeIcon(alert.type)}
                          {getTypeLabel(alert.type)}
                        </span>
                        {alert.acknowledgedBy && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            対応者: {alert.acknowledgedBy}
                          </span>
                        )}
                      </div>
                      {alert.notes && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
                          <strong>対応メモ:</strong> {alert.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="bg-transparent"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          対応開始
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDismiss(alert.id)}
                          className="bg-transparent"
                        >
                          <X className="w-4 h-4 mr-1" />
                          却下
                        </Button>
                      </>
                    )}
                    {alert.status === "acknowledged" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedAlert(alert)
                          setShowAlertDialog(true)
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        解決
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedAlert(alert)
                        setShowAlertDialog(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(alert.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">アラートがありません</h3>
                <p className="text-gray-600">現在、表示条件に一致するアラートはありません。</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Alert Detail Dialog */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && getTypeIcon(selectedAlert.type)}
              アラート詳細
            </DialogTitle>
            <DialogDescription>アラートの詳細情報と対応履歴</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">受講生</Label>
                  <p className="font-medium">{selectedAlert.studentName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">コース</Label>
                  <p className="font-medium">{selectedAlert.courseName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">種類</Label>
                  <p className="font-medium">{getTypeLabel(selectedAlert.type)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">重要度</Label>
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {getSeverityLabel(selectedAlert.severity)}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-500">説明</Label>
                  <p className="font-medium">{selectedAlert.description}</p>
                </div>
                <div>
                  <Label className="text-gray-500">発生日時</Label>
                  <p className="font-medium">{new Date(selectedAlert.timestamp).toLocaleString("ja-JP")}</p>
                </div>
                <div>
                  <Label className="text-gray-500">ステータス</Label>
                  <Badge variant="outline" className={getStatusColor(selectedAlert.status)}>
                    {getStatusLabel(selectedAlert.status)}
                  </Badge>
                </div>
                {selectedAlert.violationCount !== undefined && (
                  <div>
                    <Label className="text-gray-500">違反回数</Label>
                    <p className="font-medium">{selectedAlert.violationCount}</p>
                  </div>
                )}
              </div>

              {selectedAlert.status === "acknowledged" && (
                <div className="space-y-2">
                  <Label htmlFor="notes">対応メモ</Label>
                  <Textarea
                    id="notes"
                    placeholder="対応内容を記入してください..."
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAlertDialog(false)}>
              閉じる
            </Button>
            {selectedAlert?.status === "acknowledged" && (
              <Button
                onClick={() => handleResolve(selectedAlert.id, responseNotes)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                解決済みにする
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              通知設定
            </DialogTitle>
            <DialogDescription>アラート通知の設定を管理します</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="email" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">メール通知</TabsTrigger>
              <TabsTrigger value="alerts">アラート種類</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>メール通知</Label>
                  <p className="text-sm text-gray-500">アラート発生時にメールで通知</p>
                </div>
                <Switch
                  checked={notificationSettings.emailEnabled}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailEnabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>通知先メールアドレス</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                  />
                  <Button onClick={addEmailRecipient}>追加</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {notificationSettings.emailRecipients.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      {email}
                      <button onClick={() => removeEmailRecipient(email)} className="ml-1 hover:text-blue-600">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>即時通知</Label>
                  <p className="text-sm text-gray-500">アラート発生時に即座に通知</p>
                </div>
                <Switch
                  checked={notificationSettings.instantNotification}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, instantNotification: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>ダイジェスト通知</Label>
                  <p className="text-sm text-gray-500">まとめて定期的に通知</p>
                </div>
                <Switch
                  checked={notificationSettings.digestEnabled}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, digestEnabled: checked })
                  }
                />
              </div>

              {notificationSettings.digestEnabled && (
                <div className="space-y-2">
                  <Label>ダイジェスト頻度</Label>
                  <Select
                    value={notificationSettings.digestFrequency}
                    onValueChange={(value: "hourly" | "daily" | "weekly") =>
                      setNotificationSettings({ ...notificationSettings, digestFrequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">1時間ごと</SelectItem>
                      <SelectItem value="daily">1日ごと</SelectItem>
                      <SelectItem value="weekly">1週間ごと</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>通知する重要度の閾値</Label>
                <Select
                  value={notificationSettings.severityThreshold}
                  onValueChange={(value: "low" | "medium" | "high" | "critical") =>
                    setNotificationSettings({ ...notificationSettings, severityThreshold: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低以上</SelectItem>
                    <SelectItem value="medium">中以上</SelectItem>
                    <SelectItem value="high">高以上</SelectItem>
                    <SelectItem value="critical">緊急のみ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>通知するアラート種類</Label>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>顔未検出</span>
                  </div>
                  <Switch
                    checked={notificationSettings.alertTypes.face_not_detected}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        alertTypes: { ...notificationSettings.alertTypes, face_not_detected: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span>タブ切り替え</span>
                  </div>
                  <Switch
                    checked={notificationSettings.alertTypes.tab_switch}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        alertTypes: { ...notificationSettings.alertTypes, tab_switch: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-gray-500" />
                    <span>カメラオフ</span>
                  </div>
                  <Switch
                    checked={notificationSettings.alertTypes.camera_off}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        alertTypes: { ...notificationSettings.alertTypes, camera_off: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>セッションタイムアウト</span>
                  </div>
                  <Switch
                    checked={notificationSettings.alertTypes.session_timeout}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        alertTypes: { ...notificationSettings.alertTypes, session_timeout: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                    <span>不審な活動</span>
                  </div>
                  <Switch
                    checked={notificationSettings.alertTypes.suspicious_activity}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        alertTypes: { ...notificationSettings.alertTypes, suspicious_activity: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                    <span>別人検出</span>
                  </div>
                  <Switch
                    checked={notificationSettings.alertTypes.different_person}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        alertTypes: { ...notificationSettings.alertTypes, different_person: checked },
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={saveNotificationSettings}>設定を保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
