"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Bell, X, Check, Eye, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AlertNotification {
  id: string
  type: string
  studentName: string
  courseName: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  violationCount?: number // 違反回数を追加
}

export default function AlertNotificationToast() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<AlertNotification[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check for new alerts periodically
    const checkNewAlerts = () => {
      const alerts = JSON.parse(localStorage.getItem("monitoringAlerts") || "[]")
      const pendingAlerts = alerts.filter((a: any) => a.status === "pending" && !a.notified)

      if (pendingAlerts.length > 0) {
        // Get the most recent pending alert
        const latestAlert = pendingAlerts[pendingAlerts.length - 1]

        // Check if this alert was already shown
        const shownAlerts = JSON.parse(localStorage.getItem("shownAlertIds") || "[]")
        if (!shownAlerts.includes(latestAlert.id)) {
          setNotifications((prev) => [...prev, latestAlert])
          setIsVisible(true)

          // Mark as shown
          shownAlerts.push(latestAlert.id)
          localStorage.setItem("shownAlertIds", JSON.stringify(shownAlerts))

          // Play notification sound (optional)
          try {
            const audio = new Audio("/notification.mp3")
            audio.volume = 0.5
            audio.play().catch(() => {})
          } catch (e) {
            // Ignore audio errors
          }
        }
      }

      const urgentAlert = localStorage.getItem("urgentAlert")
      if (urgentAlert) {
        try {
          const urgent = JSON.parse(urgentAlert)
          const shownAlerts = JSON.parse(localStorage.getItem("shownAlertIds") || "[]")
          if (!shownAlerts.includes(`urgent_${urgent.alertId}`)) {
            // 緊急アラートを通知リストに追加
            setNotifications((prev) => [
              {
                id: `urgent_${urgent.alertId}`,
                type: "different_person",
                studentName: urgent.studentName || "受講者",
                courseName: urgent.courseName || "不明",
                description: `別人検出（違反${urgent.violationCount}回）- 即時対応が必要です`,
                severity: "critical",
                timestamp: urgent.timestamp,
                violationCount: urgent.violationCount,
              },
              ...prev,
            ])
            setIsVisible(true)

            shownAlerts.push(`urgent_${urgent.alertId}`)
            localStorage.setItem("shownAlertIds", JSON.stringify(shownAlerts))
          }
        } catch (e) {
          console.error("[v0] 緊急アラートの解析エラー:", e)
        }
      }
    }

    // 初回チェック
    checkNewAlerts()

    const interval = setInterval(checkNewAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (notifications.length <= 1) {
      setIsVisible(false)
    }
  }

  const acknowledgeAlert = (id: string) => {
    // Update alert status in localStorage
    const alerts = JSON.parse(localStorage.getItem("monitoringAlerts") || "[]")
    // 緊急アラートのIDからオリジナルのIDを取得
    const originalId = id.startsWith("urgent_") ? id.replace("urgent_", "") : id
    const updatedAlerts = alerts.map((a: any) =>
      a.id === originalId || a.id === id
        ? { ...a, status: "acknowledged", acknowledgedBy: "管理者", acknowledgedAt: new Date().toISOString() }
        : a,
    )
    localStorage.setItem("monitoringAlerts", JSON.stringify(updatedAlerts))

    // 緊急アラートをクリア
    localStorage.removeItem("urgentAlert")

    dismissNotification(id)
  }

  const viewAlertDetails = (id: string) => {
    router.push("/admin/alerts")
    dismissNotification(id)
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-blue-600 border-blue-700"
      case "high":
        return "bg-orange-500 border-orange-600"
      case "medium":
        return "bg-blue-500 border-blue-600"
      default:
        return "bg-blue-500 border-blue-600"
    }
  }

  const getTypeIcon = (type: string, severity: string) => {
    if (type === "different_person") {
      return <UserX className="w-6 h-6 animate-pulse" />
    }
    if (severity === "critical") {
      return <AlertTriangle className="w-6 h-6 animate-pulse" />
    }
    return <Bell className="w-6 h-6" />
  }

  const getAlertTitle = (type: string, severity: string) => {
    if (type === "different_person") {
      return "別人検出アラート"
    }
    if (severity === "critical") {
      return "緊急アラート"
    }
    return "新しいアラート"
  }

  if (!isVisible || notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
      {notifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className={`${getSeverityStyles(notification.severity)} text-white rounded-lg shadow-2xl border-2 animate-in slide-in-from-right duration-300`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getTypeIcon(notification.type, notification.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{getAlertTitle(notification.type, notification.severity)}</p>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-medium mt-1">{notification.studentName}</p>
                <p className="text-xs text-white/90 mt-0.5">{notification.courseName}</p>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">{notification.description}</p>
                {notification.violationCount && notification.violationCount >= 3 && (
                  <p className="text-xs font-bold mt-1 bg-white/20 px-2 py-1 rounded">
                    ⚠️ 違反回数: {notification.violationCount}回 - 即時対応必要
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => acknowledgeAlert(notification.id)}
                    className="h-7 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    対応開始
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => viewAlertDetails(notification.id)}
                    className="h-7 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    詳細
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {notifications.length > 3 && (
        <div className="text-center text-sm text-gray-600 bg-white rounded-lg p-2 shadow">
          他 {notifications.length - 3} 件のアラート
        </div>
      )}
    </div>
  )
}
