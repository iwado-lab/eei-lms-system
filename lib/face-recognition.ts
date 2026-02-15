// 顔認証関連のユーティリティと型定義

export interface FaceDescriptor {
  userId: string
  userName: string
  descriptor: number[]
  registeredAt: string
  imageUrl: string
}

export interface FaceMatchResult {
  isMatch: boolean
  confidence: number
  matchedUser?: FaceDescriptor
}

export interface AlertData {
  id: string
  type: "absence" | "different_person" | "camera_off" | "tab_switch"
  userId: string
  userName: string
  courseId: string
  courseName: string
  timestamp: string
  screenshot?: string
  status: "pending" | "acknowledged" | "resolved"
  details: string
  adminMessage?: string
  adminMessageSentAt?: string
}

export interface AdminMessage {
  id: string
  alertId: string
  userId: string
  message: string
  sentAt: string
  read: boolean
}

const STORAGE_KEY = "faceDescriptors"
const ALERTS_KEY = "monitoringAlerts"
const ADMIN_MESSAGES_KEY = "adminMessages"

// 顔データの保存
export function saveFaceDescriptor(descriptor: FaceDescriptor): void {
  if (typeof window === "undefined") return
  const existing = getFaceDescriptors()
  const updated = existing.filter((d) => d.userId !== descriptor.userId)
  updated.push(descriptor)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// 顔データの取得
export function getFaceDescriptors(): FaceDescriptor[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

// 特定ユーザーの顔データを取得
export function getFaceDescriptor(userId: string): FaceDescriptor | undefined {
  const descriptors = getFaceDescriptors()
  return descriptors.find((d) => d.userId === userId)
}

// 顔データの削除
export function deleteFaceDescriptor(userId: string): void {
  if (typeof window === "undefined") return
  const existing = getFaceDescriptors()
  const filtered = existing.filter((d) => d.userId !== userId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

// アラートの保存
export function saveAlert(alert: AlertData): void {
  if (typeof window === "undefined") return
  const existing = getAlerts()
  existing.unshift(alert)
  // 最新100件のみ保持
  const trimmed = existing.slice(0, 100)
  localStorage.setItem(ALERTS_KEY, JSON.stringify(trimmed))
}

// アラートの取得
export function getAlerts(): AlertData[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ALERTS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

// アラートのステータス更新
export function updateAlertStatus(alertId: string, status: AlertData["status"]): void {
  if (typeof window === "undefined") return
  const alerts = getAlerts()
  const updated = alerts.map((a) => (a.id === alertId ? { ...a, status } : a))
  localStorage.setItem(ALERTS_KEY, JSON.stringify(updated))
}

// 管理者メッセージの送信
export function sendAdminMessage(alertId: string, userId: string, message: string): void {
  if (typeof window === "undefined") return
  
  const newMessage: AdminMessage = {
    id: `msg_${Date.now()}`,
    alertId,
    userId,
    message,
    sentAt: new Date().toISOString(),
    read: false,
  }
  
  // メッセージを保存
  const existing = getAdminMessages()
  existing.unshift(newMessage)
  localStorage.setItem(ADMIN_MESSAGES_KEY, JSON.stringify(existing))
  
  // アラートにもメッセージを紐付け
  const alerts = getAlerts()
  const updated = alerts.map((a) => 
    a.id === alertId 
      ? { ...a, adminMessage: message, adminMessageSentAt: newMessage.sentAt } 
      : a
  )
  localStorage.setItem(ALERTS_KEY, JSON.stringify(updated))
}

// 管理者メッセージの取得（全件）
export function getAdminMessages(): AdminMessage[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ADMIN_MESSAGES_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

// 特定ユーザー向けの未読メッセージを取得
export function getUnreadMessagesForUser(userId: string): AdminMessage[] {
  const messages = getAdminMessages()
  return messages.filter((m) => m.userId === userId && !m.read)
}

// メッセージを既読にする
export function markMessageAsRead(messageId: string): void {
  if (typeof window === "undefined") return
  const messages = getAdminMessages()
  const updated = messages.map((m) => (m.id === messageId ? { ...m, read: true } : m))
  localStorage.setItem(ADMIN_MESSAGES_KEY, JSON.stringify(updated))
}

// ユークリッド距離の計算（顔の類似度判定用）
export function euclideanDistance(arr1: number[], arr2: number[]): number {
  if (arr1.length !== arr2.length) return Number.POSITIVE_INFINITY
  let sum = 0
  for (let i = 0; i < arr1.length; i++) {
    sum += Math.pow(arr1[i] - arr2[i], 2)
  }
  return Math.sqrt(sum)
}

// 顔の照合（シンプルな実装）
export function matchFace(descriptor: number[], threshold = 0.6): FaceMatchResult {
  const registeredFaces = getFaceDescriptors()

  if (registeredFaces.length === 0) {
    return { isMatch: false, confidence: 0 }
  }

  let bestMatch: FaceDescriptor | undefined
  let bestDistance = Number.POSITIVE_INFINITY

  for (const face of registeredFaces) {
    const distance = euclideanDistance(descriptor, face.descriptor)
    if (distance < bestDistance) {
      bestDistance = distance
      bestMatch = face
    }
  }

  // 距離が閾値以下なら一致とみなす
  const isMatch = bestDistance <= threshold
  // 信頼度は距離の逆数（0-1にスケール）
  const confidence = Math.max(0, Math.min(1, 1 - bestDistance))

  return {
    isMatch,
    confidence,
    matchedUser: isMatch ? bestMatch : undefined,
  }
}

// メール通知用のキュー
export function queueEmailNotification(alert: AlertData): void {
  if (typeof window === "undefined") return
  const queueKey = "emailNotificationQueue"
  const existing = JSON.parse(localStorage.getItem(queueKey) || "[]")
  existing.push({
    alertId: alert.id,
    type: alert.type,
    userName: alert.userName,
    courseName: alert.courseName,
    timestamp: alert.timestamp,
    details: alert.details,
    sentAt: null,
  })
  localStorage.setItem(queueKey, JSON.stringify(existing))
}
