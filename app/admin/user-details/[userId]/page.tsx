"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  User,
  Camera,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Upload,
  FileText,
  Ban,
  RotateCcw,
  Mail,
  History,
  Settings,
  ImageIcon,
  Pause,
  Award,
} from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  status: string
  registeredDate: string
  lastLogin: string
  faceImageUrl: string
  faceThreshold: number
  manualAuthApproved: boolean
  certificateBlocked: boolean
  excludeFromReport: boolean
  violationCount: number
  authHistory: Array<{
    id: string
    timestamp: string
    result: "success" | "failure"
    confidence: number
    screenshot?: string
  }>
  courseProgress: Array<{
    courseId: string
    courseName: string
    progress: number
    completed: boolean
    blocked: boolean
  }>
  documents: Array<{
    id: string
    type: "license" | "residence_card" | "passport_jp" | "other"
    fileName: string
    uploadDate: string
    verified: boolean
  }>
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string

  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const [newFaceImage, setNewFaceImage] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = () => {
    // LocalStorageから読み込み、またはモックデータを使用
    const storedUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]")
    const foundUser = storedUsers.find((u: any) => u.id === userId)

    if (foundUser) {
      setUser(foundUser)
    } else {
      // モックデータ
      setUser({
        id: userId,
        name: "田中太郎",
        email: "tanaka@example.com",
        role: "受講者",
        status: "アクティブ",
        registeredDate: "2025-01-15",
        lastLogin: "2025-01-20 14:30",
        faceImageUrl: "",
        faceThreshold: 0.6,
        manualAuthApproved: false,
        certificateBlocked: false,
        excludeFromReport: false,
        violationCount: 2,
        authHistory: [
          { id: "1", timestamp: "2025-01-20 14:30", result: "success", confidence: 0.85 },
          { id: "2", timestamp: "2025-01-20 10:15", result: "failure", confidence: 0.35 },
          { id: "3", timestamp: "2025-01-19 09:00", result: "success", confidence: 0.78 },
        ],
        courseProgress: [
          { courseId: "1", courseName: "派遣元責任者講習 Part 1", progress: 100, completed: true, blocked: false },
          { courseId: "2", courseName: "派遣元責任者講習 Part 2", progress: 65, completed: false, blocked: false },
          { courseId: "3", courseName: "派遣元責任者講習 Part 3", progress: 0, completed: false, blocked: false },
        ],
        documents: [],
      })
    }
    setIsLoading(false)
  }

  const saveUser = (updatedUser: UserData) => {
    const storedUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]")
    const index = storedUsers.findIndex((u: any) => u.id === userId)
    if (index >= 0) {
      storedUsers[index] = updatedUser
    } else {
      storedUsers.push(updatedUser)
    }
    localStorage.setItem("adminUsers", JSON.stringify(storedUsers))
    setUser(updatedUser)
  }

  // 手動認証完了処理
  const handleManualAuth = () => {
    if (!user) return
    const updatedUser = { ...user, manualAuthApproved: true }
    saveUser(updatedUser)
    alert("手動認証を完了しました。")
  }

  // 閾値変更
  const handleThresholdChange = (value: number[]) => {
    if (!user) return
    const updatedUser = { ...user, faceThreshold: value[0] }
    saveUser(updatedUser)
  }

  // 顔画像差し替え
  const handleFaceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setNewFaceImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const confirmFaceImageChange = () => {
    if (!user || !newFaceImage) return
    const updatedUser = { ...user, faceImageUrl: newFaceImage }
    saveUser(updatedUser)
    setShowImageUpload(false)
    setNewFaceImage(null)
    alert("認証用画像を更新しました。")
  }

  // 証明書発行停止
  const toggleCertificateBlock = () => {
    if (!user) return
    const updatedUser = { ...user, certificateBlocked: !user.certificateBlocked }
    saveUser(updatedUser)
  }

  // 報告対象から除外
  const toggleExcludeFromReport = () => {
    if (!user) return
    const updatedUser = { ...user, excludeFromReport: !user.excludeFromReport }
    saveUser(updatedUser)
  }

  // パート未受講に戻す
  const resetPartProgress = (courseId: string) => {
    if (!user) return
    const updatedProgress = user.courseProgress.map((cp) =>
      cp.courseId === courseId ? { ...cp, progress: 0, completed: false } : cp
    )
    const updatedUser = { ...user, courseProgress: updatedProgress }
    saveUser(updatedUser)
    alert("該当パートの進捗をリセットしました。")
  }

  // パートをブロック
  const togglePartBlock = (courseId: string) => {
    if (!user) return
    const updatedProgress = user.courseProgress.map((cp) =>
      cp.courseId === courseId ? { ...cp, blocked: !cp.blocked } : cp
    )
    const updatedUser = { ...user, courseProgress: updatedProgress }
    saveUser(updatedUser)
  }

  // 書類アップロード
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "license" | "residence_card" | "passport_jp" | "other") => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    const newDoc = {
      id: `doc_${Date.now()}`,
      type,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      verified: false,
    }

    const updatedUser = { ...user, documents: [...user.documents, newDoc] }
    saveUser(updatedUser)
    setShowDocumentUpload(false)
  }

  // 書類認証
  const verifyDocument = (docId: string) => {
    if (!user) return
    const updatedDocs = user.documents.map((doc) =>
      doc.id === docId ? { ...doc, verified: true } : doc
    )
    const updatedUser = { ...user, documents: updatedDocs, manualAuthApproved: true }
    saveUser(updatedUser)
    alert("書類を確認し、手動認証を完了しました。")
  }

  // 不正者へのメール送信
  const sendWarningEmail = async () => {
    if (!user) return
    try {
      const response = await fetch("/api/send-alert-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alert: {
            studentName: user.name,
            courseName: "派遣元責任者講習",
            type: "warning",
            severity: "high",
            description: `不正検知回数: ${user.violationCount}回`,
            timestamp: new Date().toISOString(),
          },
          recipients: [user.email],
          action: "warning",
        }),
      })
      if (response.ok) {
        alert("警告メールを送信しました。")
      }
    } catch (error) {
      console.error("メール送信エラー:", error)
      alert("メール送信に失敗しました。")
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-2xl font-bold">ユーザー詳細管理</h1>
        </div>

        {/* 基本情報 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              基本情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-gray-500">名前</Label>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <Label className="text-gray-500">メール</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-gray-500">ステータス</Label>
                <Badge variant={user.status === "アクティブ" ? "default" : "secondary"}>{user.status}</Badge>
              </div>
              <div>
                <Label className="text-gray-500">違反回数</Label>
                <Badge variant={user.violationCount > 0 ? "destructive" : "secondary"}>
                  {user.violationCount}回
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="auth" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="auth">認証管理</TabsTrigger>
            <TabsTrigger value="progress">受講進捗</TabsTrigger>
            <TabsTrigger value="documents">書類確認</TabsTrigger>
            <TabsTrigger value="history">認証履歴</TabsTrigger>
          </TabsList>

          {/* 認証管理タブ */}
          <TabsContent value="auth">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 顔認証設定 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    顔認証設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 認証用画像 */}
                  <div>
                    <Label>認証用画像</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {user.faceImageUrl ? (
                          <img src={user.faceImageUrl || "/placeholder.svg"} alt="顔画像" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            画像差し替え
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>認証用画像の差し替え</DialogTitle>
                            <DialogDescription>新しい顔画像をアップロードしてください。</DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Input type="file" accept="image/*" onChange={handleFaceImageUpload} />
                            {newFaceImage && (
                              <div className="mt-4">
                                <img src={newFaceImage || "/placeholder.svg"} alt="プレビュー" className="w-48 h-48 object-cover rounded-lg" />
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowImageUpload(false)}>
                              キャンセル
                            </Button>
                            <Button onClick={confirmFaceImageChange} disabled={!newFaceImage}>
                              確定
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* 閾値設定 */}
                  <div>
                    <Label>認証閾値（個人設定）</Label>
                    <p className="text-sm text-gray-500 mb-2">
                      値が低いほど認証が厳しくなります。標準: 0.6
                    </p>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[user.faceThreshold]}
                        onValueChange={handleThresholdChange}
                        min={0.3}
                        max={0.8}
                        step={0.05}
                        className="flex-1"
                      />
                      <span className="font-mono text-lg">{user.faceThreshold.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* 手動認証 */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>手動認証ステータス</Label>
                        <p className="text-sm text-gray-500">
                          {user.manualAuthApproved ? "手動認証済み" : "未承認"}
                        </p>
                      </div>
                      {user.manualAuthApproved ? (
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          承認済み
                        </Badge>
                      ) : (
                        <Button onClick={handleManualAuth}>
                          <Shield className="w-4 h-4 mr-2" />
                          手動認証完了
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 不正対応設定 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    不正対応設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 証明書発行停止 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>修了書・証明書の発行停止</Label>
                      <p className="text-sm text-gray-500">有効にすると証明書が発行されません</p>
                    </div>
                    <Switch checked={user.certificateBlocked} onCheckedChange={toggleCertificateBlock} />
                  </div>

                  {/* 報告対象から除外 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>資格取得者報告対象から除外</Label>
                      <p className="text-sm text-gray-500">有効にすると報告対象外になります</p>
                    </div>
                    <Switch checked={user.excludeFromReport} onCheckedChange={toggleExcludeFromReport} />
                  </div>

                  {/* 警告メール送信 */}
                  <div className="border-t pt-4">
                    <Button variant="destructive" onClick={sendWarningEmail} className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      不正者へ警告メール送信
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 受講進捗タブ */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>受講進捗管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.courseProgress.map((course) => (
                    <div key={course.courseId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{course.courseName}</span>
                          {course.completed && (
                            <Badge className="bg-blue-100 text-blue-800">完了</Badge>
                          )}
                          {course.blocked && (
                            <Badge variant="destructive">ブロック中</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resetPartProgress(course.courseId)}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            未受講に戻す
                          </Button>
                          <Button
                            variant={course.blocked ? "default" : "destructive"}
                            size="sm"
                            onClick={() => togglePartBlock(course.courseId)}
                          >
                            {course.blocked ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                ブロック解除
                              </>
                            ) : (
                              <>
                                <Ban className="w-4 h-4 mr-1" />
                                ブロック
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{course.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 書類確認タブ */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>書類確認（手動認証用）</span>
                  <Dialog open={showDocumentUpload} onOpenChange={setShowDocumentUpload}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        書類アップロード
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>書類アップロード</DialogTitle>
                        <DialogDescription>
                          運転免許証裏面や在留カードなどをアップロードしてください。
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>運転免許証裏面（改姓・改名等）</Label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload(e, "license")}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>パスポート（日本国籍のみ対応）</Label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload(e, "passport_jp")}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            日本国パスポートの顔写真ページをアップロードしてください。外国籍のパスポートは対応しておりません。
                          </p>
                        </div>
                        <div>
                          <Label>在留カード（外国人）</Label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload(e, "residence_card")}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>その他書類</Label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload(e, "other")}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>アップロードされた書類はありません</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {doc.type === "license" && "運転免許証裏面"}
                              {doc.type === "passport_jp" && "パスポート（日本）"}
                              {doc.type === "residence_card" && "在留カード"}
                              {doc.type === "other" && "その他書類"}
                              {" - "}
                              {new Date(doc.uploadDate).toLocaleDateString("ja-JP")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.verified ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              確認済み
                            </Badge>
                          ) : (
                            <Button onClick={() => verifyDocument(doc.id)}>
                              <Shield className="w-4 h-4 mr-2" />
                              確認・認証
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 認証履歴タブ */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  認証履歴
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.authHistory.map((history) => (
                    <div
                      key={history.id}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        history.result === "success" ? "border-blue-200 bg-blue-50" : "border-blue-200 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {history.result === "success" ? (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-blue-600" />
                        )}
                        <div>
                          <p className="font-medium">
                            {history.result === "success" ? "認証成功" : "認証失敗"}
                          </p>
                          <p className="text-sm text-gray-500">{history.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg">
                          {(history.confidence * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500">一致度</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
