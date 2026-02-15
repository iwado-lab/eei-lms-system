"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Filter,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Mail,
  LogOut,
} from "lucide-react"
import { Logo } from "@/components/logo"

export default function SubAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    router.push("/")
  }

  const limitedFeatures = [
    { icon: Users, title: "受講生管理", description: "受講生の基本情報確認・進捗確認", enabled: true },
    { icon: BookOpen, title: "コース確認", description: "コース内容の確認（編集不可）", enabled: true },
    { icon: BarChart3, title: "基本レポート", description: "進捗レポートの確認", enabled: true },
    { icon: Mail, title: "通知送信", description: "受講生への通知送信", enabled: true },
    { icon: Settings, title: "システム設定", description: "システム設定の変更", enabled: false },
    { icon: Download, title: "データエクスポート", description: "全データのエクスポート", enabled: false },
  ]

  const students = [
    {
      id: 1,
      name: "田中太郎",
      email: "tanaka@example.com",
      course: "プログラミング基礎",
      progress: 75,
      status: "受講中",
    },
    { id: 2, name: "佐藤花子", email: "sato@example.com", course: "データ分析入門", progress: 100, status: "完了" },
    { id: 3, name: "山田次郎", email: "yamada@example.com", course: "ビジネス英語", progress: 45, status: "受講中" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              {/* </CHANGE> */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">サブ管理ダッシュボード</h1>
                <p className="text-gray-600">限定された管理機能を利用できます</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <UserCheck className="w-4 h-4 mr-1" />
                サブ管理者
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-orange-600">サ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">管理対象受講生</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">確認可能コース</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">未対応質問</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">今月の完了者</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">受講生管理</TabsTrigger>
            <TabsTrigger value="courses">コース確認</TabsTrigger>
            <TabsTrigger value="reports">レポート</TabsTrigger>
            <TabsTrigger value="permissions">権限確認</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>受講生一覧</CardTitle>
                <CardDescription>管理対象の受講生の進捗を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="受講生を検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    フィルタ
                  </Button>
                </div>

                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <p className="text-sm text-gray-600">{student.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">進捗: {student.progress}%</p>
                          <Badge variant={student.status === "完了" ? "default" : "secondary"}>{student.status}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          詳細
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>コース確認</CardTitle>
                <CardDescription>コース内容を確認できます（編集権限なし）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">コース確認機能は開発中です</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>基本レポート</CardTitle>
                <CardDescription>受講生の進捗レポートを確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">レポート機能は開発中です</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>権限確認</CardTitle>
                <CardDescription>サブ管理者として利用可能な機能を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {limitedFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${feature.enabled ? "bg-blue-50 border-blue-200" : "bg-blue-50 border-blue-200"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <feature.icon className={`w-6 h-6 ${feature.enabled ? "text-blue-600" : "text-blue-600"}`} />
                        <div className="flex-1">
                          <h3 className="font-medium">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                        {feature.enabled ? (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
