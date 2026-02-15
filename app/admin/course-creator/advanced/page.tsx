"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Plus,
  Upload,
  Play,
  FileText,
  CheckSquare,
  FileIcon,
  Music,
  TestTube,
  FormInput,
  Save,
  Eye,
  Settings,
} from "lucide-react"

export default function AdvancedCourseCreator() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [courseTitle, setCourseTitle] = useState("オンラインライブデモ1")
  const [lectureTitle, setLectureTitle] = useState("")
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleVideoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        alert("動画ファイルを選択してください")
        return
      }

      if (file.size > 500 * 1024 * 1024) {
        alert("ファイルサイズは500MB以下にしてください")
        return
      }

      setSelectedVideoFile(file)
    }
  }

  const handleVideoUpload = async () => {
    if (!selectedVideoFile) return

    setIsUploading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const videoData = {
        id: Date.now().toString(),
        name: selectedVideoFile.name,
        size: selectedVideoFile.size,
        type: selectedVideoFile.type,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(selectedVideoFile),
      }

      const existingVideos = JSON.parse(localStorage.getItem("uploadedVideos") || "[]")
      existingVideos.push(videoData)
      localStorage.setItem("uploadedVideos", JSON.stringify(existingVideos))

      alert("動画のアップロードが完了しました")
      setSelectedVideoFile(null)
    } catch (error) {
      alert("アップロードに失敗しました")
    } finally {
      setIsUploading(false)
    }
  }

  const lectureTypes = [
    { id: "video", label: "動画", icon: Play },
    { id: "text", label: "テキスト", icon: FileText },
    { id: "quiz", label: "理解度チェック", icon: CheckSquare },
    { id: "pdf", label: "PDF", icon: FileIcon },
    { id: "material", label: "資料", icon: FileIcon },
    { id: "audio", label: "音声", icon: Music },
    { id: "exam", label: "試験", icon: TestTube },
    { id: "form", label: "フォーム", icon: FormInput },
  ]

  const questionTypes = [
    { id: "multiple", label: "選択問題" },
    { id: "dropdown", label: "ドロップダウン選択問題" },
    { id: "drag-drop", label: "ドラッグ&ドロップ穴埋め問題" },
    { id: "text-free", label: "自由記述テキストフォーム問題" },
    { id: "text-complex", label: "自由記述テキストフォーム問題（複数行）" },
    { id: "text-box", label: "自由記述テキストボックス問題（複数行）" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">高度なコース作成</h1>
            <p className="text-gray-600">包括的なe-learningコンテンツを作成</p>
          </div>
        </div>

        {/* Course Creation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-9 w-full">
            <TabsTrigger value="basic">基本設定</TabsTrigger>
            <TabsTrigger value="pricing">価格設定</TabsTrigger>
            <TabsTrigger value="custom-form">カスタムフォーム設定</TabsTrigger>
            <TabsTrigger value="publish">公開設定</TabsTrigger>
            <TabsTrigger value="instructor">講師設定</TabsTrigger>
            <TabsTrigger value="notification">通知設定</TabsTrigger>
            <TabsTrigger value="category">カテゴリー設定</TabsTrigger>
            <TabsTrigger value="learning-page">受講中ページ設定</TabsTrigger>
            <TabsTrigger value="lecture">レクチャー設定</TabsTrigger>
          </TabsList>

          {/* Basic Settings */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>プロコースを新規作成する</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course-title">プロコースのタイトル</Label>
                  <Input
                    id="course-title"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="コースタイトルを入力してください"
                  />
                  <p className="text-sm text-gray-500">タイトルは後から変更できます。</p>
                </div>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">次に進む</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lecture Settings */}
          <TabsContent value="lecture" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Lecture Creation */}
              <Card>
                <CardHeader>
                  <CardTitle>レクチャー作成</CardTitle>
                  <p className="text-sm text-gray-600">完成したレクチャーの前にのみセクションを追加できます</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>レクチャー 1</Label>
                    <Input
                      placeholder="レクチャータイトルを入力します。（全角35文字以内）"
                      value={lectureTitle}
                      onChange={(e) => setLectureTitle(e.target.value)}
                    />
                  </div>

                  {/* Lecture Type Selection */}
                  <div className="grid grid-cols-4 gap-3">
                    {lectureTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <Button
                          key={type.id}
                          variant="outline"
                          className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-sm">{type.label}</span>
                        </Button>
                      )
                    })}
                  </div>

                  <Button className="w-full bg-transparent" variant="outline">
                    レクチャーの編集に進む
                  </Button>
                </CardContent>
              </Card>

              {/* Video Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>動画設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Video Upload */}
                  <div className="space-y-2">
                    <Label>動画新規アップロード</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileSelect}
                        className="hidden"
                        id="video-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("video-upload")?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? "アップロード中..." : "ファイルを選択"}
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        {selectedVideoFile ? selectedVideoFile.name : "選択されていません"}
                      </p>
                      {selectedVideoFile && !isUploading && (
                        <Button onClick={handleVideoUpload} className="mt-2 bg-cyan-500 hover:bg-cyan-600" size="sm">
                          アップロード開始
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <Label>meta description（全角200文字以内）</Label>
                    <Textarea placeholder="プレビューページのmeta descriptionに設定する文字を入力してください。" />
                    <p className="text-sm text-gray-500">
                      プレビューページのmeta descriptionに設定する文字を入力してください。
                      未入力の場合は、本文の冒頭のテキストが設定されます。
                    </p>
                  </div>

                  {/* Display Settings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">表示設定</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>レクチャー完了ボタンとレクチャーリストを隠す</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>前後のレクチャーに移動するアイコンを隠す</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Video Player Settings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">動画プレイヤー設定</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>10秒戻しアイコンを隠す</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>10秒進むアイコンを隠す</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>シークバー操作を無効にする</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>再生速度変更を隠す</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>ピクチャーインピクチャーのアイコンを隠す</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>動画の再生が完了するまでレクチャー完了ボタンをクリック不可にする</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>動画再生終了時の次のレクチャーへの自動遷移を無効にする</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Chapter Settings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">チャプター設定</h4>
                    <Button variant="outline" className="w-full text-cyan-600 bg-transparent">
                      チャプターを追加する
                    </Button>
                  </div>

                  {/* Monitoring Settings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">受講中監視機能の設定</h4>
                    <div className="flex items-center justify-between">
                      <Label>インカメラによる監視を有効にする</Label>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exam Creation */}
          <TabsContent value="exam" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Exam Settings Sidebar */}
              <Card>
                <CardHeader>
                  <CardTitle>試験設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="ghost">
                      問題の編集
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      試験の設定
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      試験開始可能時刻の設定
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      禁止行動の設定
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      試験中監視機能の設定
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      結果通知の設定
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      受験前ページの設定
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full mb-2 bg-transparent" variant="outline">
                      下書きとして保存
                    </Button>
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600">保存して完成</Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>合計スコア:</span>
                      <span>0点</span>
                    </div>
                    <div className="flex justify-between">
                      <span>合計問題数:</span>
                      <span>0問</span>
                    </div>
                    <div className="flex justify-between">
                      <span>合計ページ数:</span>
                      <span>1ページ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Creation */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>問題の編集</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        問題一括登録
                      </Button>
                      <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                        セクションを追加
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question Type Selection */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">問題の形式を選択してください。</h4>
                    <div className="space-y-2">
                      {questionTypes.map((type) => (
                        <Button key={type.id} variant="outline" className="w-full justify-start bg-transparent">
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Question Editor */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">テキストを追加する</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Settings */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>価格設定</CardTitle>
                <CardDescription>コースの価格と支払いオプションを設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="course-price">コース価格（円）</Label>
                      <Input id="course-price" type="number" placeholder="29800" min="0" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount-price">割引価格（円）</Label>
                      <Input id="discount-price" type="number" placeholder="19800" min="0" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="free-course" />
                      <Label htmlFor="free-course">無料コース</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="subscription" />
                      <Label htmlFor="subscription">サブスクリプション対応</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>支払い方法</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="credit-card" defaultChecked />
                          <Label htmlFor="credit-card">クレジットカード</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="bank-transfer" />
                          <Label htmlFor="bank-transfer">銀行振込</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="convenience-store" />
                          <Label htmlFor="convenience-store">コンビニ決済</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-deadline">支払い期限（日）</Label>
                      <Input id="payment-deadline" type="number" placeholder="7" min="1" max="30" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">価格表示設定</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="show-original-price" defaultChecked />
                      <Label htmlFor="show-original-price">元の価格を表示</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-discount-badge" />
                      <Label htmlFor="show-discount-badge">割引バッジを表示</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="limited-time-offer" />
                      <Label htmlFor="limited-time-offer">期間限定オファー</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Publish Settings */}
          <TabsContent value="publish">
            <Card>
              <CardHeader>
                <CardTitle>公開設定</CardTitle>
                <CardDescription>コースの公開状態と公開条件を設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Publish Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>公開状態</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="draft" name="publish-status" defaultChecked />
                          <Label htmlFor="draft">下書き</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="published" name="publish-status" />
                          <Label htmlFor="published">公開</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="private" name="publish-status" />
                          <Label htmlFor="private">非公開</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="scheduled" name="publish-status" />
                          <Label htmlFor="scheduled">予約公開</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publish-date">公開開始日時</Label>
                      <Input id="publish-date" type="datetime-local" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-date">公開終了日時</Label>
                      <Input id="end-date" type="datetime-local" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="enrollment-limit">受講期限（日）</Label>
                      <Input id="enrollment-limit" type="number" placeholder="90" min="1" />
                      <p className="text-sm text-gray-500">受講開始から何日間アクセス可能か</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>アクセス制限</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="require-login" defaultChecked />
                          <Label htmlFor="require-login">ログイン必須</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="require-payment" />
                          <Label htmlFor="require-payment">支払い必須</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="require-approval" />
                          <Label htmlFor="require-approval">管理者承認必須</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="limit-devices" />
                          <Label htmlFor="limit-devices">デバイス制限</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-students">最大受講者数</Label>
                      <Input id="max-students" type="number" placeholder="100" min="1" />
                      <p className="text-sm text-gray-500">0で無制限</p>
                    </div>

                    <div className="space-y-2">
                      <Label>公開範囲</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="public-all" name="visibility" defaultChecked />
                          <Label htmlFor="public-all">全ユーザー</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="public-members" name="visibility" />
                          <Label htmlFor="public-members">会員のみ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="public-groups" name="visibility" />
                          <Label htmlFor="public-groups">特定グループ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="public-invite" name="visibility" />
                          <Label htmlFor="public-invite">招待制</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">SEO設定</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta-title">メタタイトル</Label>
                      <Input id="meta-title" placeholder="コースのメタタイトル" maxLength={60} />
                      <p className="text-sm text-gray-500">60文字以内推奨</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta-description">メタディスクリプション</Label>
                      <Textarea id="meta-description" placeholder="コースの説明文" maxLength={160} />
                      <p className="text-sm text-gray-500">160文字以内推奨</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta-keywords">キーワード</Label>
                      <Input id="meta-keywords" placeholder="キーワード1, キーワード2, キーワード3" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="search-index" defaultChecked />
                      <Label htmlFor="search-index">検索エンジンにインデックスを許可</Label>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">通知設定</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-publish" defaultChecked />
                      <Label htmlFor="notify-publish">公開時に受講者に通知</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-update" />
                      <Label htmlFor="notify-update">コース更新時に通知</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-deadline" defaultChecked />
                      <Label htmlFor="notify-deadline">受講期限前に通知</Label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button variant="outline">プレビュー</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">公開設定を保存</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content would be implemented similarly */}
          <TabsContent value="custom-form">
            <Card>
              <CardHeader>
                <CardTitle>カスタムフォーム設定</CardTitle>
              </CardHeader>
              <CardContent>
                <p>カスタムフォーム設定機能を実装予定</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructor">
            <Card>
              <CardHeader>
                <CardTitle>講師設定</CardTitle>
              </CardHeader>
              <CardContent>
                <p>講師設定機能を実装予定</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notification">
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
              </CardHeader>
              <CardContent>
                <p>通知設定機能を実装予定</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category">
            <Card>
              <CardHeader>
                <CardTitle>カテゴリー設定</CardTitle>
              </CardHeader>
              <CardContent>
                <p>カテゴリー設定機能を実装予定</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning-page">
            <Card>
              <CardHeader>
                <CardTitle>受講中ページ設定</CardTitle>
              </CardHeader>
              <CardContent>
                <p>受講中ページ設定機能を実装予定</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            下書き保存
          </Button>
          <div className="flex gap-4">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              プレビュー
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              公開設定
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
