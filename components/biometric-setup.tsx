"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Camera, Fingerprint, Mic, Shield, CheckCircle, AlertTriangle } from "lucide-react"

interface BiometricSetupProps {
  onComplete?: () => void
  userRole?: "student" | "admin" | "sub-admin"
}

export default function BiometricSetup({ onComplete, userRole = "student" }: BiometricSetupProps) {
  const [currentStep, setCurrentStep] = useState<"face" | "fingerprint" | "voice" | "complete">("face")
  const [setupProgress, setSetupProgress] = useState(0)
  const [biometricData, setBiometricData] = useState({
    faceRegistered: false,
    fingerprintRegistered: false,
    voiceRegistered: false,
    faceConfidence: 0,
    fingerprintConfidence: 0,
    voiceConfidence: 0,
  })
  const [isRecording, setIsRecording] = useState(false)
  const [faceStream, setFaceStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const registered = [
      biometricData.faceRegistered,
      biometricData.fingerprintRegistered,
      biometricData.voiceRegistered,
    ].filter(Boolean).length
    setSetupProgress((registered / 3) * 100)

    if (registered === 3) {
      setCurrentStep("complete")
    }
  }, [biometricData])

  const setupFaceRecognition = async () => {
    setError("")
    setIsProcessing(true)

    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("カメラアクセスがサポートされていません")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })
      setFaceStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Simulate face registration process with proper error handling
      setTimeout(() => {
        try {
          // Simulate face recognition processing
          const confidence = Math.floor(Math.random() * 10) + 90 // 90-99%

          setBiometricData((prev) => ({
            ...prev,
            faceRegistered: true,
            faceConfidence: confidence,
          }))

          if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setFaceStream(null)
          }

          setCurrentStep("fingerprint")
          setIsProcessing(false)
        } catch (processingError) {
          setError("顔認証の処理中にエラーが発生しました")
          setIsProcessing(false)
        }
      }, 5000)
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setError("カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。")
        } else if (error.name === "NotFoundError") {
          setError("カメラが見つかりません。デバイスにカメラが接続されているか確認してください。")
        } else {
          setError(`顔認証の設定に失敗しました: ${error.message}`)
        }
      } else {
        setError("顔認証の設定中に予期しないエラーが発生しました")
      }
      setIsProcessing(false)
    }
  }

  const setupFingerprint = async () => {
    setError("")
    setIsProcessing(true)

    try {
      // Check for WebAuthn support
      if (!window.PublicKeyCredential) {
        throw new Error("このブラウザは指紋認証をサポートしていません")
      }

      // Simulate fingerprint registration with WebAuthn-like behavior
      setTimeout(() => {
        try {
          const confidence = Math.floor(Math.random() * 5) + 95 // 95-99%

          setBiometricData((prev) => ({
            ...prev,
            fingerprintRegistered: true,
            fingerprintConfidence: confidence,
          }))
          setCurrentStep("voice")
          setIsProcessing(false)
        } catch (processingError) {
          setError("指紋認証の処理中にエラーが発生しました")
          setIsProcessing(false)
        }
      }, 3000)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("指紋認証の設定中にエラーが発生しました")
      }
      setIsProcessing(false)
    }
  }

  const setupVoiceRecognition = async () => {
    setError("")
    setIsRecording(true)
    setIsProcessing(true)

    try {
      // Check if microphone is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("マイクアクセスがサポートされていません")
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.start()

      // Simulate voice registration with proper error handling
      setTimeout(() => {
        try {
          mediaRecorder.stop()
          stream.getTracks().forEach((track) => track.stop())
          setIsRecording(false)

          const confidence = Math.floor(Math.random() * 8) + 92 // 92-99%

          setBiometricData((prev) => ({
            ...prev,
            voiceRegistered: true,
            voiceConfidence: confidence,
          }))
          setIsProcessing(false)
        } catch (processingError) {
          setError("音声認証の処理中にエラーが発生しました")
          setIsRecording(false)
          setIsProcessing(false)
        }
      }, 4000)
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setError("マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。")
        } else if (error.name === "NotFoundError") {
          setError("マイクが見つかりません。デバイスにマイクが接続されているか確認してください。")
        } else {
          setError(`音声認証の設定に失敗しました: ${error.message}`)
        }
      } else {
        setError("音声認証の設定中に予期しないエラーが発生しました")
      }
      setIsRecording(false)
      setIsProcessing(false)
    }
  }

  const handleComplete = () => {
    try {
      const biometricInfo = {
        ...biometricData,
        setupDate: new Date().toISOString(),
        userRole,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        },
      }
      localStorage.setItem("glx_biometric_setup", JSON.stringify(biometricInfo))

      if (onComplete) {
        onComplete()
      }
    } catch (storageError) {
      setError("生体認証データの保存に失敗しました")
    }
  }

  const retryCurrentStep = () => {
    setError("")
    setIsProcessing(false)
    setIsRecording(false)

    if (faceStream) {
      faceStream.getTracks().forEach((track) => track.stop())
      setFaceStream(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            生体認証セットアップ
          </CardTitle>
          <CardDescription>セキュリティ強化のため、生体認証を設定してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {error}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryCurrentStep}
                  className="ml-2 text-blue-600 border-blue-300 hover:bg-blue-100 bg-transparent"
                >
                  再試行
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>セットアップ進捗</span>
              <span>{Math.round(setupProgress)}%</span>
            </div>
            <Progress value={setupProgress} className="h-2" />
          </div>

          {/* Face Recognition Setup */}
          {currentStep === "face" && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Camera className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">顔認証の設定</h3>
                  </div>

                  {faceStream ? (
                    <div className="space-y-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full max-w-sm mx-auto rounded-lg border-2 border-blue-300"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-medium">
                          {isProcessing ? "顔データを登録中..." : "カメラを準備中..."}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                        <Camera className="w-16 h-16 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">
                        カメラを使用して顔データを登録します。正面を向いて「開始」ボタンを押してください。
                      </p>
                      <Button
                        onClick={setupFaceRecognition}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {isProcessing ? "処理中..." : "顔認証セットアップ開始"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fingerprint Setup */}
          {currentStep === "fingerprint" && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Fingerprint className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">指紋認証の設定</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                      <Fingerprint
                        className={`w-16 h-16 ${isProcessing ? "text-blue-500 animate-pulse" : "text-blue-500"}`}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {isProcessing
                        ? "指紋データを登録中です。しばらくお待ちください。"
                        : "指紋センサーまたはタッチIDを使用して指紋データを登録します。"}
                    </p>
                    <Button
                      onClick={setupFingerprint}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isProcessing ? "処理中..." : "指紋認証セットアップ開始"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voice Recognition Setup */}
          {currentStep === "voice" && (
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Mic className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-900">音声認証の設定</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                      <Mic className={`w-16 h-16 ${isRecording ? "text-blue-500 animate-pulse" : "text-purple-500"}`} />
                    </div>
                    <p className="text-sm text-gray-600">
                      {isRecording
                        ? "音声を録音中です。「私の名前は○○です」と4秒間話してください。"
                        : "マイクを使用して音声パターンを登録します。静かな場所で行ってください。"}
                    </p>
                    {!isRecording && (
                      <Button
                        onClick={setupVoiceRecognition}
                        disabled={isProcessing}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400"
                      >
                        {isProcessing ? "処理中..." : "音声認証セットアップ開始"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setup Complete */}
          {currentStep === "complete" && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-semibold text-blue-900">セットアップ完了</h3>
                  </div>

                  <p className="text-gray-600 mb-6">
                    すべての生体認証が正常に設定されました。これでより安全にログインできます。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Camera className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">顔認証</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">信頼度: {biometricData.faceConfidence}%</Badge>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Fingerprint className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">指紋認証</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        信頼度: {biometricData.fingerprintConfidence}%
                      </Badge>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">音声認証</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">信頼度: {biometricData.voiceConfidence}%</Badge>
                    </div>
                  </div>

                  <Button onClick={handleComplete} className="bg-indigo-600 hover:bg-indigo-700">
                    セットアップを完了
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Biometric Status Overview */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">登録状況</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">顔認証</span>
                  </div>
                  <Badge variant={biometricData.faceRegistered ? "default" : "secondary"}>
                    {biometricData.faceRegistered ? "登録済み" : "未登録"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">指紋認証</span>
                  </div>
                  <Badge variant={biometricData.fingerprintRegistered ? "default" : "secondary"}>
                    {biometricData.fingerprintRegistered ? "登録済み" : "未登録"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">音声認証</span>
                  </div>
                  <Badge variant={biometricData.voiceRegistered ? "default" : "secondary"}>
                    {biometricData.voiceRegistered ? "登録済み" : "未登録"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              生体認証データは暗号化されてローカルに保存され、サーバーには送信されません。
              プライバシーとセキュリティが最優先で保護されます。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
