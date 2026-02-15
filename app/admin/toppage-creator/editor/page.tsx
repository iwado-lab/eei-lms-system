"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, Bold, Italic, Link, ImageIcon, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PageContentEditor() {
  const [contentType, setContentType] = useState("freehtml")
  const [pcHtml, setPcHtml] = useState("")
  const [mobileHtml, setMobileHtml] = useState("")
  const [pageTitle, setPageTitle] = useState("")
  const [accessSettings, setAccessSettings] = useState({
    allUsers: true,
    specificGroup: false,
    loginOnly: false,
    guestUsers: false,
  })
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [publishSettings, setPublishSettings] = useState({
    webPublish: true,
    csvPublish: false,
    androidPublish: false,
  })
  const router = useRouter()

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log("Saving as draft...")
  }

  const handlePublish = () => {
    // Publish logic
    console.log("Publishing...")
  }

  const handlePreview = () => {
    // Preview logic
    console.log("Opening preview...")
  }

  const insertHtmlTag = (tag: string, editor: "pc" | "mobile") => {
    const textarea = document.getElementById(editor === "pc" ? "pc-editor" : "mobile-editor") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)
      const beforeText = textarea.value.substring(0, start)
      const afterText = textarea.value.substring(end)

      let newText = ""
      switch (tag) {
        case "bold":
          newText = `${beforeText}<strong>${selectedText}</strong>${afterText}`
          break
        case "italic":
          newText = `${beforeText}<em>${selectedText}</em>${afterText}`
          break
        case "link":
          newText = `${beforeText}<a href="">${selectedText}</a>${afterText}`
          break
        case "image":
          newText = `${beforeText}<img src="/placeholder.svg" alt="${selectedText}" />${afterText}`
          break
        default:
          newText = textarea.value
      }

      if (editor === "pc") {
        setPcHtml(newText)
      } else {
        setMobileHtml(newText)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/admin/toppage-creator")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">フリーHTML（1カラム）</h1>
                <p className="text-gray-600">コンテンツエディタ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                プレビュー
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                下書き保存
              </Button>
              <Button className="bg-cyan-500 text-white hover:bg-cyan-600" onClick={handlePublish}>
                公開
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Title */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">ページタイトル</label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="ページタイトルを入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* PC HTML Editor */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">PC用HTML</h3>
                <Badge variant="outline">下書き</Badge>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                <Button variant="ghost" size="sm" onClick={() => insertHtmlTag("bold", "pc")}>
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertHtmlTag("italic", "pc")}>
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertHtmlTag("link", "pc")}>
                  <Link className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertHtmlTag("image", "pc")}>
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Code className="w-4 h-4" />
                </Button>
              </div>

              <textarea
                id="pc-editor"
                value={pcHtml}
                onChange={(e) => setPcHtml(e.target.value)}
                placeholder="PC用のHTMLコンテンツを入力してください..."
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>Words: {pcHtml.split(" ").length}</span>
                <span>文字数: {pcHtml.length}</span>
              </div>
            </div>

            {/* Mobile HTML Editor */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">モバイル用HTML</h3>

              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                <Button variant="ghost" size="sm" onClick={() => insertHtmlTag("bold", "mobile")}>
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertHtmlTag("italic", "mobile")}>
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertHtmlTag("link", "mobile")}>
                  <Link className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertHtmlTag("image", "mobile")}>
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Code className="w-4 h-4" />
                </Button>
              </div>

              <textarea
                id="mobile-editor"
                value={mobileHtml}
                onChange={(e) => setMobileHtml(e.target.value)}
                placeholder="モバイル用のHTMLコンテンツを入力してください..."
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>Words: {mobileHtml.split(" ").length}</span>
                <span>文字数: {mobileHtml.length}</span>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Access Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">アクセス権限（グループ）</h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.allUsers}
                    onChange={(e) => setAccessSettings((prev) => ({ ...prev, allUsers: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">全てのユーザーで表示</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.specificGroup}
                    onChange={(e) => setAccessSettings((prev) => ({ ...prev, specificGroup: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">特定のグループで表示</span>
                </label>

                {accessSettings.specificGroup && (
                  <div className="ml-6 space-y-2">
                    <div className="text-sm font-medium text-gray-700">特定のグループ</div>
                    <input
                      type="text"
                      placeholder="グループ名を入力"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Login Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">アクセス権限（ログイン状態）</h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="loginAccess"
                    checked={accessSettings.loginOnly}
                    onChange={() => setAccessSettings((prev) => ({ ...prev, loginOnly: true, guestUsers: false }))}
                    className="mr-2"
                  />
                  <span className="text-sm">ログイン時のみ表示するページにする</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="loginAccess"
                    checked={accessSettings.guestUsers}
                    onChange={() => setAccessSettings((prev) => ({ ...prev, guestUsers: true, loginOnly: false }))}
                    className="mr-2"
                  />
                  <span className="text-sm">ログインしていないユーザーでも表示する</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="loginAccess"
                    checked={!accessSettings.loginOnly && !accessSettings.guestUsers}
                    onChange={() => setAccessSettings((prev) => ({ ...prev, loginOnly: false, guestUsers: false }))}
                    className="mr-2"
                  />
                  <span className="text-sm">ゲストユーザー、このページの表示を受ける</span>
                </label>
              </div>
            </div>

            {/* Publishing Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">配信設定</h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={publishSettings.webPublish}
                    onChange={(e) => setPublishSettings((prev) => ({ ...prev, webPublish: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Webで配信する</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={publishSettings.csvPublish}
                    onChange={(e) => setPublishSettings((prev) => ({ ...prev, csvPublish: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">CSVで配信する</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={publishSettings.androidPublish}
                    onChange={(e) => setPublishSettings((prev) => ({ ...prev, androidPublish: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Androidで配信する</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent" onClick={handleSaveDraft}>
                  下書きとして保存
                </Button>
                <Button className="w-full bg-cyan-500 text-white hover:bg-cyan-600" onClick={handlePublish}>
                  公開
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
