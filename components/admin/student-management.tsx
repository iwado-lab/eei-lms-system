"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  Search, Download, Tag, Filter, ChevronDown, ChevronUp, 
  User, Clock, CreditCard, ShieldCheck, BookOpen, MoreHorizontal,
  Edit, Eye, Trash2, Plus, X, Check, UserPlus, Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentRegistration, type RegisteredStudentData } from "./student-registration"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  getAuthThresholds,
  setAuthThreshold,
  getStudentAuthThreshold,
  isPhotoLocked,
  lockPhoto,
  unlockPhoto,
  getCaptureLogs,
  type AuthThreshold,
  type CaptureLog,
} from "@/lib/store"

// 受講者データ型
interface Student {
  id: string
  name: string
  furigana: string
  email: string
  registrationDate: string
  lastAttendanceDate: string
  paymentStatus: "unpaid" | "paid"
  authStatus: "unverified" | "verified"
  attendanceStatus: "not_started" | "in_progress" | "completed"
  progress: number
  studyTime: number // 分単位
  maxStudyTime: number // 分単位（延長可能）
  tags: string[]
  certificateBlocked: boolean
  excludeFromReport: boolean
  violationCount: number
  authThreshold?: number // 認証閾値（0-100）
  photoLocked?: boolean // 顔写真ロック状態
}

// サンプルデータ
const sampleStudents: Student[] = [
  {
    id: "STU001",
    name: "山田 太郎",
    furigana: "ヤマダ タロウ",
    email: "yamada@example.com",
    registrationDate: "2025-01-10",
    lastAttendanceDate: "2025-01-20",
    paymentStatus: "paid",
    authStatus: "verified",
    attendanceStatus: "in_progress",
    progress: 65,
    studyTime: 180,
    maxStudyTime: 360,
    tags: ["VIP", "企業研修"],
    certificateBlocked: false,
    excludeFromReport: false,
    violationCount: 0,
  },
  {
    id: "STU002",
    name: "佐藤 花子",
    furigana: "サトウ ハナコ",
    email: "sato@example.com",
    registrationDate: "2025-01-08",
    lastAttendanceDate: "2025-01-19",
    paymentStatus: "paid",
    authStatus: "verified",
    attendanceStatus: "completed",
    progress: 100,
    studyTime: 360,
    maxStudyTime: 360,
    tags: ["企業研修"],
    certificateBlocked: false,
    excludeFromReport: false,
    violationCount: 0,
  },
  {
    id: "STU003",
    name: "鈴木 一郎",
    furigana: "スズキ イチロウ",
    email: "suzuki@example.com",
    registrationDate: "2025-01-15",
    lastAttendanceDate: "",
    paymentStatus: "unpaid",
    authStatus: "unverified",
    attendanceStatus: "not_started",
    progress: 0,
    studyTime: 0,
    maxStudyTime: 360,
    tags: [],
    certificateBlocked: false,
    excludeFromReport: false,
    violationCount: 0,
  },
  {
    id: "STU004",
    name: "高橋 美咲",
    furigana: "タカハシ ミサキ",
    email: "takahashi@example.com",
    registrationDate: "2025-01-05",
    lastAttendanceDate: "2025-01-18",
    paymentStatus: "paid",
    authStatus: "verified",
    attendanceStatus: "in_progress",
    progress: 45,
    studyTime: 120,
    maxStudyTime: 360,
    tags: ["VIP"],
    certificateBlocked: true,
    excludeFromReport: true,
    violationCount: 3,
  },
  {
    id: "STU005",
    name: "田中 健太",
    furigana: "タナカ ケンタ",
    email: "tanaka@example.com",
    registrationDate: "2025-01-12",
    lastAttendanceDate: "2025-01-17",
    paymentStatus: "paid",
    authStatus: "verified",
    attendanceStatus: "in_progress",
    progress: 80,
    studyTime: 280,
    maxStudyTime: 360,
    tags: ["個人"],
    certificateBlocked: false,
    excludeFromReport: false,
    violationCount: 1,
  },
]

// 利用可能なタグ
const availableTags = ["VIP", "企業研修", "個人", "再受講", "要注意", "優秀"]

// localStorageキー
const STUDENTS_STORAGE_KEY = "glx_students_data"

// localStorageから受講者データを読み込む
const loadStudentsFromStorage = (): Student[] => {
  if (typeof window === "undefined") return sampleStudents
  try {
    const stored = localStorage.getItem(STUDENTS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.length > 0 ? parsed : sampleStudents
    }
  } catch (e) {
    console.error("Failed to load students from storage:", e)
  }
  return sampleStudents
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>(sampleStudents)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showAuthThresholdDialog, setShowAuthThresholdDialog] = useState(false)
  const [showCaptureLogsDialog, setShowCaptureLogsDialog] = useState(false)

  // 初期化時にlocalStorageからデータを読み込む
  useEffect(() => {
    const loadedStudents = loadStudentsFromStorage()
    setStudents(loadedStudents)
    setIsInitialized(true)
  }, [])

  // studentsが変更されたらlocalStorageに保存
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students))
    }
  }, [students, isInitialized])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchField, setSearchField] = useState<"all" | "name" | "furigana" | "id" | "email">("all")
  const [dateFilter, setDateFilter] = useState<"all" | "registration" | "attendance">("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">("all")
  const [authFilter, setAuthFilter] = useState<"all" | "verified" | "unverified">("all")
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "not_started" | "in_progress" | "completed">("all")
  const [sortField, setSortField] = useState<keyof Student>("registrationDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  
  // ダイアログ状態
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [showExtendTimeDialog, setShowExtendTimeDialog] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [newTag, setNewTag] = useState("")
  const [extendMinutes, setExtendMinutes] = useState(60)
  
  // 認証閾値設定用ステート
  const [authThresholdValue, setAuthThresholdValue] = useState(70)
  const [authThresholdReason, setAuthThresholdReason] = useState("")
  const [captureLogs, setCaptureLogs] = useState<CaptureLog[]>([])

  // 新規登録からのコールバック（受講者一覧にデータを追加）
  const handleStudentRegistered = (data: RegisteredStudentData) => {
    const newStudent: Student = {
      id: data.id,
      name: data.name,
      furigana: data.furigana,
      email: data.email,
      registrationDate: data.registeredAt.split("T")[0],
      lastAttendanceDate: "",
      paymentStatus: "paid", // 外部サイトで決済済みと想定
      authStatus: "unverified",
      attendanceStatus: "not_started",
      progress: 0,
      studyTime: 0,
      maxStudyTime: 360,
      tags: data.company ? ["企業研修"] : ["個人"],
      certificateBlocked: false,
      excludeFromReport: false,
      violationCount: 0,
    }
    setStudents((prev) => [newStudent, ...prev])
  }

  const handleStudentsImported = (dataList: RegisteredStudentData[]) => {
    const newStudents: Student[] = dataList.map((data) => ({
      id: data.id,
      name: data.name,
      furigana: data.furigana,
      email: data.email,
      registrationDate: data.registeredAt.split("T")[0],
      lastAttendanceDate: "",
      paymentStatus: "paid",
      authStatus: "unverified",
      attendanceStatus: "not_started",
      progress: 0,
      studyTime: 0,
      maxStudyTime: 360,
      tags: data.company ? ["企業研修"] : ["個人"],
      certificateBlocked: false,
      excludeFromReport: false,
      violationCount: 0,
    }))
    setStudents((prev) => [...newStudents, ...prev])
  }

  // フィルタリング
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 検索クエリ
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          (searchField === "all" || searchField === "name") && student.name.toLowerCase().includes(query) ||
          (searchField === "all" || searchField === "furigana") && student.furigana.toLowerCase().includes(query) ||
          (searchField === "all" || searchField === "id") && student.id.toLowerCase().includes(query) ||
          (searchField === "all" || searchField === "email") && student.email.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // 日付フィルタ
      if (dateFrom || dateTo) {
        const targetDate = dateFilter === "attendance" ? student.lastAttendanceDate : student.registrationDate
        if (!targetDate) return false
        if (dateFrom && targetDate < dateFrom) return false
        if (dateTo && targetDate > dateTo) return false
      }

      // タグフィルタ
      if (selectedTags.length > 0) {
        if (!selectedTags.some(tag => student.tags.includes(tag))) return false
      }

      // ステータスフィルタ
      if (paymentFilter !== "all" && student.paymentStatus !== paymentFilter) return false
      if (authFilter !== "all" && student.authStatus !== authFilter) return false
      if (attendanceFilter !== "all" && student.attendanceStatus !== attendanceFilter) return false

      return true
    }).sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })
  }, [students, searchQuery, searchField, dateFilter, dateFrom, dateTo, selectedTags, paymentFilter, authFilter, attendanceFilter, sortField, sortDirection])

  // CSVダウンロード
  const downloadCSV = () => {
    const headers = ["ID", "氏名", "フリガナ", "メール", "登録日", "最終受講日", "入金状況", "認証状況", "受講状況", "進捗率", "受講時間(分)", "タグ"]
    const rows = filteredStudents.map(s => [
      s.id,
      s.name,
      s.furigana,
      s.email,
      s.registrationDate,
      s.lastAttendanceDate,
      s.paymentStatus === "paid" ? "入金済" : "未入金",
      s.authStatus === "verified" ? "認証済" : "未認証",
      s.attendanceStatus === "completed" ? "受講済" : s.attendanceStatus === "in_progress" ? "受講中" : "未受講",
      `${s.progress}%`,
      s.studyTime.toString(),
      s.tags.join(", ")
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `受講者一覧_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  // ステータス変更
  const updateStudentStatus = (studentId: string, field: keyof Student, value: unknown) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, [field]: value } : s
    ))
  }

  // タグ追加
  const addTagToStudent = (studentId: string, tag: string) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId && !s.tags.includes(tag) 
        ? { ...s, tags: [...s.tags, tag] } 
        : s
    ))
  }

  // タグ削除
  const removeTagFromStudent = (studentId: string, tag: string) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, tags: s.tags.filter(t => t !== tag) } 
        : s
    ))
  }

  // 受講時間延長
  const extendStudyTime = (studentId: string, minutes: number) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, maxStudyTime: s.maxStudyTime + minutes } 
        : s
    ))
  }

  // 一括タグ追加
  const addTagToSelected = (tag: string) => {
    setStudents(prev => prev.map(s => 
      selectedStudents.includes(s.id) && !s.tags.includes(tag)
        ? { ...s, tags: [...s.tags, tag] }
        : s
    ))
  }

  const SortButton = ({ field, label }: { field: keyof Student; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2"
      onClick={() => {
        if (sortField === field) {
          setSortDirection(prev => prev === "asc" ? "desc" : "asc")
        } else {
          setSortField(field)
          setSortDirection("desc")
        }
      }}
    >
      {label}
      {sortField === field && (
        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  )

  const getPaymentBadge = (status: Student["paymentStatus"]) => (
    <Badge variant={status === "paid" ? "default" : "destructive"} className={status === "paid" ? "bg-blue-500" : ""}>
      {status === "paid" ? "入金済" : "未入金"}
    </Badge>
  )

  const getAuthBadge = (status: Student["authStatus"]) => (
    <Badge variant={status === "verified" ? "default" : "secondary"} className={status === "verified" ? "bg-blue-500" : ""}>
      {status === "verified" ? "認証済" : "未認証"}
    </Badge>
  )

  const getAttendanceBadge = (status: Student["attendanceStatus"]) => {
    const config = {
      not_started: { label: "未受講", className: "bg-gray-500" },
      in_progress: { label: "受講中", className: "bg-blue-500" },
      completed: { label: "受講済", className: "bg-blue-500" },
    }
    return <Badge className={config[status].className}>{config[status].label}</Badge>
  }

  return (
    <Tabs defaultValue="list" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="list" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          受講者一覧
        </TabsTrigger>
        <TabsTrigger value="register" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          新規登録
        </TabsTrigger>
      </TabsList>

      <TabsContent value="register">
        <StudentRegistration 
          onStudentRegistered={handleStudentRegistered}
          onStudentsImported={handleStudentsImported}
        />
      </TabsContent>

      <TabsContent value="list" className="space-y-6">
        {/* 検索・フィルタエリア */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              受講者検索・フィルタ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 検索 */}
            <div className="flex gap-2">
              <Select value={searchField} onValueChange={(v: typeof searchField) => setSearchField(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="name">氏名</SelectItem>
                  <SelectItem value="furigana">フリガナ</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="email">メール</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="検索キーワード..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* 日付フィルタ */}
            <div className="flex gap-2 items-center">
              <Select value={dateFilter} onValueChange={(v: typeof dateFilter) => setDateFilter(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">日付なし</SelectItem>
                  <SelectItem value="registration">登録日</SelectItem>
                  <SelectItem value="attendance">受講日</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
              <span>〜</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>

            {/* ステータスフィルタ */}
            <div className="flex gap-2 flex-wrap">
              <Select value={paymentFilter} onValueChange={(v: typeof paymentFilter) => setPaymentFilter(v)}>
                <SelectTrigger className="w-32">
                  <CreditCard className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="入金状況" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="paid">入金済</SelectItem>
                  <SelectItem value="unpaid">未入金</SelectItem>
                </SelectContent>
              </Select>

              <Select value={authFilter} onValueChange={(v: typeof authFilter) => setAuthFilter(v)}>
                <SelectTrigger className="w-32">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="認証状況" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="verified">認証済</SelectItem>
                  <SelectItem value="unverified">未認証</SelectItem>
                </SelectContent>
              </Select>

              <Select value={attendanceFilter} onValueChange={(v: typeof attendanceFilter) => setAttendanceFilter(v)}>
                <SelectTrigger className="w-32">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="受講状況" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="not_started">未受講</SelectItem>
                  <SelectItem value="in_progress">受講中</SelectItem>
                  <SelectItem value="completed">受講済</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* タグフィルタ */}
            <div className="flex gap-2 items-center flex-wrap">
              <Tag className="h-4 w-4" />
              <span className="text-sm text-gray-500">タグ:</span>
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    )
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* アクションバー */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <span className="text-sm text-gray-500">
              {filteredStudents.length}件表示 / 全{students.length}件
            </span>
            {selectedStudents.length > 0 && (
              <span className="text-sm text-blue-600">
                {selectedStudents.length}件選択中
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {selectedStudents.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Tag className="h-4 w-4 mr-1" />
                    一括タグ追加
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableTags.map(tag => (
                    <DropdownMenuItem key={tag} onClick={() => addTagToSelected(tag)}>
                      {tag}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-1" />
              CSVダウンロード
            </Button>
          </div>
        </div>

        {/* 受講者一覧テーブル */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={(e) => {
                          setSelectedStudents(e.target.checked ? filteredStudents.map(s => s.id) : [])
                        }}
                      />
                    </th>
                    <th className="p-3 text-left"><SortButton field="id" label="ID" /></th>
                    <th className="p-3 text-left"><SortButton field="name" label="氏名" /></th>
                    <th className="p-3 text-left"><SortButton field="registrationDate" label="登録日" /></th>
                    <th className="p-3 text-left"><SortButton field="paymentStatus" label="入金" /></th>
                    <th className="p-3 text-left"><SortButton field="authStatus" label="認証" /></th>
                    <th className="p-3 text-left"><SortButton field="attendanceStatus" label="受講" /></th>
                    <th className="p-3 text-left"><SortButton field="progress" label="進捗" /></th>
                    <th className="p-3 text-left"><SortButton field="studyTime" label="受講時間" /></th>
                    <th className="p-3 text-left"><SortButton field="violationCount" label="不正回数" /></th>
                    <th className="p-3 text-left">タグ</th>
                    <th className="p-3 text-left">端末情報</th>
                    <th className="p-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className={`border-b hover:bg-gray-50 ${student.certificateBlocked ? "bg-blue-50" : ""}`}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            setSelectedStudents(prev => 
                              e.target.checked 
                                ? [...prev, student.id]
                                : prev.filter(id => id !== student.id)
                            )
                          }}
                        />
                      </td>
                      <td className="p-3 text-sm">{student.id}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.furigana}</div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{student.registrationDate}</td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="cursor-pointer">
                              {getPaymentBadge(student.paymentStatus)}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="z-[100]">
                            <DropdownMenuItem onClick={() => updateStudentStatus(student.id, "paymentStatus", "paid")}>
                              入金済に変更
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStudentStatus(student.id, "paymentStatus", "unpaid")}>
                              未入金に変更
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="cursor-pointer">
                              {getAuthBadge(student.authStatus)}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="z-[100]">
                            <DropdownMenuItem onClick={() => updateStudentStatus(student.id, "authStatus", "verified")}>
                              認証済に変更
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStudentStatus(student.id, "authStatus", "unverified")}>
                              未認証に変更
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="cursor-pointer">
                              {getAttendanceBadge(student.attendanceStatus)}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="z-[100]">
                            <DropdownMenuItem onClick={() => updateStudentStatus(student.id, "attendanceStatus", "not_started")}>
                              未受講に変更
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStudentStatus(student.id, "attendanceStatus", "in_progress")}>
                              受講中に変更
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStudentStatus(student.id, "attendanceStatus", "completed")}>
                              受講済に変更
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-3">
                        <div className="w-24">
                          <div className="text-sm font-medium">{student.progress}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {Math.floor(student.studyTime / 60)}時間{student.studyTime % 60}分
                          <span className="text-gray-400"> / {Math.floor(student.maxStudyTime / 60)}時間</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 p-0 h-auto"
                          onClick={() => {
                            setEditingStudent(student)
                            setShowExtendTimeDialog(true)
                          }}
                        >
                          延長
                        </Button>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={student.violationCount > 0 ? "destructive" : "secondary"}
                          className={student.violationCount === 0 ? "bg-gray-100 text-gray-500" : ""}
                        >
                          {student.violationCount}回
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {student.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                              <X
                                className="h-3 w-3 ml-1 cursor-pointer"
                                onClick={() => removeTagFromStudent(student.id, tag)}
                              />
                            </Badge>
                          ))}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[100]">
                              {availableTags.filter(t => !student.tags.includes(t)).map(tag => (
                                <DropdownMenuItem key={tag} onClick={() => addTagToStudent(student.id, tag)}>
                                  {tag}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      <td className="p-3">
                        {(student as any).deviceInfo ? (
                          <div className="text-xs space-y-0.5">
                            <div className="font-medium">{(student as any).deviceInfo.os}</div>
                            <div className="text-gray-500">{(student as any).deviceInfo.browser}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">--</span>
                        )}
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-[100]">
                            <DropdownMenuItem onClick={() => window.open(`/admin/user-details/${student.id}`, "_blank")}>
                              <Eye className="h-4 w-4 mr-2" />
                              詳細表示
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditingStudent(student)
                              setShowProgressDialog(true)
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              進捗編集
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => updateStudentStatus(student.id, "certificateBlocked", !student.certificateBlocked)}
                              className={student.certificateBlocked ? "text-blue-600" : "text-blue-600"}
                            >
                              {student.certificateBlocked ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  証明書発行を許可
                                </>
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-2" />
                                  証明書発行を停止
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditingStudent(student)
                              setExtendMinutes(60)
                              setShowExtendTimeDialog(true)
                            }}>
                              <Clock className="h-4 w-4 mr-2" />
                              受講時間延長
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setEditingStudent(student)
                              setShowAuthThresholdDialog(true)
                            }}>
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              認証閾値設定
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditingStudent(student)
                              setShowCaptureLogsDialog(true)
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              撮影ログ確認
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 受講時間延長ダイアログ */}
        <Dialog open={showExtendTimeDialog} onOpenChange={setShowExtendTimeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>受講時間の延長</DialogTitle>
              <DialogDescription>
                {editingStudent?.name}さんの受講可能時間を延長します。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>現在の受講可能時間</Label>
                <p className="text-lg font-medium">
                  {editingStudent && `${Math.floor(editingStudent.maxStudyTime / 60)}時間${editingStudent.maxStudyTime % 60}分`}
                </p>
              </div>
              <div>
                <Label>延長時間（分）</Label>
                <Input
                  type="number"
                  value={extendMinutes}
                  onChange={(e) => setExtendMinutes(Number(e.target.value))}
                  min={0}
                  step={30}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExtendTimeDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={() => {
                if (editingStudent) {
                  extendStudyTime(editingStudent.id, extendMinutes)
                  setShowExtendTimeDialog(false)
                }
              }}>
                延長する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 進捗編集ダイアログ */}
        <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>進捗状況の編集</DialogTitle>
              <DialogDescription>
                {editingStudent?.name}さんの進捗状況を編集します。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>進捗率（%）</Label>
                <Input
                  type="number"
                  value={editingStudent?.progress || 0}
                  onChange={(e) => {
                    if (editingStudent) {
                      setEditingStudent({ ...editingStudent, progress: Number(e.target.value) })
                    }
                  }}
                  min={0}
                  max={100}
                />
              </div>
              <div>
                <Label>受講状況</Label>
                <Select
                  value={editingStudent?.attendanceStatus || "not_started"}
                  onValueChange={(v: Student["attendanceStatus"]) => {
                    if (editingStudent) {
                      setEditingStudent({ ...editingStudent, attendanceStatus: v })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">未受講</SelectItem>
                    <SelectItem value="in_progress">受講中</SelectItem>
                    <SelectItem value="completed">受講済</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={() => {
                if (editingStudent) {
                  setStudents(prev => prev.map(s => 
                    s.id === editingStudent.id 
                      ? { ...s, progress: editingStudent.progress, attendanceStatus: editingStudent.attendanceStatus }
                      : s
                  ))
                  setShowProgressDialog(false)
                }
              }}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 認証閾値設定ダイアログ */}
        {showAuthThresholdDialog && editingStudent && (
          <Dialog open={showAuthThresholdDialog} onOpenChange={setShowAuthThresholdDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>認証閾値設定</DialogTitle>
                <DialogDescription>
                  {editingStudent.name}さんの本人認証の厳しさを設定します。
                  PCカメラの性能等で認証が難しい場合は閾値を下げてください。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>認証閾値</Label>
                    <span className="text-2xl font-bold text-blue-600">{authThresholdValue}%</span>
                  </div>
                  <Slider
                    value={[authThresholdValue]}
                    onValueChange={(v) => setAuthThresholdValue(v[0])}
                    min={30}
                    max={95}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>緩い (30%)</span>
                    <span>標準 (70%)</span>
                    <span>厳格 (95%)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>変更理由（必須）</Label>
                  <Textarea
                    value={authThresholdReason}
                    onChange={(e) => setAuthThresholdReason(e.target.value)}
                    placeholder="例: PCカメラの画質が低く、認証が通りにくいため"
                    className="h-20"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-medium">注意事項</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                    <li>閾値を下げると不正の検知精度も下がります</li>
                    <li>変更履歴は記録されます</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="bg-transparent" onClick={() => {
                  setShowAuthThresholdDialog(false)
                  setAuthThresholdReason("")
                }}>
                  キャンセル
                </Button>
                <Button 
                  onClick={() => {
                    if (editingStudent && authThresholdReason.trim()) {
                      setAuthThreshold(editingStudent.id, authThresholdValue, authThresholdReason, "管理者")
                      setShowAuthThresholdDialog(false)
                      setAuthThresholdReason("")
                      alert(`${editingStudent.name}さんの認証閾値を${authThresholdValue}%に設定しました`)
                    } else {
                      alert("変更理由を入力してください")
                    }
                  }}
                  disabled={!authThresholdReason.trim()}
                >
                  保存
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* 撮影ログ確認ダイアログ */}
        {showCaptureLogsDialog && editingStudent && (
          <Dialog open={showCaptureLogsDialog} onOpenChange={setShowCaptureLogsDialog}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>撮影ログ確認</DialogTitle>
                <DialogDescription>
                  {editingStudent.name}さんの受講中撮影ログを確認します。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 overflow-y-auto max-h-[50vh]">
                {(() => {
                  const logs = getCaptureLogs(editingStudent.id)
                  if (logs.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        撮影ログがありません
                      </div>
                    )
                  }
                  return (
                    <div className="space-y-3">
                      {logs.slice(0, 20).map((log, index) => (
                        <div key={log.id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                            サムネイル
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {new Date(log.timestamp).toLocaleString("ja-JP")}
                            </p>
                            <p className={`text-xs ${log.authResult === "verified" ? "text-blue-600" : log.authResult === "failed" ? "text-blue-600" : "text-gray-500"}`}>
                              認証結果: {log.authResult === "verified" ? "OK" : log.authResult === "failed" ? "NG" : "未確認"}
                              {log.confidence > 0 && ` (${log.confidence}%)`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
              <DialogFooter>
                <Button variant="outline" className="bg-transparent" onClick={() => setShowCaptureLogsDialog(false)}>
                  閉じる
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </TabsContent>
    </Tabs>
  )
}
