"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, BookOpen, FileText, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice, getProductById, getPriceByMemberType } from "@/lib/products"
import Checkout from "@/components/checkout"
import { getCurrentUser } from "@/lib/store"

export default function BooksPage() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [memberType, setMemberType] = useState<"member" | "non_member">("non_member")
  const product = getProductById("dispatch-textbook-2025")

  // ログインユーザーの会員区分を取得
  useEffect(() => {
    const user = getCurrentUser()
    if (user?.memberType) {
      setMemberType(user.memberType)
    }
  }, [])

  if (!product) {
    return <div>商品が見つかりません</div>
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => setShowCheckout(false)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              商品ページに戻る
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">お支払い情報の入力</h1>
            <Checkout productId={product.id} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              ダッシュボードに戻る
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* ページタイトル */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">書籍ご注文フォーム</h1>
            <p className="text-muted-foreground">『{product.name}』購入ページです。</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左側：商品詳細 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 商品タイトルカード */}
              <Card>
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle className="text-xl">派遣元責任者に必要な基礎知識（派遣元責任者講習テキスト）</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 書籍画像 */}
                    <div className="flex justify-center">
                      <div className="relative w-full max-w-[300px] aspect-[3/4] bg-muted rounded-lg overflow-hidden border-2 border-border">
                        <Image
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* 商品情報 */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">商品情報</h3>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">販売価格：</dt>
                            <dd className="font-bold text-primary text-lg">{formatPrice(product.priceInCents)}</dd>
                          </div>
                          <div className="text-xs text-muted-foreground">（税込み・送料込み）/ 1冊</div>
                          <Separator />
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">発行：</dt>
                            <dd>{product.details?.publisher}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">判型：</dt>
                            <dd>A4判</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">ページ数：</dt>
                            <dd>{product.details?.pages}ページ</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">発行日：</dt>
                            <dd>{product.details?.publishDate}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">版：</dt>
                            <dd>{product.details?.edition}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 特長セクション */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    特長
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>最新の労働者派遣法に完全対応した内容</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>派遣元責任者講習の公式テキストとして使用</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>実務に即した具体的な事例と解説を豊富に掲載</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>法令改正に対応した最新情報を反映</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>派遣元責任者として必要な基礎知識を体系的に学習可能</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 目次セクション */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    主な内容
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>第1章：労働者派遣制度の概要</li>
                    <li>第2章：派遣元事業主の責務</li>
                    <li>第3章：派遣労働者の雇用管理</li>
                    <li>第4章：派遣先との関係</li>
                    <li>第5章：労働関係法令の基礎知識</li>
                    <li>第6章：個人情報保護とコンプライアンス</li>
                    <li>第7章：実務上の留意点</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 右側：購入セクション */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* 価格カード */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">価格（税込み）</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 会員/非会員 切替 */}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => setMemberType("member")}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border-2 transition-all ${
                          memberType === "member"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        会員
                      </button>
                      <button
                        onClick={() => setMemberType("non_member")}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border-2 transition-all ${
                          memberType === "non_member"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        非会員
                      </button>
                    </div>

                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">
                        {formatPrice(getPriceByMemberType(product, memberType))}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {memberType === "member" ? "会員価格（税込・送料込）" : "非会員価格（税込・送料込）"}
                      </p>
                      {memberType === "non_member" && product.memberPriceInCents && (
                        <p className="text-xs text-blue-600 mt-1">
                          会員の方は {formatPrice(product.memberPriceInCents)} でご購入いただけます
                        </p>
                      )}
                    </div>

                    <Button size="lg" className="w-full text-lg h-14" onClick={() => setShowCheckout(true)}>
                      購入する
                    </Button>

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>
                        【テキスト購入】※ご決済完了後の2〜3営業日以内に発送いたします。注文確定前に内容をよくご確認の上、ご注文ください。
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* 支払い方法カード */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">お支払い方法</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>クレジットカード</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">
                      VISA、Mastercard、JCB、American Express、Diners Club
                    </p>
                  </CardContent>
                </Card>

                {/* 注意事項 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">ご注意</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <p>• 商品の発送は日本国内のみとなります</p>
                    <p>• 返品・交換は商品到着後7日以内にご連絡ください</p>
                    <p>• 乱丁・落丁本の場合は無償で交換いたします</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
