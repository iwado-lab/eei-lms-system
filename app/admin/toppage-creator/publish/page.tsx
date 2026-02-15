"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Users, CheckCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PublishingSystem() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [approvalRequired, setApprovalRequired] = useState(true)
  const router = useRouter()

  const publishingQueue = [
    {
      id: 1,
      title: "キャンペーンバナー更新",
      type: "バナー画像",
      scheduledDate: "2025/08/25 09:00",
      status: "scheduled",
      author: "管理者",
      approver: null,
    },
    {
      id: 2,
      title: "新コース案内ページ",
      type: "フリーHTML",
      scheduledDate: "2025/08/26 10:00",
      status: "pending_approval",
      author: "管理者",
      approver: "システム管理者",
    },
  ]

  const publishingHistory = [
    {
      id: 1,
      title: "TOPページ更新",
      type: "フリーHTML",
      publishedDate: "2025/08/20 10:00",
      status: "published",
      views: 1250,
      author: "管理者",
    },
    {
      id: 2,
      title: "お知らせ一覧更新",
      type: "お知らせ",
      publishedDate: "2025/08/19 15:30",
      status: "published",
      views: 890,
      author: "管理者",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/admin/toppage-creator")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">公開管理システム</h1>
                <p className="text-gray-600">ページの公開スケジュールと承認管理</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Publishing Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  公開スケジュール
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">公開日時</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="approval"
                    checked={approvalRequired}
                    onChange={(e) => setApprovalRequired(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="approval" className="text-sm text-gray-700">
                    承認が必要
                  </label>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    即座に公開
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="w-4 h-4 mr-2" />
                    スケジュール公開
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    プレビュー
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>公開統計</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">公開中ページ</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">予約公開</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">承認待ち</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">総ビュー数</span>
                    <span className="font-medium">4,140</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Publishing Queue and History */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  公開予約キュー
                </CardTitle>
                <CardDescription>スケジュールされた公開待ちのページ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publishingQueue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{item.type}</span>
                            <span>•</span>
                            <span>{item.scheduledDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === "pending_approval" ? (
                          <Badge className="bg-blue-100 text-blue-800">承認待ち</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">予約済み</Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          編集
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  公開履歴
                </CardTitle>
                <CardDescription>最近公開されたページの履歴</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publishingHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{item.type}</span>
                            <span>•</span>
                            <span>{item.publishedDate}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{item.views} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">公開中</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
