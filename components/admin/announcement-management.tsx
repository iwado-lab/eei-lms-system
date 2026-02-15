"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  Video,
  FileText,
  Upload,
  X,
  Search,
  Filter,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  contentType: "text" | "video"
  videoUrl?: string
  videoFile?: string
  priority: "high" | "medium" | "low"
  status: "draft" | "published" | "scheduled" | "expired"
  targetAudience: "all" | "students" | "instructors" | "admins"
  displayCount: number // 表示回数制限（0=無制限）
  currentViews: number
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  author: string
}

// サンプルデータ
const sampleAnnouncements: Announcement[] = [
  {
    id: "ann_1",
    title: "システムメンテナンスのお知らせ",
    content: "2025年2月1日（土）午前2:00〜4:00の間、システムメンテナンスを実施いたします。この間、サービスをご利用いただけません。ご不便をおかけしますが、ご理解のほどよろしくお願いいたします。",
    contentType: "text",
    priority: "high",
    status: "published",
    targetAudience: "all",
    displayCount: 0,
    currentViews: 1247,
    startDate: "2025-01-20",
    endDate: "2025-02-01",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
    author: "システム管理者",
  },
  {
    id: "ann_2",
    title: "受講方法の動画ガイド",
    content: "派遣元責任者講習の受講方法について、動画でご案内いたします。",
    contentType: "video",
    videoUrl: "https://example.com/guide.mp4",
    priority: "medium",
    status: "published",
    targetAudience: "students",
    displayCount: 3,
    currentViews: 892,
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
    author: "コンテンツ担当",
  },
  {
    id: "ann_3",
    title: "年末年始の営業について",
    content: "2024年12月28日〜2025年1月5日は休業とさせていただきます。",
    contentType: "text",
    priority: "low",
    status: "expired",
    targetAudience: "all",
    displayCount: 0,
    currentViews: 2100,
    startDate: "2024-12-20",
    endDate: "2025-01-05",
    createdAt: "2024-12-20",
    updatedAt: "2024-12-20",
    author: "システム管理者",
  },
  {
    id: "ann_4",
    title: "新機能リリースのお知らせ",
    content: "2025年2月より、モバイルアプリでの受講が可能になります。詳細は後日お知らせいたします。",
    contentType: "text",
    priority: "medium",
    status: "scheduled",
    targetAudience: "all",
    displayCount: 0,
    currentViews: 0,
    startDate: "2025-02-01",
    endDate: "2025-03-31",
    createdAt: "2025-01-21",
    updatedAt: "2025-01-21",
    author: "開発チーム",
  },
]

export function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "views" | "priority">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // 編集ダイアログ
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  
  // 新規作成フォーム
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    contentType: "text" as "text" | "video",
    videoUrl: "",
    videoFile: null as File | null,
    priority: "medium" as "high" | "medium" | "low",
    targetAudience: "all" as "all" | "students" | "instructors" | "admins",
    displayCount: 0,
    startDate: "",
    endDate: "",
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // フィルタリングとソート
  const filteredAnnouncements = announcements
    .filter(a => {
      const matchesSearch = a.title.includes(searchQuery) || a.content.includes(searchQuery)
      const matchesStatus = statusFilter === "all" || a.status === statusFilter
      const matchesPriority = priorityFilter === "all" || a.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === "date") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "views") {
        comparison = a.currentViews - b.currentViews
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  // 新規作成/編集ダイアログを開く
  const openEditDialog = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement)
      setFormData({
        title: announcement.title,
        content: announcement.content,
        contentType: announcement.contentType,
        videoUrl: announcement.videoUrl || "",
        videoFile: null,
        priority: announcement.priority,
        targetAudience: announcement.targetAudience,
        displayCount: announcement.displayCount,
        startDate: announcement.startDate,
        endDate: announcement.endDate,
      })
    } else {
      setEditingAnnouncement(null)
      setFormData({
        title: "",
        content: "",
        contentType: "text",
        videoUrl: "",
        videoFile: null,
        priority: "medium",
        targetAudience: "all",
        displayCount: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      })
    }
    setShowEditDialog(true)
  }

  // 保存処理
  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert("タイトルと内容を入力してください")
      return
    }

    // 動画ファイルサイズチェック（5MB以下）
    if (formData.videoFile && formData.videoFile.size > 5 * 1024 * 1024) {
      alert("動画ファイルは5MB以下にしてください")
      return
    }

    const now = new Date().toISOString().split("T")[0]
    const startDate = new Date(formData.startDate)
    const endDate = formData.endDate ? new Date(formData.endDate) : null
    const today = new Date()

    // ステータス判定
    let status: Announcement["status"] = "draft"
    if (startDate <= today && (!endDate || endDate >= today)) {
      status = "published"
    } else if (startDate > today) {
      status = "scheduled"
    } else if (endDate && endDate < today) {
      status = "expired"
    }

    if (editingAnnouncement) {
      // 更新
      setAnnouncements(announcements.map(a => 
        a.id === editingAnnouncement.id
          ? {
              ...a,
              ...formData,
              status,
              updatedAt: now,
            }
          : a
      ))
    } else {
      // 新規作成
      const newAnnouncement: Announcement = {
        id: `ann_${Date.now()}`,
        ...formData,
        status,
        currentViews: 0,
        createdAt: now,
        updatedAt: now,
        author: "管理者",
      }
      setAnnouncements([newAnnouncement, ...announcements])
    }

    setShowEditDialog(false)
  }

  // 削除処理
  const handleDelete = (id: string) => {
    if (confirm("このお知らせを削除しますか？")) {
      setAnnouncements(announcements.filter(a => a.id !== id))
    }
  }

  // ステータス切り替え
  const toggleStatus = (id: string) => {
    setAnnouncements(announcements.map(a => {
      if (a.id !== id) return a
      const newStatus = a.status === "published" ? "draft" : "published"
      return { ...a, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] }
    }))
  }

  // 優先度のバッジ色
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-blue-100 text-blue-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-blue-100 text-blue-700",
    }
    return colors[priority] || ""
  }

  // ステータスのバッジ色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: "bg-blue-100 text-blue-700",
      draft: "bg-gray-100 text-gray-700",
      scheduled: "bg-blue-100 text-blue-700",
      expired: "bg-blue-100 text-blue-700",
    }
    return colors[status] || ""
  }

  // ステータスラベル
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      published: "公開中",
      draft: "下書き",
      scheduled: "予約",
      expired: "終了",
    }
    return labels[status] || ""
  }

  // 対象者ラベル
  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      all: "全員",
      students: "受講者",
      instructors: "講師",
      admins: "管理者",
    }
    return labels[audience] || ""
  }

  // 統計情報
  const stats = {
    total: announcements.length,
    published: announcements.filter(a => a.status === "published").length,
    scheduled: announcements.filter(a => a.status === "scheduled").length,
    totalViews: announcements.reduce((sum, a) => sum + a.currentViews, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">お知らせ管理</h2>
          <p className="text-sm text-gray-500">
            LMS上に表示するお知らせを管理します
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => openEditDialog()}
        >
          <Plus className="w-4 h-4 mr-2" />
          新規お知らせ作成
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">総数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Megaphone className="w-8 h-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">公開中</p>
                <p className="text-2xl font-bold text-blue-600">{stats.published}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">予約中</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">総閲覧数</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルタ・検索 */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="タイトル・内容で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全て</SelectItem>
                <SelectItem value="published">公開中</SelectItem>
                <SelectItem value="draft">下書き</SelectItem>
                <SelectItem value="scheduled">予約</SelectItem>
                <SelectItem value="expired">終了</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="優先度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全て</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="並び替え" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">日付順</SelectItem>
                <SelectItem value="views">閲覧数順</SelectItem>
                <SelectItem value="priority">優先度順</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-transparent"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* お知らせ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>お知らせ一覧 ({filteredAnnouncements.length}件)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnnouncements.map(announcement => (
              <div key={announcement.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(announcement.status)}>
                        {getStatusLabel(announcement.status)}
                      </Badge>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority === "high" ? "高" : announcement.priority === "medium" ? "中" : "低"}
                      </Badge>
                      {announcement.contentType === "video" && (
                        <Badge variant="outline">
                          <Video className="w-3 h-3 mr-1" />
                          動画
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {getAudienceLabel(announcement.targetAudience)}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-lg mb-2">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {announcement.startDate} 〜 {announcement.endDate || "無期限"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {announcement.currentViews.toLocaleString()}回閲覧
                        {announcement.displayCount > 0 && ` (上限: ${announcement.displayCount}回)`}
                      </span>
                      <span>作成: {announcement.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => toggleStatus(announcement.id)}
                    >
                      {announcement.status === "published" ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          非公開
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          公開
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => openEditDialog(announcement)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent text-blue-600 hover:text-blue-700"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                お知らせがありません
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 編集ダイアログ */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? "お知らせを編集" : "新規お知らせ作成"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>タイトル <span className="text-blue-500">*</span></Label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="お知らせのタイトル"
              />
            </div>

            <div className="space-y-2">
              <Label>コンテンツタイプ</Label>
              <Select 
                value={formData.contentType} 
                onValueChange={(v) => setFormData({ ...formData, contentType: v as "text" | "video" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      テキスト
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      動画（5MBまで）
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>内容 <span className="text-blue-500">*</span></Label>
              <Textarea 
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="お知らせの内容"
                rows={6}
              />
            </div>

            {formData.contentType === "video" && (
              <div className="space-y-2">
                <Label>動画</Label>
                <div className="flex gap-2">
                  <Input 
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="動画URL（YouTubeなど）"
                    className="flex-1"
                  />
                  <span className="text-gray-400 self-center">または</span>
                  <Button 
                    variant="outline" 
                    className="bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    ファイル選択
                  </Button>
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("動画ファイルは5MB以下にしてください")
                          return
                        }
                        setFormData({ ...formData, videoFile: file, videoUrl: "" })
                      }
                    }}
                  />
                </div>
                {formData.videoFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Video className="w-4 h-4" />
                    {formData.videoFile.name} ({(formData.videoFile.size / 1024 / 1024).toFixed(2)}MB)
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFormData({ ...formData, videoFile: null })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <p className="text-xs text-gray-500">動画ファイルは5MB以下にしてください</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>優先度</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(v) => setFormData({ ...formData, priority: v as typeof formData.priority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高（赤）</SelectItem>
                    <SelectItem value="medium">中（黄）</SelectItem>
                    <SelectItem value="low">低（緑）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>対象者</Label>
                <Select 
                  value={formData.targetAudience} 
                  onValueChange={(v) => setFormData({ ...formData, targetAudience: v as typeof formData.targetAudience })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全員</SelectItem>
                    <SelectItem value="students">受講者のみ</SelectItem>
                    <SelectItem value="instructors">講師のみ</SelectItem>
                    <SelectItem value="admins">管理者のみ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>表示開始日</Label>
                <Input 
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>表示終了日</Label>
                <Input 
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                <p className="text-xs text-gray-500">空欄の場合は無期限</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>表示回数制限</Label>
              <Input 
                type="number"
                min="0"
                value={formData.displayCount}
                onChange={(e) => setFormData({ ...formData, displayCount: parseInt(e.target.value) || 0 })}
                placeholder="0（無制限）"
              />
              <p className="text-xs text-gray-500">1人あたりの表示回数。0の場合は無制限</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="bg-transparent">
              キャンセル
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
            >
              {editingAnnouncement ? "更新" : "作成"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
