"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function ModelArchitecture() {
  const stages = [
    {
      name: "BERT Embeddings",
      description: "Text tokenization & contextual embeddings",
      color: "bg-primary/20 text-primary border-primary/30",
    },
    {
      name: "LSTM Layer",
      description: "Sequential pattern analysis",
      color: "bg-secondary/20 text-secondary border-secondary/30",
    },
    {
      name: "Dense Fusion",
      description: "Feature combination & processing",
      color: "bg-chart-1/20 text-chart-1 border-chart-1/30",
    },
    {
      name: "Classification",
      description: "Fake vs Genuine prediction",
      color: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    },
  ]

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3"
        >
          <div className={`p-3 rounded-lg border ${stage.color} min-w-0 flex-1`}>
            <div className="text-sm font-semibold">{stage.name}</div>
            <div className="text-xs opacity-80 mt-1">{stage.description}</div>
          </div>
          {index < stages.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
        </motion.div>
      ))}
    </div>
  )
}
