"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Upload, Download, Plus, Trash2, Edit, RefreshCw, Link, FileSpreadsheet, Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ja } from "date-fns/locale"

// 講習パターンの型定義
type CoursePattern = "standard" | "practical" | "advanced" | "refresher"

const coursePatternLabels: Record<CoursePattern, string> = {
  standard: "通常",
  practical: "実践編",
  advanced: "応用編",
  refresher: "更新講習",
}

// 講習日程の型定義
interface LectureSchedule {
  id: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  type: "online" | "venue" | "live"
  coursePattern: CoursePattern // 講習パターン
  courseName: string
  courseId: string
  capacity: number
  enrolled: number
  applicationDeadline: string // YYYY-MM-DD
  status: "open" | "closed" | "full" | "cancelled"
  externalId?: string // 基幹システムのID
  allowPatternSelect: boolean // 受講者が実践編を選択可能か
}

// APIエンドポイント設定の型
interface ApiConfig {
  endpoint: string
  apiKey: string
  syncInterval: number // 分
  lastSync?: string
  isEnabled: boolean
}

// サンプルデータ
const initialSchedules: LectureSchedule[] = [
  {
    id: "1",
    date: "2026-01-26",
    startTime: "07:00",
    endTime: "19:00",
    type: "online",
    coursePattern: "standard",
    courseName: "派遣元責任者講習",
    courseId: "1",
    capacity: 120,
    enrolled: 120,
    applicationDeadline: "2026-01-20",
    status: "closed",
    externalId: "EXT-001",
    allowPatternSelect: true,
  },
  {
    id: "2",
    date: "2026-01-28",
    startTime: "07:00",
    endTime: "19:00",
    type: "online",
    coursePattern: "standard",
    courseName: "派遣元責任者講習",
    courseId: "1",
    capacity: 120,
    enrolled: 85,
    applicationDeadline: "2026-01-22",
    status: "open",
    externalId: "EXT-002",
    allowPatternSelect: true,
  },
  {
    id: "3",
    date: "2026-02-04",
    startTime: "09:00",
    endTime: "17:00",
    type: "online",
    coursePattern: "practical",
    courseName: "派遣元責任者講習（実践編）",
    courseId: "2",
    capacity: 80,
    enrolled: 42,
    applicationDeadline: "2026-01-29",
    status: "open",
    externalId: "EXT-003",
    allowPatternSelect: false,
  },
  {
    id: "4",
    date: "2026-02-04",
    startTime: "07:00",
    endTime: "19:00",
    type: "online",
    coursePattern: "standard",
    courseName: "派遣元責任者講習",
    courseId: "1",
    capacity: 120,
    enrolled: 30,
    applicationDeadline: "2026-01-29",
    status: "open",
    externalId: "EXT-004",
    allowPatternSelect: true,
  },
  {
    id: "5",
    date: "2026-02-06",
    startTime: "07:00",
    endTime: "19:00",
    type: "online",
    coursePattern: "standard",
    courseName: "派遣元責任者講習",
    courseId: "1",
    capacity: 120,
    enrolled: 0,
    applicationDeadline: "2026-02-02",
    status: "open",
    externalId: "EXT-005",
    allowPatternSelect: true,
  },
  {
    id: "6",
    date: "2026-02-10",
    startTime: "10:00",
    endTime: "16:00",
    type: "online",
    coursePattern: "refresher",
    courseName: "派遣元責任者講習（更新）",
    courseId: "3",
    capacity: 60,
    enrolled: 15,
    applicationDeadline: "2026-02-06",
    status: "open",
    externalId: "EXT-006",
    allowPatternSelect: false,
  },
]

export function LectureScheduleManagement() {
  const [schedules, setSchedules] = useState<LectureSchedule[]>(initialSchedules)
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    endpoint: "",
    apiKey: "",
    syncInterval: 60,
    isEnabled: false
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<LectureSchedule | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 新規日程のフォーム状態
  const [newSchedule, setNewSchedule] = useState<Partial<LectureSchedule>>({
    date: "",
    startTime: "07:00",
    endTime: "19:00",
    type: "online",
    coursePattern: "standard",
    courseName: "派遣元責任者講習",
    courseId: "1",
    capacity: 120,
    enrolled: 0,
    applicationDeadline: "",
    status: "open",
    allowPatternSelect: true,
  })

  // ステータスバッジの表示
  const getStatusBadge = (status: LectureSchedule["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500 hover:bg-blue-600">受付中</Badge>
      case "closed":
        return <Badge variant="secondary">締切</Badge>
      case "full":
        return <Badge className="bg-orange-500 hover:bg-orange-600">満員</Badge>
      case "cancelled":
        return <Badge variant="destructive">中止</Badge>
    }
  }

  // 日程追加
  const handleAddSchedule = () => {
    if (!newSchedule.date || !newSchedule.applicationDeadline) return

    const schedule: LectureSchedule = {
      id: `new-${Date.now()}`,
      date: newSchedule.date,
      startTime: newSchedule.startTime || "07:00",
      endTime: newSchedule.endTime || "19:00",
      type: newSchedule.type || "online",
      coursePattern: newSchedule.coursePattern || "standard",
      courseName: newSchedule.courseName || "派遣元責任者講習",
      courseId: newSchedule.courseId || "1",
      capacity: newSchedule.capacity || 120,
      enrolled: 0,
      applicationDeadline: newSchedule.applicationDeadline,
      status: "open",
      allowPatternSelect: newSchedule.allowPatternSelect ?? true,
    }

    setSchedules([...schedules, schedule])
    setIsAddDialogOpen(false)
    setNewSchedule({
      date: "",
      startTime: "07:00",
      endTime: "19:00",
      type: "online",
      coursePattern: "standard",
      courseName: "派遣元責任者講習",
      courseId: "1",
      capacity: 120,
      enrolled: 0,
      applicationDeadline: "",
      status: "open",
      allowPatternSelect: true,
    })
  }

  // 日程削除
  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id))
  }

  // CSVインポート
  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter(line => line.trim())
      
      // ヘッダー行をスキップ
      const dataLines = lines.slice(1)
      let success = 0
      let failed = 0

      const newSchedules: LectureSchedule[] = []

      dataLines.forEach((line, index) => {
        try {
          const [date, startTime, endTime, type, coursePattern, courseName, courseId, capacity, applicationDeadline, externalId] = line.split(",").map(s => s.trim())
          
          if (!date || !startTime || !endTime) {
            failed++
            return
          }

          newSchedules.push({
            id: `csv-${Date.now()}-${index}`,
            date,
            startTime,
            endTime,
            type: (type as "online" | "venue" | "live") || "online",
            coursePattern: (coursePattern as CoursePattern) || "standard",
            courseName: courseName || "派遣元責任者講習",
            courseId: courseId || "1",
            capacity: parseInt(capacity) || 120,
            enrolled: 0,
            applicationDeadline: applicationDeadline || date,
            status: "open",
            externalId,
            allowPatternSelect: true,
          })
          success++
        } catch {
          failed++
        }
      })

      setSchedules([...schedules, ...newSchedules])
      setImportResult({ success, failed })
    }
    reader.readAsText(file)
    
    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // CSVエクスポート
  const handleCsvExport = () => {
    const header = "日付,開始時間,終了時間,形式,講習パターン,講座名,講座ID,定員,申込締切,外部ID,ステータス,申込数\n"
    const rows = schedules.map(s => 
      `${s.date},${s.startTime},${s.endTime},${s.type},${s.coursePattern},${s.courseName},${s.courseId},${s.capacity},${s.applicationDeadline},${s.externalId || ""},${s.status},${s.enrolled}`
    ).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `lecture_schedules_${format(new Date(), "yyyyMMdd")}.csv`
    link.click()
  }

  // API同期
  const handleApiSync = async () => {
    if (!apiConfig.endpoint || !apiConfig.apiKey) {
      alert("APIエンドポイントとAPIキーを設定してください")
      return
    }

    setIsSyncing(true)
    
    // 実際のAPI呼び出しをシミュレート
    setTimeout(() => {
      // デモ用：新しいスケジュールを追加
      const newSchedule: LectureSchedule = {
        id: `api-${Date.now()}`,
        date: "2026-02-10",
        startTime: "07:00",
        endTime: "19:00",
        type: "online",
        courseName: "派遣元責任者講習",
        courseId: "1",
        capacity: 120,
        enrolled: 0,
        applicationDeadline: "2026-02-06",
        status: "open",
        externalId: `EXT-${Date.now()}`
      }

      setSchedules(prev => [...prev, newSchedule])
      setApiConfig(prev => ({
        ...prev,
        lastSync: new Date().toISOString()
      }))
      setIsSyncing(false)
    }, 2000)
  }

  // CSVテンプレートダウンロード
  const handleDownloadTemplate = () => {
    const template = "日付,開始時間,終了時間,形式,講習パターン,講座名,講座ID,定員,申込締切,外部ID\n2026-03-01,07:00,19:00,online,standard,派遣元責任者講習,1,120,2026-02-25,EXT-001\n2026-03-01,09:00,17:00,online,practical,派遣元責任者講習（実践編）,2,80,2026-02-25,EXT-002\n"
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "lecture_schedule_template.csv"
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">オンライン講習日程管理</h2>
          <p className="text-sm text-gray-500 mt-1">講習日程の追加、編集、基幹システムとの連携を行います</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                日程追加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>新規講習日程を追加</DialogTitle>
                <DialogDescription>
                  オンライン講習の開催日程を設定します
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>開催日</Label>
                    <Input
                      type="date"
                      value={newSchedule.date}
                      onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>申込締切日</Label>
                    <Input
                      type="date"
                      value={newSchedule.applicationDeadline}
                      onChange={(e) => setNewSchedule({ ...newSchedule, applicationDeadline: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>開始時間</Label>
                    <Input
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>終了時間</Label>
                    <Input
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>講習形式</Label>
                    <Select
                      value={newSchedule.type}
                      onValueChange={(value) => setNewSchedule({ ...newSchedule, type: value as "online" | "venue" | "live" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">オンライン（動画視聴）</SelectItem>
                        <SelectItem value="live">オンライン（ライブ）</SelectItem>
                        <SelectItem value="venue">会場開催</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>講習パターン</Label>
                    <Select
                      value={newSchedule.coursePattern}
                      onValueChange={(value) => setNewSchedule({ ...newSchedule, coursePattern: value as CoursePattern })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">通常</SelectItem>
                        <SelectItem value="practical">実践編</SelectItem>
                        <SelectItem value="advanced">応用編</SelectItem>
                        <SelectItem value="refresher">更新講習</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>定員</Label>
                    <Input
                      type="number"
                      value={newSchedule.capacity}
                      onChange={(e) => setNewSchedule({ ...newSchedule, capacity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>講座名</Label>
                    <Input
                      value={newSchedule.courseName}
                      onChange={(e) => setNewSchedule({ ...newSchedule, courseName: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleAddSchedule}>追加</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="schedules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            日程一覧
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            インポート/エクスポート
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            API連携設定
          </TabsTrigger>
        </TabsList>

        {/* 日程一覧タブ */}
        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">講習日程一覧</CardTitle>
              <CardDescription>
                登録されている講習日程です。受講者はこの日程から選択して申し込みます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>開催日</TableHead>
                    <TableHead>時間</TableHead>
                    <TableHead>形式</TableHead>
                    <TableHead>講習パターン</TableHead>
                    <TableHead>申込締切</TableHead>
                    <TableHead className="text-center">定員</TableHead>
                    <TableHead className="text-center">申込数</TableHead>
                    <TableHead className="text-center">ステータス</TableHead>
                    <TableHead>外部ID</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.sort((a, b) => a.date.localeCompare(b.date)).map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">
                        {format(parseISO(schedule.date), "yyyy年M月d日(E)", { locale: ja })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {schedule.startTime}〜{schedule.endTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {schedule.type === "online" ? "オンライン" : schedule.type === "live" ? "ライブ" : "会場"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          schedule.coursePattern === "standard" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                          schedule.coursePattern === "practical" ? "bg-orange-100 text-orange-800 hover:bg-orange-200" :
                          schedule.coursePattern === "advanced" ? "bg-purple-100 text-purple-800 hover:bg-purple-200" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }>
                          {coursePatternLabels[schedule.coursePattern] || "通常"}
                          {schedule.allowPatternSelect && " / 実践選択可"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(parseISO(schedule.applicationDeadline), "M月d日", { locale: ja })}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          {schedule.capacity}名
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={schedule.enrolled >= schedule.capacity ? "text-blue-500 font-medium" : ""}>
                          {schedule.enrolled}名
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(schedule.status)}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {schedule.externalId || "-"}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingSchedule(schedule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* インポート/エクスポートタブ */}
        <TabsContent value="import">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  CSVインポート
                </CardTitle>
                <CardDescription>
                  CSVファイルから講習日程を一括登録します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <FileSpreadsheet className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-3">
                    CSVファイルをドラッグ＆ドロップ、またはクリックして選択
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvImport}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    ファイルを選択
                  </Button>
                </div>

                {importResult && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">インポート結果</h4>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-blue-600">
                        <CheckCircle className="h-4 w-4" />
                        成功: {importResult.success}件
                      </div>
                      {importResult.failed > 0 && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <XCircle className="h-4 w-4" />
                          失敗: {importResult.failed}件
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button variant="link" className="px-0" onClick={handleDownloadTemplate}>
                  <Download className="h-4 w-4 mr-1" />
                  CSVテンプレートをダウンロード
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  CSVエクスポート
                </CardTitle>
                <CardDescription>
                  現在の講習日程をCSVファイルとして出力します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">エクスポート対象</span>
                    <span className="font-medium">{schedules.length}件の日程</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    日付、時間、形式、講座情報、定員、申込状況などが含まれます
                  </div>
                </div>
                <Button onClick={handleCsvExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  CSVをダウンロード
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API連携設定タブ */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                API連携設定
              </CardTitle>
              <CardDescription>
                基幹システムとのAPI連携を設定します。設定後、自動的に講習日程が同期されます。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>APIエンドポイント</Label>
                  <Input
                    placeholder="https://api.example.com/schedules"
                    value={apiConfig.endpoint}
                    onChange={(e) => setApiConfig({ ...apiConfig, endpoint: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">基幹システムのAPIエンドポイントURL</p>
                </div>
                <div className="space-y-2">
                  <Label>APIキー</Label>
                  <Input
                    type="password"
                    placeholder="sk_xxxxxxxxxxxxxxxx"
                    value={apiConfig.apiKey}
                    onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">認証用のAPIキー</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>同期間隔</Label>
                  <Select
                    value={apiConfig.syncInterval.toString()}
                    onValueChange={(value) => setApiConfig({ ...apiConfig, syncInterval: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15分ごと</SelectItem>
                      <SelectItem value="30">30分ごと</SelectItem>
                      <SelectItem value="60">1時間ごと</SelectItem>
                      <SelectItem value="360">6時間ごと</SelectItem>
                      <SelectItem value="1440">1日ごと</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>最終同期日時</Label>
                  <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                    {apiConfig.lastSync 
                      ? format(parseISO(apiConfig.lastSync), "yyyy/MM/dd HH:mm:ss", { locale: ja })
                      : "未同期"
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${apiConfig.isEnabled ? "bg-blue-500" : "bg-gray-300"}`} />
                  <div>
                    <p className="font-medium">自動同期</p>
                    <p className="text-sm text-gray-500">
                      {apiConfig.isEnabled ? "有効 - 定期的に基幹システムと同期します" : "無効"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={apiConfig.isEnabled ? "outline" : "default"}
                  onClick={() => setApiConfig({ ...apiConfig, isEnabled: !apiConfig.isEnabled })}
                >
                  {apiConfig.isEnabled ? "無効にする" : "有効にする"}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleApiSync} disabled={isSyncing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "同期中..." : "今すぐ同期"}
                </Button>
                <Button variant="outline">
                  接続テスト
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  API仕様
                </h4>
                <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100">
                  <p className="text-gray-400 mb-2">// GET /schedules - 講習日程一覧取得</p>
                  <p className="text-gray-400 mb-2">// POST /schedules - 講習日程登録</p>
                  <p className="text-gray-400 mb-2">// PUT /schedules/:id - 講習日程更新</p>
                  <p className="text-gray-400">// DELETE /schedules/:id - 講習日程削除</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
