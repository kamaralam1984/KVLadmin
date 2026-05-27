"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface Tenant {
  id: string
  name: string
  subdomain: string | null
  customDomain: string | null
  apiKey: string
  status: string
  category: string
}

interface TenantContextValue {
  tenant: Tenant | null
  loading: boolean
  isTenantMode: boolean
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  loading: true,
  isTenantMode: false,
})

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => setTenant(data.tenant ?? null))
      .catch(() => setTenant(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <TenantContext.Provider value={{ tenant, loading, isTenantMode: !!tenant }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  return useContext(TenantContext)
}
