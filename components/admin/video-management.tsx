"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Video, Edit, Save, X, Play, ExternalLink, CheckCircle, HelpCircle, FileText, AlertCircle } from "lucide-react"
import { type PartVideo, getPartVideos, savePartVideos, getDemoVideo, saveDemoVideo } from "@/lib/video-data"
import { VideoPlayer, VideoUrlHelp } from "@/components/video-player"

export function VideoManagement() {
  const [partVideos, setPartVideos] = useState<PartVideo[]>([])
  const [demoVideo, setDemoVideoState] = useState<PartVideo | null>(null)
  const [editingPart, setEditingPart] = useState<number | null>(null)
  const [editingDemo, setEditingDemo] = useState(false)
  const [editForm, setEditForm] = useState<Partial<PartVideo>>({})
  const [saveSuccess, setSaveSuccess] = useState<number | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    setPartVideos(getPartVideos())
    setDemoVideoState(getDemoVideo())
  }, [])

  const handleEdit = (video: PartVideo) => {
    setEditingPart(video.partNumber)
    setEditForm({
      videoUrl: video.videoUrl,
      textUrl: video.textUrl || "",
      title: video.title,
      description: video.description,
      duration: video.duration,
    })
  }

  const handleEditDemo = () => {
    if (demoVideo) {
      setEditingDemo(true)
      setEditForm({
        videoUrl: demoVideo.videoUrl,
        textUrl: demoVideo.textUrl || "",
        title: demoVideo.title,
        description: demoVideo.description,
        duration: demoVideo.duration,
      })
    }
  }

  const handleSave = (partNumber: number) => {
    const updatedVideos = partVideos.map((v) => {
      if (v.partNumber === partNumber) {
        return { ...v, ...editForm, updatedAt: new Date().toISOString() }
      }
      return v
    })
    setPartVideos(updatedVideos)
    savePartVideos(updatedVideos)
    setEditingPart(null)
    setEditForm({})
    setSaveSuccess(partNumber)
    setTimeout(() => setSaveSuccess(null), 2000)
  }

  const handleSaveDemo = () => {
    if (demoVideo) {
      const updatedDemo = { ...demoVideo, ...editForm, updatedAt: new Date().toISOString() }
      setDemoVideoState(updatedDemo)
      saveDemoVideo(updatedDemo)
      setEditingDemo(false)
      setEditForm({})
      setSaveSuccess(0)
      setTimeout(() => setSaveSuccess(null), 2000)
    }
  }

  const handleCancel = () => {
    setEditingPart(null)
    setEditingDemo(false)
    setEditForm({})
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins}分`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">動画URL管理</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-500 hover:text-gray-700"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Video className="w-4 h-4 mr-1" />
          {partVideos.length + 1} 動画登録済み
        </Badge>
      </div>

      {showHelp && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <VideoUrlHelp />
          </CardContent>
        </Card>
      )}

      {/* デモ動画 */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                Demo
              </div>
              デモ動画
              {saveSuccess === 0 && (
                <Badge className="bg-blue-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  保存完了
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4 mr-1" />
                    プレビュー
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>動画プレビュー: デモ動画</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <VideoPlayer src={demoVideo?.videoUrl || ""} className="w-full h-full" showHelp />
                  </div>
                </DialogContent>
              </Dialog>
              {editingDemo ? (
                <>
                  <Button size="sm" onClick={handleSaveDemo} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-1" />
                    キャンセル
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={handleEditDemo}>
                  <Edit className="w-4 h-4 mr-1" />
                  編集
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {editingDemo ? (
            <div className="space-y-4">
              <div>
                <Label>動画URL</Label>
                <Input
                  value={editForm.videoUrl || ""}
                  onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/FILE_ID/view"
                />
                <VideoUrlHelp />
              </div>
              <div>
                <Label className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  テキスト/PDF URL
                </Label>
                <Input
                  value={editForm.textUrl || ""}
                  onChange={(e) => setEditForm({ ...editForm, textUrl: e.target.value })}
                  placeholder="https://example.com/lecture-material.pdf または Google Drive URL"
                />
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-800">
                      <p className="font-medium mb-1">Google DriveのPDF埋め込み手順:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Google Driveでファイルを右クリック → 「共有」</li>
                        <li>
                          「一般的なアクセス」を <strong>「リンクを知っている全員」</strong> に変更
                        </li>
                        <li>「リンクをコピー」して上の欄に貼り付け</li>
                      </ol>
                      <p className="mt-2 text-amber-700">
                        ※「制限付き」のままだと「アクセス権が必要」エラーが表示されます
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label>説明</Label>
                <Textarea
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">動画URL:</span>
                <a
                  href={demoVideo?.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 truncate max-w-md"
                >
                  {demoVideo?.videoUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {demoVideo?.textUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">テキストURL:</span>
                  <a
                    href={demoVideo.textUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 truncate max-w-md"
                  >
                    {demoVideo.textUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              <p className="text-sm text-gray-600">{demoVideo?.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* パート動画一覧 */}
      <div className="space-y-4">
        {partVideos.map((video) => (
          <Card key={video.id} className={editingPart === video.partNumber ? "border-blue-400" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {video.partNumber}
                  </div>
                  {video.title}
                  <Badge variant="outline" className="text-gray-500">
                    {formatDuration(video.duration)}
                  </Badge>
                  {saveSuccess === video.partNumber && (
                    <Badge className="bg-blue-600 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      保存完了
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-1" />
                        プレビュー
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>動画プレビュー: {video.title}</DialogTitle>
                      </DialogHeader>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <VideoPlayer src={video.videoUrl} className="w-full h-full" showHelp />
                      </div>
                    </DialogContent>
                  </Dialog>
                  {editingPart === video.partNumber ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSave(video.partNumber)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        保存
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-1" />
                        キャンセル
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                      <Edit className="w-4 h-4 mr-1" />
                      編集
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingPart === video.partNumber ? (
                <div className="space-y-4">
                  <div>
                    <Label>動画URL</Label>
                    <Input
                      value={editForm.videoUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/FILE_ID/view"
                    />
                    <VideoUrlHelp />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      テキスト/PDF URL
                    </Label>
                    <Input
                      value={editForm.textUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, textUrl: e.target.value })}
                      placeholder="https://example.com/lecture-material.pdf または Google Drive URL"
                    />
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-amber-800">
                          <p className="font-medium mb-1">Google DriveのPDF埋め込み手順:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Google Driveでファイルを右クリック → 「共有」</li>
                            <li>
                              「一般的なアクセス」を <strong>「リンクを知っている全員」</strong> に変更
                            </li>
                            <li>「リンクをコピー」して上の欄に貼り付け</li>
                          </ol>
                          <p className="mt-2 text-amber-700">
                            ※「制限付き」のままだと「アクセス権が必要」エラーが表示されます
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>説明</Label>
                    <Textarea
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">動画URL:</span>
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 truncate max-w-md"
                    >
                      {video.videoUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {video.textUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">テキストURL:</span>
                      <a
                        href={video.textUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 truncate max-w-md"
                      >
                        {video.textUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{video.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
