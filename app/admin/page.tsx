"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Users, BookOpen, AlertCircle, TrendingUp, Wand2, LogOut, Check, FileText, ImageIcon, Bell, Mail, MessageSquare, LayoutDashboard, Video, CalendarDays, Shield, Eye, BarChart3, Award, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { VideoManagement } from "@/components/admin/video-management"
import AlertNotificationToast from "@/components/alert-notification-toast"
import { AutoProcessingSettingsPanel } from "@/components/admin/auto-processing-settings"
import { issueRemoteCommand, getStudyLogs, type StudyLog } from "@/lib/remote-control"
import { StudentManagement } from "@/components/admin/student-management"
import { CertificateManagement } from "@/components/admin/certificate-management"
import { EmailManagement } from "@/components/admin/email-management"
import { AnnouncementManagement } from "@/components/admin/announcement-management"
import { LectureScheduleManagement } from "@/components/admin/lecture-schedule-management"
import {
  getActiveMonitoringSessions,
  getPendingAlerts,
  handleAlert as handleAlertAction,
  getAlerts,
  type MonitoringSession,
  type AlertRecord,
} from "@/lib/store"
import { sendAdminMessage } from "@/lib/face-recognition"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("videos")

  const [pendingAlertCount, setPendingAlertCount] = useState(0)

  // 本システムで提供するコースは2種類のみ
  const availableCourses = [
    { id: "basic", name: "派遣元責任者講習 基礎編", description: "派遣元責任者に必要な基礎知識を学習" },
    { id: "advanced", name: "派遣元責任者講習 応用編", description: "実務に即した応用知識を学習" },
  ]

  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole")
      localStorage.removeItem("authToken")
    }
    router.push("/")
  }

  const handleReportExport = () => {
    // Generate and download report based on active tab
    const reportData = {
      timestamp: new Date().toISOString(),
      tab: activeTab,
      data: activeTab === "users" ? adminUsers : dashboardStats,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `glx-report-${activeTab}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEditCourse = (courseName: string) => {
    router.push(`/admin/course-creator/edit?course=${encodeURIComponent(courseName)}`)
  }

  const handleDeleteCourse = (courseName: string) => {
    if (confirm(`「${courseName}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      // Delete course logic
      alert(`「${courseName}」を削除しました。`)
      // In real implementation, this would update the courses state
    }
  }

  const handleCreateNewCourse = () => {
    router.push("/admin/course-creator")
  }

  const handleUserDetails = (userId: number) => {
    router.push(`/admin/user-details/${userId}`)
  }

  const handleEditUser = (userId: number) => {
    router.push(`/admin/user-edit/${userId}`)
  }

  const handleUserFilter = () => {
    // Open filter modal or navigate to filter page
    alert("ユーザーフィルター機能を開きます")
  }

  const handleAssignStudentsToCourse = (courseId: string, studentIds: string[]) => {
    console.log("[v0] Assigning students to course:", { courseId, studentIds })
    // Update course assignments
    alert(`${studentIds.length}名の受講生を「${courseId}」コースに割り当てました`)
  }

  const handleBulkAssignment = () => {
    if (selectedStudents.length === 0 || selectedCourses.length === 0) {
      alert("受講生とコースを選択してください")
      return
    }

    selectedCourses.forEach((courseId) => {
      handleAssignStudentsToCourse(courseId, selectedStudents)
    })

    setSelectedStudents([])
    setSelectedCourses([])
  }

  const salesData = {
    monthly: [
      { month: "1月", amount: 85, revenue: 2100000 },
      { month: "2月", amount: 95, revenue: 2350000 },
      { month: "3月", amount: 88, revenue: 2200000 },
      { month: "4月", amount: 110, revenue: 2750000 },
      { month: "5月", amount: 125, revenue: 3125000 },
      { month: "6月", amount: 135, revenue: 3375000 },
      { month: "7月", amount: 142, revenue: 3550000 },
      { month: "8月", amount: 155, revenue: 3875000 },
    ],
    totalRevenue: "¥12,458,000",
    growth: "+8.3%",
    totalStudents: "124名",
    avgOrderValue: "¥28,500",
  }

  const progressData = {
    completion: { completed: 68, inProgress: 20, notStarted: 12 },
    examPass: 74,
    retake: 12,
    avgStudyTime: "45時間",
    certificateIssued: 156,
  }

  const dashboardStats = [
    { label: "登録ユーザー数", value: "1,458", change: "+24 (先週比)", icon: Users },
    { label: "アクティブコース", value: "32", change: "4コース準備中", icon: BookOpen },
    { label: "未対応質問", value: "17", change: "5件緊急対応", icon: AlertCircle },
    { label: "今月の収益", value: "¥1.2M", change: "目標達成率 86%", icon: TrendingUp },
  ]

  // 管理者アカウント（管理画面にログインできるユーザー）
  // ※受講生は「受講者管理」タブで管理
  const [adminUsers, setAdminUsers] = useState([
    {
      id: 1,
      name: "田中美咲",
      email: "tanaka.m@example.com",
      role: "システム管理者",
      permissions: ["all"],
      status: "アクティブ",
      avatar: "TM",
      registeredDate: "2025/03/15",
      lastLogin: "2025/08/08",
      department: "システム管理部",
    },
    {
      id: 2,
      name: "鈴木一郎",
      email: "suzuki.i@example.com",
      role: "運営スタッフ",
      permissions: ["students", "monitoring", "certificates"],
      status: "アクティブ",
      avatar: "SI",
      registeredDate: "2025/04/01",
      lastLogin: "2025/08/07",
      department: "運営部",
    },
    {
      id: 3,
      name: "高橋花子",
      email: "takahashi.h@example.com",
      role: "閲覧者",
      permissions: ["analytics", "reports"],
      status: "アクティブ",
      avatar: "TH",
      registeredDate: "2025/07/20",
      lastLogin: "2025/08/05",
      department: "経営企画部",
    },
    {
      id: 4,
      name: "佐藤次郎",
      email: "sato.j@example.com",
      role: "運営スタッフ",
      permissions: ["students", "email", "announcements"],
      status: "停止中",
      avatar: "SJ",
      registeredDate: "2025/06/15",
      lastLogin: "2025/07/01",
      department: "カスタマーサポート部",
    },
  ])

  const [realTimeMonitoringData, setRealTimeMonitoringData] = useState([])
  const [monitoringStreams, setMonitoringStreams] = useState({})

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [showCategoryEditModal, setShowCategoryEditModal] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])

  const handleNewAddition = () => {
    alert("新規追加機能を開きます")
  }

  const [topPageContents, setTopPageContents] = useState([
    {
      id: 1,
      type: "freehtml",
      title: "TOPページ",
      content: `
      <div class="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8 rounded-lg mb-6">
        <h1 class="text-3xl font-bold mb-4">派遣元責任者講習へようこそ</h1>
        <p class="text-lg">オンライン学習システムで、効率的に学習を進めましょう</p>
      </div>
    `,
      status: "published",
      accessLevel: "all",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: 2,
      type: "banner",
      title: "キャンペーンバナー",
      imageUrl: "/campaign-banner.png",
      link: "/courses",
      status: "published",
      accessLevel: "all",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: 3,
      type: "courses",
      title: "おすすめコース",
      status: "published",
      accessLevel: "all",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: 4,
      type: "news",
      title: "お知らせ",
      status: "published",
      accessLevel: "all",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
  ])

  const handleCreateTopPageContent = () => {
    const newContent = {
      id: Date.now(),
      type: "freehtml",
      title: "新しいコンテンツ",
      content: "<p>新しいコンテンツを入力してください</p>",
      status: "draft",
      accessLevel: "all",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setTopPageContents([...topPageContents, newContent])
    // Save to localStorage for persistence
    localStorage.setItem("topPageContents", JSON.stringify([...topPageContents, newContent]))
  }

  const handleEditTopPageContent = (id: number, updates: any) => {
    const updatedContents = topPageContents.map((content) =>
      content.id === id ? { ...content, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : content,
    )
    setTopPageContents(updatedContents)
    localStorage.setItem("topPageContents", JSON.stringify(updatedContents))
  }

  const handleDeleteTopPageContent = (id: number) => {
    const filteredContents = topPageContents.filter((content) => content.id !== id)
    setTopPageContents(filteredContents)
    localStorage.setItem("topPageContents", JSON.stringify(filteredContents))
  }

  const handlePublishContent = (id: number) => {
    handleEditTopPageContent(id, { status: "published" })
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContents = localStorage.getItem("topPageContents")
      if (savedContents) {
        setTopPageContents(JSON.parse(savedContents))
      }
    }
  }, [])

  useEffect(() => {
    const loadMonitoringData = () => {
      if (typeof window === "undefined") return

      const storedData = JSON.parse(localStorage.getItem("adminMonitoringData") || "[]")
      const currentStatus = JSON.parse(localStorage.getItem("currentStudentStatus") || "null")

      // Filter for recent monitoring events (last 2 hours)
      const recentEvents = storedData.filter((data) => Date.now() - new Date(data.timestamp).getTime() < 7200000)

      // Update real-time monitoring data
      setRealTimeMonitoringData(recentEvents)

      // Update monitoring streams with current student status
      if (currentStatus) {
        setMonitoringStreams((prev) => ({
          ...prev,
          [currentStatus.studentId]: currentStatus,
        }))
      }
    }

    // Load data initially and set up more frequent polling
    loadMonitoringData()
    const interval = setInterval(loadMonitoringData, 1000) // Update every 1 second for real-time feel

    return () => clearInterval(interval)
  }, [])

  // 共有データストアから監視セッションを取得
  const [monitoringSessions, setMonitoringSessions] = useState<MonitoringSession[]>([])
  const [alerts, setAlerts] = useState<AlertRecord[]>([])
  const [showAlertResponseModal, setShowAlertResponseModal] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null)
  const [alertResponseContent, setAlertResponseContent] = useState("")

  // 監視データを定期的に更新
  useEffect(() => {
    const updateMonitoringData = () => {
      const sessions = getActiveMonitoringSessions()
      const allAlerts = getAlerts()
      const pending = getPendingAlerts()
      setMonitoringSessions(sessions)
      setAlerts(allAlerts)
      setPendingAlertCount(pending.length)
    }
    
    updateMonitoringData()
    const interval = setInterval(updateMonitoringData, 3000) // 3秒ごとに更新
    
    return () => clearInterval(interval)
  }, [])

  // 監視データを整形（アラート件数に基づいて判定）
  const enhancedMonitoringData = monitoringSessions.map((session) => {
    // この受講生の未対応アラート件数を取得
    const studentAlerts = alerts.filter(
      (a) => a.studentId === session.studentId && a.status === "pending"
    )
    const hasAlert = studentAlerts.length > 0 || session.status !== "normal"
    
    // ステータス判定（カメラOFFまたは別タブで警告）
    const isWarning = session.cameraStatus === "off" || session.screenStatus !== "active" || session.status !== "normal"
    
    return {
      name: session.studentName,
      course: session.courseName,
      status: isWarning ? "警告" : "正常",
      camera: session.cameraStatus === "on" ? "ON" : "OFF",
      screen: session.screenStatus === "active" ? "アクティブ" : session.screenStatus === "tab_switch" ? "別タブ検知" : "非アクティブ",
      time: `${session.studyTimeMinutes}分`,
      alert: hasAlert,
      alertCount: studentAlerts.length,
      streamId: session.studentId,
      sessionId: session.id,
    }
  })
  
  // アラート種類別のカウント
  const alertCounts = {
    camera_off: alerts.filter((a) => a.type === "camera_off" && a.status === "pending").length,
    tab_switch: alerts.filter((a) => a.type === "tab_switch" && a.status === "pending").length,
    away: alerts.filter((a) => a.type === "away" && a.status === "pending").length,
    abnormal_behavior: alerts.filter((a) => a.type === "abnormal_behavior" && a.status === "pending").length,
  }

  // アラート対応処理
  const handleAlertResponse = useCallback((alertId: string, action: "email" | "message" | "warning" | "ignore") => {
    // メッセージ送信の場合、受講者にメッセージを届ける
    if (action === "message" && alertResponseContent.trim() && selectedAlert) {
      sendAdminMessage(alertId, selectedAlert.studentId, alertResponseContent)
    }
    
    // 警告の場合もシステムメッセージを送信
    if (action === "warning" && selectedAlert) {
      const warningMsg = alertResponseContent.trim() || "管理者から警告が発行されました。受講態度を改善してください。"
      sendAdminMessage(alertId, selectedAlert.studentId, warningMsg)
    }
    
    handleAlertAction(alertId, action, "管理者", alertResponseContent)
    setShowAlertResponseModal(false)
    setSelectedAlert(null)
    setAlertResponseContent("")
    
    // データを再取得
    const allAlerts = getAlerts()
    const pending = getPendingAlerts()
    setAlerts(allAlerts)
    setPendingAlertCount(pending.length)
  }, [alertResponseContent, selectedAlert])

  // monitoringLogs はアラートから動的に生成
  const monitoringLogs = alerts.slice(0, 5).map((a) => ({
    time: new Date(a.timestamp).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    student: a.studentName,
    course: a.type === "tab_switch" ? "別タブ検知" : a.type === "away" ? "離席検知" : a.type === "camera_off" ? "カメラOFF" : a.type,
    event: a.message,
    detail: a.message,
    status: a.status === "pending" ? "未対応" : "対応済",
  }))

  const handleEditCategory = (category: any) => {
    console.log("[v0] Editing category:", category.name)
    setEditingCategory({ ...category })
    setShowCategoryEditModal(true)
  }

  const handleSaveCategoryEdit = () => {
    if (editingCategory) {
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)))
      setShowCategoryEditModal(false)
      setEditingCategory(null)
      console.log("[v0] Saved category changes:", editingCategory.name)
    }
  }

  const [videos, setVideos] = useState([
    {
      id: "1",
      name: "プログラミング基礎_レッスン1.mp4",
      size: "245MB",
      duration: "45:30",
      uploadDate: "2025/01/15",
      status: "完了",
      url: "/placeholder-video.mp4",
    },
    {
      id: "2",
      name: "データサイエンス入門_第1章.mp4",
      size: "189MB",
      duration: "32:15",
      uploadDate: "2025/01/14",
      status: "完了",
      url: "/placeholder-video.mp4",
    },
  ])

  const [pdfs, setPdfs] = useState([
    {
      id: "1",
      name: "プログラミング基礎_テキスト.pdf",
      size: "12MB",
      pages: "156",
      uploadDate: "2025/01/15",
      status: "完了",
      url: "/placeholder.pdf",
    },
    {
      id: "2",
      name: "データサイエンス_参考資料.pdf",
      size: "8MB",
      pages: "89",
      uploadDate: "2025/01/14",
      status: "完了",
      url: "/placeholder.pdf",
    },
  ])

  const processFile = (fileId: string, type: "video" | "pdf") => {
    setTimeout(() => {
      if (type === "video") {
        setVideos((prev) =>
          prev.map((video) => (video.id === fileId ? { ...video, status: "完了", duration: "45:30" } : video)),
        )
      } else {
        setPdfs((prev) => prev.map((pdf) => (pdf.id === fileId ? { ...pdf, status: "完了", pages: "120" } : pdf)))
      }
    }, 2000) // Simulate 2 second processing time
  }

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    duration: "",
    required: false,
  })

  const [selectedVideoFile, setSelectedVideoFile] = useState<any>(null)
  const [selectedPDFFile, setSelectedPDFFile] = useState<any>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Additional code can be added here if needed

  const [uploadedVideos, setUploadedVideos] = useState<
    {
      id: string
      name: string
      size: string
      duration: string
      uploadDate: string
      status: "処理中" | "完了"
      url: string
    }[]
  >([])
  const [uploadedPDFs, setUploadedPDFs] = useState<
    {
      id: string
      name: string
      size: string
      pages: string
      uploadDate: string
      status: "処理中" | "完了"
      url: string
    }[]
  >([])

  const handleVideoUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "video/*"
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      files.forEach((file) => {
        const newVideo = {
          id: Date.now().toString(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
          duration: "未確認",
          uploadDate: new Date().toLocaleDateString("ja-JP"),
          status: "処理中" as const,
          url: URL.createObjectURL(file),
        }

        setUploadedVideos((prev) => [...prev, newVideo])

        // Simulate processing completion
        setTimeout(() => {
          setUploadedVideos((prev) => prev.map((v) => (v.id === newVideo.id ? { ...v, status: "完了" as const } : v)))
        }, 2000)
      })
    }
    input.click()
  }

  const handlePDFUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf"
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      files.forEach((file) => {
        const newPDF = {
          id: Date.now().toString(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
          pages: "未確認",
          uploadDate: new Date().toLocaleDateString("ja-JP"),
          status: "処理中" as const,
          url: URL.createObjectURL(file),
        }

        setUploadedPDFs((prev) => [...prev, newPDF])

        // Simulate processing completion
        setTimeout(() => {
          setUploadedPDFs((prev) => prev.map((p) => (p.id === newPDF.id ? { ...p, status: "完了" as const } : p)))
        }, 1500)
      })
    }
    input.click()
  }

  const handleCreateCourse = () => {
    if (!newCourse.title.trim()) {
      setError("コースタイトルを入力してください")
      return
    }

    // Create course with proper media file associations
    const courseData = {
      ...newCourse,
      id: `course-${Date.now()}`,
      courseId: `course-${Date.now()}`, // Add courseId for media linking
      createdAt: new Date().toISOString(),
      status: "active",
      instructor: "システム管理者",
      lessons: 15,
      completed: 0,
      progress: 0,
      difficulty: "初級",
      deadline: newCourse.duration || "2025/12/31",
      paymentStatus: "paid",
      categoryIcon: "💻",
      mediaFiles: {
        video: selectedVideoFile
          ? {
              id: Date.now().toString(),
              name: selectedVideoFile.name,
              url: URL.createObjectURL(selectedVideoFile),
              courseId: `course-${Date.now()}`,
            }
          : null,
        pdf: selectedPDFFile
          ? {
              id: Date.now().toString(),
              name: selectedPDFFile.name,
              url: URL.createObjectURL(selectedPDFFile),
              courseId: `course-${Date.now()}`,
            }
          : null,
      },
    }

    if (typeof window !== "undefined") {
      const existingCourses = JSON.parse(localStorage.getItem("createdCourses") || "[]")
      const updatedCourses = [...existingCourses, courseData]
      localStorage.setItem("createdCourses", JSON.stringify(updatedCourses))

      if (courseData.mediaFiles.video) {
        const existingVideos = JSON.parse(localStorage.getItem("uploadedVideos") || "[]")
        existingVideos.push(courseData.mediaFiles.video)
        localStorage.setItem("uploadedVideos", JSON.stringify(existingVideos))
      }

      if (courseData.mediaFiles.pdf) {
        const existingPDFs = JSON.parse(localStorage.getItem("uploadedPDFs") || "[]")
        existingPDFs.push(courseData.mediaFiles.pdf)
        localStorage.setItem("uploadedPDFs", JSON.stringify(existingPDFs))
      }
    }

    setCourses((prev) => [...prev, courseData])
    setNewCourse({
      title: "",
      description: "",
      category: "",
      price: 0,
      duration: "",
      required: false,
    })
    setSelectedVideoFile(null)
    setSelectedPDFFile(null)
    setError("")
    setSuccess("コースが正常に作成されました。受講生画面で確認できます。")
  }

  useEffect(() => {
    const checkPendingAlerts = () => {
      const alerts = JSON.parse(localStorage.getItem("monitoringAlerts") || "[]")
      const pending = alerts.filter((a: any) => a.status === "pending")
      setPendingAlertCount(pending.length)
    }

    checkPendingAlerts()
    const interval = setInterval(checkPendingAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <AlertNotificationToast pendingAlertCount={pendingAlertCount} />

      {/* アラート対応モーダル */}
      {showAlertResponseModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">アラート対応</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="font-medium text-blue-800">{selectedAlert.studentName}</p>
              <p className="text-sm text-blue-600">{selectedAlert.message}</p>
              <p className="text-xs text-blue-500 mt-1">
                {new Date(selectedAlert.timestamp).toLocaleString("ja-JP")}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                対応内容（メッセージ）
              </label>
              <textarea
                value={alertResponseContent}
                onChange={(e) => setAlertResponseContent(e.target.value)}
                placeholder="受講生へのメッセージを入力..."
                className="w-full border rounded-lg p-3 h-24 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={() => handleAlertResponse(selectedAlert.id, "email")}
                className="bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                メール送信
              </Button>
              <Button
                onClick={() => handleAlertResponse(selectedAlert.id, "message")}
                className="bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                メッセージ送信
              </Button>
              <Button
                onClick={() => handleAlertResponse(selectedAlert.id, "warning")}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                警告のみ
              </Button>
              <Button
                onClick={() => handleAlertResponse(selectedAlert.id, "ignore")}
                variant="outline"
                className="bg-transparent"
              >
                無視
              </Button>
            </div>

            <Button
              onClick={() => {
                setShowAlertResponseModal(false)
                setSelectedAlert(null)
                setAlertResponseContent("")
              }}
              variant="outline"
              className="w-full bg-transparent"
            >
              キャンセル
            </Button>
          </div>
        </div>
      )}

      <div className="bg-blue-700 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">管理者側</Badge>
              <div>
                <h1 className="text-xl font-bold text-white">管理者ダッシュボード</h1>
                <p className="text-blue-200 text-sm">JSA学習管理システム</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleNewAddition}
                className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                新規追加
              </Button>
              <Button
                onClick={handleReportExport}
                className="bg-blue-600 text-white border border-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                レポート出力
              </Button>
              <Button className="bg-transparent text-white border border-white/30 hover:bg-white/10" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">管</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 border border-blue-100">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-blue-600">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar + Content Layout */}
        <div className="flex gap-6 mb-6">
          {/* Sidebar Navigation - Vertical */}
          <div className="w-48 shrink-0">
            <nav className="bg-white rounded-lg shadow p-3 flex flex-col gap-1 sticky top-4">
              {[
                { id: "videos", label: "講習管理", icon: Video },
                { id: "students", label: "受講者管理", icon: Users },
                { id: "schedules", label: "日程管理", icon: CalendarDays },
                { id: "monitoring", label: "監視", icon: Eye },
                { id: "alerts", label: "アラート", icon: AlertCircle },
                { id: "analytics", label: "分析", icon: BarChart3 },
                { id: "certificates", label: "証明書", icon: Award },
                { id: "email", label: "メール", icon: Mail },
                { id: "announcements", label: "お知らせ", icon: Bell },
                { id: "settings", label: "設定", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-base font-medium transition-colors w-full text-left ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <tab.icon className="w-5 h-5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 bg-white rounded-lg shadow p-6">
            {activeTab === "videos" && <VideoManagement />}

            {activeTab === "students" && <StudentManagement />}

            {activeTab === "schedules" && <LectureScheduleManagement />}

            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <p className="text-gray-500">この機能は開発中です</p>
                <p className="text-sm text-gray-400 mt-2">分析・レポート機能を準備中です</p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">システム設定</h2>
                  <AutoProcessingSettingsPanel />
                </div>

                <hr className="border-gray-200" />

                {/* 管理者アカウント管理（旧「管理者」タブの内容） */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">管理者アカウント管理</h2>
                      <p className="text-sm text-gray-500">管理画面にログインできるユーザーを管理します（受講生は「受講者管理」で管理）</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="管理者を検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <Button
                        onClick={() => {
                          const newAdmin = {
                            id: Date.now(),
                            name: "新しい管理者",
                            email: "new@example.com",
                            role: "閲覧者",
                            permissions: ["analytics"],
                            status: "アクティブ",
                            avatar: "NA",
                            registeredDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
                            lastLogin: "-",
                            department: "",
                          }
                          setAdminUsers((prev) => [...prev, newAdmin])
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        管理者を追加
                      </Button>
                    </div>
                  </div>

                  {/* 権限レベルの説明 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">権限レベル</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-700">システム管理者:</span>
                        <span className="text-blue-600 ml-1">全機能にアクセス可能</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">運営スタッフ:</span>
                        <span className="text-blue-600 ml-1">受講者管理・監視・証明書発行</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">閲覧者:</span>
                        <span className="text-gray-600 ml-1">分析・レポートの閲覧のみ</span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            管理者
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            権限レベル
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            所属部署
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ステータス
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            最終ログイン
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {adminUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  user.role === "システム管理者" ? "bg-blue-100" :
                                  user.role === "運営スタッフ" ? "bg-blue-100" : "bg-gray-100"
                                }`}>
                                  <span className={`font-medium ${
                                    user.role === "システム管理者" ? "text-blue-600" :
                                    user.role === "運営スタッフ" ? "text-blue-600" : "text-gray-600"
                                  }`}>{user.avatar}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === "システム管理者" ? "bg-blue-100 text-blue-800" :
                                user.role === "運営スタッフ" ? "bg-blue-100 text-blue-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.department || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.status === "アクティブ"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  const newRole = prompt("権限を選択してください（システム管理者 / 運営スタッフ / 閲覧者）", user.role)
                                  if (newRole && ["システム管理者", "運営スタッフ", "閲覧者"].includes(newRole)) {
                                    setAdminUsers((prev) => prev.map((u) => 
                                      u.id === user.id ? { ...u, role: newRole } : u
                                    ))
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                権限変更
                              </button>
                              <button 
                                onClick={() => {
                                  setAdminUsers((prev) => prev.map((u) => 
                                    u.id === user.id ? { ...u, status: u.status === "アクティブ" ? "停止中" : "アクティブ" } : u
                                  ))
                                }}
                                className={user.status === "アクティブ" ? "text-blue-600 hover:text-blue-900" : "text-blue-600 hover:text-blue-900"}
                              >
                                {user.status === "アクティブ" ? "停止" : "有効化"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "monitoring" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">リアルタイム監視システム</h2>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        ライブ監視中 ({enhancedMonitoringData.length}名)
                      </div>
                    </Button>
                    <Button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={() => alert("監視設定:\n・カメラOFF検知: 有効\n・別タブ検知: 有効\n・離席検知: 有効\n・アラート通知: メール+画面通知")}
                    >
                      監視設定
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Live Video Streams */}
                  <div className="lg:col-span-3">
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        ライブ監視映像 ({enhancedMonitoringData.length}名)
                        <span className="text-sm text-gray-500 ml-2">最終更新: {new Date().toLocaleTimeString()}</span>
                      </h3>

                      {/* Video Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {enhancedMonitoringData.map((student, index) => (
                          <div key={index} className="relative">
                            <div
                              className={`bg-gray-900 rounded-lg aspect-video flex items-center justify-center border-2 ${
                                student.alert ? "border-blue-500 animate-pulse" : "border-gray-300"
                              }`}
                            >
                              {student.camera === "ON" ? (
                                <div className="relative w-full h-full">
                                  {/* Enhanced simulated video stream */}
                                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-gray-800 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-white">
                                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-2xl font-bold">{student.name.charAt(0)}</span>
                                      </div>
                                      <div className="text-sm font-medium">{student.name}</div>
                                      <div className="text-xs text-gray-300 mt-1">{student.streamId}</div>
                                    </div>
                                  </div>

                                  {/* Enhanced status overlay */}
                                  <div className="absolute top-2 left-2 flex gap-1">
                                    <div
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        student.status === "正常"
                                          ? "bg-blue-500 text-white"
                                          : student.status === "警告"
                                            ? "bg-blue-500 text-black"
                                            : "bg-blue-500 text-white"
                                      }`}
                                    >
                                      {student.status}
                                    </div>
                                    {student.alert && (
                                      <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                                        🚨 アラート
                                      </div>
                                    )}
                                  </div>

                                  {/* Recording indicator with timestamp */}
                                  <div className="absolute top-2 right-2 flex items-center gap-1">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="text-white text-xs bg-black bg-opacity-50 px-1 rounded">REC</span>
                                  </div>

                                  {/* Enhanced student info overlay */}
                                  <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <div className="font-medium">{student.course}</div>
                                        <div className="text-gray-300">学習時間: {student.time}</div>
                                      </div>
                                      <div className="text-right">
                                        <div
                                          className={`text-xs ${student.camera === "ON" ? "text-blue-400" : "text-blue-400"}`}
                                        >
                                          📹 {student.camera}
                                        </div>
                                        <div
                                          className={`text-xs ${student.screen === "アクティブ" ? "text-blue-400" : "text-blue-400"}`}
                                        >
                                          🖥️ {student.screen}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center text-gray-400">
                                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-2xl">📷</span>
                                  </div>
                                  <div className="text-sm">カメラオフ</div>
                                  <div className="text-xs text-blue-400 mt-1">{student.name}</div>
                                </div>
                              )}
                            </div>

                            {/* Enhanced control buttons */}
                            <div className="absolute bottom-2 right-2 flex gap-1">
                              <button
                                className="bg-black bg-opacity-50 text-white p-1 rounded text-xs hover:bg-opacity-70"
                                title="拡大表示"
                              >
                                🔍
                              </button>
                              <button
                                className="bg-black bg-opacity-50 text-white p-1 rounded text-xs hover:bg-opacity-70"
                                title="通知送信"
                              >
                                📱
                              </button>
                              {student.alert && (
                                <button
                                  className="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                                  title="アラート対応"
                                >
                                  ⚠️
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Detailed monitoring status */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-800">詳細監視状況</h4>
                        {enhancedMonitoringData.map((student, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${student.alert ? "border-blue-200 bg-blue-50" : "border-gray-200"}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">{student.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-sm text-gray-500">{student.course}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-sm">
                                  <div>
                                    カメラ:{" "}
                                    <span className={student.camera === "ON" ? "text-blue-600" : "text-blue-600"}>
                                      {student.camera}
                                    </span>
                                  </div>
                                  <div>
                                    画面:{" "}
                                    <span
                                      className={student.screen === "アクティブ" ? "text-blue-600" : "text-blue-600"}
                                    >
                                      {student.screen}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <div>学習時間: {student.time}</div>
                                  <div>
                                    状態:{" "}
                                    <span
                                      className={`font-medium ${student.status === "正常" ? "text-blue-600" : student.status === "警告" ? "text-blue-600" : "text-blue-600"}`}
                                    >
                                      {student.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      alert(`【${student.name}】の詳細情報\n\n受講コース: ${student.course}\nカメラ: ${student.camera}\n画面状態: ${student.screen}\n学習時間: ${student.time}\n状態: ${student.status}\nストリームID: ${student.streamId}`)
                                    }}
                                  >
                                    詳細
                                  </Button>
                                  {student.alert && (
                                    <Button 
                                      size="sm" 
                                      className="bg-blue-600 text-white hover:bg-blue-700"
                                      onClick={() => {
                                        // 該当受講生のアラートを検索
                                        const studentAlerts = alerts.filter(
                                          (a) => a.studentId === student.streamId && a.status === "pending"
                                        )
                                        if (studentAlerts.length > 0) {
                                          setSelectedAlert(studentAlerts[0])
                                          setShowAlertResponseModal(true)
                                        } else {
                                          // 新規アラートとして対応モーダルを開く
                                          setSelectedAlert({
                                            id: `temp-${Date.now()}`,
                                            studentId: student.streamId,
                                            studentName: student.name,
                                            type: "abnormal_behavior",
                                            message: `${student.name}に警告状態が検出されました`,
                                            timestamp: new Date().toISOString(),
                                            status: "pending",
                                            handledBy: null,
                                            handledAt: null,
                                            handledAction: null,
                                          })
                                          setShowAlertResponseModal(true)
                                        }
                                      }}
                                    >
                                      対応
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        リアルタイムアラート
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">カメラ異常</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${alertCounts.camera_off > 0 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}>
                            {alertCounts.camera_off}件
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">別タブ検知</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${alertCounts.tab_switch > 0 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}>
                            {alertCounts.tab_switch}件
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">離席検知</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${alertCounts.away > 0 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}>
                            {alertCounts.away}件
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">異常行動</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${alertCounts.abnormal_behavior > 0 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}>
                            {alertCounts.abnormal_behavior}件
                          </span>
                        </div>
                      </div>

                      {/* Quick action buttons */}
                      <div className="mt-4 space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => {
                            if (confirm("全てのアラートを対応済みにしますか？")) {
                              alert("全アラートを対応済みにしました")
                            }
                          }}
                        >
                          全アラート対応
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full bg-transparent"
                          onClick={() => alert("アラート履歴:\n\n2025/01/21 14:32 - 佐藤花子: 別タブ検知\n2025/01/21 14:15 - 田中太郎: カメラOFF\n2025/01/21 13:58 - 山田次郎: 離席検知")}
                        >
                          アラート履歴
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced monitoring statistics */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">監視統計</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">監視中受講者</span>
                          <span className="font-medium text-blue-600">{enhancedMonitoringData.length}名</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">正常状態</span>
                          <span className="font-medium text-blue-600">
                            {enhancedMonitoringData.filter((s) => s.status === "正常").length}名
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">警告状態</span>
                          <span className="font-medium text-blue-600">
                            {enhancedMonitoringData.filter((s) => s.status === "警告").length}名
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">異常状態</span>
                          <span className="font-medium text-blue-600">
                            {enhancedMonitoringData.filter((s) => s.status === "異常").length}名
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">カメラ稼働率</span>
                          <span className="font-medium text-blue-600">
                            {Math.round(
                              (enhancedMonitoringData.filter((s) => s.camera === "ON").length /
                                enhancedMonitoringData.length) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Monitoring Settings */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">監視設定</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">顔認証監視</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">画面監視</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">別タブ検知</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">離席検知</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">音声監視</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">設定を保存</Button>
                    </div>
                  </div>
                </div>

                {/* Monitoring Logs */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">監視ログ</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">時刻</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">受講者</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">コース</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">イベント</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">詳細</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">対応状況</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {monitoringLogs.map((log, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.student}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.course}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  log.event === "正常ログイン"
                                    ? "bg-blue-100 text-blue-800"
                                    : log.event === "別タブ検知"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {log.event}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.detail}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  log.status === "正常"
                                    ? "bg-blue-100 text-blue-800"
                                    : log.status === "対応済み"
                                      ? "bg-blue-100 text-blue-800"
                                      : log.status === "対応中"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">アラート管理</h2>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      すべて対応済みにする
                    </Button>
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      アラート設定
                    </Button>
                  </div>
                </div>

                {/* Alert Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <AlertCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">未対応アラート</p>
                        <p className="text-2xl font-bold text-blue-900">5</p>
                        <p className="text-sm text-blue-500">緊急対応中</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">対応中アラート</p>
                        <p className="text-2xl font-bold text-blue-900">2</p>
                        <p className="text-sm text-blue-500">対応中</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 border rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">対応済みアラート</p>
                        <p className="text-2xl font-bold text-gray-900">156</p>
                        <p className="text-sm text-gray-500">過去7日間</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert List */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">アラート一覧</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">受講者</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">コース</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            アラート種別
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">対応状況</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          {
                            student: "佐藤花子",
                            course: "データ分析入門",
                            type: "別タブ検知",
                            time: "2025/08/10 14:32",
                            status: "未対応",
                            details: "YouTube閲覧を検知",
                          },
                          {
                            student: "鈴木美咲",
                            course: "プログラミング基礎",
                            type: "カメラ異常",
                            time: "2025/08/10 14:28",
                            status: "対応中",
                            details: "カメラが無効化されました",
                          },
                          {
                            student: "山田次郎",
                            course: "Webセキュリティ",
                            type: "顔認証失敗",
                            time: "2025/08/10 14:25",
                            status: "対応済み",
                            details: "本人以外の顔を検知",
                          },
                          {
                            student: "田中太郎",
                            course: "AI基礎講座",
                            type: "正常ログイン",
                            time: "2025/08/10 14:20",
                            status: "対応済み",
                            details: "顔認証成功",
                          },
                          {
                            student: "伊藤花子",
                            course: "プログラミング応用",
                            type: "離席検知",
                            time: "2025/08/10 11:05",
                            status: "未対応",
                            details: "3分間離席",
                          },
                        ].map((alert, index) => (
                          <tr key={index} className={alert.status === "未対応" ? "bg-blue-50" : ""}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alert.student}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alert.course}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  alert.type === "正常ログイン"
                                    ? "bg-blue-100 text-blue-800"
                                    : alert.type === "別タブ検知"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {alert.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  alert.status === "対応済み"
                                    ? "bg-blue-100 text-blue-800"
                                    : alert.status === "対応中"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {alert.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button size="sm" variant="outline" className="mr-2 bg-transparent">
                                詳細
                              </Button>
                              {alert.status === "未対応" && (
                                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                  対応済みにする
                                </Button>
                              )}
                              {alert.status === "対応中" && (
                                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                  対応完了
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

{/* トップページ管理タブは削除されました */}

            {activeTab === "certificates" && <CertificateManagement />}

            {activeTab === "email" && <EmailManagement />}

            {activeTab === "announcements" && <AnnouncementManagement />}

            {/* 旧証明書管理コード - 新しいCertificateManagementコンポーネントに置き換え済み */}
            {false && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">修了証管理システム</h2>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      一括発行
                    </Button>
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      テンプレート管理
                    </Button>
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      デジタル署名設定
                    </Button>
                  </div>
                </div>

                {/* Certificate Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">発行済み修了証</p>
                        <p className="text-2xl font-bold text-gray-900">156</p>
                        <p className="text-sm text-gray-500">今月 +23</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">発行待ち</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                        <p className="text-sm text-gray-500">試験合格後</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">テンプレート数</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                        <p className="text-sm text-gray-500">アクティブ</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">デジタル署名</p>
                        <p className="text-2xl font-bold text-gray-900">100%</p>
                        <p className="text-sm text-gray-500">認証済み</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Management */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">修了証発行管理</h3>
                      <div className="space-y-4">
                        {[
                          {
                            student: "佐藤健太",
                            course: "プログラミング基礎",
                            status: "発行済み",
                            date: "2025/08/15",
                            certId: "GLX-2025-001",
                            downloads: 3,
                          },
                          {
                            student: "田中美咲",
                            course: "データ分析入門",
                            status: "発行済み",
                            date: "2025/08/14",
                            certId: "GLX-2025-002",
                            downloads: 1,
                          },
                          {
                            student: "山田康太郎",
                            course: "ビジネス英語",
                            status: "発行待ち",
                            date: "-",
                            certId: "-",
                            downloads: 0,
                          },
                          {
                            student: "鈴木真理",
                            course: "Webセキュリティ",
                            status: "発行済み",
                            date: "2025/08/12",
                            certId: "GLX-2025-003",
                            downloads: 5,
                          },
                          {
                            student: "高橋次郎",
                            course: "AI基礎講座",
                            status: "再発行",
                            date: "2025/08/10",
                            certId: "GLX-2025-004",
                            downloads: 2,
                          },
                        ].map((cert, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">{cert.student.charAt(0)}</span>
                                </div>
                                <div>
                                  <div className="font-medium">{cert.student}</div>
                                  <div className="text-sm text-gray-500">{cert.course}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-sm">
                                  <div>発行日: {cert.date}</div>
                                  <div>認定番号: {cert.certId}</div>
                                </div>
                                <div className="text-sm">
                                  <div>ダウンロード: {cert.downloads}回</div>
                                  <div>
                                    ステータス:{" "}
                                    <span
                                      className={`font-medium ${
                                        cert.status === "発行済み"
                                          ? "text-blue-600"
                                          : cert.status === "発行待ち"
                                            ? "text-blue-600"
                                            : "text-blue-600"
                                      }`}
                                    >
                                      {cert.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {cert.status === "発行済み" && (
                                    <>
                                      <Button size="sm" variant="outline">
                                        プレビュー
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        再発行
                                      </Button>
                                    </>
                                  )}
                                  {cert.status === "発行待ち" && (
                                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                      発行
                                    </Button>
                                  )}
                                  {cert.status === "再発行" && (
                                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                      承認
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Certificate Templates */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">修了証テンプレート</h3>
                      <div className="space-y-3">
                        {[
                          { name: "標準テンプレート", courses: 5, active: true },
                          { name: "プレミアムテンプレート", courses: 2, active: true },
                          { name: "企業向けテンプレート", courses: 1, active: false },
                          { name: "カスタムテンプレート", courses: 0, active: false },
                        ].map((template, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{template.name}</div>
                              <div className="text-xs text-gray-500">{template.courses}コースで使用中</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${template.active ? "bg-blue-500" : "bg-gray-300"}`}
                              />
                              <Button variant="ghost" size="sm">
                                編集
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
                        新規テンプレート作成
                      </Button>
                    </div>

                    {/* Digital Signature Settings */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">デジタル署名設定</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">デジタル署名</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">有効</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">ブロックチェーン証明</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">有効</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">QRコード認証</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">有効</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">有効期限設定</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">2年</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
                        署名設定を更新
                      </Button>
                    </div>

                    {/* Certificate Verification */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">修了証検証</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="認定番号を入力..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">修了証を検証</Button>
                      </div>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600">
                          <div>検証済み修了証: 156件</div>
                          <div>無効な修了証: 0件</div>
                          <div>期限切れ: 3件</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Generation Queue */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">修了証生成キュー</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">受講者</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">コース</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">試験結果</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">生成状況</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">予定日時</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          {
                            student: "伊藤花子",
                            course: "プログラミング応用",
                            score: "85点",
                            status: "生成中",
                            date: "2025/08/21 10:00",
                            progress: 75,
                          },
                          {
                            student: "渡辺太郎",
                            course: "データベース設計",
                            score: "92点",
                            status: "待機中",
                            date: "2025/08/21 11:00",
                            progress: 0,
                          },
                          {
                            student: "中村美咲",
                            course: "ネットワーク基礎",
                            score: "78点",
                            status: "署名中",
                            date: "2025/08/21 12:00",
                            progress: 90,
                          },
                        ].map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.student}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.course}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                合格 ({item.score})
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    item.status === "生成中"
                                      ? "bg-blue-100 text-blue-800"
                                      : item.status === "待機中"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                                {item.progress > 0 && (
                                  <div className="w-16 bg-gray-200 rounded-full h-1">
                                    <div
                                      className="bg-blue-600 h-1 rounded-full"
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button size="sm" variant="outline" className="mr-2 bg-transparent">
                                優先
                              </Button>
                              <Button size="sm" variant="outline">
                                キャンセル
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}
