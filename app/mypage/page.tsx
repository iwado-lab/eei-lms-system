"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Home,
  ChevronRight,
  UserCog,
  CalendarDays,
  FileText,
  LogOut,
  BookOpen,
  AlertTriangle,
  ExternalLink,
  Clock,
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit3,
  Eye,
  EyeOff,
  Play,
  CalendarX,
  CalendarCheck,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { getCurrentUser, logoutStudent, type RegisteredStudent } from "@/lib/store"

type MyPageTab = "top" | "member-info" | "regular-lecture" | "application-status"

// Demo application data
interface ApplicationRecord {
  id: string
  lectureType: string
  date: string
  time: string
  venue: string
  location: string
  status: "confirmed" | "pending" | "cancelled"
  method: "venue" | "online-fixed" | "online-anytime"
}

const demoApplications: ApplicationRecord[] = [
  {
    id: "app-001",
    lectureType: "第一種電気工事士定期講習",
    date: "2026-03-12",
    time: "09:30 ~ 16:30",
    venue: "全国家電会館",
    location: "東京都文京区湯島3-6-1",
    status: "confirmed",
    method: "venue",
  },
  {
    id: "app-002",
    lectureType: "第一種電気工事士定期講習",
    date: "2026-05-20",
    time: "09:00 ~ 17:00",
    venue: "オンライン（定時受講方式）",
    location: "オンライン",
    status: "pending",
    method: "online-fixed",
  },
]

// Demo lecture list (based on real data from koshu.eei.or.jp)
const demoLectures = [
  { id: "lec-001", area: "東京", venue: "全国家電会館", address: "東京都文京区湯島3-6-1", date: "2026-03-05", day: "木", status: "available" as const, remaining: 45 },
  { id: "lec-002", area: "東京", venue: "全国家電会館", address: "東京都文京区湯島3-6-1", date: "2026-03-12", day: "木", status: "few" as const, remaining: 8 },
  { id: "lec-003", area: "東京", venue: "東京都電設工業企業年金基金会館", address: "東京都新宿区大久保2-8-3", date: "2026-05-19", day: "火", status: "available" as const, remaining: 60 },
  { id: "lec-004", area: "東京", venue: "府中の森芸術劇場", address: "東京都府中市浅間町1-2", date: "2026-04-08", day: "水", status: "available" as const, remaining: 80 },
  { id: "lec-005", area: "埼玉", venue: "埼玉電気会館", address: "埼玉県さいたま市北区植竹町1-820-6", date: "2026-02-16", day: "月", status: "available" as const, remaining: 30 },
  { id: "lec-006", area: "神奈川", venue: "神奈川県電気工事会館", address: "神奈川県横浜市中区三吉町4-1", date: "2026-02-25", day: "水", status: "available" as const, remaining: 55 },
  { id: "lec-007", area: "大阪", venue: "大阪府社会福祉会館", address: "大阪府大阪市中央区谷町7-4-15", date: "2026-03-09", day: "月", status: "available" as const, remaining: 40 },
  { id: "lec-008", area: "オンライン", venue: "定時受講方式", address: "オンライン", date: "2026-04-15", day: "水", status: "available" as const, remaining: 100 },
  { id: "lec-009", area: "オンライン", venue: "随時受講方式", address: "オンライン", date: "2026-05-01", day: "金", status: "available" as const, remaining: 70 },
  { id: "lec-010", area: "宮城", venue: "東京エレクトロンホール宮城", address: "宮城県仙台市青葉区国分町3-3-7", date: "2026-03-18", day: "水", status: "full" as const, remaining: 0 },
]

export default function MyPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<MyPageTab>("top")
  const [currentUser, setCurrentUser] = useState<RegisteredStudent | null>(null)
  const [applications, setApplications] = useState<ApplicationRecord[]>(demoApplications)

  // Member info form state
  const [lectureTypes, setLectureTypes] = useState({
    type1: true,
    type2_recognized: false,
    type2_special: false,
  })
  const [prefecture, setPrefecture] = useState("東京都")
  const [certDate, setCertDate] = useState({ era: "令和", year: "06", month: "02", day: "23" })
  const [certIssuedBy, setCertIssuedBy] = useState("koshu-center")
  const [lastName, setLastName] = useState("岩藤")
  const [firstName, setFirstName] = useState("匡史")
  const [lastNameKana, setLastNameKana] = useState("イワドウ")
  const [firstNameKana, setFirstNameKana] = useState("マサフミ")
  const [birthDate, setBirthDate] = useState({ era: "昭和", year: "57", month: "02", day: "23" })
  const [zipCode, setZipCode] = useState({ first: "125", second: "0081" })
  const [addressPref, setAddressPref] = useState("東京都")
  const [addressCity, setAddressCity] = useState("江東区 清澄3-36")
  const [addressBuilding, setAddressBuilding] = useState("")
  const [phone, setPhone] = useState("0544443488")
  const [email, setEmail] = useState("iwado@gakkenki.co.jp")
  const [emailConfirm, setEmailConfirm] = useState("iwado@gakkenki.co.jp")
  const [mailMagazine, setMailMagazine] = useState("receive")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [workplaceName, setWorkplaceName] = useState("")
  const [workplaceDept, setWorkplaceDept] = useState("")
  const [workplaceZip, setWorkplaceZip] = useState({ first: "", second: "" })
  const [workplacePref, setWorkplacePref] = useState("都道府県の選択")
  const [workplaceCity, setWorkplaceCity] = useState("")
  const [workplaceBuilding, setWorkplaceBuilding] = useState("")
  const [workplacePhone, setWorkplacePhone] = useState("")

  // Lecture list filter
  const [areaFilter, setAreaFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  // Dialogs
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showChangeDateDialog, setShowChangeDateDialog] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null)
  const [selectedNewLecture, setSelectedNewLecture] = useState<string | null>(null)
  const [memberInfoTab, setMemberInfoTab] = useState<"input" | "confirm" | "complete">("input")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
      return
    }
    setCurrentUser(user)
  }, [router])

  const handleLogout = () => {
    if (currentUser) {
      logoutStudent(currentUser.id)
    }
    router.push("/")
  }

  const handleCancelApplication = () => {
    if (selectedApplication) {
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApplication.id ? { ...app, status: "cancelled" as const } : app
        )
      )
      setShowCancelDialog(false)
      setSelectedApplication(null)
    }
  }

  const handleChangeDate = () => {
    if (selectedApplication && selectedNewLecture) {
      const newLecture = demoLectures.find(l => l.id === selectedNewLecture)
      if (newLecture) {
        setApplications(prev =>
          prev.map(app =>
            app.id === selectedApplication.id
              ? {
                  ...app,
                  date: newLecture.date,
                  venue: newLecture.venue,
                  location: newLecture.address,
                  method: newLecture.venue.includes("オンライン") || newLecture.venue.includes("定時") || newLecture.venue.includes("随時") ? "online-fixed" as const : "venue" as const,
                }
              : app
          )
        )
      }
      setShowChangeDateDialog(false)
      setSelectedApplication(null)
      setSelectedNewLecture(null)
    }
  }

  const filteredLectures = demoLectures.filter(l => {
    if (areaFilter !== "all" && l.area !== areaFilter) return false
    if (methodFilter === "venue" && (l.venue.includes("定時") || l.venue.includes("随時"))) return false
    if (methodFilter === "online" && !l.venue.includes("定時") && !l.venue.includes("随時")) return false
    return true
  })

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${days[d.getDay()]})`
  }

  const displayName = currentUser?.name || "山田太郎"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="lg" />
            </div>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
                HOME
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{"マイページ"}</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Blue top line */}
      <div className="h-1 bg-[#003399]" />

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">
          {"マイページ（" + displayName + " 様）"}
        </h1>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Login info banner */}
        <div className="bg-[#FFF3E0] border border-[#FFE0B2] rounded-lg p-4 mb-6">
          <p className="text-foreground">
            {"現在、"}<span className="font-bold">{displayName} 様</span>{" でログインしています。"}
          </p>
          <p className="text-foreground">
            {"次回の受講期限は "}
            <span className="text-red-600 font-bold">{"令和11年02月22日"}</span>
            {" です。"}
          </p>
        </div>

        {/* Tab Navigation */}
        {activeTab !== "top" && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("top")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {"マイページトップに戻る"}
            </Button>
          </div>
        )}

        {/* TOP View - Menu Cards */}
        {activeTab === "top" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab("member-info")}
              className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-8 text-center transition-colors relative group"
            >
              <h3 className="text-lg font-bold text-foreground underline underline-offset-4">
                {"会員情報の確認・変更"}
              </h3>
              <div className="absolute bottom-3 right-3 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-[#003399]" />
            </button>

            <button
              onClick={() => setActiveTab("regular-lecture")}
              className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-8 text-center transition-colors relative group"
            >
              <h3 className="text-lg font-bold text-foreground underline underline-offset-4">
                {"定期講習の申し込み"}
              </h3>
              <div className="absolute bottom-3 right-3 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-[#003399]" />
            </button>

            <button
              onClick={() => setActiveTab("application-status")}
              className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-8 text-center transition-colors relative group"
            >
              <h3 className="text-lg font-bold text-foreground underline underline-offset-4">
                {"受講申込状況"}
              </h3>
              <div className="absolute bottom-3 right-3 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-[#003399]" />
            </button>

            <a
              href="#"
              className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-8 text-center transition-colors relative group"
            >
              <h3 className="text-lg font-bold text-foreground underline underline-offset-4">
                {"技術情報・事故情報・Q&A・テキスト改正"}
              </h3>
              <div className="absolute bottom-3 right-3 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-[#003399]" />
            </a>

            <a
              href="#"
              className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-8 text-center transition-colors relative group"
            >
              <h3 className="text-lg font-bold text-foreground underline underline-offset-4">
                {"退会手続き"}
              </h3>
              <div className="absolute bottom-3 right-3 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-[#003399]" />
            </a>

            <button
              onClick={handleLogout}
              className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-8 text-center transition-colors relative group"
            >
              <h3 className="text-lg font-bold text-foreground underline underline-offset-4">
                {"ログアウト"}
              </h3>
              <div className="absolute bottom-3 right-3 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-[#003399]" />
            </button>
          </div>
        )}

        {/* Member Info Tab */}
        {activeTab === "member-info" && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              {"会員情報の確認・変更"}
            </h2>

            {/* Step tabs */}
            <div className="flex border-b border-border mb-6">
              <button
                onClick={() => setMemberInfoTab("input")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  memberInfoTab === "input"
                    ? "border-[#4CAF50] text-[#4CAF50] bg-[#E8F5E9]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {"会員情報入力"}
              </button>
              <button
                onClick={() => setMemberInfoTab("confirm")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  memberInfoTab === "confirm"
                    ? "border-[#4CAF50] text-[#4CAF50] bg-[#E8F5E9]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {"入力内容確認"}
              </button>
              <button
                onClick={() => setMemberInfoTab("complete")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  memberInfoTab === "complete"
                    ? "border-[#4CAF50] text-[#4CAF50] bg-[#E8F5E9]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {"変更完了"}
              </button>
            </div>

            {memberInfoTab === "input" && (
              <Card className="border-border">
                <CardContent className="p-6 space-y-6">
                  <p className="text-sm text-muted-foreground bg-[#FFF3E0] p-3 rounded border border-[#FFE0B2]">
                    {"以下の情報を入力し、「内容確認へ」をクリックしてください。"}
                  </p>

                  {/* Lecture Type */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"講習の種類 "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={lectureTypes.type1}
                          onCheckedChange={(checked) => setLectureTypes(prev => ({ ...prev, type1: checked as boolean }))}
                        />
                        <span className="text-sm text-foreground">{"第一種電気工事士定期講習"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={lectureTypes.type2_recognized}
                          onCheckedChange={(checked) => setLectureTypes(prev => ({ ...prev, type2_recognized: checked as boolean }))}
                        />
                        <span className="text-sm text-foreground">{"認定電気工事従事者認定講習"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={lectureTypes.type2_special}
                          onCheckedChange={(checked) => setLectureTypes(prev => ({ ...prev, type2_special: checked as boolean }))}
                        />
                        <span className="text-sm text-foreground">{"特種電気工事資格者認定講習"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Issue Prefecture */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"発行都道府県 "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select value={prefecture} onValueChange={setPrefecture}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"].map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">{"No."}</span>
                      <Input className="w-32" defaultValue="123456" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {"免状記載の順（アルファベット含む）にご入力ください。"}
                    </p>
                  </div>

                  {/* Reception Date */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">{"受付日"}</Label>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="令和">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="令和">{"令和"}</SelectItem>
                          <SelectItem value="平成">{"平成"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input className="w-16" defaultValue="07" />
                      <span className="text-sm text-foreground">{"年"}</span>
                      <Input className="w-16" defaultValue="02" />
                      <span className="text-sm text-foreground">{"月"}</span>
                      <Input className="w-16" defaultValue="23" />
                      <span className="text-sm text-foreground">{"日"}</span>
                    </div>
                  </div>

                  {/* Certification Date */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"認定電気工事従事者認定日 "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select value={certDate.era} onValueChange={(v) => setCertDate(prev => ({ ...prev, era: v }))}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="令和">{"令和"}</SelectItem>
                          <SelectItem value="平成">{"平成"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input className="w-16" value={certDate.year} onChange={(e) => setCertDate(prev => ({ ...prev, year: e.target.value }))} />
                      <span className="text-sm text-foreground">{"年"}</span>
                      <Input className="w-16" value={certDate.month} onChange={(e) => setCertDate(prev => ({ ...prev, month: e.target.value }))} />
                      <span className="text-sm text-foreground">{"月"}</span>
                      <Input className="w-16" value={certDate.day} onChange={(e) => setCertDate(prev => ({ ...prev, day: e.target.value }))} />
                      <span className="text-sm text-foreground">{"日"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {"認定書記載の日の変更があれば正しい情報をご入力ください。講習センターにて確認いたします。"}
                    </p>
                  </div>

                  {/* Certification Issued By */}
                  <div className="space-y-2">
                    <RadioGroup value={certIssuedBy} onValueChange={setCertIssuedBy} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="koshu-center" id="koshu-center" />
                        <Label htmlFor="koshu-center" className="text-sm text-foreground">{"講習センターが講習センター"}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="other-center" id="other-center" />
                        <Label htmlFor="other-center" className="text-sm text-foreground">{"対応電器が講習センター以外"}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="first-time" id="first-time" />
                        <Label htmlFor="first-time" className="text-sm text-foreground">{"免状交付後、初めて受講される方"}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"氏名 "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground w-8">{"姓"}</span>
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="flex-1" />
                      <span className="text-sm text-foreground w-8">{"名"}</span>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="flex-1" />
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
                      {"免状に記載されている文字で入力して下さい。旧字は変換して対応する正しい文字を確認して下さい。入力文字にシステムに登録できる文字（JIS）に含まれない場合、代替の文字のまま登録いたします。ご了承ください。"}
                    </div>
                  </div>

                  {/* Furigana */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"氏名（カナ）"}
                      <span className="text-red-600">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground w-16">{"セイ"}</span>
                      <Input value={lastNameKana} onChange={(e) => setLastNameKana(e.target.value)} className="flex-1" />
                      <span className="text-sm text-foreground w-16">{"メイ"}</span>
                      <Input value={firstNameKana} onChange={(e) => setFirstNameKana(e.target.value)} className="flex-1" />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"生年月日 "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select value={birthDate.era} onValueChange={(v) => setBirthDate(prev => ({ ...prev, era: v }))}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="令和">{"令和"}</SelectItem>
                          <SelectItem value="平成">{"平成"}</SelectItem>
                          <SelectItem value="昭和">{"昭和"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input className="w-16" value={birthDate.year} onChange={(e) => setBirthDate(prev => ({ ...prev, year: e.target.value }))} />
                      <span className="text-sm text-foreground">{"年"}</span>
                      <Input className="w-16" value={birthDate.month} onChange={(e) => setBirthDate(prev => ({ ...prev, month: e.target.value }))} />
                      <span className="text-sm text-foreground">{"月"}</span>
                      <Input className="w-16" value={birthDate.day} onChange={(e) => setBirthDate(prev => ({ ...prev, day: e.target.value }))} />
                      <span className="text-sm text-foreground">{"日"}</span>
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">{"住所"}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{"〒"}</span>
                      <Input className="w-20" value={zipCode.first} onChange={(e) => setZipCode(prev => ({ ...prev, first: e.target.value }))} />
                      <span className="text-foreground">{"-"}</span>
                      <Input className="w-24" value={zipCode.second} onChange={(e) => setZipCode(prev => ({ ...prev, second: e.target.value }))} />
                    </div>
                  </div>

                  {/* Address Prefecture */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">{"都道府県・市区町村住所"}</Label>
                    <Select value={addressPref} onValueChange={setAddressPref}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"].map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input value={addressCity} onChange={(e) => setAddressCity(e.target.value)} placeholder="市区町村・番地" />
                    <p className="text-xs text-muted-foreground">{"ご指定いただいた住所でよろしいですか？"}</p>
                  </div>

                  {/* Building */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">{"建物名・号室"}</Label>
                    <Input value={addressBuilding} onChange={(e) => setAddressBuilding(e.target.value)} />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"電話番号 "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">{"（日中にご連絡のつく電話番号を半角でご入力ください。）"}</p>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"メールアドレス "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input value={emailConfirm} onChange={(e) => setEmailConfirm(e.target.value)} placeholder="確認のため再入力" />
                  </div>

                  {/* Mail Magazine */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">{"メールマガジン配信について"}</Label>
                    <RadioGroup value={mailMagazine} onValueChange={setMailMagazine}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="receive" id="receive" />
                          <Label htmlFor="receive" className="text-sm text-foreground">{"受け取る"}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="not-receive" id="not-receive" />
                          <Label htmlFor="not-receive" className="text-sm text-foreground">{"受け取らない"}</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"現在のパスワード"}
                    </Label>
                    <p className="text-xs text-muted-foreground">{"（新しいパスワードに変更する場合にご入力ください。）"}</p>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      {"新しいパスワード"}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {"パスワードの全体は以下の通り設けています。"}
                      <br />{"・6文字以上"}
                      <br />{"・メールアドレスとパスワードは一致しない"}
                      <br />{"・使用可能な文字は半角英数 ！ ＠ ＃ $ % ^ & * ( ) - _ = + , . / < >"}
                    </p>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{"※文字のお間違えない入力してください。"}</p>
                  </div>

                  {/* Workplace */}
                  <div className="space-y-4 border-t border-border pt-6">
                    <h3 className="font-bold text-foreground">{"勤務先（任意）"}</h3>
                    <div className="space-y-2">
                      <Label className="text-foreground">{"勤務先名"}</Label>
                      <Input value={workplaceName} onChange={(e) => setWorkplaceName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">{"所属"}</Label>
                      <Input value={workplaceDept} onChange={(e) => setWorkplaceDept(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">{"勤務先住所"}</Label>
                      <Select value={workplacePref} onValueChange={setWorkplacePref}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="都道府県の選択">{"都道府県の選択"}</SelectItem>
                          {["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"].map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">{"ご指定いただいた住所でよろしいですか？"}</p>
                      <Input value={workplaceCity} onChange={(e) => setWorkplaceCity(e.target.value)} placeholder="市区町村・番地" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">{"建物名・号室"}</Label>
                      <Input value={workplaceBuilding} onChange={(e) => setWorkplaceBuilding(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">{"連絡先電話番号"}</Label>
                      <Input value={workplacePhone} onChange={(e) => setWorkplacePhone(e.target.value)} />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("top")}
                    >
                      {"戻る"}
                    </Button>
                    <Button
                      className="bg-[#4CAF50] hover:bg-[#43A047] text-white"
                      onClick={() => setMemberInfoTab("confirm")}
                    >
                      {"内容確認へ"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {memberInfoTab === "confirm" && (
              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm bg-[#E8F5E9] p-3 rounded border border-[#C8E6C9] text-foreground">
                    {"以下の内容で変更します。よろしければ「変更を確定」をクリックしてください。"}
                  </p>
                  <div className="divide-y divide-border">
                    {[
                      ["講習の種類", lectureTypes.type1 ? "第一種電気工事士定期講習" : "-"],
                      ["発行都道府県", prefecture],
                      ["氏名", `${lastName} ${firstName}`],
                      ["氏名（カナ）", `${lastNameKana} ${firstNameKana}`],
                      ["生年月日", `${birthDate.era}${birthDate.year}年${birthDate.month}月${birthDate.day}日`],
                      ["住所", `〒${zipCode.first}-${zipCode.second} ${addressPref}${addressCity}`],
                      ["電話番号", phone],
                      ["メールアドレス", email],
                      ["メールマガジン", mailMagazine === "receive" ? "受け取る" : "受け取らない"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex py-3">
                        <span className="w-48 text-sm font-medium text-muted-foreground shrink-0">{label}</span>
                        <span className="text-sm text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Button variant="outline" onClick={() => setMemberInfoTab("input")}>
                      {"戻る"}
                    </Button>
                    <Button
                      className="bg-[#4CAF50] hover:bg-[#43A047] text-white"
                      onClick={() => setMemberInfoTab("complete")}
                    >
                      {"変更を確定"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {memberInfoTab === "complete" && (
              <Card className="border-border">
                <CardContent className="p-6 text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#4CAF50] mx-auto" />
                  <h3 className="text-xl font-bold text-foreground">{"会員情報の変更が完了しました"}</h3>
                  <p className="text-muted-foreground">{"変更内容はすぐに反映されます。"}</p>
                  <Button onClick={() => { setActiveTab("top"); setMemberInfoTab("input") }}>
                    {"マイページに戻る"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Regular Lecture Tab */}
        {activeTab === "regular-lecture" && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              {"定期講習の申し込み"}
            </h2>

            <Card className="border-border mb-4">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  {"現在の講習一覧表は、6ヶ月分を掲載しています。順次更新していきますのでこちらからお申込みください。"}
                </p>
                <a
                  href="https://koshu.eei.or.jp/display/regular-list/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#003399] hover:underline font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  {"電気工事技術講習センター公式サイトで申し込む"}
                </a>
              </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-foreground">{"地域:"}</Label>
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{"全て"}</SelectItem>
                    <SelectItem value="東京">{"東京"}</SelectItem>
                    <SelectItem value="埼玉">{"埼玉"}</SelectItem>
                    <SelectItem value="神奈川">{"神奈川"}</SelectItem>
                    <SelectItem value="大阪">{"大阪"}</SelectItem>
                    <SelectItem value="宮城">{"宮城"}</SelectItem>
                    <SelectItem value="オンライン">{"オンライン"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-foreground">{"方式:"}</Label>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{"全て"}</SelectItem>
                    <SelectItem value="venue">{"集合講習"}</SelectItem>
                    <SelectItem value="online">{"オンライン講習"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lecture List */}
            <div className="space-y-3">
              {filteredLectures.map(lecture => (
                <Card key={lecture.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <Badge className={
                            lecture.area === "オンライン"
                              ? "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]"
                              : "bg-[#E3F2FD] text-[#1565C0] hover:bg-[#BBDEFB]"
                          }>
                            {lecture.area}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lecture.venue}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {lecture.address}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <CalendarDays className="w-3 h-3" />
                            {formatDate(lecture.date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          {lecture.status === "available" && (
                            <span className="text-sm text-[#2E7D32] font-medium">
                              {"申込可能（残り" + lecture.remaining + "名）"}
                            </span>
                          )}
                          {lecture.status === "few" && (
                            <span className="text-sm text-[#E65100] font-medium">
                              {"残席わずか（残り" + lecture.remaining + "名）"}
                            </span>
                          )}
                          {lecture.status === "full" && (
                            <span className="text-sm text-red-600 font-medium">
                              {"満席"}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          disabled={lecture.status === "full"}
                          className={
                            lecture.status === "full"
                              ? "bg-muted text-muted-foreground"
                              : "bg-[#003399] hover:bg-[#002266] text-white"
                          }
                        >
                          {"申し込む"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Application Status Tab */}
        {activeTab === "application-status" && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {"受講申込状況"}
            </h2>

            {applications.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{"現在、申込中の講習はありません。"}</p>
                  <Button
                    className="mt-4 bg-[#003399] hover:bg-[#002266] text-white"
                    onClick={() => setActiveTab("regular-lecture")}
                  >
                    {"定期講習の申し込みへ"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <Card key={app.id} className={`border-border ${app.status === "cancelled" ? "opacity-60" : ""}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground">{app.lectureType}</h3>
                            {app.status === "confirmed" && (
                              <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">{"確定"}</Badge>
                            )}
                            {app.status === "pending" && (
                              <Badge className="bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFE0B2]">{"申込中"}</Badge>
                            )}
                            {app.status === "cancelled" && (
                              <Badge variant="outline" className="text-muted-foreground">{"キャンセル済"}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {formatDate(app.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {app.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {app.venue}
                            {app.location !== "オンライン" && (
                              <span className="text-muted-foreground ml-1">{"（" + app.location + "）"}</span>
                            )}
                          </div>
                        </div>

                        {app.status !== "cancelled" && (
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="bg-[#003399] hover:bg-[#002266] text-white"
                              onClick={() => router.push("/dashboard")}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              {"受講画面へ"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedApplication(app)
                                setShowChangeDateDialog(true)
                              }}
                            >
                              <CalendarCheck className="w-4 h-4 mr-1" />
                              {"日程変更"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => {
                                setSelectedApplication(app)
                                setShowCancelDialog(true)
                              }}
                            >
                              <CalendarX className="w-4 h-4 mr-1" />
                              {"キャンセル"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {"受講キャンセルの確認"}
            </DialogTitle>
            <DialogDescription>
              {"この申込をキャンセルしてもよろしいですか？"}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-3 py-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="font-medium text-foreground">{selectedApplication.lectureType}</p>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(selectedApplication.date)}</p>
                <p className="text-sm text-muted-foreground">{selectedApplication.venue}</p>
              </div>
              <p className="text-sm text-red-600">
                {"キャンセル後は受講日程の再申込が必要になります。"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              {"戻る"}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleCancelApplication}
            >
              {"キャンセルする"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Date Dialog */}
      <Dialog open={showChangeDateDialog} onOpenChange={setShowChangeDateDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <CalendarCheck className="w-5 h-5" />
              {"受講日程の変更"}
            </DialogTitle>
            <DialogDescription>
              {"変更先の日程を選択してください。"}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">{"現在の受講日"}</p>
                <p className="font-medium text-foreground">{formatDate(selectedApplication.date)}</p>
                <p className="text-sm text-muted-foreground">{selectedApplication.venue}</p>
              </div>

              <p className="text-sm font-medium text-foreground">{"変更可能な日程"}</p>
              <div className="space-y-2">
                {demoLectures.filter(l => l.status !== "full").map(lecture => (
                  <div
                    key={lecture.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedNewLecture === lecture.id
                        ? "border-[#003399] bg-[#E3F2FD]"
                        : "border-border hover:border-[#003399]/50"
                    }`}
                    onClick={() => setSelectedNewLecture(lecture.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-foreground">{formatDate(lecture.date)}</p>
                        <p className="text-sm text-muted-foreground">{lecture.venue}</p>
                      </div>
                      <Badge className={
                        lecture.status === "few"
                          ? "bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFE0B2]"
                          : "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]"
                      }>
                        {"残り" + lecture.remaining + "名"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangeDateDialog(false)}>
              {"キャンセル"}
            </Button>
            <Button
              className="bg-[#003399] hover:bg-[#002266] text-white"
              disabled={!selectedNewLecture}
              onClick={handleChangeDate}
            >
              {"日程を変更する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
