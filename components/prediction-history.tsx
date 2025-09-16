"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function PredictionHistory() {
  const { predictionHistory, user } = useAuth()

  if (!user) {
    return (
      <Card className="glass p-6">
        <div className="text-center space-y-4">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Sign in to view history</h3>
            <p className="text-sm text-muted-foreground">Track your last 10 predictions and analysis results</p>
          </div>
        </div>
      </Card>
    )
  }

  if (predictionHistory.length === 0) {
    return (
      <Card className="glass p-6">
        <div className="text-center space-y-4">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">No predictions yet</h3>
            <p className="text-sm text-muted-foreground">Your recent analysis history will appear here</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="glass p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
        <Clock className="h-5 w-5 text-primary" />
        <span>Recent Predictions</span>
      </h3>
      <div className="space-y-3">
        {predictionHistory.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-muted/10 rounded-lg"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <Badge variant={prediction.classification === "Genuine" ? "default" : "destructive"} className="shrink-0">
                {prediction.classification === "Genuine" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {prediction.classification}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-card-foreground truncate">{prediction.reviewText}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(prediction.timestamp).toLocaleDateString()} at{" "}
                  {new Date(prediction.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-medium text-card-foreground">{prediction.confidence}%</div>
              <div className="text-xs text-muted-foreground">confidence</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
