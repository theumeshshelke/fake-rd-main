"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Zap, Brain, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)
  const { user, logout } = useAuth()

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced BERT + LSTM model trained on Yelp dataset",
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Instant classification with confidence scores",
    },
    {
      icon: Shield,
      title: "High Accuracy",
      description: "Deep learning algorithms for precise detection",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Comprehensive insights and behavioral analysis",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.1),transparent_50%)]" />

      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-mono font-bold text-foreground">ReviewGuard</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                <Button variant="outline" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.1 }}
  className="space-y-4"
>
  <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-balance">
    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      AI-Powered
    </span>
    <br />
    Fake Review Detection
  </h1>
  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
    Leverage Deep Learning to detect deceptive reviews in real-time with our advanced BERT + LSTM model
  </p>
</motion.div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-medium group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                asChild
              >
                <Link href="/detect" className="flex items-center space-x-2">
                  <span>Try Now</span>
                  <motion.div
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="px-8 py-6 text-lg bg-transparent" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="glass p-6 h-full hover:glass-dark transition-all duration-300 group cursor-pointer">
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-lg text-card-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm mt-2">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-32"
          >
            <Card className="glass p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-mono font-bold text-primary">90.8%+</div>
                  <div className="text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-mono font-bold text-secondary">1M+</div>
                  <div className="text-muted-foreground">Reviews Analyzed</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-mono font-bold text-chart-1">&lt;1s</div>
                  <div className="text-muted-foreground">Processing Time</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
