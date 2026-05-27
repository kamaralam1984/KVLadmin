"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import type { Site } from "@/types"
import { useTenant } from "@/contexts/TenantContext"

interface SiteContextValue {
  sites: Site[]
  activeSite: Site | null
  setActiveSite: (site: Site | null) => void
  refreshSites: () => Promise<void>
  loading: boolean
}

const SiteContext = createContext<SiteContextValue | null>(null)

const ACTIVE_SITE_KEY = "kvl_active_site_id"

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>([])
  const [activeSite, setActiveSiteState] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const { tenant } = useTenant()

  const refreshSites = useCallback(async () => {
    const res = await api.get<Site[]>("/api/sites")
    if (res.data) {
      setSites(res.data)

      // Tenant mode: auto-select the tenant's site
      if (tenant) {
        const tenantSite = res.data.find((s) => s.id === tenant.id)
        if (tenantSite) { setActiveSiteState(tenantSite); setLoading(false); return }
      }

      const savedId = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_SITE_KEY) : null
      if (savedId) {
        const found = res.data.find((s) => s.id === savedId)
        if (found) setActiveSiteState(found)
      }
    }
    setLoading(false)
  }, [tenant])

  const setActiveSite = useCallback((site: Site | null) => {
    setActiveSiteState(site)
    if (typeof window !== "undefined") {
      if (site) localStorage.setItem(ACTIVE_SITE_KEY, site.id)
      else localStorage.removeItem(ACTIVE_SITE_KEY)
    }
  }, [])

  useEffect(() => { refreshSites() }, [refreshSites])

  return (
    <SiteContext.Provider value={{ sites, activeSite, setActiveSite, refreshSites, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>")
  return ctx
}
