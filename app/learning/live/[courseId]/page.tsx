"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Video, VideoOff, Mic, MicOff, Users, Camera, Clock } from "lucide-react"
import UnifiedCourseLayout from "@/components/unified-course-layout"

export default function LiveLearningPage({ params }: { params: { courseId: string } }) {
  const [isJoined, setIsJoined] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [participants, setParticipants] = useState(12)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "田中講師", message: "皆さん、こんばんは！", time: "19:00", isInstructor: true },
    { id: 2, user: "山田", message: "よろしくお願いします", time: "19:01", isInstructor: false },
    { id: 3, user: "佐藤", message: "音声は聞こえています", time: "19:02", isInstructor: false },
  ])

  const liveData = {
    title: "ビジネス英語 - 実践会話",
    instructor: "田中講師",
    scheduledTime: "2025年8月25日 19:00-21:00",
    currentTime: "19:15",
    duration: "120分",
    description: "実際のビジネスシーンで使える英語表現を学習します。",
    zoomMeetingId: "123-456-789",
    passcode: "GLX2025",
  }

  const courseData = {
    title: liveData.title,
    lesson: "ライブセッション",
    instructor: liveData.instructor,
    description: liveData.description,
  }

  const joinMeeting = () => {
    setIsJoined(true)
    console.log("[v0] Joining ZOOM meeting:", liveData.zoomMeetingId)
  }

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: "あなた",
        message: chatMessage,
        time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
        isInstructor: false,
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")
    }
  }

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised)
    if (!isHandRaised) {
      console.log("[v0] Hand raised for question")
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  if (isJoined) {
    return (
      <UnifiedCourseLayout
        courseData={courseData}
        courseType="live"
        pdfUrl="/statistics-textbook-page-with-probability-distribu.jpg"
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{liveData.title}</h1>
            <p className="text-gray-400">講師: {liveData.instructor}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="animate-pulse">
              <div className="w-2 h-2 bg-red-300 rounded-full mr-1" />
              LIVE
            </Badge>
            <Badge variant="secondary">
              <Users className="w-3 h-3 mr-1" />
              {participants}名参加中
            </Badge>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {liveData.currentTime}
            </Badge>
          </div>
        </div>
      </header>

      {/* Pre-join Screen */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">ライブ講習に参加</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{liveData.title}</h3>
              <p className="text-gray-400 text-sm">{liveData.description}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">開催時間:</span>
                <span className="text-white">{liveData.scheduledTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">予定時間:</span>
                <span className="text-white">{liveData.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ミーティングID:</span>
                <span className="text-white">{liveData.zoomMeetingId}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsVideoOn(!isVideoOn)}>
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
            </div>

            <Button onClick={joinMeeting} className="w-full bg-blue-600 hover:bg-blue-700">
              <Video className="w-4 h-4 mr-2" />
              ライブ講習に参加
            </Button>

            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription className="text-gray-300">
                参加時にカメラとマイクの使用許可が求められます。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
