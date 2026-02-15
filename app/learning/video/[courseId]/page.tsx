"use client"

import UnifiedCourseLayout from "@/components/unified-course-layout"

export default function VideoLearningPage({ params }: { params: { courseId: string } }) {
  const courseData = {
    title: "データサイエンス基礎 - 統計学入門",
    lesson: "第3章: 確率分布",
    instructor: "田中講師",
    description: "統計学の基本概念から実践的な分析手法まで学習します。",
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <UnifiedCourseLayout
      courseData={courseData}
      courseType="video"
      pdfUrl="/statistics-textbook-page-with-probability-distribu.jpg"
      onBack={handleBack}
    />
  )
}
