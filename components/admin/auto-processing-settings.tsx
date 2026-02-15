"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle, Shield, Mail, Ban, FileX, Settings, Save, RotateCcw } from "lucide-react"
import {
  getAutoProcessingSettings,
  saveAutoProcessingSettings,
  type AutoProcessingSettings,
} from "@/lib/remote-control"

export function AutoProcessingSettingsPanel() {
  const [settings, setSettings] = useState<AutoProcessingSettings>({
    enabled: false,
    violationThreshold: 3,
    autoStopVideo: true,
    autoBlockCertificate: false,
    autoSendWarning: true,
    autoExcludeFromReport: false,
  })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const loaded = getAutoProcessingSettings()
    setSettings(loaded)
  }, [])

  const handleSave = () => {
    saveAutoProcessingSettings(settings)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleReset = () => {
    const defaultSettings: AutoProcessingSettings = {
      enabled: false,
      violationThreshold: 3,
      autoStopVideo: true,
      autoBlockCertificate: false,
      autoSendWarning: true,
      autoExcludeFromReport: false,
    }
    setSettings(defaultSettings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          自動処理設定
        </CardTitle>
        <CardDescription>
          不正検知時の自動処理を設定します。違反回数が閾値に達した場合、設定された処理が自動的に実行されます。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 自動処理の有効/無効 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className={`w-6 h-6 ${settings.enabled ? "text-green-600" : "text-gray-400"}`} />
            <div>
              <Label className="text-base font-medium">自動処理を有効化</Label>
              <p className="text-sm text-gray-500">
                {settings.enabled ? "自動処理が有効です" : "自動処理は無効です"}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
          />
        </div>

        {/* 閾値設定 */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            違反回数の閾値
          </Label>
          <p className="text-sm text-gray-500">
            この回数以上の違反が検出された場合に自動処理が実行されます。
          </p>
          <div className="flex items-center gap-4">
            <Slider
              value={[settings.violationThreshold]}
              onValueChange={(value) => setSettings({ ...settings, violationThreshold: value[0] })}
              min={1}
              max={10}
              step={1}
              className="flex-1"
              disabled={!settings.enabled}
            />
            <span className="font-mono text-lg w-8 text-center">{settings.violationThreshold}回</span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <h4 className="font-medium">自動処理の内容</h4>

          {/* 動画停止 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ban className="w-5 h-5 text-red-500" />
              <div>
                <Label>動画を自動停止</Label>
                <p className="text-sm text-gray-500">受講者の動画再生を遠隔で停止します</p>
              </div>
            </div>
            <Switch
              checked={settings.autoStopVideo}
              onCheckedChange={(checked) => setSettings({ ...settings, autoStopVideo: checked })}
              disabled={!settings.enabled}
            />
          </div>

          {/* 証明書発行停止 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileX className="w-5 h-5 text-orange-500" />
              <div>
                <Label>証明書発行を自動停止</Label>
                <p className="text-sm text-gray-500">修了書・証明書の発行を停止します</p>
              </div>
            </div>
            <Switch
              checked={settings.autoBlockCertificate}
              onCheckedChange={(checked) => setSettings({ ...settings, autoBlockCertificate: checked })}
              disabled={!settings.enabled}
            />
          </div>

          {/* 警告メール */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500" />
              <div>
                <Label>警告メールを自動送信</Label>
                <p className="text-sm text-gray-500">不正者へ警告メールを送信します</p>
              </div>
            </div>
            <Switch
              checked={settings.autoSendWarning}
              onCheckedChange={(checked) => setSettings({ ...settings, autoSendWarning: checked })}
              disabled={!settings.enabled}
            />
          </div>

          {/* 報告対象除外 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <Label>報告対象から自動除外</Label>
                <p className="text-sm text-gray-500">資格取得者報告対象から除外します</p>
              </div>
            </div>
            <Switch
              checked={settings.autoExcludeFromReport}
              onCheckedChange={(checked) => setSettings({ ...settings, autoExcludeFromReport: checked })}
              disabled={!settings.enabled}
            />
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            リセット
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {isSaved ? "保存しました" : "設定を保存"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
