interface PredictionResult {
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

interface BulkPredictionResult {
  totalReviews: number
  fakeCount: number
  genuineCount: number
  averageConfidence: number
  results: Array<{
    id: number
    text: string
    label: "Fake" | "Genuine"
    confidence: number
  }>
  processingTime: number
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export async function predictReview(reviewText: string): Promise<PredictionResult> {
  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewText }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new APIError(errorData.error || `HTTP ${response.status}`, response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError("Network error. Please check your connection and try again.", 0)
  }
}

export async function bulkPredictReviews(file: File): Promise<BulkPredictionResult> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/bulk-predict", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new APIError(errorData.error || `HTTP ${response.status}`, response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError("Network error. Please check your connection and try again.", 0)
  }
}
