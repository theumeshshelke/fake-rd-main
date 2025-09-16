import { type NextRequest, NextResponse } from "next/server"

interface PredictionRequest {
  reviewText: string
}

interface PredictionResponse {
  label: "Fake" | "Genuine"
  confidence: number
  suspiciousKeywords: string[]
  behavioralFeatures: {
    ratingDeviation: number
    reviewLength: number
    sentimentScore: number
    repetitivePatterns: boolean
  }
  explanation: string
  confidenceHeatmap: Array<{ word: string; confidence: number; position: number }>
}

export async function POST(request: NextRequest) {
  try {
    const { reviewText }: PredictionRequest = await request.json()

    if (!reviewText || reviewText.trim().length === 0) {
      return NextResponse.json({ error: "Review text is required" }, { status: 400 })
    }

    // In production, this would call your Flask/FastAPI backend
    // const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    // const response = await fetch(`${backendUrl}/predict`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ text: reviewText }),
    // })

    // if (!response.ok) {
    //   throw new Error(`Backend API error: ${response.status}`)
    // }

    // const result = await response.json()

    // Mock response for demonstration - replace with actual backend call
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

    const words = reviewText.split(/\s+/)
    const mockResponse: PredictionResponse = {
      label: Math.random() > 0.5 ? "Fake" : "Genuine",
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      suspiciousKeywords: ["amazing", "perfect", "best ever", "highly recommend"].filter(() => Math.random() > 0.5),
      behavioralFeatures: {
        ratingDeviation: Number.parseFloat((Math.random() * 3 + 1).toFixed(1)),
        reviewLength: reviewText.length,
        sentimentScore: Number.parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
        repetitivePatterns: Math.random() > 0.6,
      },
      explanation: `The model analyzed ${words.length} words and detected ${
        Math.random() > 0.5 ? "suspicious" : "normal"
      } patterns in sentiment distribution and keyword usage.`,
      confidenceHeatmap: words.map((word, index) => ({
        word,
        confidence: Math.random() * 0.8 + 0.2,
        position: index,
      })),
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Prediction API error:", error)
    return NextResponse.json({ error: "Failed to analyze review. Please try again." }, { status: 500 })
  }
}
