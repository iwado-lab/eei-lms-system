"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CourseProgressContextType {
  completedParts: Set<string>
  markPartAsCompleted: (partId: string) => void
  isPartCompleted: (partId: string) => boolean
  canShowChatbot: boolean
  currentlyStudyingPart: string | null
  startStudyingPart: (partId: string) => void
  stopStudyingPart: () => void
  markAllAsCompleted: () => void
  resetAllProgress: () => void
  togglePartCompletion: (partId: string) => void
  getCompletionPercentage: () => number
  updateStudyTime: (partId: string, minutes: number) => void
  getStudyTimeMinutes: (partId: string) => number
  getTotalStudyTimeMinutes: () => number
}

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined)

export function CourseProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedParts, setCompletedParts] = useState<Set<string>>(new Set())
  const [canShowChatbot, setCanShowChatbot] = useState(false)
  const [currentlyStudyingPart, setCurrentlyStudyingPart] = useState<string | null>(null)
  const [studyTimes, setStudyTimes] = useState<Record<string, number>>({})

  const allPartIds = ["1", "2", "3", "4", "5", "6", "7"]

  // ローカルストレージから完了状態と視聴時間を読み込む
  useEffect(() => {
    const saved = localStorage.getItem("completedParts")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCompletedParts(new Set(parsed))
        setCanShowChatbot(parsed.length > 0)
      } catch (error) {
        console.error("Failed to parse completed parts:", error)
      }
    }
    const savedTimes = localStorage.getItem("studyTimes")
    if (savedTimes) {
      try {
        setStudyTimes(JSON.parse(savedTimes))
      } catch (error) {
        console.error("Failed to parse study times:", error)
      }
    }
  }, [])

  useEffect(() => {
    // 完了したパートがあり、かつ現在受講中でない場合のみチャットボットを表示
    setCanShowChatbot(completedParts.size > 0 && currentlyStudyingPart === null)
  }, [completedParts, currentlyStudyingPart])

  const markPartAsCompleted = (partId: string) => {
    setCompletedParts((prev) => {
      const newSet = new Set(prev)
      newSet.add(partId)
      // ローカルストレージに保存
      localStorage.setItem("completedParts", JSON.stringify(Array.from(newSet)))
      return newSet
    })
    setCurrentlyStudyingPart(null)
  }

  const isPartCompleted = (partId: string) => {
    return completedParts.has(partId)
  }

  const startStudyingPart = (partId: string) => {
    setCurrentlyStudyingPart(partId)
  }

  const stopStudyingPart = () => {
    setCurrentlyStudyingPart(null)
  }

  const markAllAsCompleted = () => {
    const newSet = new Set(allPartIds)
    setCompletedParts(newSet)
    localStorage.setItem("completedParts", JSON.stringify(Array.from(newSet)))
    setCurrentlyStudyingPart(null)
  }

  const resetAllProgress = () => {
    setCompletedParts(new Set())
    localStorage.setItem("completedParts", JSON.stringify([]))
    setStudyTimes({})
    localStorage.setItem("studyTimes", JSON.stringify({}))
    setCurrentlyStudyingPart(null)
  }

  const togglePartCompletion = (partId: string) => {
    setCompletedParts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(partId)) {
        newSet.delete(partId)
      } else {
        newSet.add(partId)
      }
      localStorage.setItem("completedParts", JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  const updateStudyTime = (partId: string, minutes: number) => {
    setStudyTimes((prev) => {
      const updated = { ...prev, [partId]: minutes }
      localStorage.setItem("studyTimes", JSON.stringify(updated))
      return updated
    })
  }

  const getStudyTimeMinutes = (partId: string): number => {
    return studyTimes[partId] || 0
  }

  const getTotalStudyTimeMinutes = (): number => {
    return Object.values(studyTimes).reduce((sum, mins) => sum + mins, 0)
  }

  const getCompletionPercentage = () => {
    return Math.round((completedParts.size / allPartIds.length) * 100)
  }

  return (
    <CourseProgressContext.Provider
      value={{
        completedParts,
        markPartAsCompleted,
        isPartCompleted,
        canShowChatbot,
        currentlyStudyingPart,
        startStudyingPart,
        stopStudyingPart,
        markAllAsCompleted,
        resetAllProgress,
        togglePartCompletion,
        getCompletionPercentage,
        updateStudyTime,
        getStudyTimeMinutes,
        getTotalStudyTimeMinutes,
      }}
    >
      {children}
    </CourseProgressContext.Provider>
  )
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext)
  if (context === undefined) {
    throw new Error("useCourseProgress must be used within a CourseProgressProvider")
  }
  return context
}
