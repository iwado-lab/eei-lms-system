"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Calendar, Clock, Users, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TopPageCreator() {
  const [selectedItems, setSelectedItems] = useState<string[]>(["courses"])
  const [currentStep, setCurrentStep] = useState("select") // select, create, edit
  const [selectedType, setSelectedType] = useState("")
  const router = useRouter()

  const publishedPages = [
    {
      id: 1,
      type: "フリーHTML（1カラム）",
      title: "TOPページ",
      status: "published",
      publishDate: "2025/08/20 10:00",
      lastModified: "2025/08/20 09:45",
      author: "管理者",
      views: 1250,
      version: "v1.2",
      scheduledPublish: null,
      approvalStatus: "approved",
    },
    {
      id: 2,
      type: "バナー画像（1枚）",
      title: "top 0214",
      status: "draft",
      publishDate: null,
      lastModified: "2025/08/19 16:30",
      author: "管理者",
      views: 0,
      version: "v1.0",
      scheduledPublish: "2025/08/25 09:00",
      approvalStatus: "pending",
    },
    {
      id: 3,
      type: "バナー画像（1枚）",
      title: "TOP",
      status: "draft",
      publishDate: null,
      lastModified: "2025/08/18 14:20",
      author: "管理者",
      views: 0,
      version: "v1.0",
      scheduledPublish: null,
      approvalStatus: "draft",
    },
    {
      id: 4,
      type: "バナー画像（1枚）",
      title: "会員登録",
      status: "draft",
      publishDate: null,
      lastModified: "2025/08/17 11:15",
      author: "管理者",
      views: 0,
      version: "v1.0",
      scheduledPublish: null,
      approvalStatus: "draft",
    },
    {
      id: 5,
      type: "コース一覧、オンライン講習一覧",
      title: "",
      status: "published",
      publishDate: "2025/08/15 08:00",
      lastModified: "2025/08/15 07:45",
      author: "管理者",
      views: 2100,
      version: "v2.1",
      scheduledPublish: null,
      approvalStatus: "approved",
    },
    {
      id: 6,
      type: "お知らせ一覧、お知らせ",
      title: "",
      status: "published",
      publishDate: "2025/08/10 12:00",
      lastModified: "2025/08/20 15:30",
      author: "管理者",
      views: 890,
      version: "v1.5",
      scheduledPublish: null,
      approvalStatus: "approved",
    },
  ]

  const pageTypes = [
    { id: "courses", label: "コース一覧", description: "利用可能なコースを表示" },
    { id: "mycourses", label: "マイコース一覧", description: "受講中のコースを表示" },
    { id: "banner1", label: "バナー画像（1枚）", description: "大きなバナー画像を表示" },
    { id: "banner-multi", label: "バナー画像（小・複数）", description: "複数の小さなバナーを表示" },
    { id: "freehtml", label: "フリーHTML（1カラム）", description: "自由なHTMLコンテンツ" },
    { id: "news", label: "お知らせ一覧", description: "最新のお知らせを表示" },
  ]

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleCreatePage = (type: string) => {
    setSelectedType(type)
    router.push("/admin/toppage-creator/editor")
  }

  const handlePublish = (pageId: number) => {
    const page = publishedPages.find((p) => p.id === pageId)
    if (page) {
      // Update page status to published
      page.status = "published"
      page.publishDate = new Date().toLocaleString("ja-JP")
      alert(`「${page.title || page.type}」を公開しました。`)
    }
  }

  const handleUnpublish = (pageId: number) => {
    const page = publishedPages.find((p) => p.id === pageId)
    if (page && confirm("このページを非公開にしますか？")) {
      page.status = "draft"
      page.publishDate = null
      alert(`「${page.title || page.type}」を非公開にしました。`)
    }
  }

  const handleSchedulePublish = (pageId: number) => {
    const page = publishedPages.find((p) => p.id === pageId)
    const scheduleDate = prompt("公開予定日時を入力してください (例: 2025/08/25 09:00):")
    if (scheduleDate && page) {
      page.scheduledPublish = scheduleDate
      page.approvalStatus = "pending"
      alert(`「${page.title || page.type}」の公開を${scheduleDate}に予約しました。`)
    }
  }

  const handlePreview = (pageId: number) => {
    const page = publishedPages.find((p) => p.id === pageId)
    if (page) {
      // Open preview in new window
      const previewWindow = window.open("", "_blank", "width=1200,height=800")
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head><title>プレビュー: ${page.title || page.type}</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h1>プレビュー: ${page.title || page.type}</h1>
              <p>タイプ: ${page.type}</p>
              <p>ステータス: ${page.status}</p>
              <p>最終更新: ${page.lastModified}</p>
              <div style="border: 1px solid #ccc; padding: 20px; margin-top: 20px;">
                <p>ここにページコンテンツが表示されます。</p>
              </div>
            </body>
          </html>
        `)
        previewWindow.document.close()
      }
    }
  }

  const handleDeletePage = (pageId: number) => {
    const page = publishedPages.find((p) => p.id === pageId)
    if (page && confirm(`「${page.title || page.type}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      // Remove page from array (in real implementation, this would be an API call)
      const index = publishedPages.findIndex((p) => p.id === pageId)
      if (index > -1) {
        publishedPages.splice(index, 1)
        alert("ページを削除しました。")
      }
    }
  }

  const handleApprove = (pageId: number) => {
    const page = publishedPages.find((p) => p.id === pageId)
    if (page) {
      page.approvalStatus = "approved"
      if (page.scheduledPublish) {
        alert(`「${page.title || page.type}」を承認しました。${page.scheduledPublish}に自動公開されます。`)
      } else {
        page.status = "published"
        page.publishDate = new Date().toLocaleString("ja-JP")
        alert(`「${page.title || page.type}」を承認・公開しました。`)
      }
    }
  }

  const getStatusBadge = (status: string, approvalStatus: string) => {
    if (status === "published") {
      return <Badge className="bg-blue-100 text-blue-800">公開</Badge>
    }
    if (approvalStatus === "pending") {
      return <Badge className="bg-yellow-100 text-yellow-800">承認待ち</Badge>
    }
    return <Badge className="bg-gray-100 text-gray-800">下書き</Badge>
  }

  if (currentStep === "create") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setCurrentStep("select")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">プロコースを新規作成する</h1>
                  <p className="text-gray-600">トップ &gt; プロコースを新規作成する</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">プロコースを新規作成する</h2>

              <div className="mb-6">
                <label className="block text-left text-gray-700 font-medium mb-2">プロコースのタイトル</label>
                <input
                  type="text"
                  placeholder="オンラインライブデモ1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-sm text-gray-500 mt-2">タイトルは後から変更できます。</p>
              </div>

              <Button className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 text-lg">
                次に進む
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/admin")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                管理画面に戻る
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">トップページ設定</h1>
                <p className="text-gray-600">ページの作成・管理・公開システム</p>
              </div>
            </div>
            <Badge variant="outline">JA</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">ページ管理</h2>
              <Button
                onClick={() => handleCreatePage("freehtml")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                新規作成
              </Button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {publishedPages.map((page) => (
              <div key={page.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 text-gray-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="9" />
                        <line x1="9" y1="13" x2="15" y2="13" />
                        <line x1="9" y1="17" x2="15" y2="17" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{page.type}</h3>
                        {page.title && <span className="text-sm text-gray-600">- {page.title}</span>}
                        {getStatusBadge(page.status, page.approvalStatus)}
                        <Badge variant="outline" className="text-xs">
                          {page.version}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{page.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>更新: {page.lastModified}</span>
                        </div>
                        {page.publishDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>公開: {page.publishDate}</span>
                          </div>
                        )}
                        {page.scheduledPublish && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-600">予約: {page.scheduledPublish}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(page.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/toppage-creator/editor?id=${page.id}`)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    {page.status === "published" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnpublish(page.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(page.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSchedulePublish(page.id)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePage(page.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Publishing Status Details */}
                {(page.approvalStatus === "pending" || page.scheduledPublish) && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    {page.approvalStatus === "pending" && (
                      <div className="flex items-center gap-2 text-sm text-yellow-700">
                        <Clock className="w-4 h-4" />
                        <span>承認待ち - 管理者の承認が必要です</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-auto bg-transparent"
                          onClick={() => handleApprove(page.id)}
                        >
                          承認する
                        </Button>
                      </div>
                    )}
                    {page.scheduledPublish && (
                      <div className="flex items-center gap-2 text-sm text-orange-700">
                        <Calendar className="w-4 h-4" />
                        <span>公開予約済み: {page.scheduledPublish}</span>
                        <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                          予約変更
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Publishing System Summary */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {publishedPages.filter((p) => p.status === "published").length}
                </div>
                <div className="text-sm text-gray-600">公開中</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {publishedPages.filter((p) => p.status === "draft").length}
                </div>
                <div className="text-sm text-gray-600">下書き</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {publishedPages.filter((p) => p.approvalStatus === "pending").length}
                </div>
                <div className="text-sm text-gray-600">承認待ち</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {publishedPages.filter((p) => p.scheduledPublish).length}
                </div>
                <div className="text-sm text-gray-600">予約公開</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
