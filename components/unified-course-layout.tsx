"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  MessageCircle,
  AlertTriangle,
  Camera,
  Lock,
  Download,
  SkipForward,
  SkipBack,
  Settings,
  Subtitles,
  Send,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react"

interface UnifiedCourseLayoutProps {
  courseData: {
    title: string
    lesson: string
    instructor: string
    description: string
  }
  videoUrl?: string
  pdfUrl?: string
  courseType: "video" | "live" | "venue"
  onBack?: () => void
}

const UnifiedCourseLayout = ({
  courseData,
  videoUrl,
  pdfUrl = "/statistics-textbook-page-with-probability-distribu.jpg",
  courseType,
  onBack,
}: UnifiedCourseLayoutProps) => {
  // Video states
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(754)
  const [duration, setDuration] = useState(2700)
  const [volume, setVolume] = useState(80)
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // PDF states
  const [currentPage, setCurrentPage] = useState(4)
  const [totalPages] = useState(45)
  const [pdfZoom, setPdfZoom] = useState(100)

  // Chat states
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")

  // Monitoring states
  const [monitoringActive, setMonitoringActive] = useState(true)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)

  const videoRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && courseType === "video") {
        setIsPlaying(false)
        setTabSwitchCount((prev) => prev + 1)
        if (tabSwitchCount >= 3) {
          alert("別タブでの作業が検知されました。学習を継続するには動画に戻ってください。")
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [tabSwitchCount, courseType])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = () => {
    setError("シークバーの操作は制限されています。")
    setTimeout(() => setError(""), 3000)
  }

  const handleSpeedChange = () => {
    setError("倍速再生は制限されています。")
    setTimeout(() => setError(""), 3000)
  }

  const handleDownload = () => {
    setError("動画のダウンロードは禁止されています。")
    setTimeout(() => setError(""), 3000)
  }

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      console.log("[v0] Chat message sent:", chatMessage)
      setChatMessage("")
    }
  }

  const handlePdfNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePdfZoom = (action: "in" | "out" | "reset") => {
    if (action === "in" && pdfZoom < 200) {
      setPdfZoom(pdfZoom + 25)
    } else if (action === "out" && pdfZoom > 50) {
      setPdfZoom(pdfZoom - 25)
    } else if (action === "reset") {
      setPdfZoom(100)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{courseData.title}</h1>
            <p className="text-gray-400">{courseData.lesson}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="flex items-center gap-1">
              <Camera className="w-3 h-3" />
              監視中
            </Badge>
            <Badge variant="secondary">HD画質</Badge>
            <Button variant="outline" size="sm" onClick={onBack}>
              学習終了
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Side - Video Player */}
        <div className="w-3/5 flex flex-col min-w-0">
          <div className="flex-1 bg-black relative" ref={videoRef}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="rounded-full w-20 h-20 bg-white/20 hover:bg-white/30"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
            </div>

            {/* Monitoring Overlay */}
            {monitoringActive && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/80 px-3 py-1 rounded">
                <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
                <span className="text-sm">監視システム稼働中</span>
              </div>
            )}

            {/* Subtitles */}
            {showSubtitles && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 px-4 py-2 rounded">
                <p className="text-center">統計学の基本概念について説明します。</p>
              </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex-1 relative">
                    <Progress
                      value={(currentTime / duration) * 100}
                      className="h-2 cursor-not-allowed"
                      onClick={handleSeek}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" disabled>
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" disabled>
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-4 h-4" />
                      <div className="w-16 h-1 bg-gray-600 rounded">
                        <div className="h-full bg-white rounded" style={{ width: `${volume}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowSubtitles(!showSubtitles)}>
                      <Subtitles className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleSpeedChange}>
                      <Settings className="w-4 h-4" />
                      <Lock className="w-3 h-3 ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4" />
                      <Lock className="w-3 h-3 ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="bg-gray-800 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">{courseData.lesson}</h2>
                <p className="text-gray-400 text-sm">{courseData.description}</p>
                <p className="text-gray-500 text-xs mt-1">講師: {courseData.instructor}</p>
              </div>
              <Button variant="outline" onClick={() => setShowChat(!showChat)} className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                質問する
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - PDF Viewer */}
        <div className="w-2/5 bg-gray-800 border-l border-gray-700 flex flex-col flex-shrink-0">
          {/* PDF Header */}
          <div className="p-4 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                統計学基礎テキスト.pdf
              </h3>
              <Badge variant="outline">初回視聴モード</Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                ページ {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handlePdfZoom("out")}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span>{pdfZoom}%</span>
                <Button variant="ghost" size="sm" onClick={() => handlePdfZoom("in")}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePdfZoom("reset")}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-auto">
            <div
              className="bg-white rounded-lg shadow-lg mx-auto"
              style={{
                transform: `scale(${pdfZoom / 100})`,
                transformOrigin: "top center",
                width: "100%",
                maxWidth: "100%", // コンテナの幅を最大限活用
                minHeight: "842px",
              }}
            >
              <img
                src={pdfUrl || "/placeholder.svg"}
                alt={`Page ${currentPage}`}
                className="w-full h-auto block"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>

          {/* PDF Navigation */}
          <div className="p-4 border-t border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePdfNavigation("prev")}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                前のページ
              </Button>
              <div className="text-sm text-gray-400">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePdfNavigation("next")}
                disabled={currentPage === totalPages}
              >
                次のページ
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-56 bg-gray-800 border-l border-gray-700 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-medium">講師への質問</h3>
              <p className="text-sm text-gray-400">プライベートチャット</p>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <p className="text-sm">確率分布について質問があります。</p>
                <p className="text-xs text-gray-400 mt-1">あなた - 14:23</p>
              </div>

              <div className="bg-blue-600/20 p-3 rounded-lg">
                <p className="text-sm">確率分布は統計学の基本概念です。詳しく説明しますね。</p>
                <p className="text-xs text-gray-400 mt-1">{courseData.instructor} - 14:25</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  placeholder="質問を入力..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 min-h-[60px] bg-gray-700 border-gray-600"
                />
                <Button onClick={sendChatMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monitoring Alerts */}
      {tabSwitchCount > 0 && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              別タブでの作業が{tabSwitchCount}回検知されました。学習に集中してください。
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

export { UnifiedCourseLayout }
export default UnifiedCourseLayout
