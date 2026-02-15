"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Trash2, Edit, Save, X, CheckCircle } from "lucide-react"

interface Banner {
  id: number
  title: string
  imageUrl: string
  link: string
  description: string
  status: "published" | "draft" | "archived"
  createdAt: string
  updatedAt: string
}

export default function AdminBannerManager() {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 1,
      title: "新春キャンペーン",
      imageUrl: "/new-course-announcement-banner.jpg",
      link: "/courses",
      description: "新年特別価格でコースを提供中",
      status: "published",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
  ])

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    link: "",
    description: "",
    status: "draft" as Banner["status"],
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            // Simulate uploaded image URL
            setFormData((prev) => ({
              ...prev,
              imageUrl: `/uploaded-banner-${Date.now()}.jpg`,
            }))
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const handleCreateBanner = () => {
    setIsCreating(true)
    setFormData({
      title: "",
      imageUrl: "",
      link: "",
      description: "",
      status: "draft",
    })
    setEditingBanner(null)
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      link: banner.link,
      description: banner.description,
      status: banner.status,
    })
    setIsCreating(false)
  }

  const handleSaveBanner = () => {
    if (editingBanner) {
      // Update existing banner
      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === editingBanner.id
            ? {
                ...banner,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : banner,
        ),
      )
    } else {
      // Create new banner
      const newBanner: Banner = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setBanners((prev) => [...prev, newBanner])
    }

    // Reset form
    setEditingBanner(null)
    setIsCreating(false)
    setFormData({
      title: "",
      imageUrl: "",
      link: "",
      description: "",
      status: "draft",
    })
  }

  const handleDeleteBanner = (id: number) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== id))
  }

  const handleStatusChange = (id: number, status: Banner["status"]) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id
          ? {
              ...banner,
              status,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : banner,
      ),
    )
  }

  const cancelEdit = () => {
    setEditingBanner(null)
    setIsCreating(false)
    setFormData({
      title: "",
      imageUrl: "",
      link: "",
      description: "",
      status: "draft",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">バナー管理</h2>
          <p className="text-gray-600">TOPページのキャンペーンバナーを管理します</p>
        </div>
        <Button onClick={handleCreateBanner} className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          新しいバナーを作成
        </Button>
      </div>

      {/* Banner Form */}
      {(isCreating || editingBanner) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBanner ? "バナーを編集" : "新しいバナーを作成"}</CardTitle>
            <CardDescription>バナーの詳細情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">バナータイトル</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="キャンペーン名を入力"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">リンク先URL</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="/courses"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="バナーの説明を入力"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>バナー画像</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.imageUrl ? (
                  <div className="space-y-4">
                    <img
                      src={formData.imageUrl || "/placeholder.svg"}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        画像を変更
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        削除
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">画像をアップロードしてください</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      ファイルを選択
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">アップロード中... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>ステータス</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Banner["status"]) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="published">公開中</SelectItem>
                  <SelectItem value="archived">アーカイブ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button onClick={handleSaveBanner} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                保存
              </Button>
              <Button variant="outline" onClick={cancelEdit} className="flex items-center gap-2 bg-transparent">
                <X className="w-4 h-4" />
                キャンセル
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banner List */}
      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={banner.imageUrl || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{banner.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{banner.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>リンク: {banner.link}</span>
                        <span>作成: {banner.createdAt}</span>
                        <span>更新: {banner.updatedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          banner.status === "published"
                            ? "default"
                            : banner.status === "draft"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {banner.status === "published" && "公開中"}
                        {banner.status === "draft" && "下書き"}
                        {banner.status === "archived" && "アーカイブ"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Select
                    value={banner.status}
                    onValueChange={(value: Banner["status"]) => handleStatusChange(banner.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">下書き</SelectItem>
                      <SelectItem value="published">公開中</SelectItem>
                      <SelectItem value="archived">アーカイブ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBanner(banner)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    編集
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    削除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">バナーがありません</h3>
            <p className="text-gray-600 mb-4">最初のキャンペーンバナーを作成してください</p>
            <Button onClick={handleCreateBanner}>新しいバナーを作成</Button>
          </CardContent>
        </Card>
      )}

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          公開中のバナーは自動的にTOPページに表示されます。複数のバナーがある場合は作成順に表示されます。
        </AlertDescription>
      </Alert>
    </div>
  )
}
