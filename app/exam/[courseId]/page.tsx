"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

// コース別の試験データ
const examData = {
  "programming-basics": {
    title: "プログラミング基礎 - 最終試験",
    timeLimit: 60,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Pythonで変数を定義する正しい方法はどれですか？",
        options: ["var x = 10", "x = 10", "int x = 10", "define x = 10"],
        correct: 1,
      },
      {
        id: 2,
        question: "リストの要素を追加するメソッドはどれですか？",
        options: ["add()", "append()", "insert()", "push()"],
        correct: 1,
      },
      {
        id: 3,
        question: "for文の正しい構文はどれですか？",
        options: ["for i in range(10):", "for (i = 0; i < 10; i++):", "for i = 1 to 10:", "foreach i in range(10):"],
        correct: 0,
      },
    ],
  },
  "data-analysis": {
    title: "データ分析入門 - 中間試験",
    timeLimit: 45,
    passingScore: 60,
    questions: [
      {
        id: 1,
        question: "データサイエンスで最も重要な統計的概念はどれですか？",
        options: ["平均値", "標準偏差", "正規分布", "すべて重要"],
        correct: 3,
      },
      {
        id: 2,
        question: "Pandasライブラリの主な用途は何ですか？",
        options: ["機械学習", "データ操作・分析", "可視化", "統計計算"],
        correct: 1,
      },
    ],
  },
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [score, setScore] = useState(0)

  const exam = examData[courseId as keyof typeof examData]

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && examStarted) {
      finishExam()
    }
  }, [timeLeft, examStarted])

  const startExam = () => {
    setExamStarted(true)
    setTimeLeft(exam.timeLimit * 60) // 分を秒に変換
  }

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishExam()
    }
  }

  const finishExam = () => {
    let correctAnswers = 0
    exam.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctAnswers++
      }
    })
    const finalScore = Math.round((correctAnswers / exam.questions.length) * 100)
    setScore(finalScore)
    setExamFinished(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertDescription>指定されたコースの試験が見つかりません。</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    )
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{exam.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">制限時間</div>
                  <div className="font-medium">{exam.timeLimit}分</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">合格点</div>
                  <div className="font-medium">{exam.passingScore}点以上</div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  試験開始後は制限時間内に全ての問題に回答してください。 途中で画面を離れると自動的に試験が終了します。
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button onClick={startExam} className="flex-1">
                  試験開始
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (examFinished) {
    const passed = score >= exam.passingScore
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>試験結果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}点</div>
                <Badge className={passed ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}>
                  {passed ? "合格" : "不合格"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">正解数</div>
                  <div className="font-medium">
                    {Math.round((score / 100) * exam.questions.length)} / {exam.questions.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">合格点</div>
                  <div className="font-medium">{exam.passingScore}点</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">結果</div>
                  <div className="font-medium">{passed ? "合格" : "不合格"}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => router.push("/dashboard")} className="flex-1">
                  ダッシュボードに戻る
                </Button>
                {!passed && (
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    再受験
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const question = exam.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{exam.title}</CardTitle>
              <Badge variant="outline">残り時間: {formatTime(timeLeft)}</Badge>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="text-sm text-gray-600">
              問題 {currentQuestion + 1} / {exam.questions.length}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-medium mb-4">{question.question}</div>

            <div className="space-y-2">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[currentQuestion] === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => selectAnswer(index)}
                >
                  <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                前の問題
              </Button>
              <Button onClick={nextQuestion} disabled={answers[currentQuestion] === undefined}>
                {currentQuestion === exam.questions.length - 1 ? "試験終了" : "次の問題"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
