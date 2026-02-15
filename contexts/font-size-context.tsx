"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type FontSize = "small" | "medium" | "large"

interface FontSizeContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  fontSizePercentage: number
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

const fontSizeMap: Record<FontSize, number> = {
  small: 100,
  medium: 130,
  large: 150,
}

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("small")

  useEffect(() => {
    // Load font size from localStorage
    const savedFontSize = localStorage.getItem("fontSize") as FontSize | null
    if (savedFontSize && fontSizeMap[savedFontSize]) {
      setFontSizeState(savedFontSize)
    }
  }, [])

  useEffect(() => {
    // Apply font size to document root and body
    const percentage = fontSizeMap[fontSize]
    document.documentElement.style.fontSize = `${percentage}%`
    // Also set a CSS variable for components that need it
    document.documentElement.setAttribute("data-font-size", fontSize)
  }, [fontSize])

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size)
    localStorage.setItem("fontSize", size)
  }

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        setFontSize,
        fontSizePercentage: fontSizeMap[fontSize],
      }}
    >
      {children}
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const context = useContext(FontSizeContext)
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider")
  }
  return context
}
