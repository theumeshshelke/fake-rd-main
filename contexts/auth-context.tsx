"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface PredictionHistory {
  id: string
  reviewText: string
  classification: "Fake" | "Genuine"
  confidence: number
  timestamp: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  addPredictionToHistory: (prediction: Omit<PredictionHistory, "id" | "timestamp">) => void
  predictionHistory: PredictionHistory[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([])

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("reviewguard_user")
    const savedHistory = localStorage.getItem("reviewguard_history")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedHistory) {
      setPredictionHistory(JSON.parse(savedHistory))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Mock authentication - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "demo@example.com" && password === "password") {
      const mockUser: User = {
        id: "1",
        email,
        name: "Demo User",
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      localStorage.setItem("reviewguard_user", JSON.stringify(mockUser))
    } else {
      throw new Error("Invalid credentials")
    }

    setIsLoading(false)
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)

    // Mock signup - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("reviewguard_user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    setPredictionHistory([])
    localStorage.removeItem("reviewguard_user")
    localStorage.removeItem("reviewguard_history")
  }

  const addPredictionToHistory = (prediction: Omit<PredictionHistory, "id" | "timestamp">) => {
    if (!user) return

    const newPrediction: PredictionHistory = {
      ...prediction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }

    setPredictionHistory((prev) => {
      const updated = [newPrediction, ...prev].slice(0, 10) // Keep only last 10
      localStorage.setItem("reviewguard_history", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        addPredictionToHistory,
        predictionHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
