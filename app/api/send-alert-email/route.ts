import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alert, recipients, action } = body

    // In production, integrate with an email service like SendGrid, AWS SES, etc.
    // For now, we'll simulate the email sending

    console.log("[v0] Sending alert email notification:")
    console.log("Recipients:", recipients)
    console.log("Alert:", alert)
    console.log("Action:", action)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Email template
    const emailContent = {
      subject: getEmailSubject(alert, action),
      body: getEmailBody(alert, action),
      recipients,
      timestamp: new Date().toISOString(),
    }

    // Store email log
    const emailLogs = JSON.parse((typeof window !== "undefined" ? localStorage.getItem("emailLogs") : null) || "[]")
    emailLogs.push({
      id: `email_${Date.now()}`,
      ...emailContent,
      status: "sent",
    })

    console.log("[v0] Email sent successfully:", emailContent.subject)

    return NextResponse.json({
      success: true,
      message: "Email notification sent successfully",
      emailId: `email_${Date.now()}`,
    })
  } catch (error) {
    console.error("[v0] Email sending error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email notification" }, { status: 500 })
  }
}

function getEmailSubject(alert: any, action: string): string {
  const severityLabels: Record<string, string> = {
    critical: "【緊急】",
    high: "【重要】",
    medium: "【注意】",
    low: "",
  }

  const actionLabels: Record<string, string> = {
    new: "新しいアラート",
    acknowledged: "アラート対応開始",
    resolved: "アラート解決",
  }

  return `${severityLabels[alert.severity] || ""}派遣元責任者講習 監視システム - ${actionLabels[action] || action}: ${alert.studentName}`
}

function getEmailBody(alert: any, action: string): string {
  const typeLabels: Record<string, string> = {
    face_not_detected: "顔未検出",
    tab_switch: "タブ切り替え",
    camera_off: "カメラオフ",
    session_timeout: "セッションタイムアウト",
    suspicious_activity: "不審な活動",
  }

  const severityLabels: Record<string, string> = {
    critical: "緊急",
    high: "高",
    medium: "中",
    low: "低",
  }

  return `
派遣元責任者講習 監視システムからの通知

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【アラート情報】
受講生名: ${alert.studentName}
コース名: ${alert.courseName}
アラート種類: ${typeLabels[alert.type] || alert.type}
重要度: ${severityLabels[alert.severity] || alert.severity}
発生日時: ${new Date(alert.timestamp).toLocaleString("ja-JP")}

【詳細】
${alert.description}

${
  action === "acknowledged"
    ? `
【対応情報】
対応者: ${alert.acknowledgedBy || "未設定"}
対応開始日時: ${alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString("ja-JP") : "未設定"}
`
    : ""
}

${
  action === "resolved"
    ? `
【解決情報】
対応者: ${alert.acknowledgedBy || "未設定"}
解決日時: ${alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleString("ja-JP") : "未設定"}
対応メモ: ${alert.notes || "なし"}
`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

管理画面でアラートの詳細を確認してください。
このメールは自動送信されています。

© GLX 派遣元責任者講習システム
`.trim()
}
