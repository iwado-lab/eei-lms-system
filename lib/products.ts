export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  memberPriceInCents?: number // 会員価格
  nonMemberPriceInCents?: number // 非会員価格
  images?: string[]
  details?: {
    publisher?: string
    pages?: number
    publishDate?: string
    edition?: string
    isbn?: string
  }
}

// 書籍商品カタログ
export const PRODUCTS: Product[] = [
  {
    id: "dispatch-textbook-2025",
    name: "これだけは知っておきたい 派遣元責任者に必要な基礎知識",
    description: "派遣元責任者講習テキスト - 最新版：2025年10月01日第11刷",
    priceInCents: 220000, // デフォルト（非会員価格）
    memberPriceInCents: 176000, // 会員価格 ¥1,760（税込・送料込）
    nonMemberPriceInCents: 220000, // 非会員価格 ¥2,200（税込・送料込）
    images: ["/textbook-cover.png"],
    details: {
      publisher: "一般社団法人日本人材派遣協会",
      pages: 200,
      publishDate: "2025年10月01日",
      edition: "第11刷",
      isbn: "978-4-XXXX-XXXX-X",
    },
  },
]

// 会員区分に応じた価格を取得
export function getPriceByMemberType(product: Product, memberType: "member" | "non_member"): number {
  if (memberType === "member" && product.memberPriceInCents) {
    return product.memberPriceInCents
  }
  return product.nonMemberPriceInCents || product.priceInCents
}

// 商品IDから商品を取得
export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId)
}

// 価格を円表示に変換
export function formatPrice(priceInCents: number): string {
  return `¥${(priceInCents / 100).toLocaleString("ja-JP")}`
}
