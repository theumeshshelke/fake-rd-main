"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ChevronDown,
  Brain,
  Layers,
  Zap,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { CircularProgress } from "@/components/circular-progress"
import { KeywordHighlighter } from "@/components/keyword-highlighter"
import { ModelArchitecture } from "@/components/model-architecture"
import { ConfidenceHeatmap } from "@/components/confidence-heatmap"
import { predictReview, bulkPredictReviews, APIError } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface DetectionResult {
  classification: "Fake" | "Genuine"
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

interface BulkResult {
  totalReviews: number
  fakeCount: number
  genuineCount: number
  averageConfidence: number
  processingTime: number
}

export default function DetectPage() {
  const [reviewText, setReviewText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("single")
  const [isExplainabilityOpen, setIsExplainabilityOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addPredictionToHistory } = useAuth()

  const handleAnalyze = async () => {
    if (!reviewText.trim()) return

    setIsAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      const apiResult = await predictReview(reviewText)

      const detectionResult: DetectionResult = {
        classification: apiResult.label,
        confidence: apiResult.confidence,
        suspiciousKeywords: apiResult.suspiciousKeywords,
        behavioralFeatures: apiResult.behavioralFeatures,
        explanation: apiResult.explanation,
        confidenceHeatmap: apiResult.confidenceHeatmap,
      }

      setResult(detectionResult)

      addPredictionToHistory({
        reviewText: reviewText.substring(0, 100) + (reviewText.length > 100 ? "..." : ""),
        classification: detectionResult.classification,
        confidence: detectionResult.confidence,
      })
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setUploadedFile(file)
      setError(null)
    } else if (file) {
      setError("Please select a valid CSV file.")
    }
  }

  const handleBulkAnalyze = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setBulkResult(null)
    setError(null)

    try {
      const apiResult = await bulkPredictReviews(uploadedFile)

      setBulkResult({
        totalReviews: apiResult.totalReviews,
        fakeCount: apiResult.fakeCount,
        genuineCount: apiResult.genuineCount,
        averageConfidence: apiResult.averageConfidence,
        processingTime: apiResult.processingTime,
      })
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message)
      } else {
        setError("Failed to process CSV file. Please try again.")
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.1),transparent_50%)]" />

      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" asChild className="flex items-center space-x-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-mono font-bold">Review Detection</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-balance">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Detect Fake Reviews
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Analyze individual reviews or upload CSV files for bulk detection using our advanced AI model
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass p-6 md:p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-muted/20">
                  <TabsTrigger value="single" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Single Review</span>
                  </TabsTrigger>
                  <TabsTrigger value="bulk" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Bulk Upload</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-card-foreground">Enter Review Text</label>
                    <Textarea
                      placeholder="Paste the review you want to analyze here..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="min-h-32 bg-input/50 backdrop-blur-sm border-border/50"
                      disabled={isAnalyzing}
                    />
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!reviewText.trim() || isAnalyzing}
                    size="lg"
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Detect Review"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="bulk" className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-card-foreground">Upload CSV File</label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center space-y-4 bg-muted/10">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Drop your CSV file here or click to browse</p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="csv-upload"
                          disabled={isAnalyzing}
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="csv-upload" className="cursor-pointer">
                            Choose File
                          </label>
                        </Button>
                      </div>
                      {uploadedFile && <p className="text-sm text-primary">Selected: {uploadedFile.name}</p>}
                    </div>
                  </div>

                  <Button
                    onClick={handleBulkAnalyze}
                    disabled={!uploadedFile || isAnalyzing}
                    size="lg"
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing CSV...
                      </>
                    ) : (
                      "Analyze CSV"
                    )}
                  </Button>

                  <AnimatePresence>
                    {bulkResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-6"
                      >
                        <Card className="glass p-6 space-y-4">
                          <h3 className="text-lg font-semibold text-card-foreground">Bulk Analysis Results</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-mono font-bold text-primary">{bulkResult.totalReviews}</div>
                              <div className="text-xs text-muted-foreground">Total Reviews</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-mono font-bold text-destructive">
                                {bulkResult.fakeCount}
                              </div>
                              <div className="text-xs text-muted-foreground">Fake Detected</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-mono font-bold text-chart-1">{bulkResult.genuineCount}</div>
                              <div className="text-xs text-muted-foreground">Genuine</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-mono font-bold text-secondary">
                                {bulkResult.averageConfidence}%
                              </div>
                              <div className="text-xs text-muted-foreground">Avg Confidence</div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Processing completed in {bulkResult.processingTime}ms. Check the dashboard for detailed
                            analysis.
                          </p>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="glass p-6 md:p-8">
              <Collapsible open={isExplainabilityOpen} onOpenChange={setIsExplainabilityOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-card-foreground">How Does the AI Work?</h3>
                        <p className="text-sm text-muted-foreground">
                          Understand the model architecture and decision process
                        </p>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isExplainabilityOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-card-foreground flex items-center space-x-2">
                        <Layers className="h-4 w-4 text-secondary" />
                        <span>Model Architecture</span>
                      </h4>
                      <ModelArchitecture />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-card-foreground flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-chart-1" />
                        <span>Detection Process</span>
                      </h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mt-0.5">
                            1
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">Text Preprocessing</p>
                            <p>Review text is tokenized and converted to numerical embeddings using BERT</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary mt-0.5">
                            2
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">Sequential Analysis</p>
                            <p>LSTM layers analyze word sequences and temporal patterns in the text</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-chart-1/20 flex items-center justify-center text-xs font-bold text-chart-1 mt-0.5">
                            3
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">Feature Fusion</p>
                            <p>Dense layers combine BERT embeddings with LSTM outputs for final classification</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/10 rounded-lg space-y-2">
                    <h4 className="text-sm font-semibold text-card-foreground">Training Dataset</h4>
                    <p className="text-xs text-muted-foreground">
                      Our model was trained on the Yelp dataset containing over 1.2 million reviews, with careful
                      preprocessing to identify genuine vs. fake patterns. The hybrid BERT + LSTM architecture achieves
                      95.3% accuracy on the test set.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-mono font-bold text-card-foreground">Detection Results</h2>
                    <Badge
                      variant={result.classification === "Genuine" ? "default" : "destructive"}
                      className="px-3 py-1 text-sm"
                    >
                      {result.classification === "Genuine" ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mr-1" />
                      )}
                      {result.classification}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-card-foreground">Confidence Score</h3>
                      <div className="flex items-center justify-center">
                        <CircularProgress
                          value={result.confidence}
                          size={120}
                          strokeWidth={8}
                          className="text-primary"
                        />
                      </div>
                      <p className="text-center text-sm text-muted-foreground">
                        {result.confidence}% confidence in classification
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-card-foreground">Behavioral Analysis</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Rating Deviation</span>
                          <span className="text-sm font-medium">{result.behavioralFeatures.ratingDeviation}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Review Length</span>
                          <span className="text-sm font-medium">{result.behavioralFeatures.reviewLength} chars</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Sentiment Score</span>
                          <span className="text-sm font-medium">{result.behavioralFeatures.sentimentScore}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Repetitive Patterns</span>
                          <Badge variant={result.behavioralFeatures.repetitivePatterns ? "destructive" : "default"}>
                            {result.behavioralFeatures.repetitivePatterns ? "Detected" : "None"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-card-foreground">Word-Level Confidence Analysis</h3>
                    <ConfidenceHeatmap data={result.confidenceHeatmap} />
                    <p className="text-xs text-muted-foreground">
                      Darker colors indicate words that contributed more strongly to the classification decision.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-card-foreground">Suspicious Keywords Analysis</h3>
                    <KeywordHighlighter
                      text={reviewText}
                      keywords={result.suspiciousKeywords}
                      className="p-4 bg-muted/20 rounded-lg text-sm leading-relaxed"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-card-foreground">Model Explanation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
