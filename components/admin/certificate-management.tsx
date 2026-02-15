"use client"

import { useState, useMemo } from "react"
import { 
  FileText, Download, Ban, Check, AlertTriangle, Search,
  ChevronDown, ChevronUp, Eye, Send, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CertificateRecord {
  id: string
  studentId: string
  studentName: string
  email: string
  courseName: string
  completedDate: string
  certificateNumber: string
  status: "pending" | "issued" | "blocked" | "revoked"
  downloadCount: number
  lastDownload: string | null
  blockReason: string | null
  violationCount: number
  isReportExcluded: boolean
}

const sampleCertificates: CertificateRecord[] = [
  {
    id: "CERT001",
    studentId: "STU001",
    studentName: "山田 太郎",
    email: "yamada@example.com",
    courseName: "派遣元責任者講習",
    completedDate: "2025-01-20",
    certificateNumber: "CERT-2025-00001",
    status: "issued",
    downloadCount: 2,
    lastDownload: "2025-01-20",
    blockReason: null,
    violationCount: 0,
    isReportExcluded: false,
  },
  {
    id: "CERT002",
    studentId: "STU002",
    studentName: "佐藤 花子",
    email: "sato@example.com",
    courseName: "派遣元責任者講習",
    completedDate: "2025-01-19",
    certificateNumber: "CERT-2025-00002",
    status: "issued",
    downloadCount: 1,
    lastDownload: "2025-01-19",
    blockReason: null,
    violationCount: 0,
    isReportExcluded: false,
  },
  {
    id: "CERT003",
    studentId: "STU003",
    studentName: "高橋 美咲",
    email: "takahashi@example.com",
    courseName: "派遣元責任者講習",
    completedDate: "2025-01-18",
    certificateNumber: "CERT-2025-00003",
    status: "blocked",
    downloadCount: 0,
    lastDownload: null,
    blockReason: "不正検知（顔認証失敗3回以上）",
    violationCount: 5,
    isReportExcluded: true,
  },
  {
    id: "CERT004",
    studentId: "STU004",
    studentName: "鈴木 一郎",
    email: "suzuki@example.com",
    courseName: "派遣元責任者講習",
    completedDate: "2025-01-17",
    certificateNumber: "CERT-2025-00004",
    status: "pending",
    downloadCount: 0,
    lastDownload: null,
    blockReason: null,
    violationCount: 1,
    isReportExcluded: false,
  },
  {
    id: "CERT005",
    studentId: "STU005",
    studentName: "田中 健太",
    email: "tanaka@example.com",
    courseName: "派遣元責任者講習",
    completedDate: "2025-01-15",
    certificateNumber: "CERT-2025-00005",
    status: "revoked",
    downloadCount: 1,
    lastDownload: "2025-01-15",
    blockReason: "後日不正発覚により取消",
    violationCount: 8,
    isReportExcluded: true,
  },
]

export function CertificateManagement() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>(sampleCertificates)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | CertificateRecord["status"]>("all")
  const [sortField, setSortField] = useState<keyof CertificateRecord>("completedDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  // ダイアログ状態
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateRecord | null>(null)
  const [blockReason, setBlockReason] = useState("")

  // フィルタリング
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!cert.studentName.toLowerCase().includes(query) &&
            !cert.studentId.toLowerCase().includes(query) &&
            !cert.certificateNumber.toLowerCase().includes(query) &&
            !cert.email.toLowerCase().includes(query)) {
          return false
        }
      }
      if (statusFilter !== "all" && cert.status !== statusFilter) return false
      return true
    }).sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })
  }, [certificates, searchQuery, statusFilter, sortField, sortDirection])

  // 統計
  const stats = useMemo(() => ({
    total: certificates.length,
    issued: certificates.filter(c => c.status === "issued").length,
    pending: certificates.filter(c => c.status === "pending").length,
    blocked: certificates.filter(c => c.status === "blocked").length,
    revoked: certificates.filter(c => c.status === "revoked").length,
    excluded: certificates.filter(c => c.isReportExcluded).length,
  }), [certificates])

  // 証明書ブロック
  const blockCertificate = () => {
    if (!selectedCertificate) return
    setCertificates(prev => prev.map(c => 
      c.id === selectedCertificate.id 
        ? { ...c, status: "blocked" as const, blockReason, isReportExcluded: true }
        : c
    ))
    setShowBlockDialog(false)
    setBlockReason("")
  }

  // 証明書取消
  const revokeCertificate = () => {
    if (!selectedCertificate) return
    setCertificates(prev => prev.map(c => 
      c.id === selectedCertificate.id 
        ? { ...c, status: "revoked" as const, blockReason, isReportExcluded: true }
        : c
    ))
    setShowRevokeDialog(false)
    setBlockReason("")
  }

  // 証明書発行許可
  const allowCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => 
      c.id === certId 
        ? { ...c, status: "issued" as const, blockReason: null }
        : c
    ))
  }

  // 報告対象への復帰
  const includeInReport = (certId: string) => {
    setCertificates(prev => prev.map(c => 
      c.id === certId ? { ...c, isReportExcluded: false } : c
    ))
  }

  // 報告対象から除外
  const excludeFromReport = (certId: string) => {
    setCertificates(prev => prev.map(c => 
      c.id === certId ? { ...c, isReportExcluded: true } : c
    ))
  }

  const getStatusBadge = (status: CertificateRecord["status"]) => {
    const config = {
      pending: { label: "発行待ち", className: "bg-blue-500" },
      issued: { label: "発行済", className: "bg-blue-500" },
      blocked: { label: "発行停止", className: "bg-blue-500" },
      revoked: { label: "取消済", className: "bg-gray-500" },
    }
    return <Badge className={config[status].className}>{config[status].label}</Badge>
  }

  const SortButton = ({ field, label }: { field: keyof CertificateRecord; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2"
      onClick={() => {
        if (sortField === field) {
          setSortDirection(prev => prev === "asc" ? "desc" : "asc")
        } else {
          setSortField(field)
          setSortDirection("desc")
        }
      }}
    >
      {label}
      {sortField === field && (
        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  )

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">全体</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.issued}</div>
            <div className="text-sm text-gray-500">発行済</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <div className="text-sm text-gray-500">発行待ち</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.blocked}</div>
            <div className="text-sm text-gray-500">発行停止</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.revoked}</div>
            <div className="text-sm text-gray-500">取消済</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.excluded}</div>
            <div className="text-sm text-gray-500">報告除外</div>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルタ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            証明書管理
          </CardTitle>
          <CardDescription>
            修了証・証明書の発行状況を管理します。不正検知時の発行停止や取消を行えます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="氏名、ID、証明書番号で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: typeof statusFilter) => setStatusFilter(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="pending">発行待ち</SelectItem>
                <SelectItem value="issued">発行済</SelectItem>
                <SelectItem value="blocked">発行停止</SelectItem>
                <SelectItem value="revoked">取消済</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 証明書一覧 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left"><SortButton field="certificateNumber" label="証明書番号" /></th>
                  <th className="p-3 text-left"><SortButton field="studentName" label="受講者" /></th>
                  <th className="p-3 text-left"><SortButton field="completedDate" label="修了日" /></th>
                  <th className="p-3 text-left"><SortButton field="status" label="ステータス" /></th>
                  <th className="p-3 text-left"><SortButton field="downloadCount" label="DL回数" /></th>
                  <th className="p-3 text-left"><SortButton field="violationCount" label="違反回数" /></th>
                  <th className="p-3 text-left">報告対象</th>
                  <th className="p-3 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} className={`border-b hover:bg-gray-50 ${cert.status === "blocked" || cert.status === "revoked" ? "bg-blue-50" : ""}`}>
                    <td className="p-3 font-mono text-sm">{cert.certificateNumber}</td>
                    <td className="p-3">
                      <div className="font-medium">{cert.studentName}</div>
                      <div className="text-xs text-gray-500">{cert.email}</div>
                    </td>
                    <td className="p-3 text-sm">{cert.completedDate}</td>
                    <td className="p-3">{getStatusBadge(cert.status)}</td>
                    <td className="p-3 text-center">
                      <span className="font-medium">{cert.downloadCount}</span>
                      {cert.lastDownload && (
                        <div className="text-xs text-gray-500">最終: {cert.lastDownload}</div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {cert.violationCount > 0 ? (
                        <Badge variant="destructive">{cert.violationCount}回</Badge>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {cert.isReportExcluded ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">除外</Badge>
                      ) : (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">対象</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {cert.status === "issued" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 bg-transparent"
                              onClick={() => {
                                setSelectedCertificate(cert)
                                setShowBlockDialog(true)
                              }}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-orange-600 bg-transparent"
                              onClick={() => {
                                setSelectedCertificate(cert)
                                setShowRevokeDialog(true)
                              }}
                            >
                              取消
                            </Button>
                          </>
                        )}
                        {cert.status === "blocked" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 bg-transparent"
                            onClick={() => allowCertificate(cert.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            許可
                          </Button>
                        )}
                        {cert.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 bg-transparent"
                              onClick={() => allowCertificate(cert.id)}
                            >
                              発行
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 bg-transparent"
                              onClick={() => {
                                setSelectedCertificate(cert)
                                setShowBlockDialog(true)
                              }}
                            >
                              停止
                            </Button>
                          </>
                        )}
                        {cert.isReportExcluded ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => includeInReport(cert.id)}
                          >
                            報告復帰
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600"
                            onClick={() => excludeFromReport(cert.id)}
                          >
                            報告除外
                          </Button>
                        )}
                      </div>
                      {cert.blockReason && (
                        <div className="text-xs text-blue-600 mt-1">
                          理由: {cert.blockReason}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 発行停止ダイアログ */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <Ban className="h-5 w-5" />
              証明書の発行停止
            </DialogTitle>
            <DialogDescription>
              {selectedCertificate?.studentName}さんの証明書発行を停止します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">注意</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                発行停止すると、受講者は証明書をダウンロードできなくなります。
                また、資格取得者報告対象からも自動的に除外されます。
              </p>
            </div>
            <div>
              <Label>停止理由</Label>
              <Textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="発行停止の理由を入力してください..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={blockCertificate}>
              発行停止
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 取消ダイアログ */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              証明書の取消
            </DialogTitle>
            <DialogDescription>
              {selectedCertificate?.studentName}さんの発行済み証明書を取り消します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">重要</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                取消処理を行うと、既に発行された証明書は無効となります。
                この操作は元に戻せません。
              </p>
            </div>
            <div>
              <Label>取消理由</Label>
              <Textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="取消の理由を入力してください..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>
              キャンセル
            </Button>
            <Button 
              variant="destructive" 
              onClick={revokeCertificate}
              disabled={!blockReason}
            >
              証明書を取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
