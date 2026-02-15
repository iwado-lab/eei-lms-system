"use client"

import { useState, useCallback, useEffect } from "react"

interface CourseProgress {
  courseId: string
  partId: string
  completed: boolean
  startedAt?: string
  completedAt?: string
  studyingStartedAt?: string
}

interface UseCourseProgressReturn {
  markPartComplete: (courseId: string, partId: string) => void
  isPartCompleted: (courseId: string, partId: string) => boolean
  startStudyingPart: (courseId: string, partId: string) => void
  stopStudyingPart: (courseId: string, partId: string) => void
  getProgress: (courseId: string) => CourseProgress[]
}

const STORAGE_KEY = "course_progress"

export function useCourseProgress(): UseCourseProgressReturn {
  const [progress, setProgress] = useState<CourseProgress[]>([])

  // ローカルストレージから進捗を読み込む
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setProgress(JSON.parse(saved))
      } catch (e) {
        console.error("[v0] 進捗データの読み込みに失敗:", e)
      }
    }
  }, [])

  // 進捗を保存
  const saveProgress = useCallback((newProgress: CourseProgress[]) => {
    setProgress(newProgress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
  }, [])

  // パートを完了としてマーク
  const markPartComplete = useCallback(
    (courseId: string, partId: string) => {
      const existing = progress.find((p) => p.courseId === courseId && p.partId === partId)

      if (existing) {
        const updated = progress.map((p) =>
          p.courseId === courseId && p.partId === partId
            ? { ...p, completed: true, completedAt: new Date().toISOString() }
            : p,
        )
        saveProgress(updated)
      } else {
        const newProgress: CourseProgress = {
          courseId,
          partId,
          completed: true,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        }
        saveProgress([...progress, newProgress])
      }

      console.log(`[v0] パート完了: courseId=${courseId}, partId=${partId}`)
    },
    [progress, saveProgress],
  )

  // パートが完了しているかチェック
  const isPartCompleted = useCallback(
    (courseId: string, partId: string): boolean => {
      const found = progress.find((p) => p.courseId === courseId && p.partId === partId)
      return found?.completed ?? false
    },
    [progress],
  )

  // 学習を開始
  const startStudyingPart = useCallback(
    (courseId: string, partId: string) => {
      const existing = progress.find((p) => p.courseId === courseId && p.partId === partId)

      if (existing) {
        const updated = progress.map((p) =>
          p.courseId === courseId && p.partId === partId ? { ...p, studyingStartedAt: new Date().toISOString() } : p,
        )
        saveProgress(updated)
      } else {
        const newProgress: CourseProgress = {
          courseId,
          partId,
          completed: false,
          startedAt: new Date().toISOString(),
          studyingStartedAt: new Date().toISOString(),
        }
        saveProgress([...progress, newProgress])
      }

      console.log(`[v0] 学習開始: courseId=${courseId}, partId=${partId}`)
    },
    [progress, saveProgress],
  )

  // 学習を停止
  const stopStudyingPart = useCallback(
    (courseId: string, partId: string) => {
      const updated = progress.map((p) =>
        p.courseId === courseId && p.partId === partId ? { ...p, studyingStartedAt: undefined } : p,
      )
      saveProgress(updated)
      console.log(`[v0] 学習停止: courseId=${courseId}, partId=${partId}`)
    },
    [progress, saveProgress],
  )

  // 特定コースの進捗を取得
  const getProgress = useCallback(
    (courseId: string): CourseProgress[] => {
      return progress.filter((p) => p.courseId === courseId)
    },
    [progress],
  )

  return {
    markPartComplete,
    isPartCompleted,
    startStudyingPart,
    stopStudyingPart,
    getProgress,
  }
}
