"use client"

import { useFontSize } from "@/contexts/font-size-context"

const sizes = [
  { key: "small" as const, label: "小" },
  { key: "medium" as const, label: "中" },
  { key: "large" as const, label: "大" },
]

export function FontSizeSelector() {
  const { fontSize, setFontSize } = useFontSize()

  return (
    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
      <span className="text-xs text-gray-500 px-2 shrink-0" style={{ fontSize: "12px" }}>文字</span>
      {sizes.map((s) => (
        <button
          key={s.key}
          onClick={() => setFontSize(s.key)}
          style={{ fontSize: "12px", padding: "4px 10px" }}
          className={`border-l border-gray-200 transition-colors ${
            fontSize === s.key
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
