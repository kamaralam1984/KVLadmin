"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { User } from "@/types"

interface AuthUser extends Pick<User, "id" | "name" | "email" | "role" | "status"> {}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refresh = useCallback(async () => {
    const result = await api.get<AuthUser>("/api/auth/me")
    if (result.data) setUser(result.data)
    else setUser(null)
  }, [])

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout", {})
    setUser(null)
    router.push("/auth/login")
  }, [router])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
