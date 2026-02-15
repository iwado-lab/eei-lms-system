"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Monitor, Smartphone } from "lucide-react"

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  const ua = navigator.userAgent
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) && window.innerWidth < 768
}

export function MobileBlock({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
    setChecked(true)

    const handleResize = () => {
      setIsMobile(isMobileDevice())
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!checked) return null

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            スマートフォンでは受講できません
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            本講習はPC・タブレットでの受講が必要です。
            お手数ですが、PCまたはタブレット端末からアクセスしてください。
          </p>
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Monitor className="w-5 h-5 text-primary shrink-0" />
              <span>PC（Windows / Mac）</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Monitor className="w-5 h-5 text-primary shrink-0" />
              <span>タブレット（iPad等、画面幅768px以上）</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            定期講習 - 一般財団法人 電気工事技術講習センター
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
