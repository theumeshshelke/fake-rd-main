"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChartIcon,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { AnimatedCounter } from "@/components/animated-counter"
import { PredictionHistory } from "@/components/prediction-history"

// Mock data for charts
const distributionData = [
  { name: "Genuine", value: 6847, percentage: 68.47 },
  { name: "Fake", value: 3153, percentage: 31.53 },
]

const monthlyData = [
  { month: "Jan", genuine: 580, fake: 220 },
  { month: "Feb", genuine: 620, fake: 180 },
  { month: "Mar", genuine: 690, fake: 310 },
  { month: "Apr", genuine: 720, fake: 280 },
  { month: "May", genuine: 650, fake: 350 },
  { month: "Jun", genuine: 780, fake: 220 },
]

const confidenceData = [
  { range: "90-100%", count: 4200 },
  { range: "80-89%", count: 2800 },
  { range: "70-79%", count: 1900 },
  { range: "60-69%", count: 800 },
  { range: "50-59%", count: 300 },
]

const reviewLengthData = [
  { length: "0-50", genuine: 120, fake: 380 },
  { length: "51-100", genuine: 450, fake: 520 },
  { length: "101-200", genuine: 890, fake: 420 },
  { length: "201-500", genuine: 1200, fake: 180 },
  { length: "500+", genuine: 340, fake: 50 },
]

const COLORS = ["#0891b2", "#ec4899", "#059669", "#be123c", "#10b981"]

export default function DashboardPage() {
  const [totalReviews, setTotalReviews] = useState(0)
  const [fakeReviews, setFakeReviews] = useState(0)
  const [avgConfidence, setAvgConfidence] = useState(0)

  // Animate counters on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setTotalReviews(10000)
      setFakeReviews(3153)
      setAvgConfidence(87.3)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(8,145,178,0.1),transparent_50%)]" />

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" asChild className="flex items-center space-x-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-lg font-mono font-bold">Analytics Dashboard</span>
          </div>

          <Button variant="outline" asChild>
            <Link href="/detect">Analyze Reviews</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-balance">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Review Analytics
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Comprehensive insights and statistics from your fake review detection analysis
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="glass p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Reviews Analyzed</p>
                <div className="text-3xl font-mono font-bold text-card-foreground">
                  <AnimatedCounter value={totalReviews} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  +12% from last month
                </Badge>
              </div>
            </Card>

            <Card className="glass p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Fake Reviews Detected</p>
                <div className="text-3xl font-mono font-bold text-card-foreground">
                  <AnimatedCounter value={fakeReviews} />
                </div>
                <Badge variant="destructive" className="text-xs">
                  31.5% of total
                </Badge>
              </div>
            </Card>

            <Card className="glass p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-chart-1/10">
                  <CheckCircle className="h-6 w-6 text-chart-1" />
                </div>
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Confidence</p>
                <div className="text-3xl font-mono font-bold text-card-foreground">
                  <AnimatedCounter value={avgConfidence} decimals={1} />%
                </div>
                <Badge variant="default" className="text-xs">
                  High accuracy
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* Charts Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="distribution" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted/20">
                <TabsTrigger value="distribution" className="flex items-center space-x-2">
                  <PieChartIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Distribution</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Trends</span>
                </TabsTrigger>
                <TabsTrigger value="confidence" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Confidence</span>
                </TabsTrigger>
                <TabsTrigger value="length" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Length</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="distribution">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Review Classification</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid rgba(148, 163, 184, 0.2)",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="glass p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Classification Breakdown</h3>
                    <div className="space-y-4">
                      {distributionData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium text-card-foreground">{item.name} Reviews</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-card-foreground">{item.value.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends">
                <Card className="glass p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Monthly Detection Trends</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.8)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="genuine"
                        stackId="1"
                        stroke={COLORS[0]}
                        fill={COLORS[0]}
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="fake"
                        stackId="1"
                        stroke={COLORS[1]}
                        fill={COLORS[1]}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="confidence">
                <Card className="glass p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Confidence Score Distribution</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={confidenceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis dataKey="range" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.8)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="length">
                <Card className="glass p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Review Length vs Prediction</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={reviewLengthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis dataKey="length" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.8)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="genuine" fill={COLORS[0]} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="fake" fill={COLORS[1]} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Prediction History Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <PredictionHistory />
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Detection Activity</h3>
              <div className="space-y-4">
                {[
                  { time: "2 minutes ago", type: "Fake", confidence: 94, text: "Amazing product, highly recommend..." },
                  {
                    time: "5 minutes ago",
                    type: "Genuine",
                    confidence: 87,
                    text: "Good quality but delivery was slow...",
                  },
                  {
                    time: "8 minutes ago",
                    type: "Fake",
                    confidence: 91,
                    text: "Perfect in every way, best purchase ever...",
                  },
                  {
                    time: "12 minutes ago",
                    type: "Genuine",
                    confidence: 82,
                    text: "Decent product for the price point...",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant={activity.type === "Genuine" ? "default" : "destructive"}>
                        {activity.type === "Genuine" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {activity.type}
                      </Badge>
                      <div>
                        <p className="text-sm text-card-foreground truncate max-w-md">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-card-foreground">{activity.confidence}%</div>
                      <div className="text-xs text-muted-foreground">confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
