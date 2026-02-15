"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  Download,
  UserPlus,
  Users,
  Mail,
  Key,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react"

interface Student {
  id: string
  name: string
  furigana: string
  email: string
  company: string
  phone: string
  courseType: "online" | "venue"
  venue?: string
  courseDate: string
  loginId: string
  password: string
  status: "pending" | "registered" | "sent"
  registeredAt?: string
}

interface ImportResult {
  success: number
  failed: number
  errors: { row: number; message: string }[]
}

// 親コンポーネントに渡すデータ型（受講者一覧と互換性のある形式）
export interface RegisteredStudentData {
  id: string
  name: string
  furigana: string
  email: string
  company: string
  loginId: string
  password: string
  courseType: "online" | "venue"
  registeredAt: string
}

interface StudentRegistrationProps {
  onStudentRegistered?: (student: RegisteredStudentData) => void
  onStudentsImported?: (students: RegisteredStudentData[]) => void
}

// ID/PW生成関数
function generateLoginId(): string {
  const prefix = "GLX"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
  let password = ""
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export function StudentRegistration({ onStudentRegistered, onStudentsImported }: StudentRegistrationProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [newStudent, setNewStudent] = useState({
    name: "",
    furigana: "",
    email: "",
    company: "",
    phone: "",
    courseType: "online" as "online" | "venue",
    venue: "",
    courseDate: "",
  })

  // 単体登録
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) {
      alert("氏名とメールアドレスは必須です")
      return
    }

    const registeredAt = new Date().toISOString()
    const student: Student = {
      id: `STU${Date.now()}`,
      ...newStudent,
      loginId: generateLoginId(),
      password: generatePassword(),
      status: "registered",
      registeredAt,
    }

    setStudents((prev) => [...prev, student])
    
    // 親コンポーネントに通知（受講者一覧に追加）
    if (onStudentRegistered) {
      onStudentRegistered({
        id: student.id,
        name: student.name,
        furigana: student.furigana,
        email: student.email,
        company: student.company,
        loginId: student.loginId,
        password: student.password,
        courseType: student.courseType,
        registeredAt,
      })
    }
    
    setNewStudent({
      name: "",
      furigana: "",
      email: "",
      company: "",
      phone: "",
      courseType: "online",
      venue: "",
      courseDate: "",
    })
    setShowAddDialog(false)
  }

  // CSVインポート
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    
    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())
      
      const result: ImportResult = { success: 0, failed: 0, errors: [] }
      const newStudents: Student[] = []

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
          
          const nameIdx = headers.findIndex((h) => h.includes("氏名") || h.toLowerCase() === "name")
          const furiganaIdx = headers.findIndex((h) => h.includes("フリガナ") || h.includes("ふりがな"))
          const emailIdx = headers.findIndex((h) => h.includes("メール") || h.toLowerCase() === "email")
          const companyIdx = headers.findIndex((h) => h.includes("会社") || h.includes("企業"))
          const phoneIdx = headers.findIndex((h) => h.includes("電話") || h.toLowerCase() === "phone")
          const typeIdx = headers.findIndex((h) => h.includes("受講形式") || h.includes("タイプ"))
          const venueIdx = headers.findIndex((h) => h.includes("会場"))
          const dateIdx = headers.findIndex((h) => h.includes("受講日") || h.includes("日付"))

          const name = nameIdx >= 0 ? values[nameIdx] : ""
          const email = emailIdx >= 0 ? values[emailIdx] : ""

          if (!name || !email) {
            result.failed++
            result.errors.push({ row: i + 1, message: "氏名またはメールアドレスが空です" })
            continue
          }

          // メール形式チェック
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            result.failed++
            result.errors.push({ row: i + 1, message: `無効なメールアドレス: ${email}` })
            continue
          }

          const student: Student = {
            id: `STU${Date.now()}_${i}`,
            name,
            furigana: furiganaIdx >= 0 ? values[furiganaIdx] : "",
            email,
            company: companyIdx >= 0 ? values[companyIdx] : "",
            phone: phoneIdx >= 0 ? values[phoneIdx] : "",
            courseType: typeIdx >= 0 && values[typeIdx]?.includes("会場") ? "venue" : "online",
            venue: venueIdx >= 0 ? values[venueIdx] : "",
            courseDate: dateIdx >= 0 ? values[dateIdx] : "",
            loginId: generateLoginId(),
            password: generatePassword(),
            status: "registered",
            registeredAt: new Date().toISOString(),
          }

          newStudents.push(student)
          result.success++
        } catch (err) {
          result.failed++
          result.errors.push({ row: i + 1, message: "行の解析に失敗しました" })
        }
      }

      setStudents((prev) => [...prev, ...newStudents])
      setImportResult(result)
      setShowImportDialog(false)
      setShowPreviewDialog(true)
      
      // 親コンポーネントに通知（受講者一覧に追加）
      if (onStudentsImported && newStudents.length > 0) {
        onStudentsImported(newStudents.map((s) => ({
          id: s.id,
          name: s.name,
          furigana: s.furigana,
          email: s.email,
          company: s.company,
          loginId: s.loginId,
          password: s.password,
          courseType: s.courseType,
          registeredAt: s.registeredAt || new Date().toISOString(),
        })))
      }
    } catch (err) {
      alert("CSVファイルの読み込みに失敗しました")
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // 受講票メール送信
  const handleSendTickets = async () => {
    if (selectedStudents.length === 0) {
      alert("送信する受講者を選択してください")
      return
    }

    setIsProcessing(true)

    // シミュレーション
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStudents((prev) =>
      prev.map((s) =>
        selectedStudents.includes(s.id) ? { ...s, status: "sent" as const } : s
      )
    )

    alert(`${selectedStudents.length}名に受講票を送信しました`)
    setSelectedStudents([])
    setIsProcessing(false)
  }

  // CSV出力
  const handleExportCSV = () => {
    const headers = ["ID", "氏名", "フリガナ", "メールアドレス", "会社名", "電話番号", "受講形式", "会場", "受講日", "ログインID", "パスワード", "ステータス", "登録日時"]
    const rows = students.map((s) => [
      s.id,
      s.name,
      s.furigana,
      s.email,
      s.company,
      s.phone,
      s.courseType === "online" ? "オンライン" : "会場",
      s.venue,
      s.courseDate,
      s.loginId,
      s.password,
      s.status === "sent" ? "送信済" : s.status === "registered" ? "登録済" : "保留",
      s.registeredAt || "",
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `受講者一覧_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // CSVテンプレートダウンロード
  const handleDownloadTemplate = () => {
    const headers = ["氏名", "フリガナ", "メールアドレス", "会社名", "電話番号", "受講形式", "会場", "受講日"]
    const sample = ["山田太郎", "ヤマダタロウ", "yamada@example.com", "株式会社サンプル", "03-1234-5678", "オンライン", "", "2026-02-01"]
    const csv = [headers.join(","), sample.join(",")].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "受講者登録テンプレート.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map((s) => s.id))
    }
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">受講生登録</h2>
          <p className="text-gray-600">新規受講生の登録・ID/PW発行・受講票送信</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            CSVテンプレート
          </Button>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="w-4 h-4 mr-2" />
            一括インポート
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            新規登録
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">登録済み</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">受講票送信済</p>
                <p className="text-2xl font-bold">{students.filter((s) => s.status === "sent").length}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">未送信</p>
                <p className="text-2xl font-bold">{students.filter((s) => s.status === "registered").length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">選択中</p>
                <p className="text-2xl font-bold">{selectedStudents.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 操作ボタン */}
      {students.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={toggleSelectAll}
          >
            {selectedStudents.length === students.length ? "選択解除" : "全て選択"}
          </Button>
          <Button
            onClick={handleSendTickets}
            disabled={selectedStudents.length === 0 || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            受講票を送信 ({selectedStudents.length}名)
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV出力
          </Button>
        </div>
      )}

      {/* 受講者一覧 */}
      {students.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>氏名</TableHead>
                  <TableHead>メールアドレス</TableHead>
                  <TableHead>会社名</TableHead>
                  <TableHead>受講形式</TableHead>
                  <TableHead>ログインID</TableHead>
                  <TableHead>パスワード</TableHead>
                  <TableHead>ステータス</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStudents((prev) => [...prev, student.id])
                          } else {
                            setSelectedStudents((prev) => prev.filter((id) => id !== student.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.furigana}</div>
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.company}</TableCell>
                    <TableCell>
                      <Badge variant={student.courseType === "online" ? "default" : "secondary"}>
                        {student.courseType === "online" ? "オンライン" : "会場"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{student.loginId}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(student.loginId)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {showPasswords[student.id] ? student.password : "**********"}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(student.id)}
                        >
                          {showPasswords[student.id] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(student.password)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "sent"
                            ? "default"
                            : student.status === "registered"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          student.status === "sent"
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }
                      >
                        {student.status === "sent"
                          ? "送信済"
                          : student.status === "registered"
                          ? "登録済"
                          : "保留"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">受講生がいません</h3>
            <p className="text-gray-600 mt-2">
              「新規登録」または「一括インポート」から受講生を追加してください
            </p>
          </CardContent>
        </Card>
      )}

      {/* 新規登録ダイアログ */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新規受講生登録</DialogTitle>
            <DialogDescription>
              受講生情報を入力してください。ID/PWは自動発行されます。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>氏名 *</Label>
                <Input
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="山田太郎"
                />
              </div>
              <div>
                <Label>フリガナ</Label>
                <Input
                  value={newStudent.furigana}
                  onChange={(e) => setNewStudent({ ...newStudent, furigana: e.target.value })}
                  placeholder="ヤマダタロウ"
                />
              </div>
            </div>
            <div>
              <Label>メールアドレス *</Label>
              <Input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="yamada@example.com"
              />
            </div>
            <div>
              <Label>会社名</Label>
              <Input
                value={newStudent.company}
                onChange={(e) => setNewStudent({ ...newStudent, company: e.target.value })}
                placeholder="株式会社サンプル"
              />
            </div>
            <div>
              <Label>電話番号</Label>
              <Input
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                placeholder="03-1234-5678"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>受講形式</Label>
                <Select
                  value={newStudent.courseType}
                  onValueChange={(value: "online" | "venue") =>
                    setNewStudent({ ...newStudent, courseType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">オンライン</SelectItem>
                    <SelectItem value="venue">会場</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>受講日</Label>
                <Input
                  type="date"
                  value={newStudent.courseDate}
                  onChange={(e) => setNewStudent({ ...newStudent, courseDate: e.target.value })}
                />
              </div>
            </div>
            {newStudent.courseType === "venue" && (
              <div>
                <Label>会場</Label>
                <Input
                  value={newStudent.venue}
                  onChange={(e) => setNewStudent({ ...newStudent, venue: e.target.value })}
                  placeholder="東京会場"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleAddStudent}>
              <Key className="w-4 h-4 mr-2" />
              登録してID/PW発行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSVインポートダイアログ */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>CSVインポート</DialogTitle>
            <DialogDescription>
              CSVファイルから受講生を一括登録します。ID/PWは自動発行されます。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">CSVファイルをドロップまたは選択</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                ファイルを選択
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">CSVフォーマット</h4>
              <p className="text-sm text-gray-600">
                必須項目: 氏名, メールアドレス<br />
                任意項目: フリガナ, 会社名, 電話番号, 受講形式, 会場, 受講日
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={handleDownloadTemplate}
              >
                テンプレートをダウンロード
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* インポート結果ダイアログ */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>インポート完了</DialogTitle>
          </DialogHeader>
          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{importResult.success}</p>
                  <p className="text-sm text-blue-700">成功</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <AlertCircle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{importResult.failed}</p>
                  <p className="text-sm text-blue-700">失敗</p>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">エラー詳細</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {importResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>行 {err.row}: {err.message}</li>
                    ))}
                    {importResult.errors.length > 5 && (
                      <li>...他 {importResult.errors.length - 5} 件</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowPreviewDialog(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
