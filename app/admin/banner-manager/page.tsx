"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, ImageIcon, Save, Eye, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BannerManager() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedBanner, setSelectedBanner] = useState<any>(null)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [bannerTitle, setBannerTitle] = useState("")
  const [bannerDescription, setBannerDescription] = useState("")
  const [bannerLink, setBannerLink] = useState("")

  const [banners] = useState([
    {
      id: 1,
      title: "キャンペーンバナー",
      description: "メインキャンペーンバナー",
      imageUrl: "/campaign-banner.png",
      link: "/courses",
      status: "active",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: 2,
      title: "新コース告知",
      description: "新しいコースの告知バナー",
      imageUrl: "/new-course-announcement-banner.jpg",
      link: "/courses/new",
      status: "draft",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
    },
  ])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveBanner = () => {
    if (!bannerTitle || !previewImage) {
      alert("タイトルと画像は必須です。")
      return
    }

    // In a real implementation, this would save to the backend
    console.log("[v0] Saving banner:", {
      title: bannerTitle,
      description: bannerDescription,
      link: bannerLink,
      image: previewImage,
    })

    alert("バナーを保存しました。")

    // Reset form
    setBannerTitle("")
    setBannerDescription("")
    setBannerLink("")
    setPreviewImage("")
    setSelectedBanner(null)
  }

  const handleEditBanner = (banner: any) => {
    setSelectedBanner(banner)
    setBannerTitle(banner.title)
    setBannerDescription(banner.description)
    setBannerLink(banner.link)
    setPreviewImage(banner.imageUrl)
  }

  const handleDeleteBanner = (bannerId: number) => {
    if (confirm("このバナーを削除してもよろしいですか？")) {
      console.log("[v0] Deleting banner:", bannerId)
      alert("バナーを削除しました。")
    }
  }

  const handleActivateBanner = (bannerId: number) => {
    console.log("[v0] Activating banner:", bannerId)
    alert("バナーを有効化しました。")
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
                <h1 className="text-2xl font-bold text-gray-900">バナー管理</h1>
                <p className="text-gray-600">トップページバナーの作成・編集・管理</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Banner Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {selectedBanner ? "バナー編集" : "新規バナー作成"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>バナー画像</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {previewImage ? (
                    <div className="space-y-4">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Banner preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                          <Upload className="w-4 h-4 mr-2" />
                          画像を変更
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setPreviewImage("")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">バナー画像をアップロード</p>
                      <Button onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        画像を選択
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500">推奨サイズ: 1200x400px (3:1比率) / 最大ファイルサイズ: 5MB</p>
              </div>

              {/* Banner Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">バナータイトル *</Label>
                  <Input
                    id="title"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="キャンペーンバナー"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">説明</Label>
                  <Textarea
                    id="description"
                    value={bannerDescription}
                    onChange={(e) => setBannerDescription(e.target.value)}
                    placeholder="バナーの説明を入力..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">リンク先URL</Label>
                  <Input
                    id="link"
                    value={bannerLink}
                    onChange={(e) => setBannerLink(e.target.value)}
                    placeholder="/courses"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleSaveBanner} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {selectedBanner ? "更新" : "保存"}
                </Button>
                {selectedBanner && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedBanner(null)
                      setBannerTitle("")
                      setBannerDescription("")
                      setBannerLink("")
                      setPreviewImage("")
                    }}
                  >
                    キャンセル
                  </Button>
                )}
              </div>

              <Alert>
                <ImageIcon className="h-4 w-4" />
                <AlertDescription>
                  バナーは自動的にトップページに反映されます。公開前にプレビューで確認してください。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Banner List */}
          <Card>
            <CardHeader>
              <CardTitle>既存バナー一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <img
                        src={banner.imageUrl || "/placeholder.svg"}
                        alt={banner.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{banner.title}</h3>
                          <Badge
                            variant={banner.status === "active" ? "default" : "secondary"}
                            className={
                              banner.status === "active" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {banner.status === "active" ? "有効" : "下書き"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
                        <p className="text-xs text-gray-500">
                          更新: {banner.updatedAt} | リンク: {banner.link}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditBanner(banner)}>
                        編集
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(banner.imageUrl, "_blank")}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {banner.status === "draft" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateBanner(banner.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          有効化
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
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
  )
}
