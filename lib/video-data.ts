// 動画データの型定義と管理
// 
// 【重要】publish後も動画URLを反映させるには：
// 下記の defaultPartVideos と demoVideo の videoUrl / textUrl を
// 実際に使用するURLに変更してください。
// 管理画面での変更はlocalStorageに保存されますが、publish後は反映されません。

export interface PartVideo {
  id: string
  partNumber: number
  title: string
  videoUrl: string
  textUrl?: string
  duration: number // 秒単位
  description: string
  thumbnailUrl?: string
  updatedAt: string
}

// テキストURL（全章共通）
// Google DriveのPDFを埋め込むには /preview または Google Docs Viewer を使用
// 注意: Google Driveの共有設定で「リンクを知っている全員が閲覧可」にする必要があります
const COMMON_TEXT_URL = "https://drive.google.com/file/d/158X3YxF9Mfd2-LcSu4vFINhxczvZr7sF/preview"

// デフォルトの動画データ（派遣元責任者講習 基礎編）
export const defaultPartVideos: PartVideo[] = [
  {
    id: "part-1",
    partNumber: 1,
    title: "Part 1: 派遣制度の仕組み",
    videoUrl: "https://drive.google.com/file/d/1yNVhtqbB7DWiQ1qYDncdxWMMN7y-joOO/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300, // 55分
    description: "派遣制度の基本的な仕組みについて学習します。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "part-2",
    partNumber: 2,
    title: "Part 2: 派遣労働者の雇用管理",
    videoUrl: "https://drive.google.com/file/d/1sxtxrJkabNvOBVRd17DARL-IbVK5Ffn5/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "派遣労働者の雇用管理について学習します。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "part-3",
    partNumber: 3,
    title: "Part 3: 派遣先責任者の役割",
    videoUrl: "https://drive.google.com/file/d/102MY6YkCUcF3I-X8tJWnH7pThmAWV5eE/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "派遣先責任者の役割について学習します。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "part-4",
    partNumber: 4,
    title: "Part 4: 労働者派遣契約",
    videoUrl: "https://drive.google.com/file/d/1eQBEFpsmFPTm8Ekl5kvZs4jcGXtZr8rr/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "労働者派遣契約について学習します。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "part-5",
    partNumber: 5,
    title: "Part 5: 派遣労働者の保護",
    videoUrl: "https://drive.google.com/file/d/1P2a9m1QDqLlhqvrr142zOvql6iTO2nHe/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "派遣労働者の保護について学習します。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "part-6",
    partNumber: 6,
    title: "Part 6: 紛争解決",
    videoUrl: "https://drive.google.com/file/d/1oTmKvEZ-hOq74fW6ialZG_lHcHRloxal/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "紛争解決について学習します。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "part-7",
    partNumber: 7,
    title: "Part 7: 関係法令",
    videoUrl: "https://drive.google.com/file/d/1v0h1r_oM5LDO234zCDsA00E19EQ97C5A/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 1800, // 30分
    description: "関係法令について学習します。",
    updatedAt: new Date().toISOString(),
  },
]

// 実践編の動画データ
export const advancedPartVideos: PartVideo[] = [
  {
    id: "advanced-part-1",
    partNumber: 1,
    title: "実践編 Part 1",
    videoUrl: "https://drive.google.com/file/d/1MaFbG111jE9HTs0ABG8uwBttV8nzeA0w/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "実践編 Part 1 の学習内容です。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "advanced-part-2",
    partNumber: 2,
    title: "実践編 Part 2",
    videoUrl: "https://drive.google.com/file/d/1JheGWyA464VicuhV6jV8Lv-QMhKFP-j0/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "実践編 Part 2 の学習内容です。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "advanced-part-3",
    partNumber: 3,
    title: "実践編 Part 3",
    videoUrl: "https://drive.google.com/file/d/1-hb6xkkBZ8pqau3kSpH8PJGD5Rh0isgd/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "実践編 Part 3 の学習内容です。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "advanced-part-4",
    partNumber: 4,
    title: "実践編 Part 4",
    videoUrl: "https://drive.google.com/file/d/1M_Sd1AJ1QEs-try_8RD4YJhriCXiJZNt/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "実践編 Part 4 の学習内容です。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "advanced-part-5",
    partNumber: 5,
    title: "実践編 Part 5",
    videoUrl: "https://drive.google.com/file/d/1KtxKsklgArHbf-DyO9N4GF2WExFInMAY/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "実践編 Part 5 の学習内容です。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "advanced-part-6",
    partNumber: 6,
    title: "実践編 Part 6",
    videoUrl: "https://drive.google.com/file/d/1Gd7xWDM-wm6ihH9tRxxFeNZFq8l3JidA/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 3300,
    description: "実践編 Part 6 の学習内容です。",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "advanced-part-7",
    partNumber: 7,
    title: "実践編 Part 7",
    videoUrl: "https://drive.google.com/file/d/1v0h1r_oM5LDO234zCDsA00E19EQ97C5A/preview",
    textUrl: COMMON_TEXT_URL,
    duration: 1800,
    description: "実践編 Part 7 の学習内容です。",
    updatedAt: new Date().toISOString(),
  },
]

// デモ動画データ
export const demoVideo: PartVideo = {
  id: "demo",
  partNumber: 0,
  title: "デモ動画",
  videoUrl: "https://drive.google.com/file/d/1jgEwS7hm4vOlrDli_HQRu4lLv4YBhqHR/preview",
  textUrl: COMMON_TEXT_URL,
  duration: 60,
  description: "受講環境の確認用デモ動画です。",
  updatedAt: new Date().toISOString(),
}

// ローカルストレージキー
const STORAGE_KEY = "partVideos"
const DEMO_STORAGE_KEY = "demoVideo"

// 動画データの取得
export function getPartVideos(): PartVideo[] {
  if (typeof window === "undefined") return defaultPartVideos

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultPartVideos
    }
  }
  return defaultPartVideos
}

// 動画データの保存
export function savePartVideos(videos: PartVideo[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
}

// 特定パートの動画を取得
export function getPartVideo(partNumber: number): PartVideo | undefined {
  const videos = getPartVideos()
  return videos.find((v) => v.partNumber === partNumber)
}

// 特定パートの動画を更新
export function updatePartVideo(partNumber: number, updates: Partial<PartVideo>): void {
  const videos = getPartVideos()
  const index = videos.findIndex((v) => v.partNumber === partNumber)
  if (index !== -1) {
    videos[index] = { ...videos[index], ...updates, updatedAt: new Date().toISOString() }
    savePartVideos(videos)
  }
}

// デモ動画の取得
export function getDemoVideo(): PartVideo {
  if (typeof window === "undefined") return demoVideo

  const stored = localStorage.getItem(DEMO_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return demoVideo
    }
  }
  return demoVideo
}

// デモ動画の保存
export function saveDemoVideo(video: PartVideo): void {
  if (typeof window === "undefined") return
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(video))
}

export function getVideoUrl(partId: string): string | null {
  if (partId === "demo") {
    const demo = getDemoVideo()
    return demo.videoUrl || null
  }

  const partNumber = Number.parseInt(partId, 10)
  if (isNaN(partNumber)) return null

  const partVideo = getPartVideo(partNumber)
  return partVideo?.videoUrl || null
}

export function getTextUrl(partId: string): string | null {
  if (partId === "demo") {
    const demo = getDemoVideo()
    return demo.textUrl || null
  }

  const partNumber = Number.parseInt(partId, 10)
  if (isNaN(partNumber)) return null

  const partVideo = getPartVideo(partNumber)
  return partVideo?.textUrl || null
}
