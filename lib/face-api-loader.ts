// face-api.jsのモデルをロードするユーティリティ
import * as faceapi from "face-api.js"

let modelsLoaded = false
let loadingPromise: Promise<void> | null = null

export async function loadFaceApiModels(): Promise<void> {
  if (modelsLoaded) {
    return Promise.resolve()
  }

  if (loadingPromise) {
    await loadingPromise
    return
  }

  loadingPromise = (async () => {
    try {
      console.log("[v0] face-api.jsモデルのロードを開始...")

      const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model"

      console.log("[v0] ssdMobilenetv1をロード中...")
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
      console.log("[v0] ssdMobilenetv1ロード完了")

      console.log("[v0] faceLandmark68Netをロード中...")
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      console.log("[v0] faceLandmark68Netロード完了")

      console.log("[v0] faceRecognitionNetをロード中...")
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      console.log("[v0] faceRecognitionNetロード完了")

      modelsLoaded = true
      console.log("[v0] face-api.jsモデルのロード完了（全てのモデル）")
    } catch (error) {
      console.error("[v0] face-api.jsモデルのロードに失敗:", error)
      loadingPromise = null
      throw error
    }
  })()

  await loadingPromise
}

export function isModelsLoaded(): boolean {
  return modelsLoaded
}

export async function ensureModelsLoaded(): Promise<boolean> {
  if (modelsLoaded) return true

  try {
    await loadFaceApiModels()
    return true
  } catch (error) {
    console.error("[v0] モデルロード確認に失敗:", error)
    return false
  }
}

// 画像から顔の特徴ベクトル（128次元）を抽出
export async function extractFaceDescriptor(
  imageSource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): Promise<Float32Array | null> {
  if (!modelsLoaded) {
    const loaded = await ensureModelsLoaded()
    if (!loaded) {
      console.error("[v0] モデルのロードに失敗しました")
      return null
    }
  }

  try {
    let width = 0
    let height = 0

    if (imageSource instanceof HTMLVideoElement) {
      width = imageSource.videoWidth
      height = imageSource.videoHeight
      if (imageSource.readyState < 2) {
        console.log("[v0] ビデオがまだ準備できていません")
        return null
      }
    } else if (imageSource instanceof HTMLImageElement) {
      width = imageSource.naturalWidth || imageSource.width
      height = imageSource.naturalHeight || imageSource.height
    } else if (imageSource instanceof HTMLCanvasElement) {
      width = imageSource.width
      height = imageSource.height
    }

    if (width === 0 || height === 0) {
      console.log("[v0] 画像サイズが無効です:", { width, height })
      return null
    }

    const detection = await faceapi
      .detectSingleFace(imageSource, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      console.log("[v0] 顔が検出されませんでした")
      return null
    }

    console.log("[v0] 顔の特徴ベクトルを抽出しました")
    return detection.descriptor
  } catch (error) {
    console.error("[v0] 顔の特徴ベクトル抽出に失敗:", error)
    return null
  }
}

// 2つの顔の特徴ベクトルを比較（ユークリッド距離）
export function compareFaceDescriptors(
  descriptor1: Float32Array,
  descriptor2: Float32Array,
): { distance: number; isMatch: boolean; confidence: number } {
  // ユークリッド距離を計算
  let sum = 0
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = descriptor1[i] - descriptor2[i]
    sum += diff * diff
  }
  const distance = Math.sqrt(sum)

  // 距離が0.7以下なら同一人物とみなす
  const threshold = 0.7
  const isMatch = distance < threshold

  // 距離を信頼度（0-1）に変換
  const confidence = Math.max(0, Math.min(1, 1 - distance))

  console.log(
    `[v0] 顔比較結果 - 距離: ${distance.toFixed(4)}, 閾値: ${threshold}, 一致: ${isMatch}, 信頼度: ${(confidence * 100).toFixed(1)}%`,
  )

  return { distance, isMatch, confidence }
}

// Base64画像からHTMLImageElementを作成
export function createImageFromBase64(base64Data: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(error)
    img.src = base64Data
  })
}

export async function detectFaceFromVideo(
  videoElement: HTMLVideoElement,
  canvasElement?: HTMLCanvasElement,
): Promise<Float32Array | null> {
  // モデルのロードチェック
  if (!modelsLoaded) {
    const loaded = await ensureModelsLoaded()
    if (!loaded) {
      console.error("[v0] モデルのロードに失敗しました")
      return null
    }
  }

  // ビデオ要素チェック
  if (!videoElement) {
    console.log("[v0] detectFaceFromVideo: ビデオ要素がありません")
    return null
  }

  // ビデオが再生可能な状態かチェック (readyState >= 2: HAVE_CURRENT_DATA)
  if (videoElement.readyState < 2) {
    console.log("[v0] detectFaceFromVideo: ビデオがまだ準備できていません。readyState:", videoElement.readyState)
    return null
  }

  // ビデオサイズチェック
  const videoWidth = videoElement.videoWidth
  const videoHeight = videoElement.videoHeight

  if (!videoWidth || !videoHeight || videoWidth === 0 || videoHeight === 0) {
    console.log("[v0] detectFaceFromVideo: ビデオサイズが無効です:", { videoWidth, videoHeight })
    return null
  }

  // srcObjectチェック（カメラストリームがあるか）
  if (!videoElement.srcObject) {
    console.log("[v0] detectFaceFromVideo: ビデオにsrcObjectがありません")
    return null
  }

  try {
    // Canvasを作成または使用
    let canvas = canvasElement
    if (!canvas) {
      canvas = document.createElement("canvas")
    }

    // Canvasサイズを明示的に設定
    canvas.width = videoWidth
    canvas.height = videoHeight

    // Canvasサイズを再確認
    if (canvas.width === 0 || canvas.height === 0) {
      console.log("[v0] detectFaceFromVideo: Canvasサイズが0です:", { width: canvas.width, height: canvas.height })
      return null
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("[v0] detectFaceFromVideo: Canvas 2D contextを取得できませんでした")
      return null
    }

    // ビデオをCanvasに描画
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

    // 描画後にCanvasの画像データを確認
    try {
      const imageData = ctx.getImageData(0, 0, 1, 1)
      if (!imageData || imageData.data.length === 0) {
        console.log("[v0] detectFaceFromVideo: Canvasに有効な画像データがありません")
        return null
      }
    } catch (e) {
      console.log("[v0] detectFaceFromVideo: Canvas画像データ取得エラー:", e)
      return null
    }

    // canvasから顔を検出（extractFaceDescriptorを呼ぶ）
    const result = await extractFaceDescriptor(canvas)
    return result
  } catch (error) {
    // InvalidStateErrorなどのエラーをキャッチ
    console.error("[v0] detectFaceFromVideo: エラーが発生しました:", error)
    return null
  }
}

export function compareFaces(
  descriptor1: Float32Array,
  descriptor2: Float32Array,
): { distance: number; isMatch: boolean; confidence: number } {
  return compareFaceDescriptors(descriptor1, descriptor2)
}
