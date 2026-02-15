import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const heights = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  const height = heights[size]
  const width = height * 6

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/eei-logo.png"
        alt="一般財団法人 電気工事技術講習センター"
        width={width}
        height={height}
        className="h-auto object-contain"
        priority
      />
    </div>
  )
}

export default Logo
