"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, SunMedium, MoonStar, Bot, User, Trash2, CornerDownLeft, X, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const CONFIG = {
  title: "派遣元責任者講習の回答AI",
  subtitle: "AI Answer Assistant for Dispatch Source Training",
  brandGradient: "from-emerald-500 via-teal-500 to-cyan-500",
  glassBg: "bg-white/70 dark:bg-zinc-900/60",
  border: "border border-white/40 dark:border-white/10",
  radius: "rounded-2xl",
  shadow: "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)]",
  welcome:
    "こんにちは！私は『派遣元責任者講習』に関する質問に答えるAIです。受講方法や対象者、法的根拠などをお尋ねください。",
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function timestamp() {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

function mockReply(input: string) {
  const text = input.trim().toLowerCase()

  if (/対象|だれ|受講者|資格/.test(text)) {
    return "派遣元責任者講習の受講対象者は、労働者派遣事業を行う派遣元事業主またはその代理担当者です。"
  }
  if (/期間|有効|いつまで/.test(text)) {
    return "修了証の有効期間は特に定められていませんが、法令改正や制度変更に応じて再受講が推奨されます。"
  }
  if (/内容|科目|講義/.test(text)) {
    return "講習では、労働者派遣法の概要、派遣元管理の責務、安全衛生、トラブル対応などが扱われます。"
  }
  if (/法|根拠|条文/.test(text)) {
    return "根拠法令は『労働者派遣法（昭和60年法律第88号）』で、第36条および関係省令に規定されています。"
  }
  if (/申し込み|受講方法|予約|申請/.test(text)) {
    return "受講はオンラインまたは会場講習のいずれかを選択可能です。Web申込ページから日時と会場を選択してください。"
  }
  if (/ありがとう|thanks|感謝/.test(text)) {
    return "どういたしまして。ほかにも講習の費用や実施団体についてお聞きになりますか？"
  }

  return `「${input}」についてですね。派遣元責任者講習に関連する内容でしたら、対象・法令・受講方法などの観点からお答えできます。`
}

const roles = {
  user: {
    name: "You",
    icon: <User className="h-4 w-4" />,
    bubble:
      "bg-gradient-to-br from-slate-800 to-slate-900 text-white dark:from-slate-100 dark:to-slate-200 dark:text-slate-900",
    align: "items-end",
  },
  bot: {
    name: "Bot",
    icon: <Bot className="h-4 w-4" />,
    bubble:
      "bg-gradient-to-br from-white/90 to-white/60 text-slate-800 dark:from-zinc-800/80 dark:to-zinc-900/60 dark:text-zinc-100",
    align: "items-start",
  },
}

interface Message {
  id: number
  role: "user" | "bot"
  text: string
  time: string
}

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ id: 1, role: "bot", text: CONFIG.welcome, time: timestamp() }])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const rootClasses = useMemo(
    () => cn(CONFIG.radius, CONFIG.shadow, CONFIG.border, CONFIG.glassBg, "backdrop-blur-xl w-full max-w-2xl"),
    [],
  )

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault()
    const content = input.trim()
    if (!content) return

    const userMsg: Message = { id: Date.now(), role: "user", text: content, time: timestamp() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    await new Promise((r) => setTimeout(r, 500))
    const reply = mockReply(content)

    const parts = reply.split(/。/).filter(Boolean)
    const first = parts.shift()

    const botMsgBase: Message = { id: Date.now() + 1, role: "bot", text: first + "。", time: timestamp() }
    setMessages((prev) => [...prev, botMsgBase])

    for (const p of parts) {
      await new Promise((r) => setTimeout(r, 350))
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), role: "bot", text: p + "。", time: timestamp() },
      ])
    }
    setLoading(false)
  }

  function clearChat() {
    setMessages([{ id: 1, role: "bot", text: CONFIG.welcome, time: timestamp() }])
  }

  return (
    <TooltipProvider>
      <div className={cn("fixed bottom-6 right-6 z-[9997]", dark ? "dark" : "")}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="mb-4"
            >
              <motion.div className={rootClasses}>
                <div className={cn("relative overflow-hidden", "rounded-t-2xl")}>
                  <div className={cn("p-5", "bg-gradient-to-r", CONFIG.brandGradient)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/15 grid place-items-center">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-white text-lg font-bold tracking-wide">{CONFIG.title}</h2>
                          <p className="text-white/80 text-xs">{CONFIG.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              aria-label="Theme"
                              size="icon"
                              variant="secondary"
                              className="bg-white/15 text-white hover:bg-white/25 border-white/30"
                              onClick={() => setDark((v) => !v)}
                            >
                              {dark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>テーマ切替</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              aria-label="Clear"
                              size="icon"
                              variant="secondary"
                              className="bg-white/15 text-white hover:bg-white/25 border-white/30"
                              onClick={clearChat}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>履歴クリア</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              aria-label="Close"
                              size="icon"
                              variant="secondary"
                              className="bg-white/15 text-white hover:bg-white/25 border-white/30"
                              onClick={() => setIsOpen(false)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>閉じる</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className={cn("border-0", CONFIG.glassBg, "rounded-none rounded-b-2xl")}>
                  <CardContent className="p-0">
                    <div className="px-4 pt-4 pb-2 flex flex-wrap gap-2">
                      {["受講対象", "法的根拠", "講習内容", "受講方法"].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setInput(q)
                            setTimeout(() => handleSend(), 0)
                          }}
                          className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    <div className="px-2 pb-2">
                      <ScrollArea className="h-[38vh] md:h-[46vh] rounded-xl" viewportRef={scrollRef}>
                        <div className="p-3 space-y-3">
                          <AnimatePresence initial={false}>
                            {messages.map((m) => {
                              const role = roles[m.role]
                              return (
                                <motion.div
                                  key={m.id}
                                  layout
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                >
                                  <div className={cn("flex gap-2", role.align)}>
                                    <div className="shrink-0 grid place-items-center h-8 w-8 rounded-xl bg-black/5 dark:bg-white/10">
                                      {role.icon}
                                    </div>
                                    <div className="flex-1 max-w-[84%]">
                                      <div
                                        className={cn(
                                          "px-3 py-2 text-sm leading-relaxed",
                                          CONFIG.border,
                                          role.bubble,
                                          CONFIG.radius,
                                        )}
                                      >
                                        {m.text}
                                      </div>
                                      <div className="text-[10px] text-black/50 dark:text-white/40 mt-1">{m.time}</div>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </AnimatePresence>

                          <AnimatePresence>
                            {loading && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-xs text-black/60 dark:text-white/60"
                              >
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:120ms]" />
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:240ms]" />
                                <span className="ml-2">応答を作成中…</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    </div>

                    <form onSubmit={handleSend} className="p-3 pt-1">
                      <div className="flex items-end gap-2">
                        <div className="relative flex-1">
                          <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="質問を入力…"
                            className={cn(
                              CONFIG.radius,
                              "pr-12 h-12 bg-white/70 dark:bg-zinc-900/70 backdrop-blur placeholder:text-black/40 dark:placeholder:text-white/40",
                            )}
                          />
                          <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5 text-xs text-black/40 dark:text-white/40">
                            <CornerDownLeft className="h-4 w-4" /> Enter で送信
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className={cn(CONFIG.radius, "h-12 px-5 bg-gradient-to-r", CONFIG.brandGradient)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          送信
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "h-14 w-14 rounded-full shadow-2xl",
              "bg-gradient-to-r",
              CONFIG.brandGradient,
              "hover:shadow-emerald-500/50",
            )}
            size="icon"
          >
            {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
          </Button>
        </motion.div>


      </div>
    </TooltipProvider>
  )
}
