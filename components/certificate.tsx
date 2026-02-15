"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

interface CertificateProps {
  studentName?: string
  birthDate?: string
  courseDate?: string
  issueDate?: string
}

export function Certificate({
  studentName = "田中 太郎",
  birthDate = "1985年4月1日",
  courseDate = "2025年1月15日",
  issueDate = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!certificateRef.current) return

    try {
      // Create a temporary canvas to render the certificate
      const certificate = certificateRef.current
      const rect = certificate.getBoundingClientRect()

      // Create canvas with higher resolution
      const canvas = document.createElement("canvas")
      const scale = 3 // Higher scale for better quality
      canvas.width = rect.width * scale
      canvas.height = rect.height * scale
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Canvas context not available")
      }

      // Set white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Scale context for high resolution
      ctx.scale(scale, scale)

      // Draw certificate background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Draw gold border
      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 16
      ctx.strokeRect(8, 8, rect.width - 16, rect.height - 16)

      // Draw corner decorations
      const cornerSize = 64
      ctx.strokeStyle = "#f59e0b"
      ctx.lineWidth = 8

      // Top-left corner
      ctx.beginPath()
      ctx.moveTo(16, cornerSize)
      ctx.lineTo(16, 16)
      ctx.lineTo(cornerSize, 16)
      ctx.stroke()

      // Top-right corner
      ctx.beginPath()
      ctx.moveTo(rect.width - cornerSize, 16)
      ctx.lineTo(rect.width - 16, 16)
      ctx.lineTo(rect.width - 16, cornerSize)
      ctx.stroke()

      // Bottom-left corner
      ctx.beginPath()
      ctx.moveTo(16, rect.height - cornerSize)
      ctx.lineTo(16, rect.height - 16)
      ctx.lineTo(cornerSize, rect.height - 16)
      ctx.stroke()

      // Bottom-right corner
      ctx.beginPath()
      ctx.moveTo(rect.width - cornerSize, rect.height - 16)
      ctx.lineTo(rect.width - 16, rect.height - 16)
      ctx.lineTo(rect.width - 16, rect.height - cornerSize)
      ctx.stroke()

      // Draw blue gradient background (decorative)
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height / 3)
      gradient.addColorStop(0, "rgba(96, 165, 250, 0.1)")
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.1)")
      gradient.addColorStop(1, "rgba(37, 99, 235, 0.1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height / 3)

      // Draw badge
      const badgeY = 100
      const badgeGradient = ctx.createLinearGradient(rect.width / 2 - 100, badgeY, rect.width / 2 + 100, badgeY)
      badgeGradient.addColorStop(0, "#fb923c")
      badgeGradient.addColorStop(1, "#f97316")
      ctx.fillStyle = badgeGradient
      ctx.beginPath()
      ctx.roundRect(rect.width / 2 - 120, badgeY - 15, 240, 30, 15)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("これだけは知っておきたい", rect.width / 2, badgeY + 5)

      // Draw title
      ctx.fillStyle = "#1e3a8a"
      ctx.font = "bold 28px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("派遣元責任者に必要な", rect.width / 2, 180)

      ctx.font = "bold 42px sans-serif"
      ctx.fillText("受講証明書", rect.width / 2, 230)

      // Draw decorative line
      const lineGradient = ctx.createLinearGradient(rect.width / 2 - 150, 250, rect.width / 2 + 150, 250)
      lineGradient.addColorStop(0, "rgba(37, 99, 235, 0)")
      lineGradient.addColorStop(0.5, "#2563eb")
      lineGradient.addColorStop(1, "rgba(37, 99, 235, 0)")
      ctx.strokeStyle = lineGradient
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(rect.width / 2 - 150, 250)
      ctx.lineTo(rect.width / 2 + 150, 250)
      ctx.stroke()

      // Draw student name
      ctx.fillStyle = "#374151"
      ctx.font = "20px sans-serif"
      ctx.fillText("氏名", rect.width / 2 - 180, 320)

      ctx.fillStyle = "#111827"
      ctx.font = "bold 32px sans-serif"
      ctx.fillText(studentName, rect.width / 2, 320)

      ctx.fillStyle = "#374151"
      ctx.font = "20px sans-serif"
      ctx.fillText("殿", rect.width / 2 + 180, 320)

      // Draw underline for name
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(rect.width / 2 - 120, 325)
      ctx.lineTo(rect.width / 2 + 120, 325)
      ctx.stroke()

      // Draw birth date and course date
      ctx.fillStyle = "#374151"
      ctx.font = "18px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`生年月日    ${birthDate}`, rect.width / 2, 370)
      ctx.fillText(`受講日    ${courseDate}`, rect.width / 2, 400)

      // Draw separator line
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(rect.width / 2 - 250, 430)
      ctx.lineTo(rect.width / 2 + 250, 430)
      ctx.stroke()

      // Draw certification text
      ctx.fillStyle = "#4b5563"
      ctx.font = "16px sans-serif"
      ctx.fillText("上記の者は、派遣元責任者講習の全課程を修了したことを証明します。", rect.width / 2, 470)

      // Draw issue date
      ctx.fillStyle = "#374151"
      ctx.font = "18px sans-serif"
      ctx.fillText(`発行日    ${issueDate}`, rect.width / 2, 520)

      // Draw organization logo (circle)
      const logoX = rect.width / 2 - 80
      const logoY = 560
      const logoGradient2 = ctx.createLinearGradient(logoX - 30, logoY - 30, logoX + 30, logoY + 30)
      logoGradient2.addColorStop(0, "#fb923c")
      logoGradient2.addColorStop(1, "#f97316")
      ctx.fillStyle = logoGradient2
      ctx.beginPath()
      ctx.arc(logoX, logoY, 30, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("JASSA", logoX, logoY + 5)

      // Draw organization name
      ctx.fillStyle = "#111827"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("一般財団法人 電気工事技術講習センター", logoX + 40, logoY - 5)

      ctx.fillStyle = "#4b5563"
      ctx.font = "11px sans-serif"
      ctx.fillText("Electrical Engineering Institute", logoX + 40, logoY + 15)

      // Convert canvas to image and create PDF
      const imgData = canvas.toDataURL("image/png")

      const jsPDF = (await import("jspdf")).default
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`派遣元責任者講習_受講証明書_${studentName}.pdf`)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("PDFの生成に失敗しました。もう一度お試しください。")
    }
  }

  const handlePrint = () => {
    if (!certificateRef.current) return
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>受講証明書</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            @media print {
              @page { size: landscape; margin: 0; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${certificateRef.current.outerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        style={{
          backgroundColor: "#ffffff",
          padding: "48px",
          borderRadius: "8px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "16px solid #fbbf24",
          position: "relative",
          overflow: "hidden",
          aspectRatio: "1.414/1",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Decorative corner elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "128px",
            height: "128px",
            borderTop: "8px solid #f59e0b",
            borderLeft: "8px solid #f59e0b",
            borderTopLeftRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "128px",
            height: "128px",
            borderTop: "8px solid #f59e0b",
            borderRight: "8px solid #f59e0b",
            borderTopRightRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "128px",
            height: "128px",
            borderBottom: "8px solid #f59e0b",
            borderLeft: "8px solid #f59e0b",
            borderBottomLeftRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "128px",
            height: "128px",
            borderBottom: "8px solid #f59e0b",
            borderRight: "8px solid #f59e0b",
            borderBottomRightRadius: "8px",
          }}
        />

        {/* Blue gradient banner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "192px",
            background:
              "linear-gradient(to bottom right, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: 0,
            width: "384px",
            height: "384px",
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "32px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              background: "linear-gradient(to right, #fb923c, #f97316)",
              color: "#ffffff",
              padding: "8px 24px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: "bold",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            これだけは知っておきたい
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#1e3a8a", letterSpacing: "0.05em", margin: 0 }}>
              派遣元責任者に必要な
            </h1>
            <h2 style={{ fontSize: "42px", fontWeight: "bold", color: "#1e3a8a", letterSpacing: "0.1em", margin: 0 }}>
              受講証明書
            </h2>
            <div
              style={{
                marginTop: "16px",
                height: "2px",
                width: "256px",
                background: "linear-gradient(to right, transparent, #2563eb, transparent)",
                margin: "16px auto 0",
              }}
            />
          </div>

          {/* Student Info */}
          <div
            style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "24px", marginTop: "32px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                <span style={{ fontSize: "20px", color: "#374151" }}>氏名</span>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#111827",
                    borderBottom: "2px solid #d1d5db",
                    padding: "0 32px 4px",
                  }}
                >
                  {studentName}
                </span>
                <span style={{ fontSize: "20px", color: "#374151" }}>殿</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "#374151" }}>
              <p style={{ fontSize: "18px", margin: 0 }}>
                生年月日 <span style={{ fontWeight: 600, marginLeft: "16px" }}>{birthDate}</span>
              </p>
              <p style={{ fontSize: "18px", margin: 0 }}>
                受講日 <span style={{ fontWeight: 600, marginLeft: "16px" }}>{courseDate}</span>
              </p>
            </div>

            <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "16px", color: "#4b5563", lineHeight: 1.75, maxWidth: "600px", margin: "0 auto" }}>
                上記の者は、派遣元責任者講習の全課程を修了したことを証明します。
              </p>
            </div>
          </div>

          {/* Issue Info */}
          <div
            style={{ marginTop: "auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <p style={{ fontSize: "18px", color: "#374151", margin: 0 }}>
              発行日 <span style={{ fontWeight: 600, marginLeft: "16px" }}>{issueDate}</span>
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(to bottom right, #fb923c, #f97316)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                JASSA
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {"一般財団法人 電気工事技術講習センター"}
                </p>
                <p style={{ fontSize: "11px", color: "#4b5563", margin: 0 }}>Electrical Engineering Institute</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload} style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
          <Download className="w-4 h-4 mr-2" />
          PDFダウンロード
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          style={{ borderColor: "#2563eb", color: "#2563eb", backgroundColor: "transparent" }}
        >
          <Printer className="w-4 h-4 mr-2" />
          印刷
        </Button>
      </div>
    </div>
  )
}
