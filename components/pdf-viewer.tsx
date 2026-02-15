"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react"

interface PDFViewerProps {
  pdfUrl?: string
  title?: string
}

export default function PDFViewer({ pdfUrl, title = "講習資料" }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [jumpToPage, setJumpToPage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const totalPages = 5

  const dummyPDFPages = [
    {
      page: 1,
      title: "第1章: データサイエンス入門",
      content: `
        データサイエンスとは、データから価値のある洞察を抽出し、意思決定を支援する学問分野です。
        
        1.1 データサイエンスの定義
        データサイエンスは、統計学、機械学習、プログラミング、ドメイン知識を組み合わせて、
        大量のデータから有用な情報を抽出する分野です。
        
        1.2 データサイエンスのプロセス
        • データ収集
        • データクリーニング
        • 探索的データ分析
        • モデリング
        • 結果の解釈と可視化
        
        1.3 必要なスキル
        • プログラミング（Python, R）
        • 統計学の基礎知識
        • 機械学習アルゴリズム
        • データベース操作
        • ビジネス理解
      `,
    },
    {
      page: 2,
      title: "第2章: 統計学の基礎",
      content: `
        統計学は、データサイエンスの基盤となる重要な分野です。
        
        2.1 記述統計
        データの特徴を要約し、理解しやすい形で表現する手法です。
        
        • 中心傾向の測度
          - 平均値（Mean）
          - 中央値（Median）
          - 最頻値（Mode）
        
        • 散布度の測度
          - 分散（Variance）
          - 標準偏差（Standard Deviation）
          - 四分位範囲（IQR）
        
        2.2 確率分布
        • 正規分布（Normal Distribution）
        • 二項分布（Binomial Distribution）
        • ポアソン分布（Poisson Distribution）
        
        2.3 仮説検定
        統計的仮説検定は、データに基づいて仮説の妥当性を判断する手法です。
      `,
    },
    {
      page: 3,
      title: "第3章: Python プログラミング基礎",
      content: `
        Pythonは、データサイエンスで最も広く使用されているプログラミング言語です。
        
        3.1 基本構文
        # 変数の定義
        name = "データサイエンス"
        age = 25
        
        # リストの操作
        numbers = [1, 2, 3, 4, 5]
        squared = [x**2 for x in numbers]
        
        3.2 重要なライブラリ
        • NumPy: 数値計算ライブラリ
        • Pandas: データ操作・分析ライブラリ
        • Matplotlib: データ可視化ライブラリ
        • Scikit-learn: 機械学習ライブラリ
        
        3.3 データフレームの操作
        import pandas as pd
        
        # CSVファイルの読み込み
        df = pd.read_csv('data.csv')
        
        # データの確認
        print(df.head())
        print(df.info())
        print(df.describe())
      `,
    },
    {
      page: 4,
      title: "第4章: 機械学習アルゴリズム",
      content: `
        機械学習は、データから自動的にパターンを学習し、予測や分類を行う技術です。
        
        4.1 教師あり学習
        • 回帰（Regression）
          - 線形回帰
          - 多項式回帰
          - ランダムフォレスト回帰
        
        • 分類（Classification）
          - ロジスティック回帰
          - 決定木
          - サポートベクターマシン（SVM）
          - ランダムフォレスト
        
        4.2 教師なし学習
        • クラスタリング
          - K-means
          - 階層クラスタリング
          - DBSCAN
        
        • 次元削減
          - 主成分分析（PCA）
          - t-SNE
        
        4.3 モデル評価
        • 交差検証（Cross Validation）
        • 混同行列（Confusion Matrix）
        • ROC曲線とAUC
      `,
    },
    {
      page: 5,
      title: "第5章: データ可視化とレポート作成",
      content: `
        データ可視化は、分析結果を効果的に伝えるための重要なスキルです。
        
        5.1 可視化の原則
        • 目的に応じたグラフの選択
        • 色の効果的な使用
        • 適切なスケールの設定
        • 明確なラベルとタイトル
        
        5.2 グラフの種類
        • 棒グラフ: カテゴリ別の比較
        • 折れ線グラフ: 時系列データの変化
        • 散布図: 2つの変数の関係
        • ヒストグラム: データの分布
        • ボックスプロット: 分布の要約統計
        
        5.3 Pythonでの可視化
        import matplotlib.pyplot as plt
        import seaborn as sns
        
        # 基本的な散布図
        plt.scatter(x, y)
        plt.xlabel('X軸ラベル')
        plt.ylabel('Y軸ラベル')
        plt.title('散布図のタイトル')
        plt.show()
        
        5.4 レポート作成のベストプラクティス
        • 明確な目的の設定
        • 適切な可視化の選択
        • 結果の解釈と提言
        • 再現可能な分析の実装
      `,
    },
  ]

  const currentPageData = dummyPDFPages[currentPage - 1]

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleJumpToPage = () => {
    const pageNum = Number.parseInt(jumpToPage)
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum)
      setJumpToPage("")
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("[v0] Searching for:", searchQuery)
      // 実際の実装では、PDFコンテンツ内を検索してハイライト表示
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* PDF Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-base text-gray-900">{title}</h3>
          <span className="text-sm text-gray-600">
            ページ {currentPage} / {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="ページ"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
            className="w-20 h-8 text-xs"
            min={1}
            max={totalPages}
          />
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs bg-transparent" onClick={handleJumpToPage}>
            移動
          </Button>

          <div className="flex items-center gap-1 ml-2">
            <Input
              type="text"
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-32 h-8 text-xs"
            />
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs bg-transparent" onClick={handleSearch}>
              <Search className="w-3 h-3" />
            </Button>
          </div>

          <Button variant="outline" size="sm" className="h-8 px-2 text-xs ml-2 bg-transparent">
            <Download className="w-3 h-3 mr-1" />
            ダウンロード
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="max-w-full mx-auto">
          <h2 className="text-xl font-bold mb-6 text-gray-800">{currentPageData.title}</h2>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
              {currentPageData.content}
            </pre>
          </div>
        </div>
      </div>

      {/* PDF Navigation */}
      <div className="flex items-center justify-between p-4 border-t bg-white">
        <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          前へ
        </Button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
          次へ
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
