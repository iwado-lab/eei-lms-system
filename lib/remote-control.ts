// リモート制御用のユーティリティ

export interface RemoteCommand {
  id: string
  userId: string
  type: "stop_video" | "block_certificate" | "reset_progress" | "send_warning"
  courseId?: string
  timestamp: string
  executed: boolean
}

export interface AutoProcessingSettings {
  enabled: boolean
  violationThreshold: number // この回数以上で自動処理
  autoStopVideo: boolean
  autoBlockCertificate: boolean
  autoSendWarning: boolean
  autoExcludeFromReport: boolean
}

// デフォルト設定
const DEFAULT_SETTINGS: AutoProcessingSettings = {
  enabled: false,
  violationThreshold: 3,
  autoStopVideo: true,
  autoBlockCertificate: false,
  autoSendWarning: true,
  autoExcludeFromReport: false,
}

// コマンドを発行
export function issueRemoteCommand(command: Omit<RemoteCommand, "id" | "timestamp" | "executed">) {
  const fullCommand: RemoteCommand = {
    ...command,
    id: `cmd_${Date.now()}`,
    timestamp: new Date().toISOString(),
    executed: false,
  }

  const commands = getRemoteCommands()
  commands.push(fullCommand)
  localStorage.setItem("remoteCommands", JSON.stringify(commands))

  // イベントをディスパッチして受講者側に通知
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("remoteCommand", { detail: fullCommand }))
  }

  return fullCommand
}

// コマンドを取得
export function getRemoteCommands(userId?: string): RemoteCommand[] {
  if (typeof window === "undefined") return []
  const commands: RemoteCommand[] = JSON.parse(localStorage.getItem("remoteCommands") || "[]")
  if (userId) {
    return commands.filter((cmd) => cmd.userId === userId && !cmd.executed)
  }
  return commands
}

// コマンドを実行済みにする
export function markCommandExecuted(commandId: string) {
  const commands = getRemoteCommands()
  const index = commands.findIndex((cmd) => cmd.id === commandId)
  if (index >= 0) {
    commands[index].executed = true
    localStorage.setItem("remoteCommands", JSON.stringify(commands))
  }
}

// 自動処理設定を取得
export function getAutoProcessingSettings(): AutoProcessingSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  const stored = localStorage.getItem("autoProcessingSettings")
  if (stored) {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  }
  return DEFAULT_SETTINGS
}

// 自動処理設定を保存
export function saveAutoProcessingSettings(settings: AutoProcessingSettings) {
  localStorage.setItem("autoProcessingSettings", JSON.stringify(settings))
}

// 違反に対して自動処理を実行
export async function executeAutoProcessing(
  userId: string,
  userName: string,
  email: string,
  violationCount: number,
  courseId: string,
  courseName: string
) {
  const settings = getAutoProcessingSettings()

  if (!settings.enabled || violationCount < settings.violationThreshold) {
    return
  }

  // 動画停止コマンド
  if (settings.autoStopVideo) {
    issueRemoteCommand({
      userId,
      type: "stop_video",
      courseId,
    })
  }

  // 証明書発行停止
  if (settings.autoBlockCertificate) {
    const users = JSON.parse(localStorage.getItem("adminUsers") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === userId)
    if (userIndex >= 0) {
      users[userIndex].certificateBlocked = true
      localStorage.setItem("adminUsers", JSON.stringify(users))
    }
  }

  // 警告メール送信
  if (settings.autoSendWarning) {
    try {
      await fetch("/api/send-alert-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alert: {
            studentName: userName,
            courseName,
            type: "auto_warning",
            severity: "critical",
            description: `自動処理: 不正検知回数が${violationCount}回に達しました。`,
            timestamp: new Date().toISOString(),
          },
          recipients: [email],
          action: "warning",
        }),
      })
    } catch (error) {
      console.error("自動メール送信エラー:", error)
    }
  }

  // 報告対象から除外
  if (settings.autoExcludeFromReport) {
    const users = JSON.parse(localStorage.getItem("adminUsers") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === userId)
    if (userIndex >= 0) {
      users[userIndex].excludeFromReport = true
      localStorage.setItem("adminUsers", JSON.stringify(users))
    }
  }
}

// 受講中ログ（スクリーンショット）を保存
export interface StudyLog {
  id: string
  userId: string
  courseId: string
  timestamp: string
  screenshot: string
  faceDetected: boolean
  confidence: number
}

export function saveStudyLog(log: Omit<StudyLog, "id">) {
  const logs = getStudyLogs(log.userId)
  const fullLog: StudyLog = {
    ...log,
    id: `log_${Date.now()}`,
  }
  logs.push(fullLog)
  // 最新100件のみ保持
  const recentLogs = logs.slice(-100)
  localStorage.setItem(`studyLogs_${log.userId}`, JSON.stringify(recentLogs))
}

export function getStudyLogs(userId: string): StudyLog[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(`studyLogs_${userId}`) || "[]")
}
