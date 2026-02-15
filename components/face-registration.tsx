"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, CheckCircle, AlertTriangle, User, Trash2, RefreshCw } from "lucide-react"
import {
  saveFaceDescriptor,
  getFaceDescriptors,
  deleteFaceDescriptor,
  type FaceDescriptor,
} from "@/lib/face-recognition"
import { loadFaceApiModels, extractFaceDescriptor, createImageFromBase64 } from "@/lib/face-api-loader"

interface FaceRegistrationProps {
  userId?: string
  userName?: string
  onRegistrationComplete?: (descriptor: FaceDescriptor) => void
}

export function FaceRegistration({
  userId = "user_001",
  userName = "テストユーザー",
  onRegistrationComplete,
}: FaceRegistrationProps) {
  const [step, setStep] = useState<"idle" | "capturing" | "processing" | "complete" | "error">("idle")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [registeredFaces, setRegisteredFaces] = useState<FaceDescriptor[]>([])
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRegisteredFaces(getFaceDescriptors())
  }, [])

  const startCamera = async () => {
    try {
      setStep("capturing")
      setIsCameraReady(false)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      })

      setCameraStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play()
            setIsCameraReady(true)
            console.log("[v0] カメラ起動成功")
          } catch (playError) {
            console.error("[v0] 再生エラー:", playError)
          }
        }
      }
    } catch (error) {
      console.error("[v0] カメラアクセスエラー:", error)
      setErrorMessage("カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。")
      setStep("error")
    }
  }

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setIsCameraReady(false)
  }, [cameraStream])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("[v0] videoRef or canvasRef is null")
      return
    }

    if (!isCameraReady) {
      console.error("[v0] カメラがまだ準備できていません")
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current

    const videoWidth = video.videoWidth || 640
    const videoHeight = video.videoHeight || 480

    console.log("[v0] ビデオサイズ:", videoWidth, "x", videoHeight)

    canvas.width = videoWidth
    canvas.height = videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("[v0] Canvas context is null")
      return
    }

    ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
    const imageData = canvas.toDataURL("image/jpeg", 0.9)

    console.log("[v0] 撮影完了、画像データ長:", imageData.length)

    setCapturedImage(imageData)
    stopCamera()
    processImage(imageData)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setCapturedImage(imageData)
      processImage(imageData)
    }
    reader.readAsDataURL(file)
  }

  const processImage = async (imageData: string) => {
    setStep("processing")
    setProgress(0)
    setIsModelLoading(true)

    try {
      console.log("[v0] 顔認識モデルをロード中...")
      setProgress(10)
      await loadFaceApiModels()
      setProgress(30)
      console.log("[v0] 顔認識モデルのロード完了")

      console.log("[v0] 画像を処理中...")
      setProgress(40)
      const img = await createImageFromBase64(imageData)
      setProgress(50)

      console.log("[v0] 顔の特徴ベクトルを抽出中...")
      setProgress(60)
      const descriptor = await extractFaceDescriptor(img)
      setProgress(80)

      if (!descriptor) {
        throw new Error("顔を検出できませんでした。正面を向いた顔がはっきり写っている画像を使用してください。")
      }

      console.log("[v0] 顔の特徴ベクトル抽出完了、長さ:", descriptor.length)
      console.log("[v0] descriptor first 5 values:", Array.from(descriptor.slice(0, 5)))

      setProgress(90)
      const faceDescriptor: FaceDescriptor = {
        userId,
        userName,
        descriptor: Array.from(descriptor),
        registeredAt: new Date().toISOString(),
        imageUrl: imageData,
      }

      saveFaceDescriptor(faceDescriptor)
      setRegisteredFaces(getFaceDescriptors())

      setProgress(100)
      setStep("complete")
      setIsModelLoading(false)

      console.log("[v0] 顔データ保存完了:", userId)

      if (onRegistrationComplete) {
        onRegistrationComplete(faceDescriptor)
      }
    } catch (error) {
      console.error("[v0] 顔登録エラー:", error)
      setErrorMessage(error instanceof Error ? error.message : "顔の処理中にエラーが発生しました")
      setStep("error")
      setIsModelLoading(false)
    }
  }

  const handleDelete = (userId: string) => {
    if (confirm("この顔データを削除しますか？")) {
      deleteFaceDescriptor(userId)
      setRegisteredFaces(getFaceDescriptors())
    }
  }

  const resetRegistration = () => {
    setCapturedImage(null)
    setStep("idle")
    setProgress(0)
    setErrorMessage(null)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            本人画像登録
          </CardTitle>
          <CardDescription>
            受講時の本人認証に使用する顔写真を登録してください。正面から撮影した鮮明な写真が必要です。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "idle" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={startCamera} className="h-32 flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                  <Camera className="w-8 h-8" />
                  <span>カメラで撮影</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8" />
                  <span>画像をアップロード</span>
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  登録する写真は正面を向いた顔がはっきり写っているものを選択してください。
                  眼鏡、帽子、マスクを外した状態で撮影することをおすすめします。
                </AlertDescription>
              </Alert>
            </div>
          )}

          {step === "capturing" && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                {!isCameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                      <p>カメラを起動中...</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-80 border-4 border-blue-500 border-dashed rounded-lg opacity-70" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={capturePhoto}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!isCameraReady}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isCameraReady ? "撮影する" : "カメラ準備中..."}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    stopCamera()
                    setStep("idle")
                  }}
                >
                  キャンセル
                </Button>
              </div>
              <p className="text-sm text-gray-500 text-center">
                枠内に顔を合わせて「撮影する」ボタンをクリックしてください
              </p>
            </div>
          )}

          {step === "processing" && (
            <div className="space-y-4 text-center py-8">
              {capturedImage && (
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-blue-500">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured"
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                </div>
              )}
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {progress < 30
                    ? "顔認識モデルをロード中..."
                    : progress < 50
                      ? "画像を処理中..."
                      : progress < 80
                        ? "顔の特徴を抽出中..."
                        : "保存中..."}
                </p>
                <p className="text-sm text-gray-500">{isModelLoading && "初回は少し時間がかかります"}</p>
              </div>
              <div className="max-w-xs mx-auto space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-500">{progress}%</p>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-4 text-center py-8">
              <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-blue-600">登録完了</p>
                <p className="text-sm text-gray-500">顔データが正常に登録されました</p>
              </div>
              {capturedImage && (
                <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Registered"
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                </div>
              )}
              <Button onClick={resetRegistration} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                別の写真を登録
              </Button>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-4 text-center py-8">
              <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-16 h-16 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-blue-600">エラー</p>
                <p className="text-sm text-gray-500">{errorMessage}</p>
              </div>
              <Button onClick={resetRegistration} variant="outline">
                再試行
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>登録済み顔データ</span>
            <Badge variant="outline">{registeredFaces.length}件</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {registeredFaces.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">登録された顔データはありません</p>
          ) : (
            <div className="space-y-4">
              {registeredFaces.map((face) => (
                <div key={face.userId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={face.imageUrl || "/placeholder.svg"}
                        alt={face.userName}
                        className="w-full h-full object-cover"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{face.userName}</p>
                      <p className="text-sm text-gray-500">ID: {face.userId}</p>
                      <p className="text-xs text-gray-400">
                        登録日: {new Date(face.registeredAt).toLocaleString("ja-JP")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleDelete(face.userId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
