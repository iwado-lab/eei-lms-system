"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import {
  BookOpen,
  TrendingUp,
  Users,
  Download,
  Filter,
  Plus,
  Edit,
  FileText,
  Shield,
  BarChart3,
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  Globe,
  Target,
  Zap,
  Brain,
  Eye,
} from "lucide-react"

export default function AnalyticsSystem() {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedView, setSelectedView] = useState("monthly")
  const [activeTab, setActiveTab] = useState("overview")
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    ongoingLessons: 89,
    completedToday: 156,
    revenue: 45600,
  })

  const courses = [
    {
      id: 1,
      name: "初級データ分析講座",
      status: "公開中",
      students: 124,
      deadline: "2025/12/31",
      statusColor: "green",
      completionRate: 78,
      averageScore: 85,
      revenue: 2480000,
      region: "関東",
      category: "データサイエンス",
    },
    {
      id: 2,
      name: "AI基礎知識講座",
      status: "準備中",
      students: 57,
      deadline: "2026/03/15",
      statusColor: "blue",
      completionRate: 0,
      averageScore: 0,
      revenue: 0,
      region: "関西",
      category: "AI・機械学習",
    },
    {
      id: 3,
      name: "Webセキュリティ入門",
      status: "終了",
      students: 86,
      deadline: "2025/09/30",
      statusColor: "gray",
      completionRate: 92,
      averageScore: 88,
      revenue: 1720000,
      region: "全国",
      category: "セキュリティ",
    },
  ]

  const salesData = [
    { month: "1月", sales: 95, growth: 8.5, forecast: 98, target: 100 },
    { month: "2月", sales: 110, growth: 15.8, forecast: 115, target: 105 },
    { month: "3月", sales: 98, growth: 3.2, forecast: 102, target: 110 },
    { month: "4月", sales: 135, growth: 37.8, forecast: 140, target: 115 },
    { month: "5月", sales: 142, growth: 5.2, forecast: 145, target: 120 },
    { month: "6月", sales: 155, growth: 9.2, forecast: 160, target: 125 },
    { month: "7月", sales: 148, growth: -4.5, forecast: 152, target: 130 },
    { month: "8月", sales: 168, growth: 13.5, forecast: 175, target: 135 },
  ]

  const progressData = [
    { name: "完了", value: 68, color: "#10b981" },
    { name: "進行中", value: 22, color: "#3b82f6" },
    { name: "未開始", value: 10, color: "#f59e0b" },
  ]

  const regionData = [
    { region: "関東", students: 456, revenue: 9120000, growth: 12.5 },
    { region: "関西", students: 298, revenue: 5960000, growth: 8.3 },
    { region: "中部", students: 187, revenue: 3740000, growth: 15.2 },
    { region: "九州", students: 156, revenue: 3120000, growth: 6.8 },
    { region: "東北", students: 134, revenue: 2680000, growth: 9.1 },
    { region: "その他", students: 227, revenue: 4540000, growth: 11.7 },
  ]

  const deviceData = [
    { device: "PC", users: 65, color: "#8b5cf6" },
    { device: "スマートフォン", users: 28, color: "#06b6d4" },
    { device: "タブレット", users: 7, color: "#f59e0b" },
  ]

  const timeData = [
    { time: "6-9", users: 15 },
    { time: "9-12", users: 35 },
    { time: "12-15", users: 25 },
    { time: "15-18", users: 20 },
    { time: "18-21", users: 45 },
    { time: "21-24", users: 30 },
    { time: "0-6", users: 5 },
  ]

  const alerts = [
    { id: 1, type: "warning", message: "コース完了率が目標を下回っています", course: "AI基礎講座", time: "2時間前" },
    { id: 2, type: "success", message: "月間売上目標を達成しました", amount: "¥12,458,000", time: "4時間前" },
    { id: 3, type: "info", message: "新規受講者が急増しています", count: "124名", time: "6時間前" },
  ]

  const exportOptions = [
    { id: "students", label: "受講者リスト", icon: Users, color: "blue", formats: ["CSV", "Excel", "PDF"] },
    { id: "grades", label: "成績データ", icon: BarChart3, color: "green", formats: ["CSV", "Excel"] },
    { id: "stats", label: "受講統計", icon: TrendingUp, color: "purple", formats: ["PDF", "PowerPoint"] },
    { id: "financial", label: "売上レポート", icon: TrendingUp, color: "orange", formats: ["Excel", "PDF"] },
    { id: "engagement", label: "エンゲージメント分析", icon: Eye, color: "teal", formats: ["CSV", "PDF"] },
  ]

  const permissions = {
    スクール管理者: {
      userManagement: true,
      courseManagement: true,
      salesAnalysis: true,
      systemSettings: false,
      dataExport: true,
      reporting: true,
    },
    講師: {
      userManagement: false,
      courseManagement: true,
      salesAnalysis: false,
      systemSettings: false,
      dataExport: false,
      reporting: true,
    },
    サブ管理者: {
      userManagement: true,
      courseManagement: false,
      salesAnalysis: true,
      systemSettings: false,
      dataExport: true,
      reporting: true,
    },
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        ongoingLessons: prev.ongoingLessons + Math.floor(Math.random() * 6 - 3),
        completedToday: prev.completedToday + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 1000 - 500),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold">GLX</span>
            </div>
            <Badge variant="secondary">管理者側</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              レポート配信設定
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              一括エクスポート
            </Button>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">管</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">管理者側：コース・進捗・請求・分析UI</h1>
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-100 text-blue-700">
              <Zap className="w-3 h-3 mr-1" />
              リアルタイム更新中
            </Badge>
            <span className="text-sm text-gray-600">最終更新: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="courses">コース管理</TabsTrigger>
            <TabsTrigger value="sales">売上分析</TabsTrigger>
            <TabsTrigger value="students">受講者分析</TabsTrigger>
            <TabsTrigger value="reports">レポート</TabsTrigger>
            <TabsTrigger value="predictions">予測分析</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Real-time Dashboard */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">アクティブユーザー</p>
                      <p className="text-2xl font-bold text-blue-600">{realTimeData.activeUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">+5.2%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">進行中レッスン</p>
                      <p className="text-2xl font-bold text-blue-600">{realTimeData.ongoingLessons}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">リアルタイム</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">本日完了</p>
                      <p className="text-2xl font-bold text-blue-600">{realTimeData.completedToday}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">+12.8%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">本日売上</p>
                      <p className="text-2xl font-bold text-orange-600">¥{realTimeData.revenue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600">目標達成</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  アラート・通知
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.type === "warning"
                          ? "bg-blue-50 border-blue-400"
                          : alert.type === "success"
                            ? "bg-blue-50 border-blue-400"
                            : "bg-blue-50 border-blue-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {alert.type === "warning" && <AlertTriangle className="w-4 h-4 text-blue-600" />}
                          {alert.type === "success" && <Target className="w-4 h-4 text-blue-600" />}
                          {alert.type === "info" && <TrendingUp className="w-4 h-4 text-blue-600" />}
                          <span className="text-sm font-medium">{alert.message}</span>
                        </div>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      {alert.course && <div className="text-xs text-gray-600 mt-1">対象: {alert.course}</div>}
                      {alert.amount && <div className="text-xs text-gray-600 mt-1">金額: {alert.amount}</div>}
                      {alert.count && <div className="text-xs text-gray-600 mt-1">人数: {alert.count}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Analytics */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>地域別分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {regionData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{region.students}名</div>
                          <div className="text-xs text-gray-600">+{region.growth}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>デバイス別利用状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="users"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {deviceData.map((device, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                        <span className="text-sm">
                          {device.device}: {device.users}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    コース管理ダッシュボード
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      新規作成
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-1" />
                      フィルタ
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
                    <span>コース名</span>
                    <span>ステータス</span>
                    <span>受講者数</span>
                    <span>完了率</span>
                    <span>平均点</span>
                    <span>売上</span>
                    <span>操作</span>
                  </div>
                  {courses.map((course) => (
                    <div key={course.id} className="grid grid-cols-7 gap-4 items-center py-2">
                      <div className="font-medium text-sm">{course.name}</div>
                      <Badge
                        variant={course.statusColor === "green" ? "default" : "secondary"}
                        className={`w-fit text-xs ${
                          course.statusColor === "green"
                            ? "bg-blue-100 text-blue-700"
                            : course.statusColor === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {course.status}
                      </Badge>
                      <div className="text-sm">{course.students}名</div>
                      <div className="text-sm">{course.completionRate}%</div>
                      <div className="text-sm">{course.averageScore}点</div>
                      <div className="text-sm">¥{course.revenue.toLocaleString()}</div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    売上管理・分析
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025年</SelectItem>
                        <SelectItem value="2024">2024年</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      月次表示
                    </Button>
                    <Button variant="outline" size="sm">
                      四半期表示
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      CSVエクスポート
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stackId="2"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.3}
                      />
                      <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">¥12,458,000</div>
                    <div className="text-sm text-gray-600">月次売上</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">+8.3%</div>
                    <div className="text-sm text-gray-600">前年比</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">124名</div>
                    <div className="text-sm text-gray-600">新規受講者</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">AI予測</div>
                    <div className="text-sm text-gray-600">次月売上予測</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  受講者進捗分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-3">コース完了率</div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={progressData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {progressData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>受講完了</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>試験通過率</span>
                        <span className="font-medium">74%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "74%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>再受講率</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: "12%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium mb-3">時間帯別アクセス分析</div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  データエクスポート・レポート生成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-sm font-medium">エクスポート可能データ</div>
                    {exportOptions.map((option) => (
                      <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <option.icon className={`w-5 h-5 text-${option.color}-600`} />
                          <div>
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-gray-600">対応形式: {option.formats.join(", ")}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="text-sm font-medium">カスタムレポート設定</div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700">期間指定</label>
                        <div className="flex gap-2 mt-1">
                          <Input type="date" className="text-sm" />
                          <span className="text-sm text-gray-500 self-center">〜</span>
                          <Input type="date" className="text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700">対象コース</label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="すべてのコース" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">すべてのコース</SelectItem>
                            <SelectItem value="data">データ分析講座</SelectItem>
                            <SelectItem value="ai">AI基礎講座</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700">配信設定</label>
                        <div className="space-y-2 mt-1">
                          <div className="flex items-center gap-2">
                            <Checkbox id="auto-send" />
                            <label htmlFor="auto-send" className="text-sm">
                              自動配信
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="weekly" />
                            <label htmlFor="weekly" className="text-sm">
                              週次レポート
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="monthly" />
                            <label htmlFor="monthly" className="text-sm">
                              月次レポート
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      <FileText className="w-4 h-4 mr-2" />
                      カスタムレポート生成
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI予測分析・トレンド予測
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-3">売上予測 (次3ヶ月)</div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={salesData.slice(-3).concat([
                            { month: "9月", sales: null, forecast: 172 },
                            { month: "10月", sales: null, forecast: 185 },
                            { month: "11月", sales: null, forecast: 178 },
                          ])}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} />
                          <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke="#06b6d4"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">AI予測結果</div>
                      <div className="text-xs text-blue-700 mt-1">
                        • 次月売上予測: ¥17,200,000 (信頼度: 87%) • 成長率予測: +2.4% • 推奨アクション:
                        マーケティング強化
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-3">受講者動向予測</div>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">新規受講者増加予測</span>
                        </div>
                        <div className="text-xs text-blue-700 mt-1">次月: +15% (約186名の新規受講者)</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">離脱リスク予測</span>
                        </div>
                        <div className="text-xs text-blue-700 mt-1">高リスク受講者: 23名 (早期フォロー推奨)</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">完了率予測</span>
                        </div>
                        <div className="text-xs text-blue-700 mt-1">今月完了予測: 72% (目標: 70%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  権限設定・システム管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-medium mb-3">管理者権限グループ</div>
                    <Button variant="outline" className="w-full mb-4 bg-transparent">
                      <Plus className="w-4 h-4 mr-2" />
                      新規グループ追加
                    </Button>
                    <div className="space-y-4">
                      {Object.entries(permissions).map(([role, perms]) => (
                        <div key={role} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">{role}</div>
                            <Button variant="outline" size="sm">
                              編集
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Checkbox checked={perms.userManagement} />
                              <span>ユーザー管理</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox checked={perms.courseManagement} />
                              <span>コース管理</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox checked={perms.salesAnalysis} />
                              <span>売上分析</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox checked={perms.systemSettings} />
                              <span>システム設定</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox checked={perms.dataExport} />
                              <span>データエクスポート</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox checked={perms.reporting} />
                              <span>レポート機能</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-center text-xs text-gray-500 py-4 border-t">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
          <span>管理者権限レベルに応じて利用可能な機能が制御されます</span>
          <span>データセキュリティ対応、アクセスログ記録、AI予測分析機能搭載</span>
        </div>
      </div>
    </div>
  )
}
