"use client"

// Storage keys
const STORAGE_KEYS = {
  STUDENTS: "glx_students",
  CURRENT_USER: "glx_current_user",
  MONITORING_SESSIONS: "glx_monitoring_sessions",
  ALERTS: "glx_alerts",
  STUDY_PROGRESS: "glx_study_progress",
}

// Types
export interface RegisteredStudent {
  id: string
  name: string
  furigana: string
  email: string
  company: string
  loginId: string
  password: string
  courseType: "online" | "venue"
  courseName: string
  registeredAt: string
  isOnline: boolean
  lastLoginAt: string | null
  studyTimeMinutes: number
  progress: number
  certificateIssued: boolean
  certificateBlocked: boolean
  // デバイス情報（ログイン時に自動保存）
  deviceInfo?: {
    os: string
    browser: string
    userAgent: string
    screenWidth: number
    screenHeight: number
    lastUpdated: string
  }
  // コース切替用
  activeCourseId?: string
  courseProgress?: Record<string, { progress: number; lastPosition: number; locked: boolean }>
  // 会員区分
  memberType?: "member" | "non_member"
}

export interface MonitoringSession {
  id: string
  studentId: string
  studentName: string
  courseName: string
  startedAt: string
  cameraStatus: "on" | "off"
  screenStatus: "active" | "inactive" | "tab_switch"
  status: "normal" | "warning" | "alert"
  studyTimeMinutes: number
}

export interface AlertRecord {
  id: string
  studentId: string
  studentName: string
  type: "camera_off" | "tab_switch" | "away" | "abnormal_behavior"
  message: string
  timestamp: string
  status: "pending" | "handled" | "ignored"
  handledBy: string | null
  handledAt: string | null
  handledAction: string | null
}

// Helper functions for localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error("Failed to save to localStorage")
  }
}

// Initialize demo data
export function initializeDemoData(): void {
  const existingStudents = getFromStorage<RegisteredStudent[]>(STORAGE_KEYS.STUDENTS, [])
  if (existingStudents.length === 0) {
    const demoStudents: RegisteredStudent[] = [
      {
        id: "demo-001",
        name: "山田太郎",
        furigana: "ヤマダタロウ",
        email: "yamada@example.com",
        company: "株式会社サンプル",
        loginId: "demo001",
        password: "demo001",
        courseType: "online",
        courseName: "派遣元責任者講習 基礎編",
        registeredAt: new Date().toISOString(),
        isOnline: false,
        lastLoginAt: null,
        studyTimeMinutes: 0,
        progress: 0,
        certificateIssued: false,
        certificateBlocked: false,
      },
    ]
    setToStorage(STORAGE_KEYS.STUDENTS, demoStudents)
  }
}

// Student management
export function getRegisteredStudents(): RegisteredStudent[] {
  return getFromStorage<RegisteredStudent[]>(STORAGE_KEYS.STUDENTS, [])
}

export function addRegisteredStudent(student: RegisteredStudent): void {
  const students = getRegisteredStudents()
  students.push(student)
  setToStorage(STORAGE_KEYS.STUDENTS, students)
}

export function updateStudent(studentId: string, updates: Partial<RegisteredStudent>): void {
  const students = getRegisteredStudents()
  const index = students.findIndex((s) => s.id === studentId)
  if (index >= 0) {
    students[index] = { ...students[index], ...updates }
    setToStorage(STORAGE_KEYS.STUDENTS, students)
  }
}

// デバイス情報を取得
function getDeviceInfo(): RegisteredStudent["deviceInfo"] {
  if (typeof window === "undefined") return undefined
  const ua = navigator.userAgent
  let os = "Unknown"
  if (ua.includes("Windows")) os = "Windows"
  else if (ua.includes("Mac OS")) os = "macOS"
  else if (ua.includes("Linux")) os = "Linux"
  else if (ua.includes("Android")) os = "Android"
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS"

  let browser = "Unknown"
  if (ua.includes("Edg/")) browser = "Edge"
  else if (ua.includes("Chrome/")) browser = "Chrome"
  else if (ua.includes("Firefox/")) browser = "Firefox"
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari"

  return {
    os,
    browser,
    userAgent: ua,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    lastUpdated: new Date().toISOString(),
  }
}

// Authentication
export function authenticateStudent(loginId: string, password: string): RegisteredStudent | null {
  const students = getRegisteredStudents()
  const student = students.find((s) => s.loginId === loginId && s.password === password)
  if (student) {
    const deviceInfo = getDeviceInfo()
    updateStudent(student.id, {
      isOnline: true,
      lastLoginAt: new Date().toISOString(),
      deviceInfo,
    })
    const updatedStudent = { ...student, isOnline: true, lastLoginAt: new Date().toISOString(), deviceInfo }
    setToStorage(STORAGE_KEYS.CURRENT_USER, updatedStudent)
    return updatedStudent
  }
  return null
}

export function getCurrentUser(): RegisteredStudent | null {
  return getFromStorage<RegisteredStudent | null>(STORAGE_KEYS.CURRENT_USER, null)
}

export function logoutStudent(studentId: string): void {
  updateStudent(studentId, { isOnline: false })
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
  endMonitoringSession(studentId)
}

// Monitoring sessions
export function startMonitoringSession(student: RegisteredStudent): MonitoringSession {
  const sessions = getFromStorage<MonitoringSession[]>(STORAGE_KEYS.MONITORING_SESSIONS, [])
  
  // Remove existing session for this student
  const filteredSessions = sessions.filter((s) => s.studentId !== student.id)
  
  const newSession: MonitoringSession = {
    id: "session-" + Date.now(),
    studentId: student.id,
    studentName: student.name,
    courseName: student.courseName,
    startedAt: new Date().toISOString(),
    cameraStatus: "off",
    screenStatus: "active",
    status: "normal",
    studyTimeMinutes: 0,
  }
  
  filteredSessions.push(newSession)
  setToStorage(STORAGE_KEYS.MONITORING_SESSIONS, filteredSessions)
  return newSession
}

export function updateMonitoringSession(studentId: string, updates: Partial<MonitoringSession>): void {
  const sessions = getFromStorage<MonitoringSession[]>(STORAGE_KEYS.MONITORING_SESSIONS, [])
  const index = sessions.findIndex((s) => s.studentId === studentId)
  if (index >= 0) {
    sessions[index] = { ...sessions[index], ...updates }
    setToStorage(STORAGE_KEYS.MONITORING_SESSIONS, sessions)
  }
}

export function endMonitoringSession(studentId: string): void {
  const sessions = getFromStorage<MonitoringSession[]>(STORAGE_KEYS.MONITORING_SESSIONS, [])
  const filteredSessions = sessions.filter((s) => s.studentId !== studentId)
  setToStorage(STORAGE_KEYS.MONITORING_SESSIONS, filteredSessions)
}

export function getActiveMonitoringSessions(): MonitoringSession[] {
  return getFromStorage<MonitoringSession[]>(STORAGE_KEYS.MONITORING_SESSIONS, [])
}

// Alerts
export function addAlert(alert: Omit<AlertRecord, "id" | "status" | "handledBy" | "handledAt" | "handledAction">): void {
  const alertId = "alert-" + Date.now()
  const newAlert: AlertRecord = {
    ...alert,
    id: alertId,
    status: "pending",
    handledBy: null,
    handledAt: null,
    handledAction: null,
  }
  
  // glx_alerts に保存
  const alerts = getFromStorage<AlertRecord[]>(STORAGE_KEYS.ALERTS, [])
  alerts.unshift(newAlert)
  setToStorage(STORAGE_KEYS.ALERTS, alerts)
  
  // monitoringAlerts にも同時保存（管理者のアラート管理画面が参照するストア）
  if (typeof window !== "undefined") {
    const typeMap: Record<string, string> = {
      camera_off: "camera_off",
      tab_switch: "tab_switch",
      away: "absence",
      mismatch: "different_person",
    }
    const monitoringAlert = {
      id: alertId,
      type: typeMap[alert.type] || alert.type,
      userId: alert.studentId,
      userName: alert.studentName,
      courseId: "",
      courseName: alert.type === "tab_switch" ? "別タブ検知" : alert.type === "away" ? "離席検知" : alert.type === "camera_off" ? "カメラOFF" : "",
      timestamp: alert.timestamp,
      status: "pending",
      details: alert.message,
    }
    const existing = JSON.parse(localStorage.getItem("monitoringAlerts") || "[]")
    existing.unshift(monitoringAlert)
    localStorage.setItem("monitoringAlerts", JSON.stringify(existing))
  }
}

export function getAlerts(): AlertRecord[] {
  return getFromStorage<AlertRecord[]>(STORAGE_KEYS.ALERTS, [])
}

export function getPendingAlerts(): AlertRecord[] {
  const alerts = getAlerts()
  return alerts.filter((a) => a.status === "pending")
}

export function handleAlert(alertId: string, action: "email" | "message" | "warning" | "ignore", handledBy: string, content?: string): void {
  const alerts = getAlerts()
  const index = alerts.findIndex((a) => a.id === alertId)
  if (index >= 0) {
    alerts[index] = {
      ...alerts[index],
      status: action === "ignore" ? "ignored" : "handled",
      handledBy,
      handledAt: new Date().toISOString(),
      handledAction: action,
    }
    setToStorage(STORAGE_KEYS.ALERTS, alerts)
  }
}

// Study progress
export function updateStudyProgress(studentId: string, progress: number, studyTimeMinutes: number): void {
  updateStudent(studentId, { progress, studyTimeMinutes })
  
  // Also update monitoring session
  updateMonitoringSession(studentId, { studyTimeMinutes })
}

export function issueCertificate(studentId: string): void {
  updateStudent(studentId, { certificateIssued: true })
}

export function blockCertificate(studentId: string): void {
  updateStudent(studentId, { certificateBlocked: true })
}

// Individual authentication threshold settings
const STORAGE_KEY_AUTH_THRESHOLDS = "glx_auth_thresholds"

export interface AuthThreshold {
  studentId: string
  threshold: number // 0-100, default is 70
  reason: string
  updatedAt: string
  updatedBy: string
}

export function getAuthThresholds(): Record<string, AuthThreshold> {
  return getFromStorage<Record<string, AuthThreshold>>(STORAGE_KEY_AUTH_THRESHOLDS, {})
}

export function setAuthThreshold(studentId: string, threshold: number, reason: string, updatedBy: string): void {
  const thresholds = getAuthThresholds()
  thresholds[studentId] = {
    studentId,
    threshold,
    reason,
    updatedAt: new Date().toISOString(),
    updatedBy,
  }
  setToStorage(STORAGE_KEY_AUTH_THRESHOLDS, thresholds)
}

export function getStudentAuthThreshold(studentId: string): number {
  const thresholds = getAuthThresholds()
  return thresholds[studentId]?.threshold ?? 70 // Default 70%
}

// Capture logs (photos taken during study)
const STORAGE_KEY_CAPTURE_LOGS = "glx_capture_logs"

export interface CaptureLog {
  id: string
  studentId: string
  studentName: string
  timestamp: string
  imageData: string // Base64 thumbnail
  authResult: "verified" | "failed" | "pending"
  confidence: number
}

export function addCaptureLog(log: Omit<CaptureLog, "id">): void {
  const logs = getFromStorage<CaptureLog[]>(STORAGE_KEY_CAPTURE_LOGS, [])
  logs.unshift({
    ...log,
    id: "capture-" + Date.now(),
  })
  // Keep only last 500 logs
  setToStorage(STORAGE_KEY_CAPTURE_LOGS, logs.slice(0, 500))
}

export function getCaptureLogs(studentId?: string): CaptureLog[] {
  const logs = getFromStorage<CaptureLog[]>(STORAGE_KEY_CAPTURE_LOGS, [])
  if (studentId) {
    return logs.filter((l) => l.studentId === studentId)
  }
  return logs
}

// Drowsiness detection alert
export function addDrowsinessAlert(studentId: string, studentName: string, customMessage?: string): void {
  addAlert({
    studentId,
    studentName,
    type: "abnormal_behavior",
    message: customMessage || `${studentName}に居眠りの可能性が検知されました。動画を一時停止しています。`,
    timestamp: new Date().toISOString(),
  })
}

// Photo registration lock (prevent changing registered photo)
const STORAGE_KEY_PHOTO_LOCKS = "glx_photo_locks"

export function isPhotoLocked(studentId: string): boolean {
  const locks = getFromStorage<Record<string, boolean>>(STORAGE_KEY_PHOTO_LOCKS, {})
  return locks[studentId] === true
}

export function lockPhoto(studentId: string): void {
  const locks = getFromStorage<Record<string, boolean>>(STORAGE_KEY_PHOTO_LOCKS, {})
  locks[studentId] = true
  setToStorage(STORAGE_KEY_PHOTO_LOCKS, locks)
}

export function unlockPhoto(studentId: string): void {
  const locks = getFromStorage<Record<string, boolean>>(STORAGE_KEY_PHOTO_LOCKS, {})
  delete locks[studentId]
  setToStorage(STORAGE_KEY_PHOTO_LOCKS, locks)
}

// Custom alert messages (admin can set custom messages for alerts)
const STORAGE_KEY_CUSTOM_ALERTS = "glx_custom_alert_messages"

export interface CustomAlertMessage {
  id: string
  type: "drowsiness" | "camera_off" | "tab_switch" | "away" | "general"
  title: string
  message: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function getCustomAlertMessages(): CustomAlertMessage[] {
  return getFromStorage<CustomAlertMessage[]>(STORAGE_KEY_CUSTOM_ALERTS, [
    {
      id: "default-drowsiness",
      type: "drowsiness",
      title: "居眠り検知",
      message: "居眠りの可能性が検知されました。動画を一時停止しています。視聴を再開するには画面をクリックしてください。",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "default-camera-off",
      type: "camera_off",
      title: "カメラOFF検知",
      message: "カメラがOFFになっています。本人確認のためカメラをONにしてください。",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "default-tab-switch",
      type: "tab_switch",
      title: "別タブ検知",
      message: "別のタブに移動したことが検知されました。受講中は動画画面に集中してください。",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])
}

export function saveCustomAlertMessage(alertMessage: CustomAlertMessage): void {
  const messages = getCustomAlertMessages()
  const index = messages.findIndex((m) => m.id === alertMessage.id)
  if (index >= 0) {
    messages[index] = { ...alertMessage, updatedAt: new Date().toISOString() }
  } else {
    messages.push({ ...alertMessage, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }
  setToStorage(STORAGE_KEY_CUSTOM_ALERTS, messages)
}

export function getActiveAlertMessage(type: CustomAlertMessage["type"]): CustomAlertMessage | null {
  const messages = getCustomAlertMessages()
  return messages.find((m) => m.type === type && m.isActive) || null
}

// Drowsiness detection - track consecutive low-eye-activity frames
const STORAGE_KEY_DROWSINESS_STATE = "glx_drowsiness_state"

export function updateDrowsinessState(studentId: string, isEyesClosed: boolean): { shouldAlert: boolean; closedFrameCount: number } {
  const states = getFromStorage<Record<string, { closedFrameCount: number; lastUpdate: string }>>(STORAGE_KEY_DROWSINESS_STATE, {})
  
  const currentState = states[studentId] || { closedFrameCount: 0, lastUpdate: new Date().toISOString() }
  
  if (isEyesClosed) {
    currentState.closedFrameCount++
  } else {
    currentState.closedFrameCount = 0
  }
  currentState.lastUpdate = new Date().toISOString()
  
  states[studentId] = currentState
  setToStorage(STORAGE_KEY_DROWSINESS_STATE, states)
  
  // Alert if eyes closed for 2+ consecutive checks (10+ seconds with 5s intervals)
  return {
    shouldAlert: currentState.closedFrameCount >= 2,
    closedFrameCount: currentState.closedFrameCount,
  }
}

export function resetDrowsinessState(studentId: string): void {
  const states = getFromStorage<Record<string, { closedFrameCount: number; lastUpdate: string }>>(STORAGE_KEY_DROWSINESS_STATE, {})
  delete states[studentId]
  setToStorage(STORAGE_KEY_DROWSINESS_STATE, states)
}
