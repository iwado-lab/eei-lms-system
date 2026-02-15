"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Info } from "lucide-react"
import { FaceRegistration } from "@/components/face-registration"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentUser, type RegisteredStudent } from "@/lib/store"

export default function FaceRegistrationPage() {
  const router = useRouter()
  const [isRegistered, setIsRegistered] = useState(false)
  const [currentUser, setCurrentUser] = useState<RegisteredStudent | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (!user) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            ダッシュボードに戻る
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-semibold">本人画像登録</h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* 説明カード */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                本人認証について
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                本システムでは、受講時の本人確認のため顔認証を行います。
                登録した顔データは受講中の本人確認に使用され、不正受講の防止に役立てられます。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">1. 顔データ登録</h4>
                  <p className="text-sm text-blue-700">
                    カメラで撮影または画像をアップロードして顔データを登録します。
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">2. 受講時認証</h4>
                  <p className="text-sm text-blue-700">受講開始時に顔認証を行い、本人確認を実施します。</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">3. 継続監視</h4>
                  <p className="text-sm text-purple-700">
                    受講中も定期的に本人確認を行い、入れ替わりや離席を検知します。
                  </p>
                </div>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  登録した顔データは暗号化して保存され、本人認証以外の目的には使用されません。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 顔登録コンポーネント */}
          <FaceRegistration
            userId={currentUser?.id || "current_user_001"}
            userName={currentUser?.name || "テストユーザー"}
            onRegistrationComplete={(descriptor) => {
              setIsRegistered(true)
              console.log("[v0] 顔登録完了:", descriptor.userId)
            }}
          />

          {/* 登録完了後のアクション */}
          {isRegistered && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900">顔データの登録が完了しました</h3>
                      <p className="text-sm text-blue-700">これで受講時の本人認証が有効になります</p>
                    </div>
                  </div>
                  <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
                    ダッシュボードに戻る
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
