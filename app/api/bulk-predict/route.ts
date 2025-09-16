import { type NextRequest, NextResponse } from "next/server"

interface BulkPredictionResponse {
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "CSV file is required" }, { status: 400 })
    }

    if (file.type !== "text/csv") {
      return NextResponse.json({ error: "File must be a CSV" }, { status: 400 })
    }

    const csvText = await file.text()
    const lines = csvText.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV must contain at least a header and one data row" }, { status: 400 })
    }

    // In production, this would call your Flask/FastAPI backend
    // const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    // const response = await fetch(`${backendUrl}/bulk-predict`, {
    //   method: 'POST',
    //   body: formData,
    // })

    // if (!response.ok) {
    //   throw new Error(`Backend API error: ${response.status}`)
    // }

    // const result = await response.json()

    // Mock processing for demonstration
    const startTime = Date.now()
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

    // Parse CSV (assuming first column after header contains review text)
    const dataLines = lines.slice(1) // Skip header
    const results = dataLines.slice(0, 100).map((line, index) => {
      const columns = line.split(",")
      const reviewText = columns[0] || `Sample review ${index + 1}`

      return {
        id: index + 1,
        text: reviewText.substring(0, 100) + (reviewText.length > 100 ? "..." : ""),
        label: Math.random() > 0.5 ? ("Fake" as const) : ("Genuine" as const),
        confidence: Math.floor(Math.random() * 30) + 70,
      }
    })

    const fakeCount = results.filter((r) => r.label === "Fake").length
    const genuineCount = results.length - fakeCount
    const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length

    const mockResponse: BulkPredictionResponse = {
      totalReviews: results.length,
      fakeCount,
      genuineCount,
      averageConfidence: Number.parseFloat(averageConfidence.toFixed(1)),
      results,
      processingTime: Date.now() - startTime,
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Bulk prediction API error:", error)
    return NextResponse.json(
      { error: "Failed to process CSV file. Please check the format and try again." },
      { status: 500 },
    )
  }
}
