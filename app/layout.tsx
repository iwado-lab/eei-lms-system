import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { FontSizeProvider } from "@/contexts/font-size-context"
import { CourseProgressProvider } from "@/contexts/course-progress-context"
import { MobileBlock } from "@/components/mobile-block"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
})

export const metadata: Metadata = {
  title: "定期講習 - 一般財団法人 電気工事技術講習センター",
  description: "一般財団法人 電気工事技術講習センター 定期講習 オンライン学習システム",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <MobileBlock>
          <FontSizeProvider>
            <CourseProgressProvider>{children}</CourseProgressProvider>
          </FontSizeProvider>
        </MobileBlock>
      </body>
    </html>
  )
}
