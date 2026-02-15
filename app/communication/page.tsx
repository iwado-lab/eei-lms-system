"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Mail,
  MessageCircle,
  Send,
  Phone,
  Users,
  Settings,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Megaphone,
  HelpCircle,
  Star,
  Paperclip,
  Smile,
} from "lucide-react"

export default function CommunicationSystem() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [newMessage, setNewMessage] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState("")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "system",
      title: "システムメンテナンスのお知らせ",
      message: "2025年8月15日 2:00-4:00にシステムメンテナンスを実施します",
      timestamp: "2時間前",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "course",
      title: "新しいコースが追加されました",
      message: "AI基礎講座の受講が開始できます",
      timestamp: "4時間前",
      read: true,
      priority: "medium",
    },
    {
      id: 3,
      type: "payment",
      title: "お支払い完了のお知らせ",
      message: "データ分析講座の受講料のお支払いが完了しました",
      timestamp: "1日前",
      read: true,
      priority: "low",
    },
  ])

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "田中先生",
      senderRole: "講師",
      message: "JavaScriptのPromiseについて質問があります。thenとcatchの使い方がよくわかりません。",
      timestamp: "10:30",
      avatar: "/placeholder.svg?height=32&width=32",
      isInstructor: true,
      attachments: [],
    },
    {
      id: 2,
      sender: "山田太郎",
      senderRole: "受講者",
      message:
        "Promiseは非同期処理を扱うためのオブジェクトです。thenメソッドで成功時の処理を、catchメソッドで失敗時の処理を定義できます。",
      timestamp: "10:35",
      avatar: "/placeholder.svg?height=32&width=32",
      isInstructor: false,
      attachments: ["sample-code.js"],
    },
  ])

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: "受講開始通知",
      subject: "【GLX】コース受講開始のお知らせ",
      content: "{{受講者名}}様\n\nコース「{{コース名}}」の受講が開始されました。",
      category: "course",
      usage: 1250,
    },
    {
      id: 2,
      name: "修了証発行通知",
      subject: "【GLX】修了証発行完了のお知らせ",
      content: "{{受講者名}}様\n\n修了証の発行が完了しました。",
      category: "certificate",
      usage: 890,
    },
    {
      id: 3,
      name: "支払い確認通知",
      subject: "【GLX】お支払い確認のお知らせ",
      content: "{{受講者名}}様\n\nお支払いを確認いたしました。",
      category: "payment",
      usage: 2100,
    },
  ])

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "夏季休業期間のお知らせ",
      content: "8月13日〜8月16日は夏季休業とさせていただきます。",
      author: "システム管理者",
      publishDate: "2025-08-01",
      priority: "high",
      targetAudience: "all",
      views: 1247,
      status: "published",
    },
    {
      id: 2,
      title: "新機能リリースのお知らせ",
      content: "チャット機能とリアルタイム通知機能をリリースしました。",
      author: "開発チーム",
      publishDate: "2025-07-28",
      priority: "medium",
      targetAudience: "students",
      views: 892,
      status: "published",
    },
  ])

  const [faqItems, setFaqItems] = useState([
    {
      id: 1,
      question: "受講料の支払い方法を教えてください",
      answer: "クレジットカード、コンビニ決済、銀行振込に対応しています。",
      category: "payment",
      views: 1500,
      helpful: 145,
      lastUpdated: "2025-07-15",
    },
    {
      id: 2,
      question: "修了証はいつ発行されますか？",
      answer: "全ての課題と試験に合格後、自動的に発行されます。",
      category: "certificate",
      views: 1200,
      helpful: 98,
      lastUpdated: "2025-07-10",
    },
  ])

  const notificationSettings = {
    email: {
      courseStart: true,
      courseComplete: true,
      examResults: true,
      paymentConfirm: true,
      systemMaintenance: true,
      marketing: false,
    },
    push: {
      newMessages: true,
      announcements: true,
      deadlineReminders: true,
      liveClassStart: true,
    },
    sms: {
      emergencyOnly: true,
      authenticationCodes: true,
      paymentReminders: false,
    },
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "現在のユーザー",
        senderRole: "受講者",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "/placeholder.svg?height=32&width=32",
        isInstructor: false,
        attachments: [],
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const markAsRead = (notificationId: number) => {
    setNotifications(notifications.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold">GLX</span>
            </div>
            <Badge variant="secondary">コミュニケーション</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              通知設定
            </Button>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">管</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">コミュニケーション・通知システム</h1>
          <p className="text-gray-600">受講者と講師間のコミュニケーション、システム通知、お知らせ管理</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="notifications">通知</TabsTrigger>
            <TabsTrigger value="chat">チャット</TabsTrigger>
            <TabsTrigger value="announcements">お知らせ</TabsTrigger>
            <TabsTrigger value="email">メール管理</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        通知一覧
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-1" />
                          フィルタ
                        </Button>
                        <Button variant="outline" size="sm">
                          すべて既読
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            notification.read ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                  notification.priority === "high"
                                    ? "bg-blue-500"
                                    : notification.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                }`}
                              ></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-sm">{notification.title}</h3>
                                  {!notification.read && (
                                    <Badge className="bg-blue-100 text-blue-700 text-xs">新着</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {notification.type === "system"
                                      ? "システム"
                                      : notification.type === "course"
                                        ? "コース"
                                        : "決済"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
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

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">通知統計</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>未読通知</span>
                        <span className="font-medium text-blue-600">3件</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>今日の通知</span>
                        <span className="font-medium">8件</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>今週の通知</span>
                        <span className="font-medium">24件</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">クイックアクション</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <Megaphone className="w-4 h-4 mr-2" />
                        お知らせ作成
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        一斉メール送信
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        通知設定
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">チャットルーム</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">講師連絡室</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">田中先生、佐藤先生</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-medium">質問・相談</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">一般的な質問</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm font-medium">受講者同士</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">グループディスカッション</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        講師連絡室
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-700">オンライン</Badge>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-1" />
                          参加者
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 h-96 overflow-y-auto mb-4">
                      {messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.sender}</span>
                              <Badge variant="outline" className="text-xs">
                                {message.senderRole}
                              </Badge>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm">{message.message}</p>
                              {message.attachments.length > 0 && (
                                <div className="mt-2">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs text-blue-600">
                                      <Paperclip className="w-3 h-3" />
                                      <span>{attachment}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="メッセージを入力..."
                          className="resize-none"
                          rows={2}
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Smile className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-orange-600" />
                    お知らせ・掲示板管理
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新規お知らせ作成
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{announcement.title}</h3>
                            <Badge
                              className={`text-xs ${
                                announcement.priority === "high"
                                  ? "bg-blue-100 text-blue-700"
                                  : announcement.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {announcement.priority === "high"
                                ? "重要"
                                : announcement.priority === "medium"
                                  ? "通常"
                                  : "参考"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {announcement.targetAudience === "all"
                                ? "全員"
                                : announcement.targetAudience === "students"
                                  ? "受講者"
                                  : "講師"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{announcement.content}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>投稿者: {announcement.author}</span>
                            <span>公開日: {announcement.publishDate}</span>
                            <span>閲覧数: {announcement.views}回</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    メールテンプレート管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emailTemplates.map((template) => (
                      <div key={template.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">{template.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{template.subject}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>使用回数: {template.usage}回</span>
                          <Button variant="outline" size="sm">
                            プレビュー
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    新規テンプレート作成
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">一斉メール送信</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">送信対象</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="送信対象を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全受講者</SelectItem>
                          <SelectItem value="active">アクティブ受講者</SelectItem>
                          <SelectItem value="course">特定コース受講者</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">テンプレート</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="テンプレートを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">受講開始通知</SelectItem>
                          <SelectItem value="2">修了証発行通知</SelectItem>
                          <SelectItem value="3">支払い確認通知</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">件名</label>
                      <Input className="mt-1" placeholder="メール件名を入力" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">本文</label>
                      <Textarea className="mt-1" rows={6} placeholder="メール本文を入力" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="schedule" />
                      <label htmlFor="schedule" className="text-xs">
                        送信予約
                      </label>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      メール送信
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    FAQ管理・質問回答システム
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    FAQ追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((faq) => (
                    <div key={faq.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm mb-2">{faq.question}</h3>
                          <p className="text-sm text-gray-600 mb-3">{faq.answer}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>カテゴリ: {faq.category}</span>
                            <span>閲覧数: {faq.views}回</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>役立った: {faq.helpful}人</span>
                            </div>
                            <span>更新日: {faq.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    メール通知設定
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">コース開始通知</div>
                        <div className="text-xs text-gray-600">新しいコースが開始された時</div>
                      </div>
                      <Checkbox checked={notificationSettings.email.courseStart} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">コース完了通知</div>
                        <div className="text-xs text-gray-600">コースを完了した時</div>
                      </div>
                      <Checkbox checked={notificationSettings.email.courseComplete} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">試験結果通知</div>
                        <div className="text-xs text-gray-600">試験結果が出た時</div>
                      </div>
                      <Checkbox checked={notificationSettings.email.examResults} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">支払い確認通知</div>
                        <div className="text-xs text-gray-600">支払いが確認された時</div>
                      </div>
                      <Checkbox checked={notificationSettings.email.paymentConfirm} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">システムメンテナンス</div>
                        <div className="text-xs text-gray-600">メンテナンス情報</div>
                      </div>
                      <Checkbox checked={notificationSettings.email.systemMaintenance} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">マーケティング情報</div>
                        <div className="text-xs text-gray-600">新サービスやキャンペーン情報</div>
                      </div>
                      <Checkbox checked={notificationSettings.email.marketing} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    プッシュ通知設定
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">新着メッセージ</div>
                        <div className="text-xs text-gray-600">チャットに新しいメッセージが届いた時</div>
                      </div>
                      <Checkbox checked={notificationSettings.push.newMessages} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">お知らせ</div>
                        <div className="text-xs text-gray-600">重要なお知らせが投稿された時</div>
                      </div>
                      <Checkbox checked={notificationSettings.push.announcements} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">期限リマインダー</div>
                        <div className="text-xs text-gray-600">課題や試験の期限が近づいた時</div>
                      </div>
                      <Checkbox checked={notificationSettings.push.deadlineReminders} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">ライブ授業開始</div>
                        <div className="text-xs text-gray-600">ライブ授業が開始される時</div>
                      </div>
                      <Checkbox checked={notificationSettings.push.liveClassStart} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    SMS通知設定
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">緊急時のみ</div>
                        <div className="text-xs text-gray-600">システム障害など緊急時のみ</div>
                      </div>
                      <Checkbox checked={notificationSettings.sms.emergencyOnly} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">認証コード</div>
                        <div className="text-xs text-gray-600">ログイン時の認証コード</div>
                      </div>
                      <Checkbox checked={notificationSettings.sms.authenticationCodes} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">支払いリマインダー</div>
                        <div className="text-xs text-gray-600">支払い期限のリマインダー</div>
                      </div>
                      <Checkbox checked={notificationSettings.sms.paymentReminders} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">通知頻度設定</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">メール配信頻度</label>
                      <Select defaultValue="immediate">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">即座に送信</SelectItem>
                          <SelectItem value="daily">1日1回まとめて</SelectItem>
                          <SelectItem value="weekly">週1回まとめて</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">プッシュ通知時間</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Input type="time" defaultValue="09:00" />
                        <Input type="time" defaultValue="21:00" />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">この時間帯のみ通知を受信</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-center text-xs text-gray-500 py-4 border-t">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
          <span>リアルタイム通知・メール配信・チャット機能完備</span>
          <span>セキュリティ対応・プライバシー保護・GDPR準拠</span>
        </div>
      </div>
    </div>
  )
}
