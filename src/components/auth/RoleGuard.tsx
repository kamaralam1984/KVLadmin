"use client"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { Role } from "@/types"

interface RoleGuardProps {
  allowedRoles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  const hasAccess = user && allowedRoles.includes(user.role as Role)

  useEffect(() => {
    if (!loading && !hasAccess && !fallback) {
      router.push("/access-denied")
    }
  }, [loading, hasAccess, fallback, router])

  if (loading) return null
  if (!hasAccess) return fallback ? <>{fallback}</> : null
  return <>{children}</>
}
