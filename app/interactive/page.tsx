"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  MapPin,
  Video,
  Download,
  MessageCircle,
  Camera,
  Users,
  Calendar,
  Settings,
  QrCode,
  Eye,
  FileText,
  Clock,
} from "lucide-react"

export default function InteractiveLearning() {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true)
  const [chatMessage, setChatMessage] = useState("")
  const [downloadEnabled, setDownloadEnabled] = useState(true)

  const venues = [
    { name: "QR出席管理システム", status: "準備完了", icon: QrCode },
    { name: "本人認証実行", status: "認証済み", icon: Camera },
    { name: "出席記録登録", status: "登録完了", icon: FileText },
    { name: "修了証がダウンロード可能", status: "利用可能", icon: Download },
    { name: "追加コース出席", status: "待機中", icon: Calendar },
    { name: "修了証プレビュー", status: "表示可能", icon: Eye },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold">GLX</span>
            </div>
            <Badge variant="outline">受講者側</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              通知あり
            </Button>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">田</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">受講者側：受講中のインタラクションと講師連携UI</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Venue System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                会場型講習システム
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">利用可能な会場一覧</span>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  通知あり
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {venues.map((venue, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <venue.icon className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{venue.name}</div>
                      <div className="text-xs text-gray-500">{venue.status}</div>
                    </div>
                    {venue.name.includes("QR") && (
                      <div className="w-12 h-12 bg-black flex items-center justify-center">
                        <div className="w-10 h-10 bg-white grid grid-cols-3 gap-px p-1">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className={`bg-black ${i % 2 === 0 ? "" : "bg-white"}`}></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
                <Eye className="w-4 h-4 mr-2" />
                修了証プレビュー
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                会場型講習は変更不可。選択後のキャンセルは管理者に連絡が必要です。
              </p>
            </CardContent>
          </Card>

          {/* Live Streaming */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                ZOOM連携ライブストリーミング
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">
                  <Clock className="w-3 h-3 mr-1" />
                  8月15日 15:00開始
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm font-medium">次回のライブ講義</div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Webプログラミング基礎</h3>
                      <p className="text-sm text-gray-600">田中 健太 講師</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Calendar className="w-3 h-3 mr-1" />
                          参加登録
                        </Button>
                        <Button variant="outline" size="sm">
                          予約
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">ライブ配信機能</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>画質・なりすまし検出</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>別タブ・別ウィンドウ検出</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>出席時間記録</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">遅刻20分以上の離席は未出席扱い</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                テキストダウンロード機能
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">教材ダウンロード設定</span>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-1" />
                  コースごとに設定可能
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Webプログラミング講座</span>
                      <Switch checked={downloadEnabled} onCheckedChange={setDownloadEnabled} />
                    </div>
                    <div className="text-xs text-gray-600">
                      テキスト、サンプルコード
                      <br />
                      ダウンロード無効
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-transparent"
                      disabled={!downloadEnabled}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      ダウンロード禁止
                    </Button>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">UI/UXデザイン講座</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="text-xs text-gray-600">
                      ダウンロード無効
                      <br />
                      ネットワーク基礎
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      <Download className="w-3 h-3 mr-1" />
                      ダウンロード禁止
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">データベース設計</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">資料、ER図テンプレート</span>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      PDFをダウンロード
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                チャット型質問&講師連携UI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">講師: 田中先生</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">オンライン</span>
                    <Button variant="outline" size="sm">
                      <Users className="w-3 h-3 mr-1" />
                      クローズドチャット
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <div className="text-sm text-gray-700">
                    JavaScriptのPromiseについて質問があります。thenとcatchの使い方がよくわかりません。
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="メッセージを入力..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    送信
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                監視システム（離席・なりすまし検出）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm font-medium">受講モニタリングステータス</div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700">
                    <Camera className="w-3 h-3 mr-1" />
                    カメラ監視
                  </Badge>
                  <span className="text-sm text-gray-600">顔認識による本人確認</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">画面監視</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs">92%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">別タブ・別ウィンドウ検出</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs">100%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-xs text-gray-500 py-4 border-t mt-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <span>学習中の不正防止と効果的なサポートを両立</span>
            <span>QRコード出席確認 + ZOOM連携で柔軟な受講形態に対応</span>
          </div>
        </div>
      </div>
    </div>
  )
}
