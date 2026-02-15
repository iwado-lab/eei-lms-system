"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCourseProgress } from "@/contexts/course-progress-context"
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle, Clock, HelpCircle, ShoppingCart, List, Grid3x3, Camera, LogOut, Home, Video, Award, Play, UserCog } from "lucide-react"
import { Logo } from "@/components/logo"
import { CourseProgressProvider } from "@/contexts/course-progress-context"
import ChatBotWidget from "@/components/chat-bot-widget"
import { ScheduleChange } from "@/components/schedule-change"
import { Certificate } from "@/components/certificate"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  getCurrentUser,
  logoutStudent,
  startMonitoringSession,
  updateMonitoringSession,
  endMonitoringSession,
  updateStudyProgress,
  addAlert,
  type RegisteredStudent,
} from "@/lib/store"

export default function StudentDashboard() {
  return (
    <CourseProgressProvider>
      <DashboardContent />
    </CourseProgressProvider>
  )
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"home" | "videos" | "certificate" | "textbook">("home")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const router = useRouter()
  const [monitoringEnabled, setMonitoringEnabled] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categoryView, setCategoryView] = useState("grid")
  const [monitoringStatus, setMonitoringStatus] = useState({
    camera: false,
    screen: false,
    faceAuth: false,
    tabFocus: false,
    mouseTracking: false,
  })
  const [monitoringData, setMonitoringData] = useState({
    sessionTime: 0,
    tabSwitches: 0,
    faceDetections: 0,
    alerts: [] as any[],
  })
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const faceDetectionRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const COURSE_DEFINITIONS = [
    { id: "course-a", name: "コースA（基礎編）", description: "派遣元責任者講習の基礎的な内容を学びます" },
    { id: "course-b", name: "コースB（実践編）", description: "実践的な派遣業務管理について学びます" },
  ]
  const [activeCourseId, setActiveCourseId] = useState("course-a")
  const [courseProgressMap, setCourseProgressMap] = useState<Record<string, { lastPartId: number; completedParts: string[] }>>({
    "course-a": { lastPartId: 1, completedParts: [] },
    "course-b": { lastPartId: 1, completedParts: [] },
  })
  const [showCourseSwitch, setShowCourseSwitch] = useState(false)

  const handleCourseSwitch = (targetCourseId: string) => {
    if (targetCourseId === activeCourseId) return
    setCourseProgressMap(prev => ({
      ...prev,
      [activeCourseId]: {
        ...prev[activeCourseId],
        completedParts: Array.from(completedParts),
      },
    }))
    setActiveCourseId(targetCourseId)
    setShowCourseSwitch(false)
  }
  const [partViewMode, setPartViewMode] = useState<"list" | "grid">("list")

  const [showPDF, setShowPDF] = useState(true)
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const [currentPDF, setCurrentPDF] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const monitoringVideoRef = useRef<HTMLVideoElement>(null)
  const playerVideoRef = useRef<HTMLVideoElement>(null)

  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [showCourseDetail, setShowCourseDetail] = useState(false)

  const [selectedPart, setSelectedPart] = useState<any>(null)
  const [showPartDialog, setShowPartDialog] = useState(false)

  const [topPageContent, setTopPageContent] = useState([])

  const [currentUser, setCurrentUser] = useState<RegisteredStudent | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
      return
    }
    setCurrentUser(user)
    startMonitoringSession(user)
    return () => {
      if (user) {
        endMonitoringSession(user.id)
      }
    }
  }, [router])

  const updateMonitoringState = useCallback(() => {
    if (!currentUser) return
    updateMonitoringSession(currentUser.id, {
      cameraStatus: monitoringStatus.camera ? "on" : "off",
      screenStatus: monitoringStatus.tabFocus ? "active" : "inactive",
      status: monitoringStatus.camera && monitoringStatus.tabFocus ? "normal" : "warning",
    })
  }, [currentUser, monitoringStatus])

  useEffect(() => {
    updateMonitoringState()
  }, [updateMonitoringState])

  const triggerAlert = useCallback((type: "camera_off" | "tab_switch" | "away" | "abnormal_behavior", message: string) => {
    if (!currentUser) return
    addAlert({
      studentId: currentUser.id,
      studentName: currentUser.name,
      type,
      message,
      timestamp: new Date().toISOString(),
    })
    updateMonitoringSession(currentUser.id, { status: "warning" })
  }, [currentUser])

  const handleLogout = useCallback(() => {
    if (currentUser) {
      logoutStudent(currentUser.id)
    }
    router.push("/")
  }, [currentUser, router])

  const {
    completedParts,
    isPartCompleted,
    getCompletionPercentage,
    markAllAsCompleted,
    resetAllProgress,
    togglePartCompletion,
    getTotalStudyTimeMinutes,
  } = useCourseProgress()

  const completionPercentage = getCompletionPercentage()
  const completedCount = completedParts.size

  // PDF準拠のパートデータ
  const curriculumParts = [
    {
      id: "part1",
      number: 1,
      title: "労働基準法",
      subtitle: "Part 1",
      duration: "視聴時間約55分",
      remaining: "（残り時間約6時間）",
    },
    {
      id: "part2",
      number: 2,
      title: "労働基準法その他労働関係法令",
      subtitle: "Part 2",
      duration: "視聴時間約55分",
      remaining: "（残り時間約5時間05分）",
    },
    {
      id: "part3",
      number: 3,
      title: "労働基準法等の適用に関する特例",
      subtitle: "Part 3",
      duration: "視聴時間約55分",
      remaining: "（残り時間約4時間10分）",
    },
    {
      id: "part4",
      number: 4,
      title: "労働者派遣法の目的・制度など",
      subtitle: "Part 4",
      duration: "視聴時間約55分",
      remaining: "（残り時間約3時間15分）",
    },
    {
      id: "part5",
      number: 5,
      title: "派遣先と派遣会社の関係",
      subtitle: "Part 5",
      duration: "視聴時間約55分",
      remaining: "（残り時間約2時間20分）",
    },
    {
      id: "part6",
      number: 6,
      title: "派遣社員と派遣会社の関係",
      subtitle: "Part 6",
      duration: "視聴時間約55分",
      remaining: "（残り時間約1時間25分）",
    },
    {
      id: "part7",
      number: 7,
      title: "法改正の動向など",
      subtitle: "Part 7",
      duration: "視聴時間約30分",
      remaining: "",
    },
  ]

  const courseFlowData = [
    {
      id: 1,
      title: "Part 1: 労働基準法",
      duration: "視聴時間約55分",
      remaining: "（残り時間約6時間）",
      details: [
        { section: "第1章 労働基準法の概要", items: ["1.1 労働基準法とは", "1.2 適用範囲", "1.3 労働者の権利"] },
        { section: "第2章 労働条件", items: ["2.1 労働時間", "2.2 休憩・休日"] },
        { section: "第3章 賃金", items: ["3.1 賃金の支払い", "3.2 最低賃金"] },
      ],
      topics: ["労働基準法の基本", "労働条件と賃金", "労働者の権利"],
    },
    {
      id: 2,
      title: "Part 2: 労働基準法その他労働関係法令",
      duration: "視聴時間約55分",
      remaining: "（残り時間約5時間05分）",
      details: [
        { section: "第1章 労働安全衛生法", items: ["1.1 安全衛生管理", "1.2 健康診断"] },
        { section: "第2章 労働契約法", items: ["2.1 契約の基本", "2.2 解雇ルール"] },
        { section: "第3章 その他関連法令", items: ["3.1 男女雇用機会均等法", "3.2 育児・介護休業法"] },
      ],
      topics: ["労働安全衛生法", "労働契約法", "関連法令"],
    },
    {
      id: 3,
      title: "Part 3: 労働基準法等の適用に関する特例",
      duration: "視聴時間約55分",
      remaining: "（残り時間約4時間10分）",
      details: [
        { section: "第1章 特例の概要", items: ["1.1 適用除外", "1.2 特別措置"] },
        { section: "第2章 派遣労働者への適用", items: ["2.1 責任分担", "2.2 実務上の注意点"] },
      ],
      topics: ["特例の概要", "派遣労働者への適用", "実務上の注意点"],
    },
    {
      id: 4,
      title: "Part 4: 労働者派遣法の目的・制度など",
      duration: "視聴時間約55分",
      remaining: "（残り時間約3時間15分）",
      details: [
        { section: "第1章 労働者派遣法の目的", items: ["1.1 法律の目的", "1.2 制度の沿革"] },
        { section: "第2章 派遣制度の仕組み", items: ["2.1 許可制度", "2.2 届出制度"] },
      ],
      topics: ["労働者派遣法の目的", "派遣制度の仕組み"],
    },
    {
      id: 5,
      title: "Part 5: 派遣先と派遣会社の関係",
      duration: "視聴時間約55分",
      remaining: "（残り時間約2時間20分）",
      details: [
        { section: "第1章 派遣契約", items: ["1.1 契約の締結", "1.2 明示事項"] },
        { section: "第2章 派遣先の義務", items: ["2.1 適正な管理", "2.2 苦情処理"] },
      ],
      topics: ["派遣契約", "派遣先の義務"],
    },
    {
      id: 6,
      title: "Part 6: 派遣社員と派遣会社の関係",
      duration: "視聴時間約55分",
      remaining: "（残り時間約1時間25分）",
      details: [
        { section: "第1章 雇用管理", items: ["1.1 労働条件", "1.2 福利厚生"] },
        { section: "第2章 キャリア形成支援", items: ["2.1 教育訓練", "2.2 キャリアコンサルティング"] },
      ],
      topics: ["雇用管理", "キャリア形成支援"],
    },
    {
      id: 7,
      title: "Part 7: 法改正の動向など",
      duration: "視聴時間約30分",
      remaining: "",
      details: [
        { section: "第1章 最近の法改正", items: ["1.1 改正のポイント", "1.2 実務への影響"] },
        { section: "第2章 今後の展望", items: ["2.1 制度改革の方向性", "2.2 対応のポイント"] },
      ],
      topics: ["最近の法改正", "今後の展望"],
    },
  ]

  useEffect(() => {
    const savedContents = localStorage.getItem("topPageContents")
    if (savedContents) {
      const parsedContents = JSON.parse(savedContents)
      setTopPageContent(parsedContents.filter((content: any) => content.status === "published"))
    }
  }, [])

  const refreshTopPageContent = () => {
    const savedContents = localStorage.getItem("topPageContents")
    if (savedContents) {
      const parsedContents = JSON.parse(savedContents)
      setTopPageContent(parsedContents.filter((content: any) => content.status === "published"))
    }
  }

  useEffect(() => {
    const interval = setInterval(refreshTopPageContent, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => {
      stopMonitoring()
    }
  }, [])

  const uploadedMedia = {
    videos: [
      { id: 1, name: "FE_qa_dqt4sy.mp4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", courseId: "programming-basics" },
    ],
    pdfs: [
      { id: 1, name: "文書名テクノプロ様.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", courseId: "programming-basics" },
    ],
  }

  const loadCourseMedia = (courseId: string) => {
    try {
      const uploadedVideos = JSON.parse(localStorage.getItem("uploadedVideos") || "[]")
      const uploadedPDFs = JSON.parse(localStorage.getItem("uploadedPDFs") || "[]")
      const courseVideo = uploadedVideos.find((video: any) => video.courseId === courseId) || uploadedMedia.videos.find((video) => video.courseId === courseId)
      const coursePdf = uploadedPDFs.find((pdf: any) => pdf.courseId === courseId) || uploadedMedia.pdfs.find((pdf) => pdf.courseId === courseId)
      if (courseVideo) setCurrentVideo(courseVideo.url)
      else setCurrentVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
      if (coursePdf) setCurrentPDF(coursePdf.url)
      else setCurrentPDF("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
    } catch (error) {
      setCurrentVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
      setCurrentPDF("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
    }
  }

  const handleStartLearning = async (course: any) => {
    router.push(`/lecture/${course.id}`)
  }

  const stopMonitoring = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    if (sessionTimerRef.current) { clearInterval(sessionTimerRef.current); sessionTimerRef.current = null }
    if (faceDetectionRef.current) { clearInterval(faceDetectionRef.current); faceDetectionRef.current = null }
    setMonitoringStatus({ camera: false, screen: false, faceAuth: false, mouseTracking: false, tabFocus: false })
    setMonitoringEnabled(false)
    setMonitoringData({ sessionTime: 0, tabSwitches: 0, faceDetections: 0, alerts: [] })
  }

  const notifications = [
    { id: 1, title: "「ブラウザ操作」エラーについて", date: "2025/08/25" },
    { id: 2, title: "「タブレット」端末でのご受講について", date: "2025/05/21" },
  ]

  const handlePartClick = (part: any) => {
    setSelectedPart(part)
    setShowPartDialog(true)
  }

  const handleStartPart = (partId: number) => {
    setShowPartDialog(false)
    router.push(`/lecture/${partId}`)
  }

  const totalStudyMinutes = getTotalStudyTimeMinutes()
  const totalStudyHours = Math.floor(totalStudyMinutes / 60)
  const totalStudyRemainingMinutes = totalStudyMinutes % 60

  // 動画一覧リスト（ホームと動画一覧タブで共有するコンポーネント）
  const VideoListSection = ({ showStartButton }: { showStartButton: boolean }) => (
    <div className="space-y-4">
      <p className="text-base text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
        パート1から順番に受講してください。各パートの動画を視聴後、確認テストに合格すると次のパートに進めます。
      </p>
      {curriculumParts.map((part, index) => {
        const isCompleted = isPartCompleted(String(index + 1))
        return (
          <div
            key={part.id}
            className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
              isCompleted
                ? "bg-blue-50/50 border-blue-300 shadow-sm"
                : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-extrabold text-blue-600">{part.subtitle}:</span>
                <span className="text-lg font-bold text-gray-900">{part.title}</span>
                {isCompleted && (
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold inline-flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    完了
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1.5">
                {part.duration}
                {part.remaining && <span className="ml-2 text-gray-400">{part.remaining}</span>}
              </div>
            </div>
            <div className="flex-shrink-0">
              {showStartButton && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base px-5 py-2.5 h-auto"
                  onClick={() => router.push(`/lecture/${part.number}`)}
                >
                  <Play className="w-4 h-4 mr-1.5" />
                  {isCompleted ? "復習" : "受講開始"}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  // タブ定義
  const tabs = [
    { id: "home" as const, label: "ホーム", icon: Home },
    { id: "videos" as const, label: "動画一覧", icon: Video },
    { id: "certificate" as const, label: "受講証明書", icon: Award },
    { id: "textbook" as const, label: "テキスト購入", icon: ShoppingCart },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="lg" />
              <div className="h-10 w-px bg-gray-200" />
              <h1 className="text-xl font-bold text-gray-900">定期講習 オンライン動画視聴画面</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="text-base border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={() => router.push("/mypage")}
              >
                <UserCog className="w-5 h-5 mr-1.5" />
                マイページ
              </Button>
              <Button
                variant="outline"
                className="text-base border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={() => router.push("/profile/face-registration")}
              >
                <Camera className="w-5 h-5 mr-1.5" />
                本人画像登録
              </Button>
              <Button
                variant="outline"
                className="text-base border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-1.5" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-0 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-5 text-base font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* コース切替パネル */}
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-500">受講中コース:</span>
              <span className="text-lg font-bold text-gray-900">
                {COURSE_DEFINITIONS.find(c => c.id === activeCourseId)?.name}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCourseSwitch(!showCourseSwitch)}
              className="text-base border-gray-200 text-blue-600 hover:bg-blue-50"
            >
              コース切替
            </Button>
          </div>
          {showCourseSwitch && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 border-t border-gray-100 pt-3">
              {COURSE_DEFINITIONS.map(course => {
                const isActive = course.id === activeCourseId
                const savedProgress = courseProgressMap[course.id]
                return (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSwitch(course.id)}
                    disabled={isActive}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      isActive
                        ? "border-blue-300 bg-white cursor-default"
                        : "border-gray-200 hover:border-blue-200 hover:bg-white cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-base">{course.name}</span>
                      {isActive && (
                        <span className="text-sm bg-blue-600 text-white px-2 py-0.5 rounded-full">受講中</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{course.description}</p>
                    {savedProgress && savedProgress.completedParts.length > 0 && (
                      <p className="text-sm text-blue-600 mt-0.5">{savedProgress.completedParts.length}パート完了済み</p>
                    )}
                  </button>
                )
              })}
            </div>
          )}
          <p className="text-sm text-gray-400 mt-2">
            いずれのコースを修了しても、発行される認定証は同一です。
          </p>
        </div>

        {/* ホームタブ */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">ホーム</h2>
              <p className="text-base text-gray-500 mt-1">受講状況と最新情報をご確認ください</p>
            </div>

            {/* トライアル用管理機能 */}
            <Card className="border-gray-200 bg-white">
              <CardHeader className="py-4 px-5">
                <CardTitle className="text-gray-700 text-base font-medium">トライアル用管理機能</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={markAllAsCompleted} className="text-base">すべて完了にする</Button>
                  <Button variant="outline" onClick={resetAllProgress} className="text-base">すべてリセット</Button>
                  {[1, 2, 3, 4, 5, 6, 7].map((partNum) => (
                    <Button
                      key={partNum}
                      variant={isPartCompleted(String(partNum)) ? "default" : "outline"}
                      onClick={() => togglePartCompletion(String(partNum))}
                      className={`text-base ${isPartCompleted(String(partNum)) ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    >
                      Part {partNum} {isPartCompleted(String(partNum)) ? "✓" : ""}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* お知らせ一覧 */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="w-1 h-6 bg-blue-600 rounded-full" />
                  お知らせ一覧
                </CardTitle>
                <Button variant="outline" className="text-base text-blue-600 border-blue-200 hover:bg-blue-50">
                  <HelpCircle className="w-5 h-5 mr-1.5" />
                  よくある質問
                </Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-center py-3">
                      <span className="text-base text-gray-400 mr-4 shrink-0">{notification.date}</span>
                      <span className="text-base text-gray-800">{notification.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 進捗サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white border border-gray-200 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">完了パート</p>
                      <p className="text-2xl font-bold text-gray-900">{completedCount}/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white border border-gray-200 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">総受講時間</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalStudyHours}時間{totalStudyRemainingMinutes > 0 ? `${totalStudyRemainingMinutes}分` : ""}/6時間
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 受講日程カード */}
            <ScheduleChange />

            {/* デモ動画 */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-900 flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  デモ動画
                </CardTitle>
                <CardDescription className="text-base text-gray-500">
                  受講環境の確認用デモ動画をご覧いただけます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-base text-gray-600 leading-relaxed">
                    受講の当日までに下記のデモ動画を再生いただき、本人認証・音声ボリューム・動画再生が可能かどうかなどインターネット等も含め、受講環境の確認を行なって下さい。
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base"
                    onClick={() => router.push("/lecture/demo")}
                  >
                    <Play className="w-5 h-5 mr-1.5" />
                    デモ動画を視聴する
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 動画一覧（ホーム上で直接受講開始可能） */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="w-1 h-6 bg-blue-600 rounded-full" />
                  動画一覧
                </CardTitle>
                <CardDescription className="text-base">全7パートを順番に受講してください</CardDescription>
              </CardHeader>
              <CardContent>
                <VideoListSection showStartButton={true} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* 動画一覧タブ */}
        {activeTab === "videos" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">動画一覧</h2>
              <p className="text-base text-gray-500 mt-1">全7パートを順番に受講してください</p>
            </div>

            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">受講パート</CardTitle>
                    <CardDescription className="text-base">各パートをクリックすると詳細が表示されます</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={partViewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPartViewMode("list")}
                      className={`gap-1.5 text-sm ${partViewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    >
                      <List className="w-4 h-4" />
                      リスト
                    </Button>
                    <Button
                      variant={partViewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPartViewMode("grid")}
                      className={`gap-1.5 text-sm ${partViewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                      グリッド
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {partViewMode === "list" ? (
                  <div className="space-y-4">
                    {courseFlowData.map((part, index) => {
                      const isCompleted = isPartCompleted(String(index + 1))
                      return (
                        <div
                          key={part.id}
                          className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                            isCompleted
                              ? "bg-blue-50/50 border-blue-300 shadow-sm"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xl font-extrabold text-blue-600">Part {index + 1}:</span>
                              <span className="text-lg font-bold text-gray-900">{part.title.replace(/^Part \d+: /, "")}</span>
                              {isCompleted && (
                                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold inline-flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  完了
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1.5">
                              {part.duration}
                              {part.remaining && <span className="ml-2 text-gray-400">{part.remaining}</span>}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white text-base px-5 py-2.5 h-auto"
                              onClick={(e) => { e.stopPropagation(); handleStartPart(part.id) }}
                            >
                              <Play className="w-4 h-4 mr-1.5" />
                              {isCompleted ? "復習" : "受講開始"}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {courseFlowData.map((part, index) => {
                      const isCompleted = isPartCompleted(String(index + 1))
                      return (
                        <div
                          key={part.id}
                          className={`relative p-5 rounded-xl border-2 transition-all ${
                            isCompleted
                              ? "bg-blue-50/50 border-blue-300 shadow-sm"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          {isCompleted && (
                            <div className="absolute top-3 right-3">
                              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold inline-flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                完了
                              </span>
                            </div>
                          )}
                          <div className="text-center pt-2">
                            <div className="text-xl font-extrabold text-blue-600 mb-1">Part {index + 1}</div>
                            <div className="text-base font-bold text-gray-900 mb-2">{part.title.replace(/^Part \d+: /, "")}</div>
                            <div className="text-sm text-gray-500">{part.duration}</div>
                            {part.remaining && <div className="text-sm text-gray-400 mt-1">{part.remaining}</div>}
                          </div>
                          <Button
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-base py-2.5 h-auto"
                            onClick={() => handleStartPart(part.id)}
                          >
                            <Play className="w-4 h-4 mr-1.5" />
                            {isCompleted ? "復習" : "受講開始"}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 受講証明書タブ */}
        {activeTab === "certificate" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">受講証明書</h2>
              <p className="text-base text-gray-500 mt-1">全パート完了後、受講証明書をダウンロードできます</p>
            </div>

            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-900 flex items-center gap-2 text-lg font-semibold">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  受講証明書
                </CardTitle>
                <CardDescription className="text-base">
                  全パート完了後、受講証明書をダウンロードできます
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedCount === 7 ? (
                  <div className="space-y-4">
                    <div className="p-5 bg-white border border-blue-200 rounded-lg text-center">
                      <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <p className="text-gray-900 font-semibold text-lg">おめでとうございます!</p>
                      <p className="text-base text-gray-600">全7パートを完了しました。</p>
                    </div>
                    <Certificate studentName={currentUser?.name || "田中 太郎"} birthDate="1985年4月1日" courseDate="2025年1月15日" />
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-base text-gray-600 mb-3">
                      全7パートを完了すると、受講証明書がダウンロード可能になります。
                    </p>
                    <p className="text-base text-blue-600 mb-4 font-medium">現在の進捗: {completedCount}/7 パート完了</p>
                    <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <Button variant="outline" disabled className="opacity-50 bg-transparent text-base">
                      受講証明書をダウンロード
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* テキスト購入タブ */}
        {activeTab === "textbook" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">テキスト購入</h2>
              <p className="text-base text-gray-500 mt-1">派遣元責任者講習の公式テキストをご購入いただけます</p>
            </div>

            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-900 flex items-center gap-2 text-lg font-semibold">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  公式テキスト購入
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-5 p-5 bg-white rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-28 h-36 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200">
                      <BookOpen className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      これだけは知っておきたい 派遣元責任者に必要な基礎知識
                    </h3>
                    <p className="text-base text-gray-500 mb-2">
                      派遣元責任者講習テキスト - 最新版：2025年10月01日第11刷
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl font-bold text-blue-600">¥2,200</span>
                      <span className="text-base text-gray-500">（税込・送料込）</span>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6"
                      onClick={() => router.push("/books")}
                    >
                      <ShoppingCart className="w-5 h-5 mr-1.5" />
                      テキストを購入する
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={showPartDialog} onOpenChange={setShowPartDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedPart?.title}</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedPart?.duration}
              {selectedPart?.remaining && ` ${selectedPart.remaining}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-3">
            {selectedPart?.details?.map((detail: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="font-medium text-sm text-gray-900 border-b pb-1.5">{detail.section}</div>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside ml-2">
                  {detail.items.map((item: string, itemIdx: number) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {selectedPart?.topics && selectedPart.topics.length > 0 && (
              <div className="space-y-1.5">
                <div className="font-medium text-sm text-gray-900 border-b pb-1.5">主なトピック</div>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside ml-2">
                  {selectedPart.topics.map((topic: string, topicIdx: number) => (
                    <li key={topicIdx}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5"
                onClick={() => handleStartPart(selectedPart?.id)}
              >
                <Play className="w-4 h-4 mr-1.5" />
                {isPartCompleted(String(selectedPart?.id)) ? "復習する" : "受講開始"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ChatBotWidget />
    </div>
  )
}
