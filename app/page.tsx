"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, UserCheck, Settings, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Logo } from "@/components/logo"
import { authenticateStudent, getRegisteredStudents, initializeDemoData } from "@/lib/store"

export default function DispatchSupervisorLogin() {
  const router = useRouter()
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [registeredStudents, setRegisteredStudents] = useState<any[]>([])
  const [email, setEmail] = useState(""); // Declare email variable

  // 初期化
  useEffect(() => {
    initializeDemoData()
    setRegisteredStudents(getRegisteredStudents())
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    setError("")

    if (selectedRole === "admin") {
      // 管理者ログイン
      router.push("/admin")
    } else if (selectedRole === "sub-admin") {
      // サブ管理者ログイン
      router.push("/sub-admin")
    } else {
      // 受講生ログイン - 共有データストアで認証
      const student = authenticateStudent(loginId, password)
      if (student) {
        // ログイン成功
        router.push("/dashboard")
      } else {
        // ログイン失敗
        setError("ログインIDまたはパスワードが正しくありません")
        setLoading(false)
        return
      }
    }

    setLoading(false)
  }

  const handleQuickLogin = (role: string) => {
    setSelectedRole(role)
    setError("")
    if (role === "admin") {
      setLoginId("admin@example.com")
      setPassword("admin123")
      setTimeout(() => router.push("/admin"), 500)
    } else if (role === "sub-admin") {
      setLoginId("subadmin@example.com")
      setPassword("subadmin123")
      setTimeout(() => router.push("/sub-admin"), 500)
    } else {
      // デモ受講生でログイン
      setLoginId("demo001")
      setPassword("demo001")
      setTimeout(() => {
        const student = authenticateStudent("demo001", "demo001")
        if (student) {
          router.push("/dashboard")
        }
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">定期講習</h1>
          <p className="text-lg text-gray-700">オンライン学習システム</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Authentication Form */}
          <Card className="w-full shadow-lg border-blue-200">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-2xl text-center text-gray-900">ログイン</CardTitle>
              <CardDescription className="text-center text-gray-600">認証情報を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-gray-700">役割選択</Label>
                <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-blue-50">
                    <TabsTrigger
                      value="student"
                      className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
                    >
                      受講生
                    </TabsTrigger>
                    <TabsTrigger
                      value="sub-admin"
                      className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
                    >
                      サブ管理者
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
                    >
                      管理者
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Traditional Login Form */}
              <div className="space-y-4">
                {error && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-blue-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="loginId" className="text-gray-700">
                    {selectedRole === "student" ? "ログインID" : "メールアドレス"}
                  </Label>
                  <Input
                    id="loginId"
                    type="text"
                    placeholder={selectedRole === "student" ? "ログインIDを入力" : "your-email@example.com"}
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    パスワード
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="パスワードを入力"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white"
                  disabled={loading || (selectedRole === "student" && (!loginId || !password))}
                >
                  {loading ? "ログイン中..." : "ログイン"}
                </Button>

                {/* 登録済み受講生の表示（受講生選択時のみ） */}
                {selectedRole === "student" && registeredStudents.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">登録済み受講生（クリックで入力）</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {registeredStudents.map((student) => (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => {
                            setLoginId(student.loginId)
                            setPassword(student.password)
                            setError("")
                          }}
                          className="w-full text-left text-xs p-2 bg-white rounded border hover:bg-blue-100 transition-colors"
                        >
                          <span className="font-medium">{student.name}</span>
                          <span className="text-gray-500 ml-2">ID: {student.loginId}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <Button variant="link" className="text-sm text-blue-600 hover:text-blue-800">
                    パスワードを忘れた場合
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Cards */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">クイックアクセス</h3>
              <p className="text-sm text-gray-600">ワンクリックでデモアカウントにログイン</p>
            </div>

            <div className="space-y-4">
              {/* Student Quick Access */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">受講生</h4>
                      <p className="text-sm text-gray-600">コース受講・学習進捗管理</p>
                    </div>
                    <Button
                      onClick={() => handleQuickLogin("student")}
                      size="sm"
                      className="bg-[#0066CC] hover:bg-[#0052A3] text-white"
                    >
                      アクセス
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sub Admin Quick Access */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">サブ管理者</h4>
                      <p className="text-sm text-gray-600">限定管理機能・受講者サポート</p>
                    </div>
                    <Button
                      onClick={() => handleQuickLogin("sub-admin")}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      アクセス
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Quick Access */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#0066CC] bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="w-6 h-6 text-[#0066CC]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">管理者</h4>
                      <p className="text-sm text-gray-600">システム全体管理・分析</p>
                    </div>
                    <Button
                      onClick={() => handleQuickLogin("admin")}
                      size="sm"
                      className="bg-[#0066CC] hover:bg-[#0052A3] text-white"
                    >
                      アクセス
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Account Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">デモアカウント情報</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <div>受講生: student@example.com / student123</div>
                  <div>サブ管理者: subadmin@example.com / subadmin123</div>
                  <div>管理者: admin@example.com / admin123</div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  ※ 現在は認証をスルーしているため、どの認証情報でもログイン可能です
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">一般財団法人 電気工事技術講習センター 定期講習 オンライン学習システム</p>
        </div>
      </div>
    </div>
  )
}
