"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/logo"

const ClockIcon = () => <span>⏰</span>
const ShieldIcon = () => <span>🛡️</span>
const FileTextIcon = () => <span>📄</span>
const DownloadIcon = () => <span>⬇️</span>
const AlertTriangleIcon = () => <span>⚠️</span>
const CheckCircleIcon = () => <span>✅</span>
const CameraIcon = () => <span>📷</span>
const EyeIcon = () => <span>👁️</span>
const LockIcon = () => <span>🔒</span>
const AwardIcon = () => <span>🏆</span>

export default function ExamSystem() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [examStarted, setExamStarted] = useState(false)
  const [examCompleted, setExamCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [monitoringActive, setMonitoringActive] = useState(false)
  const [violations, setViolations] = useState<string[]>([])
  const [faceDetected, setFaceDetected] = useState(true)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [examMode, setExamMode] = useState<"practice" | "official">("official")

  const questions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "Q5. 次のうち、GLXシステムのセキュリティ対策として正しくないものはどれですか？",
      options: [
        "A. 多要素認証によるログインセキュリティ",
        "B. eKYCを活用した本人確認プロセス",
        "C. 保護個人データの公開共有機能",
        "D. コンテンツ保護のためのコピープロテクション",
      ],
      correctAnswer: "C",
      points: 10,
      timeLimit: 300,
    },
    {
      id: 2,
      type: "descriptive",
      question:
        "GLXシステムの学習管理機能について、受講者の学習効果を最大化するための3つの重要な要素を説明してください。（200文字以内）",
      correctAnswer: "",
      points: 15,
      timeLimit: 600,
    },
    {
      id: 3,
      type: "image-based",
      question: "以下の画面キャプチャを見て、どの機能が表示されているか選択してください。",
      image: "/glx-dashboard-screenshot.png",
      options: ["A. 受講者ダッシュボード", "B. 管理者ダッシュボード", "C. 試験結果画面", "D. コース選択画面"],
      correctAnswer: "A",
      points: 10,
      timeLimit: 180,
    },
  ]

  const examResults = {
    totalScore: 85,
    passingScore: 70,
    timeSpent: 28,
    passed: true,
    attemptNumber: 1,
    maxAttempts: 3,
    nextAttemptDate: "2025-09-15",
    certificateId: "GLX-2025-12345-AB",
    sections: [
      { name: "基礎知識", score: 90, maxScore: 100, questions: 10, correct: 9 },
      { name: "実践応用", score: 80, maxScore: 100, questions: 8, correct: 6 },
      { name: "問題解決", score: 75, maxScore: 100, questions: 7, correct: 5 },
    ],
    weakAreas: ["データ分析手法", "セキュリティ設定"],
    recommendations: ["データ分析基礎コースの復習をお勧めします", "セキュリティ設定に関する追加学習が効果的です"],
    detailedFeedback: {
      strengths: ["基本概念の理解", "システム操作"],
      improvements: ["応用問題への対応", "時間管理"],
    },
  }

  useEffect(() => {
    if (examStarted && !examCompleted) {
      setMonitoringActive(true)

      const monitoringInterval = setInterval(() => {
        if (Math.random() < 0.1) {
          setFaceDetected(Math.random() > 0.3)
        }

        const handleVisibilityChange = () => {
          if (document.hidden) {
            setTabSwitchCount((prev) => prev + 1)
            setViolations((prev) => [...prev, `別タブ切り替え検出: ${new Date().toLocaleTimeString()}`])
          }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
      }, 5000)

      return () => clearInterval(monitoringInterval)
    }
  }, [examStarted, examCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartExam = () => {
    setExamStarted(true)
  }

  const handleCompleteExam = () => {
    setExamCompleted(true)
    setShowResults(true)
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              {/* </CHANGE> */}
              <Badge variant="outline">受講者側</Badge>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">受講者側：試験・認定/修了証UI</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Enhanced Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircleIcon />
                  合格判定・結果表示UI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <Badge
                    className={`mb-4 text-lg px-4 py-2 ${examResults.passed ? "bg-blue-100 text-blue-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {examResults.passed ? (
                      <>
                        <CheckCircleIcon />
                        合格
                      </>
                    ) : (
                      <>
                        <AlertTriangleIcon />
                        不合格
                      </>
                    )}
                  </Badge>
                  <h2 className="text-xl font-bold mb-2">GLX認定基礎テスト</h2>
                  <div className="text-sm text-gray-600 mb-4">
                    <div>
                      受験回数: {examResults.attemptNumber}/{examResults.maxAttempts}回
                    </div>
                    <div>次回受験可能日: {examResults.nextAttemptDate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{examResults.totalScore}/100点</div>
                    <div className="text-sm text-gray-600">総点</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{examResults.passingScore}点以上</div>
                    <div className="text-sm text-gray-600">合格基準</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{examResults.timeSpent}分</div>
                    <div className="text-sm text-gray-600">所要時間</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">セクション別詳細分析</div>
                  {examResults.sections.map((section, index) => (
                    <div key={index} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{section.name}</span>
                        <span className="font-medium">
                          {section.correct}/{section.questions}問正解 ({section.score}点)
                        </span>
                      </div>
                      <Progress value={(section.score / section.maxScore) * 100} className="h-2" />
                      <div className="text-xs text-gray-600">
                        正答率: {Math.round((section.correct / section.questions) * 100)}% | 達成度:{" "}
                        {Math.round((section.score / section.maxScore) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">改善推奨分野</div>
                    <div className="space-y-1">
                      {examResults.weakAreas.map((area, index) => (
                        <div key={index} className="text-xs text-blue-700">
                          • {area}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">学習推奨事項</div>
                    <div className="space-y-1">
                      {examResults.recommendations.map((rec, index) => (
                        <div key={index} className="text-xs text-blue-700">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button className="flex-1 bg-transparent" variant="outline">
                    <FileTextIcon />
                    詳細レポート
                  </Button>
                  {examResults.passed && (
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <AwardIcon />
                      修了証発行
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Certificate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AwardIcon />
                  修了証発行・ダウンロード機能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <div className="bg-white border rounded-lg p-6 shadow-sm relative">
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        <ShieldIcon />
                        デジタル署名済
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AwardIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">修了証明書</h3>
                      <div className="text-sm text-gray-600 mb-4">
                        <div>山田 太郎 様</div>
                        <div>GLX基礎コース</div>
                        <div>データ分析基礎講座</div>
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        <div>修了日: 2025年7月28日</div>
                        <div>証明書ID: {examResults.certificateId}</div>
                        <div>有効期限: 2027年7月28日</div>
                        <div>デジタル署名: 検証済み</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">証明書設定</div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-700">フォーマット選択</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center gap-2">
                        <input type="radio" id="pdf" name="format" defaultChecked />
                        <Label htmlFor="pdf" className="text-sm">
                          PDF
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="jpeg" name="format" />
                        <Label htmlFor="jpeg" className="text-sm">
                          JPEG
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="png" name="format" />
                        <Label htmlFor="png" className="text-sm">
                          PNG
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-700">言語設定</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <input type="radio" id="japanese" name="language" defaultChecked />
                        <Label htmlFor="japanese" className="text-sm">
                          日本語
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="english" name="language" />
                        <Label htmlFor="english" className="text-sm">
                          English
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-700">追加オプション</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="qr-code" defaultChecked />
                        <Label htmlFor="qr-code" className="text-sm">
                          QRコード認証付き
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="blockchain" defaultChecked />
                        <Label htmlFor="blockchain" className="text-sm">
                          ブロックチェーン証明
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="watermark" />
                        <Label htmlFor="watermark" className="text-sm">
                          透かし追加
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <DownloadIcon />
                  修了証をダウンロード
                </Button>

                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">証明書管理</div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>• ダウンロード期限: 730日 (変更可能: 1-999日)</div>
                      <div>• 再発行: 3回まで無料</div>
                      <div>• 有効期限: 2年間 (延長申請可能)</div>
                      <div>• デジタル署名: 自動付与・検証可能</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-xs bg-transparent">
                      <FileTextIcon />
                      履歴確認
                    </Button>
                    <Button variant="outline" className="flex-1 text-xs bg-transparent">
                      <ShieldIcon />
                      真正性検証
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                  修了証にはブロックチェーン技術による真正性証明とQRコード認証が付与されます。
                  デジタル署名により改ざん防止機能が有効で、オンライン検証システムで真正性を確認できます。
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeIcon />
                試験監視レポート
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                  <div className="text-sm text-blue-700">顔認識率</div>
                  <div className="text-xs text-gray-600 mt-1">監視時間中の本人認証</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{tabSwitchCount}</div>
                  <div className="text-sm text-blue-700">タブ切り替え</div>
                  <div className="text-xs text-gray-600 mt-1">別タブ・別ウィンドウ検出</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-700">不正行為検出</div>
                  <div className="text-xs text-gray-600 mt-1">重大な違反行為</div>
                </div>
              </div>

              {violations.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-2">監視ログ</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {violations.map((violation, index) => (
                      <div key={index} className="text-xs text-blue-700">
                        • {violation}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              {/* </CHANGE> */}
              <Badge variant="outline">受講者側</Badge>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">受講者側：試験・認定/修了証UI</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon />
                オンライン試験システム
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">
                  <ClockIcon />
                  残り時間: 30分
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">GLX認定テスト</h2>
                  <p className="text-gray-600 mb-4">試験を開始する前に以下の注意事項をご確認ください</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">試験監視システム</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CameraIcon />
                          <span>画面監視: 50回確認済</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <EyeIcon />
                          <span>監視・履歴出力: 別タブ・別ウィンドウ検出</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldIcon />
                          <span>スクリーンショット禁止とブラウザ制御による検出・遮断</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LockIcon />
                          <span>選択したマーク付きデータの設定による可能</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">コピープロテクション機能</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <AlertTriangleIcon />
                          <span>右クリック無効化: テキスト選択禁止</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldIcon />
                          <span>スクリーンショット禁止: ブラウザ制御による検出・遮断</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <EyeIcon />
                          <span>選択したマーク付きデータの設定による可能</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">受験環境設定情報</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">試験時間制限:</span>
                      <span className="ml-2 font-medium">50分間</span>
                    </div>
                    <div>
                      <span className="text-gray-600">コピープロテクション機能:</span>
                      <span className="ml-2 font-medium">有効</span>
                    </div>
                    <div>
                      <span className="text-gray-600">受験環境設定:</span>
                      <span className="ml-2 font-medium">60分間</span>
                    </div>
                    <div>
                      <span className="text-gray-600">受験環境設定期間:</span>
                      <span className="ml-2 font-medium">50日間</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangleIcon />
                  <AlertDescription className="text-sm">
                    <strong>不正検知</strong>
                    <br />
                    スクリーンショットが検出されました
                    <br />
                    スクリーンショットの取得は禁止されています。
                    <br />
                    この行為は試験監視違反となります。
                  </AlertDescription>
                </Alert>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <AlertTriangleIcon />
                    <span className="font-medium">スクリーンキャプチャが検出されました</span>
                  </div>
                  <div className="text-sm text-blue-600">
                    <div>この行為は試験監視違反となります。</div>
                    <div>ご注意ください。</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  全ての試験は不正防止のため、多角的な監視システムで保護されています。
                  画面データは50日間保存可能で、問題データは50日間保存されます。スクリーンショットなどの不正検知は自動検知・防止されます。
                </p>

                <Button onClick={handleStartExam} className="w-full bg-blue-600 hover:bg-blue-700">
                  <ShieldIcon />
                  試験を開始
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            {/* </CHANGE> */}
            <Badge variant="outline">受講者側</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-100 text-blue-700">
              <ClockIcon />
              残り時間: {formatTime(timeRemaining)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>GLX認定テスト</CardTitle>
              <Badge className="bg-blue-100 text-blue-700">残り時間: {formatTime(timeRemaining)}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">進捗: 1/3 問題</span>
              <Progress value={33} className="flex-1" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-4">{questions[currentQuestion].question}</h3>
                {questions[currentQuestion].type === "multiple-choice" && (
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    {questions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.charAt(0)} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {questions[currentQuestion].type === "descriptive" && (
                  <textarea
                    className="w-full h-32 border rounded-lg p-2"
                    placeholder="ここに回答を入力してください"
                  ></textarea>
                )}
                {questions[currentQuestion].type === "image-based" && (
                  <div className="flex items-center justify-center">
                    <img
                      src={questions[currentQuestion].image || "/placeholder.svg"}
                      alt="Question Image"
                      className="w-64 h-64 object-contain"
                    />
                    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                      {questions[currentQuestion].options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.charAt(0)} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" disabled={currentQuestion === 0}>
                  <span>前の問題</span>
                </Button>
                <Button onClick={handleCompleteExam} className="bg-blue-600 hover:bg-blue-700">
                  次の問題 →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
