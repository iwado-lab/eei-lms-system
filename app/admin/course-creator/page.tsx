"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Video,
  Brain,
  Wand2,
  Upload,
  Settings,
  Eye,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Play,
  Clock,
  DollarSign,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  Users,
  Lock,
  UserCheck,
} from "lucide-react"

export default function CourseCreator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    duration: "",
    price: "",
    instructor: "",
    thumbnail: null,
    tags: [],
    chapters: [],
    exams: [],
    settings: {
      isPublic: true,
      allowDownload: false,
      enableChat: true,
      enableMonitoring: true,
      certificateEnabled: true,
      maxAttempts: 3,
      passingScore: 70,
      accessControl: {
        enabled: false,
        type: "individual", // "individual" or "group"
        allowedUsers: [],
        allowedGroups: [],
        restrictionMessage: "このコースは限定公開です。アクセス権限がありません。",
      },
    },
  })

  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [groupSearchQuery, setGroupSearchQuery] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState([])

  const availableUsers = [
    { id: 1, name: "佐藤健太", email: "sato.k@example.com", group: "企業法人" },
    { id: 2, name: "田中美咲", email: "tanaka.m@example.com", group: "管理者" },
    { id: 3, name: "山田康太郎", email: "yamada.k@example.com", group: "個人受講者" },
    { id: 4, name: "鈴木真理", email: "suzuki.m@example.com", group: "個人受講者" },
    { id: 5, name: "高橋次郎", email: "takahashi.j@example.com", group: "企業法人" },
    { id: 6, name: "伊藤花子", email: "ito.h@example.com", group: "プレミアム会員" },
  ]

  const availableGroups = [
    { id: 1, name: "企業法人", userCount: 74, description: "法人契約ユーザー" },
    { id: 2, name: "個人受講者", userCount: 283, description: "個人契約ユーザー" },
    { id: 3, name: "プレミアム会員", userCount: 58, description: "プレミアムプランユーザー" },
    { id: 4, name: "管理者", userCount: 12, description: "システム管理者" },
    { id: 5, name: "講師", userCount: 25, description: "講師アカウント" },
  ]

  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: "イントロダクション",
      type: "video",
      content: "",
      duration: "10分",
      order: 1,
      lessons: [
        { id: 1, title: "コース概要", type: "video", duration: "5分", content: "" },
        { id: 2, title: "学習目標", type: "text", duration: "5分", content: "" },
      ],
    },
  ])

  const [examQuestions, setExamQuestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState(null)

  const steps = [
    { id: 1, title: "基本情報", icon: BookOpen },
    { id: 2, title: "コンテンツ作成", icon: Video },
    { id: 3, title: "試験問題", icon: Brain },
    { id: 4, title: "設定・公開", icon: Settings },
  ]

  const handleAddUser = (user) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId))
  }

  const handleAddGroup = (group) => {
    if (!selectedGroups.find((g) => g.id === group.id)) {
      setSelectedGroups([...selectedGroups, group])
    }
  }

  const handleRemoveGroup = (groupId) => {
    setSelectedGroups(selectedGroups.filter((g) => g.id !== groupId))
  }

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
  )

  const filteredGroups = availableGroups.filter((group) =>
    group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()),
  )

  const handleAIGeneration = (type: string, prompt: string) => {
    setIsGenerating(true)

    const generateContent = async () => {
      try {
        const response = await fetch("/api/ai-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, prompt }),
        })

        if (response.ok) {
          const result = await response.json()
          setGeneratedContent(result)
        } else {
          // Fallback to mock data if API not available
          const mockContent = {
            title: `AI生成: ${prompt}に関する講義`,
            content: `# ${prompt}について\n\n## 概要\n${prompt}は現代のビジネスにおいて重要な概念です。`,
            duration: "45分",
            type: "mixed",
          }
          setGeneratedContent(mockContent)
        }
      } catch (error) {
        // Fallback content generation
        const fallbackContent = {
          title: `${prompt}に関する講義`,
          content: `# ${prompt}について\n\n基本的な内容から応用まで体系的に学習します。`,
          duration: "30分",
          type: "basic",
        }
        setGeneratedContent(fallbackContent)
      } finally {
        setIsGenerating(false)
      }
    }

    generateContent()
  }

  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: `チャプター ${chapters.length + 1}`,
      type: "video",
      content: "",
      duration: "0分",
      order: chapters.length + 1,
      lessons: [],
    }
    setChapters([...chapters, newChapter])
  }

  const addLesson = (chapterId: number) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lessons: [
                ...chapter.lessons,
                {
                  id: Date.now(),
                  title: `レッスン ${chapter.lessons.length + 1}`,
                  type: "video",
                  duration: "0分",
                  content: "",
                },
              ],
            }
          : chapter,
      ),
    )
  }

  const removeChapter = (chapterId: number) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId))
  }

  const removeLesson = (chapterId: number, lessonId: number) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lessons: chapter.lessons.filter((lesson) => lesson.id !== lessonId),
            }
          : chapter,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                管理画面に戻る
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">高度なコース作成ツール</h1>
                <p className="text-gray-600">AI支援によるe-learning・試験問題生成</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                プレビュー
              </Button>
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                下書き保存
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                公開
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow">
          {currentStep === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">基本情報設定</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">コースタイトル *</Label>
                    <Input
                      id="title"
                      placeholder="例: データサイエンス基礎講座"
                      value={courseData.title}
                      onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">コース説明</Label>
                    <Textarea
                      id="description"
                      placeholder="コースの概要、学習目標、対象者などを記載してください"
                      rows={4}
                      value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">カテゴリ</Label>
                      <select
                        id="category"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={courseData.category}
                        onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                      >
                        <option value="">選択してください</option>
                        <option value="data-science">データサイエンス</option>
                        <option value="ai-ml">AI・機械学習</option>
                        <option value="web-dev">Web開発</option>
                        <option value="security">セキュリティ</option>
                        <option value="business">ビジネススキル</option>
                        <option value="design">デザイン</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">難易度</Label>
                      <select
                        id="difficulty"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={courseData.difficulty}
                        onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                      >
                        <option value="beginner">初級</option>
                        <option value="intermediate">中級</option>
                        <option value="advanced">上級</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">想定学習時間</Label>
                      <Input
                        id="duration"
                        placeholder="例: 20時間"
                        value={courseData.duration}
                        onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">価格（円）</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="29800"
                        value={courseData.price}
                        onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor">講師名</Label>
                      <Input
                        id="instructor"
                        placeholder="田中講師"
                        value={courseData.instructor}
                        onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>サムネイル画像</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">画像をドラッグ&ドロップまたはクリックして選択</p>
                      <p className="text-sm text-gray-500 mt-2">推奨サイズ: 1280x720px, JPG/PNG</p>
                      <Button variant="outline" className="mt-4 bg-transparent">
                        ファイル選択
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>タグ</Label>
                    <Input placeholder="Python, データ分析, 統計学（カンマ区切り）" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">Python</Badge>
                      <Badge variant="secondary">データ分析</Badge>
                      <Badge variant="secondary">統計学</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">コンテンツ作成</h2>
                <div className="flex gap-2">
                  <Button onClick={addChapter} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    チャプター追加
                  </Button>
                </div>
              </div>

              {/* AI Content Generation */}
              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    AI コンテンツ生成
                  </CardTitle>
                  <CardDescription>AIを活用して高品質な学習コンテンツを自動生成します</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Input
                      placeholder="生成したいコンテンツのトピックを入力（例: Python基礎、データ可視化）"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleAIGeneration("content", "Python基礎")}
                      disabled={isGenerating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isGenerating ? "生成中..." : "コンテンツ生成"}
                    </Button>
                  </div>
                  {isGenerating && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">AI生成中... {generationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chapter List */}
              <div className="space-y-4">
                {chapters.map((chapter, chapterIndex) => (
                  <Card key={chapter.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{chapterIndex + 1}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{chapter.title}</CardTitle>
                            <CardDescription className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {chapter.duration}
                              </span>
                              <Badge variant="outline">{chapter.type}</Badge>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => addLesson(chapter.id)}>
                            <Plus className="w-4 h-4 mr-1" />
                            レッスン追加
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => removeChapter(chapter.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {chapter.lessons.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">レッスン一覧</h4>
                          {chapter.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium">{lessonIndex + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {lesson.duration}
                                    <Badge variant="outline" className="text-xs">
                                      {lesson.type}
                                    </Badge>
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Play className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => removeLesson(chapter.id, lesson.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">試験問題作成</h2>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    問題インポート
                  </Button>
                </div>
              </div>

              {/* AI Question Generation */}
              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    AI 試験問題生成
                  </CardTitle>
                  <CardDescription>コンテンツに基づいて適切な難易度の試験問題を自動生成します</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label>問題カテゴリ</Label>
                      <Input placeholder="例: Python基礎、データ分析" />
                    </div>
                    <div>
                      <Label>問題数</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="5">5問</option>
                        <option value="10">10問</option>
                        <option value="15">15問</option>
                        <option value="20">20問</option>
                      </select>
                    </div>
                    <div>
                      <Label>難易度</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="mixed">混合</option>
                        <option value="easy">易しい</option>
                        <option value="medium">普通</option>
                        <option value="hard">難しい</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAIGeneration("exam", "Python基礎")}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {isGenerating ? "生成中..." : "問題生成"}
                  </Button>
                  {isGenerating && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">AI問題生成中... {generationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Question List */}
              <div className="space-y-4">
                {examQuestions.map((question, index) => (
                  <Card key={question.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">問題 {index + 1}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{question.type === "multiple" ? "選択式" : "記述式"}</Badge>
                            <Badge variant="outline">{question.difficulty}</Badge>
                            <Badge variant="outline">{question.category}</Badge>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="font-medium">問題文</Label>
                          <p className="text-gray-700 mt-1">{question.question}</p>
                        </div>
                        {question.type === "multiple" && (
                          <div>
                            <Label className="font-medium">選択肢</Label>
                            <div className="space-y-2 mt-1">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-2 rounded border ${
                                    optionIndex === question.correctAnswer
                                      ? "bg-blue-50 border-blue-200"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  {option}
                                  {optionIndex === question.correctAnswer && (
                                    <Badge variant="secondary" className="ml-2">
                                      正解
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <Label className="font-medium">解説</Label>
                          <p className="text-gray-600 text-sm mt-1">{question.explanation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {examQuestions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>まだ問題が作成されていません</p>
                    <p className="text-sm">AI生成機能を使用して問題を作成してください</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">設定・公開</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>公開設定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>一般公開</Label>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>ダウンロード許可</Label>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>チャット機能</Label>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>監視システム</Label>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>修了証発行</Label>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>試験設定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>最大受験回数</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg mt-1" defaultValue="3">
                        <option value="1">1回</option>
                        <option value="2">2回</option>
                        <option value="3">3回</option>
                        <option value="unlimited">無制限</option>
                      </select>
                    </div>
                    <div>
                      <Label>合格点（%）</Label>
                      <Input type="number" defaultValue="70" min="0" max="100" />
                    </div>
                    <div>
                      <Label>制限時間（分）</Label>
                      <Input type="number" defaultValue="60" min="1" />
                    </div>
                    <div>
                      <Label>受講期限</Label>
                      <Input type="date" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6 border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-orange-600" />
                    アクセス制御設定
                  </CardTitle>
                  <CardDescription>特定の受講生のみがこのコースにアクセスできるように制限します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>アクセス制御を有効にする</Label>
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={courseData.settings.accessControl.enabled}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          settings: {
                            ...courseData.settings,
                            accessControl: {
                              ...courseData.settings.accessControl,
                              enabled: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  {courseData.settings.accessControl.enabled && (
                    <>
                      <div>
                        <Label>制限タイプ</Label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                          value={courseData.settings.accessControl.type}
                          onChange={(e) =>
                            setCourseData({
                              ...courseData,
                              settings: {
                                ...courseData.settings,
                                accessControl: {
                                  ...courseData.settings.accessControl,
                                  type: e.target.value,
                                },
                              },
                            })
                          }
                        >
                          <option value="individual">個別ユーザー指定</option>
                          <option value="group">グループ指定</option>
                          <option value="both">個別ユーザー + グループ</option>
                        </select>
                      </div>

                      {(courseData.settings.accessControl.type === "individual" ||
                        courseData.settings.accessControl.type === "both") && (
                        <div>
                          <Label className="flex items-center gap-2 mb-3">
                            <UserCheck className="w-4 h-4" />
                            許可ユーザー選択
                          </Label>
                          <div className="space-y-4">
                            <Input
                              placeholder="ユーザー名またはメールアドレスで検索..."
                              value={userSearchQuery}
                              onChange={(e) => setUserSearchQuery(e.target.value)}
                            />
                            <div className="max-h-48 overflow-y-auto border rounded-lg">
                              {filteredUsers.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <span className="text-blue-600 text-sm font-medium">{user.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{user.name}</div>
                                      <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {user.group}
                                    </Badge>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={selectedUsers.find((u) => u.id === user.id) ? "default" : "outline"}
                                    onClick={() =>
                                      selectedUsers.find((u) => u.id === user.id)
                                        ? handleRemoveUser(user.id)
                                        : handleAddUser(user)
                                    }
                                  >
                                    {selectedUsers.find((u) => u.id === user.id) ? "削除" : "追加"}
                                  </Button>
                                </div>
                              ))}
                            </div>
                            {selectedUsers.length > 0 && (
                              <div>
                                <Label className="text-sm font-medium">
                                  選択済みユーザー ({selectedUsers.length}名)
                                </Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedUsers.map((user) => (
                                    <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                                      {user.name}
                                      <button
                                        onClick={() => handleRemoveUser(user.id)}
                                        className="ml-1 text-gray-500 hover:text-blue-500"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {(courseData.settings.accessControl.type === "group" ||
                        courseData.settings.accessControl.type === "both") && (
                        <div>
                          <Label className="flex items-center gap-2 mb-3">
                            <Users className="w-4 h-4" />
                            許可グループ選択
                          </Label>
                          <div className="space-y-4">
                            <Input
                              placeholder="グループ名で検索..."
                              value={groupSearchQuery}
                              onChange={(e) => setGroupSearchQuery(e.target.value)}
                            />
                            <div className="max-h-48 overflow-y-auto border rounded-lg">
                              {filteredGroups.map((group) => (
                                <div
                                  key={group.id}
                                  className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
                                >
                                  <div>
                                    <div className="font-medium text-sm">{group.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {group.description} ({group.userCount}名)
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={selectedGroups.find((g) => g.id === group.id) ? "default" : "outline"}
                                    onClick={() =>
                                      selectedGroups.find((g) => g.id === group.id)
                                        ? handleRemoveGroup(group.id)
                                        : handleAddGroup(group)
                                    }
                                  >
                                    {selectedGroups.find((g) => g.id === group.id) ? "削除" : "追加"}
                                  </Button>
                                </div>
                              ))}
                            </div>
                            {selectedGroups.length > 0 && (
                              <div>
                                <Label className="text-sm font-medium">
                                  選択済みグループ ({selectedGroups.length}グループ)
                                </Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedGroups.map((group) => (
                                    <Badge key={group.id} variant="secondary" className="flex items-center gap-1">
                                      {group.name} ({group.userCount}名)
                                      <button
                                        onClick={() => handleRemoveGroup(group.id)}
                                        className="ml-1 text-gray-500 hover:text-blue-500"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>アクセス拒否時のメッセージ</Label>
                        <Textarea
                          placeholder="アクセス権限がない場合に表示するメッセージを入力してください"
                          value={courseData.settings.accessControl.restrictionMessage}
                          onChange={(e) =>
                            setCourseData({
                              ...courseData,
                              settings: {
                                ...courseData.settings,
                                accessControl: {
                                  ...courseData.settings.accessControl,
                                  restrictionMessage: e.target.value,
                                },
                              },
                            })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">アクセス制御サマリー</h4>
                        <div className="text-sm text-blue-800 space-y-1">
                          <div>
                            制限タイプ:{" "}
                            {courseData.settings.accessControl.type === "individual"
                              ? "個別ユーザー指定"
                              : courseData.settings.accessControl.type === "group"
                                ? "グループ指定"
                                : "個別ユーザー + グループ"}
                          </div>
                          {selectedUsers.length > 0 && <div>許可ユーザー: {selectedUsers.length}名</div>}
                          {selectedGroups.length > 0 && <div>許可グループ: {selectedGroups.length}グループ</div>}
                          <div className="mt-2 text-xs">
                            ※ アクセス制御を有効にすると、指定されたユーザー・グループのみがこのコースを受講できます
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>コース概要</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-semibold">{chapters.length}</p>
                      <p className="text-sm text-gray-600">チャプター</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-semibold">{examQuestions.length}</p>
                      <p className="text-sm text-gray-600">試験問題</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-semibold">{courseData.duration || "未設定"}</p>
                      <p className="text-sm text-gray-600">学習時間</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="font-semibold">¥{courseData.price || "0"}</p>
                      <p className="text-sm text-gray-600">価格</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center p-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              前へ
            </Button>
            <div className="flex gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full ${currentStep >= step.id ? "bg-blue-600" : "bg-gray-300"}`}
                />
              ))}
            </div>
            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                className="bg-blue-600 hover:bg-blue-700"
              >
                次へ
              </Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                コース公開
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
