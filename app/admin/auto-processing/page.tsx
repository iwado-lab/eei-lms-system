"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AutoProcessingSettingsPanel } from "@/components/admin/auto-processing-settings"
import { StudyLogsViewer } from "@/components/admin/study-logs-viewer"

export default function AutoProcessingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-2xl font-bold">自動処理設定・受講中ログ</h1>
        </div>

        {/* 自動処理設定 */}
        <AutoProcessingSettingsPanel />

        {/* 受講中ログビューア */}
        <StudyLogsViewer />
      </div>
    </div>
  )
}
