"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Calendar, Clock, Users, QrCode, CheckCircle, Camera, Download, Mail } from "lucide-react"
import UnifiedCourseLayout from "@/components/unified-course-layout"

export default function VenueLearningPage({ params }: { params: { courseId: string } }) {
  const [attendanceStatus, setAttendanceStatus] = useState<"pending" | "checked_in" | "completed">("pending")
  const [qrScanned, setQrScanned] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [showLearningInterface, setShowLearningInterface] = useState(false)

  const venueData = {
    title: "AI基礎セミナー",
    instructor: "鈴木講師",
    venue: "東京会場 - GLX研修センター",
    address: "東京都渋谷区○○ 1-2-3 GLXビル 5F",
    date: "2025年9月15日（月）",
    time: "10:00 - 17:00",
    capacity: 30,
    registered: 28,
    description: "AI技術の基礎から実践的な応用まで、1日集中で学習します。",
    requirements: ["本人確認書類の持参", "ノートPC持参（推奨）", "事前課題の完了"],
    schedule: [
      { time: "10:00-10:30", content: "受付・開講挨拶" },
      { time: "10:30-12:00", content: "AI基礎理論" },
      { time: "13:00-14:30", content: "機械学習入門" },
      { time: "14:45-16:15", content: "実践演習" },
      { time: "16:15-17:00", content: "まとめ・修了証授与" },
    ],
  }

  const courseData = {
    title: venueData.title,
    lesson: "会場受講セッション",
    instructor: venueData.instructor,
    description: venueData.description,
  }

  const handleQRScan = () => {
    // Simulate QR code scanning
    setQrScanned(true)
    setAttendanceStatus("checked_in")
    setShowLearningInterface(true)

    // Simulate certificate availability after course completion
    setTimeout(() => {
      setAttendanceStatus("completed")
      setShowCertificate(true)
    }, 5000) // Simulate 5 seconds for demo
  }

  const handleCertificateDownload = () => {
    // Simulate certificate download
    alert("修了証をダウンロードしました")
  }

  const handleBack = () => {
    setShowLearningInterface(false)
    setQrScanned(false)
    setAttendanceStatus("pending")
  }

  if (showLearningInterface) {
    return (
      <UnifiedCourseLayout
        courseData={courseData}
        courseType="venue"
        pdfUrl="/statistics-textbook-page-with-probability-distribu.jpg"
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{venueData.title}</h1>
          <p className="text-gray-600">{venueData.description}</p>
        </div>

        {/* Status Alert */}
        {attendanceStatus === "pending" && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              会場での受講が予定されています。開始時刻の30分前までに会場にお越しください。
            </AlertDescription>
          </Alert>
        )}

        {attendanceStatus === "checked_in" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              出席確認が完了しました。講習終了後に修了証がダウンロード可能になります。
            </AlertDescription>
          </Alert>
        )}

        {attendanceStatus === "completed" && showCertificate && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>講習が完了しました。修了証をダウンロードできます。</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Venue Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                会場情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{venueData.venue}</h3>
                <p className="text-sm text-gray-600">{venueData.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{venueData.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{venueData.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm">
                    定員: {venueData.capacity}名 / 申込: {venueData.registered}名
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(venueData.registered / venueData.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">持参物・要件</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {venueData.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  会場に連絡
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  地図を見る
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                当日スケジュール
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {venueData.schedule.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-600 min-w-[80px]">{item.time}</div>
                    <div className="text-sm">{item.content}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-600" />
              出席確認
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!qrScanned ? (
              <div className="text-center py-8">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">会場に設置されたQRコードをスキャンして出席確認を行ってください</p>
                <Button onClick={handleQRScan} className="bg-purple-600 hover:bg-purple-700">
                  <Camera className="w-4 h-4 mr-2" />
                  QRコードをスキャン
                </Button>
                <p className="text-xs text-gray-500 mt-2">※本人確認書類の提示が必要です</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-blue-800 mb-2">出席確認完了</h3>
                <p className="text-gray-600">出席が正常に記録されました。講習終了まで会場でお待ちください。</p>
                {attendanceStatus === "completed" && (
                  <div className="mt-6">
                    <Badge className="bg-blue-100 text-blue-800 mb-4">講習完了</Badge>
                    <div>
                      <Button onClick={handleCertificateDownload} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        修了証をダウンロード
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructor Info */}
        <Card>
          <CardHeader>
            <CardTitle>講師情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">鈴</span>
              </div>
              <div>
                <h3 className="font-medium">{venueData.instructor}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  AI・機械学習分野の専門家。大手IT企業での実務経験を活かし、 実践的な指導を行います。
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">AI専門家</Badge>
                  <Badge variant="outline">実務経験15年</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
