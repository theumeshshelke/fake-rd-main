"use client"

import { motion } from "framer-motion"

interface ConfidenceHeatmapProps {
  data: Array<{ word: string; confidence: number; position: number }>
}

export function ConfidenceHeatmap({ data }: ConfidenceHeatmapProps) {
  const getHeatmapColor = (confidence: number) => {
    // Convert confidence (0-1) to color intensity
    const intensity = Math.floor(confidence * 255)
    const alpha = 0.3 + confidence * 0.7 // 0.3 to 1.0 alpha
    return `rgba(8, 145, 178, ${alpha})` // Using primary color with varying alpha
  }

  const getTextColor = (confidence: number) => {
    // Use white text for high confidence (dark background), dark text for low confidence
    return confidence > 0.6 ? "#ffffff" : "#1e293b"
  }

  return (
    <div className="p-4 bg-muted/10 rounded-lg">
      <div className="flex flex-wrap gap-1 text-sm leading-relaxed">
        {data.map((item, index) => (
          <motion.span
            key={`${item.word}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            className="px-2 py-1 rounded transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: getHeatmapColor(item.confidence),
              color: getTextColor(item.confidence),
            }}
            title={`Confidence: ${(item.confidence * 100).toFixed(1)}%`}
          >
            {item.word}
          </motion.span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Low Impact</span>
        <div className="flex items-center space-x-1">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((intensity) => (
            <div key={intensity} className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(intensity) }} />
          ))}
        </div>
        <span>High Impact</span>
      </div>
    </div>
  )
}
