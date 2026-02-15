"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CreditCard,
  Building2,
  FileText,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  ShoppingCart,
  AlertTriangle,
  Bell,
  Receipt,
  Banknote,
  Shield,
  Eye,
  Search,
  BarChart3,
} from "lucide-react"

export default function PaymentSystem() {
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("payment")
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["course1"])
  const [billingName, setBillingName] = useState("")
  const [showMultiCourse, setShowMultiCourse] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [subscriptionPlan, setSubscriptionPlan] = useState("monthly")
  const [autoRenewal, setAutoRenewal] = useState(true)
  const [paymentAnalytics, setPaymentAnalytics] = useState({
    successRate: 94.2,
    averageAmount: 28500,
    monthlyRevenue: 12458000,
    failureReasons: [
      { reason: "カード残高不足", count: 23 },
      { reason: "有効期限切れ", count: 15 },
      { reason: "セキュリティコード誤り", count: 8 },
    ],
  })

  const availableCourses = [
    {
      id: "course1",
      title: "プログラミング基礎",
      price: 29800,
      instructor: "田中講師",
      duration: "3ヶ月",
      required: true,
      subscriptionAvailable: true,
      monthlyPrice: 9800,
    },
    {
      id: "course2",
      title: "データ分析入門",
      price: 24800,
      instructor: "佐藤講師",
      duration: "2ヶ月",
      required: false,
      subscriptionAvailable: true,
      monthlyPrice: 8200,
    },
    {
      id: "course3",
      title: "ビジネス英語",
      price: 19800,
      instructor: "山田講師",
      duration: "4ヶ月",
      required: true,
      subscriptionAvailable: false,
      monthlyPrice: 0,
    },
    {
      id: "course4",
      title: "AI基礎セミナー",
      price: 15000,
      instructor: "鈴木講師",
      duration: "1日",
      required: false,
      subscriptionAvailable: false,
      monthlyPrice: 0,
    },
  ]

  const availableCoupons = [
    { code: "WELCOME20", discount: 20, type: "percentage", description: "新規登録20%オフ" },
    { code: "STUDENT50", discount: 5000, type: "fixed", description: "学生割引5000円オフ" },
    { code: "EARLY2025", discount: 15, type: "percentage", description: "早期申込15%オフ" },
  ]

  const subscriptionPlans = [
    { id: "monthly", name: "月額プラン", discount: 0, description: "毎月自動更新" },
    { id: "quarterly", name: "3ヶ月プラン", discount: 10, description: "3ヶ月ごと自動更新・10%オフ" },
    { id: "annual", name: "年額プラン", discount: 20, description: "年間契約・20%オフ" },
  ]

  const paymentHistory = [
    {
      id: "INV-2025-08130001",
      course: "ビジネスリーダーシップ講座",
      amount: "¥62,800",
      date: "2025年9月10日",
      status: "完了",
      method: "クレジットカード",
      statusColor: "green",
      dueDate: "2025年9月17日",
      invoiceDownloaded: 2,
      receiptDownloaded: 1,
      paymentDeadline: "2025年9月17日",
      billingAddress: "山田太郎",
      isSubscription: false,
      nextPaymentDate: null,
      autoRenewal: false,
      couponUsed: null,
      originalAmount: "¥62,800",
    },
    {
      id: "REC-2025-08050002",
      course: "プロジェクト管理基礎",
      amount: "¥38,500",
      date: "2025年8月5日",
      status: "支払い済み",
      method: "銀行振込",
      statusColor: "blue",
      dueDate: "2025年8月12日",
      invoiceDownloaded: 1,
      receiptDownloaded: 3,
      paymentDeadline: "2025年8月12日",
      billingAddress: "山田太郎",
      isSubscription: true,
      nextPaymentDate: "2025年9月5日",
      autoRenewal: true,
      couponUsed: "WELCOME20",
      originalAmount: "¥48,125",
    },
    {
      id: "INV-2025-07250005",
      course: "AIプログラミング入門",
      amount: "¥68,200",
      date: "2025年7月25日",
      status: "入金期限切れ",
      method: "コンビニ決済",
      statusColor: "red",
      dueDate: "2025年8月1日",
      invoiceDownloaded: 0,
      receiptDownloaded: 0,
      paymentDeadline: "2025年8月1日",
      billingAddress: "山田太郎",
      isSubscription: false,
      nextPaymentDate: null,
      autoRenewal: false,
      couponUsed: null,
      originalAmount: "¥68,200",
    },
    {
      id: "INV-2025-08200006",
      course: "データサイエンス応用",
      amount: "¥45,600",
      date: "2025年8月20日",
      status: "入金待ち",
      method: "銀行振込",
      statusColor: "orange",
      dueDate: "2025年8月27日",
      invoiceDownloaded: 1,
      receiptDownloaded: 0,
      paymentDeadline: "2025年8月27日",
      billingAddress: "山田太郎",
      isSubscription: false,
      nextPaymentDate: null,
      autoRenewal: false,
      couponUsed: "STUDENT50",
      originalAmount: "¥50,600",
    },
  ]

  const paymentNotifications = [
    {
      id: 1,
      type: "deadline",
      title: "自動督促メール送信",
      message: "「データサイエンス応用」の入金期限が近づいています。自動督促メールを送信しました。",
      date: "2025/08/24",
      urgent: true,
      automated: true,
    },
    {
      id: 2,
      type: "confirmation",
      title: "自動入金確認完了",
      message: "「プロジェクト管理基礎」の入金が自動確認され、受講開始メールを送信しました。",
      date: "2025/08/05",
      urgent: false,
      automated: true,
    },
    {
      id: 3,
      type: "failure",
      title: "決済失敗・自動リトライ",
      message: "クレジットカード決済が失敗しました。24時間後に自動リトライを実行します。",
      date: "2025/08/20",
      urgent: true,
      automated: true,
    },
    {
      id: 4,
      type: "subscription",
      title: "定期課金成功",
      message: "月額プランの自動更新が完了しました。次回課金日: 2025/09/05",
      date: "2025/08/05",
      urgent: false,
      automated: true,
    },
  ]

  const validateCoupon = (code: string) => {
    const coupon = availableCoupons.find((c) => c.code === code)
    if (coupon) {
      alert(`クーポン適用: ${coupon.description}`)
      return coupon
    } else {
      alert("無効なクーポンコードです")
      return null
    }
  }

  const calculateTotal = () => {
    let total = selectedCourses.reduce((sum, courseId) => {
      const course = availableCourses.find((c) => c.id === courseId)
      if (!course) return sum

      // Check if subscription is selected and available
      if (subscriptionPlan !== "one-time" && course.subscriptionAvailable) {
        const monthlyPrice = course.monthlyPrice
        const planDiscount = subscriptionPlans.find((p) => p.id === subscriptionPlan)?.discount || 0
        return sum + (monthlyPrice * (100 - planDiscount)) / 100
      }

      return sum + course.price
    }, 0)

    // Apply coupon discount
    if (couponCode) {
      const coupon = availableCoupons.find((c) => c.code === couponCode)
      if (coupon) {
        if (coupon.type === "percentage") {
          total = (total * (100 - coupon.discount)) / 100
        } else {
          total = Math.max(0, total - coupon.discount)
        }
      }
    }

    return Math.round(total)
  }

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const handlePayment = () => {
    // Simulate payment processing with enhanced features
    const total = calculateTotal()
    const isSubscription = subscriptionPlan !== "one-time"
    alert(
      `${selectedCourses.length}件のコースの決済を開始します。\n総額: ¥${total.toLocaleString()}\n${isSubscription ? `定期課金: ${subscriptionPlans.find((p) => p.id === subscriptionPlan)?.name}` : "一回払い"}`,
    )
  }

  const generateInvoice = (paymentId: string) => {
    // Simulate invoice generation with unique number
    const uniqueNumber = `INV-${new Date().getFullYear()}-${Date.now()}`
    alert(`請求書を生成しました。番号: ${uniqueNumber}`)
  }

  const generateReceipt = (paymentId: string) => {
    // Simulate receipt generation with unique number
    const uniqueNumber = `REC-${new Date().getFullYear()}-${Date.now()}`
    alert(`領収書を生成しました。番号: ${uniqueNumber}`)
  }

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
            <Badge variant="outline">決済・請求システム</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              通知{" "}
              <Badge variant="destructive" className="ml-1">
                2
              </Badge>
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              請求履歴
            </Button>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">山</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="payment">決済</TabsTrigger>
            <TabsTrigger value="subscription">定期課金</TabsTrigger>
            <TabsTrigger value="invoices">請求書・領収書</TabsTrigger>
            <TabsTrigger value="history">支払い履歴</TabsTrigger>
            <TabsTrigger value="analytics">決済分析</TabsTrigger>
            <TabsTrigger value="settings">設定・自動化</TabsTrigger>
          </TabsList>

          <TabsContent value="payment">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Multi-Course Selection */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      複数コース選択決済
                    </CardTitle>
                    <div className="text-sm text-gray-600">受講したいコースを選択してまとめて決済できます</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {availableCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedCourses.includes(course.id)}
                              onCheckedChange={() => toggleCourseSelection(course.id)}
                            />
                            <div>
                              <h3 className="font-medium">{course.title}</h3>
                              <p className="text-sm text-gray-600">
                                講師: {course.instructor} | 期間: {course.duration}
                              </p>
                              <div className="flex gap-2 mt-1">
                                {course.required && (
                                  <Badge variant="outline" className="text-xs">
                                    必須
                                  </Badge>
                                )}
                                {course.subscriptionAvailable && (
                                  <Badge variant="secondary" className="text-xs">
                                    定期課金対応
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">¥{course.price.toLocaleString()}</div>
                            {course.subscriptionAvailable && (
                              <div className="text-sm text-gray-600">月額: ¥{course.monthlyPrice.toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <Label htmlFor="coupon">クーポンコード</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="coupon"
                          placeholder="WELCOME20"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => validateCoupon(couponCode)}>
                          適用
                        </Button>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        利用可能: WELCOME20 (20%オフ), STUDENT50 (5000円オフ), EARLY2025 (15%オフ)
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">選択コース数: {selectedCourses.length}件</span>
                        <span className="text-xl font-bold text-blue-600">
                          合計: ¥{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                      {couponCode && <div className="text-sm text-blue-600 mt-1">クーポン適用済み</div>}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      GMO-PG連携決済システム
                    </CardTitle>
                    <div className="text-sm text-gray-600">決済方法を選択</div>
                    <Badge variant="secondary" className="w-fit">
                      <Shield className="w-3 h-3 mr-1" />
                      PCI DSS準拠・不正検知対応
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex items-center gap-3 flex-1 cursor-pointer">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">クレジットカード決済</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, JCB, American Express</div>
                            <div className="text-xs text-blue-600">即時決済・3Dセキュア・自動リトライ対応</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="convenience" id="convenience" />
                        <Label htmlFor="convenience" className="flex items-center gap-3 flex-1 cursor-pointer">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">コンビニ決済</div>
                            <div className="text-sm text-gray-500">セブンイレブン、ローソン、ファミリーマートなど</div>
                            <div className="text-xs text-blue-600">支払い期限: 7日間・自動督促メール対応</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center gap-3 flex-1 cursor-pointer">
                          <Banknote className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">銀行振込</div>
                            <div className="text-sm text-gray-500">オンラインバンキング、ATM振込など</div>
                            <div className="text-xs text-blue-600">振込手数料: お客様負担・入金自動確認</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "credit" && (
                      <div className="mt-6 space-y-4">
                        <div className="text-sm font-medium">カード情報</div>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="card-number">カード番号</Label>
                            <Input id="card-number" placeholder="1234 5678 9012 3456" className="mt-1" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="expiry">MM / YY</Label>
                              <Input id="expiry" placeholder="12/28" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="cvc">CVC</Label>
                              <Input id="cvc" placeholder="123" className="mt-1" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="cardholder">カード名義人</Label>
                            <Input id="cardholder" placeholder="YAMADA TARO" className="mt-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "convenience" && (
                      <div className="mt-6 space-y-4">
                        <Alert>
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            コンビニ決済を選択した場合、支払い番号が発行されます。7日以内にお支払いください。
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {paymentMethod === "bank" && (
                      <div className="mt-6 space-y-4">
                        <Alert>
                          <Banknote className="h-4 w-4" />
                          <AlertDescription>
                            銀行振込を選択した場合、振込先情報をメールでお送りします。3営業日以内にお振込みください。
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {/* Billing Information */}
                    <div className="mt-6 space-y-4">
                      <div className="text-sm font-medium">請求書・領収書情報</div>
                      <div>
                        <Label htmlFor="billing-name">宛名（請求書・領収書に記載）</Label>
                        <Input
                          id="billing-name"
                          placeholder="山田太郎 または 株式会社○○"
                          value={billingName}
                          onChange={(e) => setBillingName(e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">※一度設定すると変更できません</p>
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                      disabled={selectedCourses.length === 0}
                    >
                      ¥{calculateTotal().toLocaleString()} を決済する
                    </Button>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          決済完了後、自動で入金確認・受講開始メールを送信します
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>決済サマリー</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCourses.map((courseId) => {
                        const course = availableCourses.find((c) => c.id === courseId)
                        return course ? (
                          <div key={courseId} className="flex justify-between text-sm">
                            <span>{course.title}</span>
                            <span>¥{course.price.toLocaleString()}</span>
                          </div>
                        ) : null
                      })}
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>合計</span>
                        <span>¥{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>決済セキュリティ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">SSL暗号化通信</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">PCI DSS準拠</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">3Dセキュア対応</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    定期課金プラン
                  </CardTitle>
                  <div className="text-sm text-gray-600">継続学習に最適な定期課金システム</div>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={subscriptionPlan} onValueChange={setSubscriptionPlan} className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                        <div className="font-medium">一回払い</div>
                        <div className="text-sm text-gray-500">通常価格での単発購入</div>
                      </Label>
                    </div>
                    {subscriptionPlans.map((plan) => (
                      <div key={plan.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{plan.name}</div>
                              <div className="text-sm text-gray-500">{plan.description}</div>
                            </div>
                            {plan.discount > 0 && (
                              <Badge className="bg-blue-100 text-blue-800">{plan.discount}%オフ</Badge>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>自動更新</Label>
                      <Checkbox checked={autoRenewal} onCheckedChange={setAutoRenewal} />
                    </div>
                    <div className="text-sm text-gray-600">
                      自動更新を有効にすると、期限前に自動的に課金され、学習を継続できます。
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>現在の定期課金</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentHistory
                      .filter((p) => p.isSubscription)
                      .map((subscription) => (
                        <div key={subscription.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{subscription.course}</h3>
                              <p className="text-sm text-gray-600">次回課金: {subscription.nextPaymentDate}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{subscription.amount}</div>
                              <Badge className="bg-blue-100 text-blue-800 mt-1">定期課金中</Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>自動更新: {subscription.autoRenewal ? "有効" : "無効"}</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                設定変更
                              </Button>
                              <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
                                解約
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    請求書発行
                  </CardTitle>
                  <div className="text-sm text-gray-600">ユニーク番号付き請求書を発行</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentHistory
                      .filter((p) => p.status !== "完了")
                      .map((payment) => (
                        <div key={payment.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{payment.course}</h3>
                              <p className="text-sm text-gray-600">支払期限: {payment.dueDate}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{payment.amount}</div>
                              <Badge variant={payment.statusColor === "red" ? "destructive" : "secondary"}>
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>請求番号</span>
                              <span className="text-blue-600">{payment.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>宛名</span>
                              <span>{payment.billingAddress}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateInvoice(payment.id)}
                              className="flex-1"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              請求書発行
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-3 h-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    領収書発行
                  </CardTitle>
                  <div className="text-sm text-gray-600">支払い完了後に何度でも発行可能</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentHistory
                      .filter((p) => p.status === "完了" || p.status === "支払い済み")
                      .map((payment) => (
                        <div key={payment.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{payment.course}</h3>
                              <p className="text-sm text-gray-600">支払日: {payment.date}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{payment.amount}</div>
                              <Badge className="bg-blue-100 text-blue-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>領収書番号</span>
                              <span className="text-blue-600">{payment.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>発行回数</span>
                              <span>{payment.receiptDownloaded}回</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateReceipt(payment.id)}
                              className="flex-1"
                            >
                              <Receipt className="w-3 h-3 mr-1" />
                              領収書発行
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-3 h-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  支払い履歴管理
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input placeholder="請求番号で検索..." className="pl-10 w-64" />
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全ての状態</SelectItem>
                      <SelectItem value="completed">完了</SelectItem>
                      <SelectItem value="pending">入金待ち</SelectItem>
                      <SelectItem value="expired">期限切れ</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    CSV出力
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{payment.course}</h3>
                          <p className="text-sm text-gray-600">決済日: {payment.date}</p>
                          <p className="text-sm text-gray-600">支払期限: {payment.paymentDeadline}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{payment.amount}</div>
                          <Badge
                            variant={payment.statusColor === "green" ? "default" : "secondary"}
                            className={`mt-1 ${
                              payment.statusColor === "green"
                                ? "bg-blue-100 text-blue-700"
                                : payment.statusColor === "blue"
                                  ? "bg-blue-100 text-blue-700"
                                  : payment.statusColor === "red"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {payment.statusColor === "green" || payment.statusColor === "blue" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : payment.statusColor === "red" ? (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>請求番号: {payment.id}</div>
                        <div>決済方法: {payment.method}</div>
                        <div>請求書DL: {payment.invoiceDownloaded}回</div>
                        <div>領収書DL: {payment.receiptDownloaded}回</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          詳細
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          請求書
                        </Button>
                        <Button variant="outline" size="sm">
                          <Receipt className="w-3 h-3 mr-1" />
                          領収書
                        </Button>
                        {payment.status === "入金待ち" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <CreditCard className="w-3 h-3 mr-1" />
                            支払う
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    決済成功率分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <span className="font-medium">全体成功率</span>
                      <span className="text-2xl font-bold text-blue-600">{paymentAnalytics.successRate}%</span>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">失敗理由分析</h4>
                      {paymentAnalytics.failureReasons.map((reason, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm">{reason.reason}</span>
                          <Badge variant="destructive">{reason.count}件</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>収益分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ¥{paymentAnalytics.monthlyRevenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">月次収益</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ¥{paymentAnalytics.averageAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">平均単価</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>一回払い</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>定期課金</span>
                        <span className="font-medium">32%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>クーポン利用率</span>
                        <span className="font-medium">24%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    発行元情報設定
                  </CardTitle>
                  <div className="text-sm text-gray-600">請求書・領収書に印字される情報</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">会社名</Label>
                      <Input id="company-name" defaultValue="GLXアカデミー" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="company-address">会社住所</Label>
                      <Textarea
                        id="company-address"
                        defaultValue="〒150-0001&#10;東京都渋谷区代々木1-1-1&#10;GLXビル 5F"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoice-number">インボイス番号</Label>
                      <Input id="invoice-number" defaultValue="T12345678901123" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">電話番号</Label>
                      <Input id="phone" defaultValue="03-1234-5678" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">メールアドレス</Label>
                      <Input id="email" defaultValue="billing@glx-academy.com" className="mt-1" />
                    </div>

                    <Button className="w-full">設定を保存</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    自動化設定
                  </CardTitle>
                  <div className="text-sm text-gray-600">決済プロセスの自動化機能</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">自動入金確認</div>
                        <div className="text-sm text-gray-600">入金を自動検知して受講開始</div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">期限前自動督促</div>
                        <div className="text-sm text-gray-600">期限3日前に自動メール送信</div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">決済失敗自動リトライ</div>
                        <div className="text-sm text-gray-600">24時間後に自動再試行</div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">定期課金自動更新</div>
                        <div className="text-sm text-gray-600">期限前に自動課金実行</div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">不正検知システム</div>
                        <div className="text-sm text-gray-600">異常な決済パターンを自動検知</div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Webhook通知</div>
                        <div className="text-sm text-gray-600">外部システムへの自動通知</div>
                      </div>
                      <Checkbox />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <h4 className="font-medium">API設定</h4>
                    <div>
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input id="webhook-url" placeholder="https://your-system.com/webhook" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="api-key">API キー</Label>
                      <Input id="api-key" type="password" placeholder="••••••••••••••••" className="mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-center text-xs text-gray-500 py-4 border-t">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
          <span>GMO-PG連携・定期課金・自動化対応 | 不正検知・リスク管理システム完備</span>
          <span>クーポン・割引機能 | Webhook・API連携 | 高度な分析・レポート機能</span>
        </div>
      </div>
    </div>
  )
}
