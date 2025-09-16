"use client"

import { cn } from "@/lib/utils"

interface KeywordHighlighterProps {
  text: string
  keywords: string[]
  className?: string
}

export function KeywordHighlighter({ text, keywords, className }: KeywordHighlighterProps) {
  const highlightText = (text: string, keywords: string[]) => {
    if (!keywords.length) return text

    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) => {
      const isKeyword = keywords.some((keyword) => keyword.toLowerCase() === part.toLowerCase())

      return isKeyword ? (
        <span key={index} className="bg-destructive/20 text-destructive px-1 py-0.5 rounded font-medium">
          {part}
        </span>
      ) : (
        part
      )
    })
  }

  return <div className={cn("whitespace-pre-wrap", className)}>{highlightText(text, keywords)}</div>
}
