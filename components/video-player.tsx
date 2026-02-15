"use client"

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { AlertTriangle, HelpCircle, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  src: string
  autoPlay?: boolean
  muted?: boolean
  playsInline?: boolean
  className?: string
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onLoadedMetadata?: (duration: number) => void
  onEnded?: () => void
  showHelp?: boolean
  hideNativeControls?: boolean
  onReady?: (isIframe: boolean) => void
}

export interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  getCurrentTime: () => number
  getDuration: () => number
  setCurrentTime: (time: number) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  isIframe: () => boolean
}

function getVideoType(
  url: string,
): "mp4" | "youtube" | "vimeo" | "googledrive" | "googledrive-folder" | "iframe" | "invalid" {
  if (!url || url.trim() === "") return "invalid"

  const trimmedUrl = url.trim()

  if (trimmedUrl.includes("drive.google.com/drive/folders")) {
    return "googledrive-folder"
  }

  if (trimmedUrl.includes("<iframe")) {
    return "iframe"
  }

  if (trimmedUrl.includes("youtube.com") || trimmedUrl.includes("youtu.be")) {
    return "youtube"
  }

  if (trimmedUrl.includes("vimeo.com")) {
    return "vimeo"
  }

  if (trimmedUrl.includes("drive.google.com/file/d/")) {
    return "googledrive"
  }

  if (trimmedUrl.match(/\.(mp4|webm|ogg|mov)(\?|$)/i) || trimmedUrl.includes("commondatastorage.googleapis.com")) {
    return "mp4"
  }

  if (trimmedUrl.startsWith("http")) {
    return "mp4"
  }

  return "invalid"
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

function getVimeoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?(\d+)/
  const match = url.match(regExp)
  return match ? match[1] : null
}

function getGoogleDriveId(url: string): string | null {
  const regExp = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(regExp)
  return match ? match[1] : null
}

function getIframeSrc(iframeCode: string): string | null {
  const regExp = /src=["']([^"']+)["']/
  const match = iframeCode.match(regExp)
  return match ? match[1] : null
}

export function VideoUrlHelp() {
  return (
    <div className="text-xs text-gray-500 space-y-1 mt-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-1 font-medium text-gray-700">
        <HelpCircle className="w-3 h-3" />
        対応している動画URL形式:
      </div>
      <ul className="list-disc list-inside space-y-0.5 ml-1">
        <li>
          <span className="font-medium">YouTube:</span> https://www.youtube.com/watch?v=VIDEO_ID
        </li>
        <li>
          <span className="font-medium">Vimeo:</span> https://vimeo.com/VIDEO_ID
        </li>
        <li>
          <span className="font-medium">Google Drive:</span> https://drive.google.com/file/d/FILE_ID/view
        </li>
        <li>
          <span className="font-medium">MP4直接:</span> https://example.com/video.mp4
        </li>
        <li>
          <span className="font-medium">iframe埋め込み:</span> {'<iframe src="..." ...></iframe>'}
        </li>
      </ul>
      <div className="text-amber-600 mt-2 flex items-start gap-1">
        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <div>
          <p>Google Driveの動画を使う場合は「リンクを知っている全員」に共有設定してください。</p>
          <p className="text-red-500 mt-1">※フォルダURLではなく、動画ファイルのURLを指定してください。</p>
        </div>
      </div>
    </div>
  )
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  (
    {
      src,
      autoPlay = false,
      muted = false,
      playsInline = true,
      className = "",
      onPlay,
      onPause,
      onTimeUpdate,
      onLoadedMetadata,
      onEnded,
      showHelp = false,
      hideNativeControls = false,
      onReady,
    },
    ref,
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [videoType, setVideoType] = useState<ReturnType<typeof getVideoType>>("mp4")
    const [embedUrl, setEmbedUrl] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [iframeLoaded, setIframeLoaded] = useState(false)
    const [iframeError, setIframeError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const isIframeType = ["youtube", "vimeo", "googledrive", "iframe"].includes(videoType)

    useEffect(() => {
      console.log("[v0] VideoPlayer src received:", src)
      setError(null)
      setIframeLoaded(false)
      setIframeError(false)
      setIsLoading(true)

      const trimmedSrc = src?.trim() || ""
      const type = getVideoType(trimmedSrc)
      console.log("[v0] VideoPlayer detected type:", type)
      setVideoType(type)

      switch (type) {
        case "googledrive-folder":
          setError(
            "Google Driveのフォルダではなく、動画ファイルのURLを指定してください。\n\n正しい形式: https://drive.google.com/file/d/FILE_ID/view",
          )
          setEmbedUrl("")
          break
        case "invalid":
          setError("動画URLが指定されていません")
          setEmbedUrl("")
          break
        case "youtube": {
          const videoId = getYouTubeId(trimmedSrc)
          if (videoId) {
            const params = new URLSearchParams({
              autoplay: autoPlay ? "1" : "0",
              mute: muted ? "1" : "0",
              enablejsapi: "1",
              origin: typeof window !== "undefined" ? window.location.origin : "",
            })
            setEmbedUrl(`https://www.youtube.com/embed/${videoId}?${params.toString()}`)
          } else {
            setError("YouTubeの動画IDを取得できませんでした")
          }
          break
        }
        case "vimeo": {
          const videoId = getVimeoId(trimmedSrc)
          if (videoId) {
            const params = new URLSearchParams({
              autoplay: autoPlay ? "1" : "0",
              muted: muted ? "1" : "0",
            })
            setEmbedUrl(`https://player.vimeo.com/video/${videoId}?${params.toString()}`)
          } else {
            setError("Vimeoの動画IDを取得できませんでした")
          }
          break
        }
        case "googledrive": {
          const fileId = getGoogleDriveId(trimmedSrc)
          console.log("[v0] Google Drive fileId extracted:", fileId)
          if (fileId) {
            const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`
            console.log("[v0] Google Drive embedUrl:", embedUrl)
            setEmbedUrl(embedUrl)
          } else {
            setError("Google DriveのファイルIDを取得できませんでした")
          }
          break
        }
        case "iframe": {
          const iframeSrc = getIframeSrc(trimmedSrc)
          console.log("[v0] iframe src extracted:", iframeSrc)
          if (iframeSrc) {
            setEmbedUrl(iframeSrc)
          } else {
            setError("iframeのsrc属性を取得できませんでした")
          }
          break
        }
        default:
          setEmbedUrl(trimmedSrc)
      }

      setIsLoading(false)
    }, [src])

    useEffect(() => {
      if (onReady) {
        onReady(isIframeType)
      }
      console.log("[v0] VideoPlayer videoType:", videoType, "isIframeType:", isIframeType)
    }, [src, videoType, isIframeType, onReady])

    useImperativeHandle(ref, () => ({
      play: () => {
        if (videoType === "mp4" && videoRef.current) {
          videoRef.current.play()
        }
      },
      pause: () => {
        if (videoType === "mp4" && videoRef.current) {
          videoRef.current.pause()
        }
      },
      getCurrentTime: () => {
        if (videoType === "mp4" && videoRef.current) {
          return videoRef.current.currentTime
        }
        return 0
      },
      getDuration: () => {
        if (videoType === "mp4" && videoRef.current) {
          return videoRef.current.duration
        }
        return 0
      },
      setCurrentTime: (time: number) => {
        if (videoType === "mp4" && videoRef.current) {
          videoRef.current.currentTime = time
        }
      },
      setVolume: (volume: number) => {
        if (videoType === "mp4" && videoRef.current) {
          videoRef.current.volume = volume
        }
      },
      setMuted: (muted: boolean) => {
        if (videoType === "mp4" && videoRef.current) {
          videoRef.current.muted = muted
        }
      },
      isIframe: () => {
        return videoType !== "mp4" && videoType !== "invalid"
      },
    }))

    if (error) {
      return (
        <div className={`flex flex-col items-center justify-center bg-gray-900 text-white p-8 ${className}`}>
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
          <p className="text-center whitespace-pre-line">{error}</p>
          {showHelp && <VideoUrlHelp />}
        </div>
      )
    }

    if (videoType === "mp4") {
      return (
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          muted={muted}
          playsInline={playsInline}
          className={className}
          controls={!hideNativeControls}
          onPlay={onPlay}
          onPause={onPause}
          onTimeUpdate={() => {
            if (videoRef.current && onTimeUpdate) {
              onTimeUpdate(videoRef.current.currentTime, videoRef.current.duration)
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current && onLoadedMetadata) {
              onLoadedMetadata(videoRef.current.duration)
            }
          }}
          onEnded={onEnded}
          onError={() => setError("動画の読み込みに失敗しました。URLが正しいか確認してください。")}
        />
      )
    }

    console.log("[v0] Rendering iframe with embedUrl:", embedUrl)

    return (
      <div className={`relative ${className}`}>
        {isLoading && !iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
            <RefreshCw className="w-8 h-8 animate-spin mb-4" />
            <p>動画を読み込み中...</p>
            {(videoType === "googledrive" || embedUrl?.includes("drive.google.com")) && (
              <p className="text-sm text-gray-400 mt-2">Google Driveの動画は読み込みに時間がかかる場合があります</p>
            )}
          </div>
        )}

        {iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
            <p className="text-center mb-4">動画の読み込みに問題が発生しました</p>
            <div className="text-sm text-gray-400 text-center space-y-2 mb-4">
              <p>Google Driveの動画の場合:</p>
              <ul className="list-disc list-inside text-left">
                <li>動画の共有設定が「リンクを知っている全員」になっているか確認</li>
                <li>動画ファイル（フォルダではなく）のURLを使用しているか確認</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(embedUrl, "_blank")}
                className="text-white border-white hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                別タブで開く
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIframeError(false)
                  setIframeLoaded(false)
                  setIsLoading(true)
                }}
                className="text-white border-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                再読み込み
              </Button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={embedUrl}
          className={`w-full h-full ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: "none" }}
          onLoad={() => {
            console.log("[v0] iframe loaded")
            setIframeLoaded(true)
            setIsLoading(false)
          }}
          onError={() => {
            console.log("[v0] iframe error")
            setIframeError(true)
            setIsLoading(false)
          }}
        />
      </div>
    )
  },
)

VideoPlayer.displayName = "VideoPlayer"
