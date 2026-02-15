"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Send,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  Download,
  Upload,
  Copy,
} from "lucide-react"

// 送信元アドレス（日本人材派遣協会）
const SENDER_ADDRESS = "noreply@jassa.or.jp"
const SENDER_NAME = "日本人材派遣協会"

// メールテンプレートタイプ
type EmailTemplateType = 
  | "enrollment_ticket" // 受講票再送
  | "auth_reminder" // 未認証リマインド
  | "warning" // 注意喚起
  | "individual" // 個別テキストメール
  | "broadcast" // 一斉配信メール

interface EmailTemplate {
  id: string
  type: EmailTemplateType
  name: string
  subject: string
  body: string
  variables: string[]
  createdAt: string
  updatedAt: string
  usageCount: number
}

interface EmailLog {
  id: string
  type: EmailTemplateType
  subject: string
  recipients: string[]
  recipientCount: number
  sentAt: string
  status: "sent" | "failed" | "pending"
  openRate?: number
}

interface Recipient {
  id: string
  name: string
  email: string
  status: "未認証" | "認証済" | "受講中" | "受講済"
  tags: string[]
}

// デフォルトテンプレート
const defaultTemplates: EmailTemplate[] = [
  {
    id: "tpl_1",
    type: "enrollment_ticket",
    name: "受講票再送",
    subject: "【日本人材派遣協会】派遣元責任者講習 受講票の再送付",
    body: `{{受講者名}} 様

いつもお世話になっております。
日本人材派遣協会でございます。

ご依頼いただきました受講票を再送付いたします。

■受講情報
受講者ID: {{受講者ID}}
コース名: {{コース名}}
受講期限: {{受講期限}}

■受講URL
{{受講URL}}

ご不明な点がございましたら、下記までお問い合わせください。

─────────────────────────────
一般社団法人 日本人材派遣協会
TEL: 03-XXXX-XXXX
Email: support@jassa.or.jp
─────────────────────────────`,
    variables: ["受講者名", "受講者ID", "コース名", "受講期限", "受講URL"],
    createdAt: "2025-01-01",
    updatedAt: "2025-01-15",
    usageCount: 156,
  },
  {
    id: "tpl_2",
    type: "auth_reminder",
    name: "未認証リマインド",
    subject: "【日本人材派遣協会】本人認証のお願い",
    body: `{{受講者名}} 様

いつもお世話になっております。
日本人材派遣協会でございます。

派遣元責任者講習の受講にあたり、本人認証がまだ完了しておりません。
受講を開始するには、本人認証を完了していただく必要がございます。

■認証手順
1. 受講ページにアクセス
2. カメラをオンにして顔認証を実施
3. 認証完了後、受講を開始

■受講URL
{{受講URL}}

認証期限: {{認証期限}}

ご不明な点がございましたら、お気軽にお問い合わせください。

─────────────────────────────
一般社団法人 日本人材派遣協会
TEL: 03-XXXX-XXXX
Email: support@jassa.or.jp
─────────────────────────────`,
    variables: ["受講者名", "受講URL", "認証期限"],
    createdAt: "2025-01-01",
    updatedAt: "2025-01-10",
    usageCount: 89,
  },
  {
    id: "tpl_3",
    type: "warning",
    name: "注意喚起",
    subject: "【日本人材派遣協会】受講に関する注意喚起",
    body: `{{受講者名}} 様

いつもお世話になっております。
日本人材派遣協会でございます。

受講中に以下の事象が検出されました。

■検出内容
{{検出内容}}

■発生日時
{{発生日時}}

派遣元責任者講習は、法令に基づく講習であり、
本人による受講が義務付けられております。

今後も同様の事象が続く場合、受講の無効化や
修了証の発行停止となる場合がございます。

ご不明な点がございましたら、お問い合わせください。

─────────────────────────────
一般社団法人 日本人材派遣協会
TEL: 03-XXXX-XXXX
Email: support@jassa.or.jp
─────────────────────────────`,
    variables: ["受講者名", "検出内容", "発生日時"],
    createdAt: "2025-01-01",
    updatedAt: "2025-01-05",
    usageCount: 23,
  },
  {
    id: "tpl_4",
    type: "individual",
    name: "個別連絡",
    subject: "【日本人材派遣協会】{{件名}}",
    body: `{{受講者名}} 様

いつもお世話になっております。
日本人材派遣協会でございます。

{{本文}}

─────────────────────────────
一般社団法人 日本人材派遣協会
TEL: 03-XXXX-XXXX
Email: support@jassa.or.jp
─────────────────────────────`,
    variables: ["受講者名", "件名", "本文"],
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    usageCount: 45,
  },
  {
    id: "tpl_5",
    type: "broadcast",
    name: "一斉配信",
    subject: "【日本人材派遣協会】{{件名}}",
    body: `受講者の皆様

いつもお世話になっております。
日本人材派遣協会でございます。

{{本文}}

─────────────────────────────
一般社団法人 日本人材派遣協会
TEL: 03-XXXX-XXXX
Email: support@jassa.or.jp
─────────────────────────────`,
    variables: ["件名", "本文"],
    createdAt: "2025-01-01",
    updatedAt: "2025-01-20",
    usageCount: 12,
  },
]

// サンプル受講者データ
const sampleRecipients: Recipient[] = [
  { id: "STU001", name: "山田 太郎", email: "yamada@example.com", status: "受講中", tags: ["企業A", "2025年1月"] },
  { id: "STU002", name: "佐藤 花子", email: "sato@example.com", status: "未認証", tags: ["企業B", "2025年1月"] },
  { id: "STU003", name: "鈴木 一郎", email: "suzuki@example.com", status: "認証済", tags: ["企業A", "2025年2月"] },
  { id: "STU004", name: "田中 美咲", email: "tanaka@example.com", status: "受講済", tags: ["企業C", "2025年1月"] },
  { id: "STU005", name: "高橋 健太", email: "takahashi@example.com", status: "未認証", tags: ["企業B", "2025年2月"] },
]

// サンプル送信ログ
const sampleEmailLogs: EmailLog[] = [
  {
    id: "log_1",
    type: "broadcast",
    subject: "【日本人材派遣協会】システムメンテナンスのお知らせ",
    recipients: ["全受講者"],
    recipientCount: 156,
    sentAt: "2025-01-20 10:30",
    status: "sent",
    openRate: 68.5,
  },
  {
    id: "log_2",
    type: "auth_reminder",
    subject: "【日本人材派遣協会】本人認証のお願い",
    recipients: ["佐藤 花子", "高橋 健太"],
    recipientCount: 2,
    sentAt: "2025-01-19 14:00",
    status: "sent",
    openRate: 100,
  },
  {
    id: "log_3",
    type: "warning",
    subject: "【日本人材派遣協会】受講に関する注意喚起",
    recipients: ["山田 太郎"],
    recipientCount: 1,
    sentAt: "2025-01-18 09:15",
    status: "sent",
    openRate: 100,
  },
]

export function EmailManagement() {
  const [activeTab, setActiveTab] = useState("compose")
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(sampleEmailLogs)
  const [recipients, setRecipients] = useState<Recipient[]>(sampleRecipients)
  
  // メール作成フォーム
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [recipientFilter, setRecipientFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // テンプレート編集
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  
  // プレビュー
  const [showPreview, setShowPreview] = useState(false)

  // テンプレート選択時の処理
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setEmailSubject(template.subject)
      setEmailBody(template.body)
    }
  }

  // 受講者フィルタリング
  const filteredRecipients = recipients.filter(r => {
    const matchesSearch = r.name.includes(recipientFilter) || r.email.includes(recipientFilter)
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 受講者選択
  const toggleRecipient = (id: string) => {
    setSelectedRecipients(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  // 全選択/解除
  const toggleAllRecipients = () => {
    if (selectedRecipients.length === filteredRecipients.length) {
      setSelectedRecipients([])
    } else {
      setSelectedRecipients(filteredRecipients.map(r => r.id))
    }
  }

  // メール送信
  const handleSendEmail = async () => {
    if (selectedRecipients.length === 0) {
      alert("送信先を選択してください")
      return
    }

    const selectedRecipientData = recipients.filter(r => selectedRecipients.includes(r.id))
    
    // 送信ログに追加
    const newLog: EmailLog = {
      id: `log_${Date.now()}`,
      type: selectedTemplate ? (templates.find(t => t.id === selectedTemplate)?.type || "individual") : "individual",
      subject: emailSubject,
      recipients: selectedRecipientData.map(r => r.name),
      recipientCount: selectedRecipients.length,
      sentAt: new Date().toLocaleString("ja-JP"),
      status: "sent",
    }
    
    setEmailLogs([newLog, ...emailLogs])
    
    // テンプレート使用回数を更新
    if (selectedTemplate) {
      setTemplates(templates.map(t => 
        t.id === selectedTemplate ? { ...t, usageCount: t.usageCount + 1 } : t
      ))
    }
    
    alert(`${selectedRecipients.length}名に送信しました`)
    
    // フォームリセット
    setSelectedRecipients([])
    setEmailSubject("")
    setEmailBody("")
    setSelectedTemplate("")
  }

  // テンプレートタイプのラベル
  const getTemplateTypeLabel = (type: EmailTemplateType) => {
    const labels: Record<EmailTemplateType, string> = {
      enrollment_ticket: "受講票再送",
      auth_reminder: "未認証リマインド",
      warning: "注意喚起",
      individual: "個別メール",
      broadcast: "一斉配信",
    }
    return labels[type]
  }

  // テンプレートタイプの色
  const getTemplateTypeColor = (type: EmailTemplateType) => {
    const colors: Record<EmailTemplateType, string> = {
      enrollment_ticket: "bg-blue-100 text-blue-700",
      auth_reminder: "bg-blue-50 text-blue-600",
      warning: "bg-blue-200 text-blue-800",
      individual: "bg-blue-100 text-blue-700",
      broadcast: "bg-blue-50 text-blue-600",
    }
    return colors[type]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">メール送信管理</h2>
          <p className="text-sm text-gray-500">
            送信元: {SENDER_NAME} &lt;{SENDER_ADDRESS}&gt;
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            送信ログCSV
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="compose">メール作成</TabsTrigger>
          <TabsTrigger value="templates">テンプレート管理</TabsTrigger>
          <TabsTrigger value="logs">送信履歴</TabsTrigger>
        </TabsList>

        {/* メール作成タブ */}
        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左: メール作成フォーム */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  メール作成
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>テンプレート選択</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="テンプレートを選択..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            <Badge className={getTemplateTypeColor(template.type)}>
                              {getTemplateTypeLabel(template.type)}
                            </Badge>
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>件名</Label>
                  <Input 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="メールの件名を入力..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>本文</Label>
                  <Textarea 
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="メール本文を入力..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="bg-transparent"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    プレビュー
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleSendEmail}
                    disabled={selectedRecipients.length === 0 || !emailSubject || !emailBody}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    送信 ({selectedRecipients.length}名)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 右: 送信先選択 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  送信先選択
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="名前・メールで検索..."
                      value={recipientFilter}
                      onChange={(e) => setRecipientFilter(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全て</SelectItem>
                      <SelectItem value="未認証">未認証</SelectItem>
                      <SelectItem value="認証済">認証済</SelectItem>
                      <SelectItem value="受講中">受講中</SelectItem>
                      <SelectItem value="受講済">受講済</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={selectedRecipients.length === filteredRecipients.length && filteredRecipients.length > 0}
                      onCheckedChange={toggleAllRecipients}
                    />
                    <span className="text-sm font-medium">全て選択</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {selectedRecipients.length}/{filteredRecipients.length}名選択中
                  </span>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredRecipients.map(recipient => (
                    <div 
                      key={recipient.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRecipients.includes(recipient.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleRecipient(recipient.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedRecipients.includes(recipient.id)}
                          onCheckedChange={() => toggleRecipient(recipient.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{recipient.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {recipient.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">{recipient.email}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* クイック選択ボタン */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <span className="text-xs text-gray-500 w-full mb-1">クイック選択:</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent"
                    onClick={() => setSelectedRecipients(recipients.filter(r => r.status === "未認証").map(r => r.id))}
                  >
                    未認証者のみ
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent"
                    onClick={() => setSelectedRecipients(recipients.filter(r => r.status === "受講中").map(r => r.id))}
                  >
                    受講中のみ
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent"
                    onClick={() => setSelectedRecipients(recipients.map(r => r.id))}
                  >
                    全員
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* テンプレート管理タブ */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>メールテンプレート</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  新規テンプレート
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map(template => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTemplateTypeColor(template.type)}>
                            {getTemplateTypeLabel(template.type)}
                          </Badge>
                          <h3 className="font-medium">{template.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>使用回数: {template.usageCount}回</span>
                          <span>更新日: {template.updatedAt}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.variables.map(v => (
                            <Badge key={v} variant="outline" className="text-xs">
                              {`{{${v}}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 送信履歴タブ */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>送信履歴</CardTitle>
                <Button variant="outline" className="bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  更新
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailLogs.map(log => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTemplateTypeColor(log.type)}>
                            {getTemplateTypeLabel(log.type)}
                          </Badge>
                          {log.status === "sent" ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              送信済
                            </Badge>
                          ) : log.status === "failed" ? (
                            <Badge className="bg-red-100 text-red-700">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              失敗
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <Clock className="w-3 h-3 mr-1" />
                              送信中
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-sm mb-1">{log.subject}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>送信先: {log.recipientCount}名</span>
                          <span>送信日時: {log.sentAt}</span>
                          {log.openRate && <span>開封率: {log.openRate}%</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {log.recipients.slice(0, 3).map((r, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {r}
                            </Badge>
                          ))}
                          {log.recipients.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{log.recipients.length - 3}名
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* プレビューダイアログ */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>メールプレビュー</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">
                送信元: {SENDER_NAME} &lt;{SENDER_ADDRESS}&gt;
              </div>
              <div className="text-sm text-gray-500 mb-2">
                送信先: {selectedRecipients.length}名
              </div>
              <div className="font-medium mb-4">{emailSubject}</div>
              <div className="whitespace-pre-wrap text-sm border-t pt-4">
                {emailBody}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)} className="bg-transparent">
              閉じる
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowPreview(false)
                handleSendEmail()
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              送信
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
