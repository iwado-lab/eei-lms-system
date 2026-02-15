"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarDays, Clock, Users, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react"
import { format, parseISO, isToday, isFuture, isBefore } from "date-fns"
import { ja } from "date-fns/locale"

interface ScheduleOption {
  id: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  enrolled: number
  status: "open" | "closed" | "full" | "cancelled"
  coursePattern: string
  courseName: string
}

// 受講者の現在の受講日（デモ用）
const currentSchedule: ScheduleOption = {
  id: "current",
  date: "2026-02-08",
  startTime: "07:00",
  endTime: "19:00",
  capacity: 120,
  enrolled: 95,
  status: "open",
  coursePattern: "通常",
  courseName: "派遣元責任者講習",
}

// 変更可能な日程一覧（デモ用）
const availableSchedules: ScheduleOption[] = [
  {
    id: "alt-1",
    date: "2026-02-10",
    startTime: "07:00",
    endTime: "19:00",
    capacity: 120,
    enrolled: 45,
    status: "open",
    coursePattern: "通常",
    courseName: "派遣元責任者講習",
  },
  {
    id: "alt-2",
    date: "2026-02-12",
    startTime: "07:00",
    endTime: "19:00",
    capacity: 120,
    enrolled: 80,
    status: "open",
    coursePattern: "通常",
    courseName: "派遣元責任者講習",
  },
  {
    id: "alt-3",
    date: "2026-02-14",
    startTime: "09:00",
    endTime: "17:00",
    capacity: 80,
    enrolled: 30,
    status: "open",
    coursePattern: "実践編",
    courseName: "派遣元責任者講習（実践編）",
  },
  {
    id: "alt-4",
    date: "2026-02-18",
    startTime: "07:00",
    endTime: "19:00",
    capacity: 120,
    enrolled: 10,
    status: "open",
    coursePattern: "通常",
    courseName: "派遣元責任者講習",
  },
  {
    id: "alt-5",
    date: "2026-02-20",
    startTime: "07:00",
    endTime: "19:00",
    capacity: 120,
    enrolled: 120,
    status: "full",
    coursePattern: "通常",
    courseName: "派遣元責任者講習",
  },
]

export function ScheduleChange() {
  const [mySchedule, setMySchedule] = useState<ScheduleOption>(currentSchedule)
  const [showChangeDialog, setShowChangeDialog] = useState(false)
  const [selectedNewSchedule, setSelectedNewSchedule] = useState<ScheduleOption | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [changeComplete, setChangeComplete] = useState(false)

  const handleSelectSchedule = (schedule: ScheduleOption) => {
    setSelectedNewSchedule(schedule)
    setShowConfirmDialog(true)
  }

  const handleConfirmChange = () => {
    if (selectedNewSchedule) {
      setMySchedule(selectedNewSchedule)
      setShowConfirmDialog(false)
      setChangeComplete(true)
      setTimeout(() => {
        setChangeComplete(false)
        setShowChangeDialog(false)
      }, 2000)
    }
  }

  const isScheduleAvailable = (schedule: ScheduleOption) => {
    return schedule.status === "open" && schedule.enrolled < schedule.capacity
  }

  return (
    <>
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            受講日程
          </CardTitle>
          <CardDescription className="text-blue-700">
            あなたの受講予定日です。都合が悪い場合は日程を変更できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                <p className="text-xs text-gray-500">受講日</p>
                <p className="text-lg font-bold text-gray-900">
                  {format(parseISO(mySchedule.date), "yyyy年M月d日(E)", { locale: ja })}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Clock className="h-3 w-3" />
                  {mySchedule.startTime} ~ {mySchedule.endTime}
                </div>
              </div>
              <div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {mySchedule.coursePattern}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">{mySchedule.courseName}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowChangeDialog(true)}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              日程を変更
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 日程変更ダイアログ */}
      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              受講日程の変更
            </DialogTitle>
            <DialogDescription>
              変更先の日程を選択してください。空きのある日程のみ選択できます。
            </DialogDescription>
          </DialogHeader>

          {changeComplete ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-lg font-medium text-green-700">日程変更が完了しました</p>
            </div>
          ) : (
            <>
              {/* 現在の受講日 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 mb-1">現在の受講日</p>
                <div className="flex items-center gap-3">
                  <p className="font-medium">
                    {format(parseISO(mySchedule.date), "yyyy年M月d日(E)", { locale: ja })}
                  </p>
                  <span className="text-sm text-gray-500">
                    {mySchedule.startTime} ~ {mySchedule.endTime}
                  </span>
                  <Badge variant="outline">{mySchedule.coursePattern}</Badge>
                </div>
              </div>

              {/* 変更可能な日程一覧 */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">変更可能な日程</p>
                {availableSchedules.map((schedule) => {
                  const available = isScheduleAvailable(schedule)
                  const isSelected = selectedNewSchedule?.id === schedule.id
                  const remaining = schedule.capacity - schedule.enrolled

                  return (
                    <div
                      key={schedule.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        !available
                          ? "opacity-50 cursor-not-allowed bg-gray-50"
                          : isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "hover:border-blue-300 cursor-pointer"
                      }`}
                      onClick={() => available && handleSelectSchedule(schedule)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {format(parseISO(schedule.date), "M月d日(E)", { locale: ja })}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {schedule.startTime} ~ {schedule.endTime}
                            </div>
                          </div>
                          <Badge className={
                            schedule.coursePattern === "通常"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                          }>
                            {schedule.coursePattern}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="h-3 w-3 text-gray-400" />
                              <span className={remaining <= 10 ? "text-blue-600 font-medium" : "text-gray-600"}>
                                {available ? `残り${remaining}名` : schedule.status === "full" ? "満員" : "締切"}
                              </span>
                            </div>
                          </div>
                          {available && (
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 確認ダイアログ */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              受講日変更の確認
            </DialogTitle>
            <DialogDescription>
              以下の内容で受講日を変更します。よろしいですか?
            </DialogDescription>
          </DialogHeader>
          {selectedNewSchedule && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">変更前</p>
                  <p className="font-medium text-sm">
                    {format(parseISO(mySchedule.date), "M月d日(E)", { locale: ja })}
                  </p>
                  <p className="text-xs text-gray-500">{mySchedule.startTime}~{mySchedule.endTime}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">変更後</p>
                  <p className="font-medium text-sm text-blue-900">
                    {format(parseISO(selectedNewSchedule.date), "M月d日(E)", { locale: ja })}
                  </p>
                  <p className="text-xs text-blue-600">{selectedNewSchedule.startTime}~{selectedNewSchedule.endTime}</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  変更後は新しい受講日にのみ受講可能となります。当日の受講途中でも変更が可能です。
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="bg-transparent">
              キャンセル
            </Button>
            <Button onClick={handleConfirmChange}>
              変更を確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
