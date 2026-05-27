"use client"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")

  useEffect(() => {
    const saved = localStorage.getItem("kvl_theme") as Theme | null
    if (saved) {
      setThemeState(saved)
      document.documentElement.setAttribute("data-theme", saved)
    }
  }, [])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem("kvl_theme", t)
    document.documentElement.setAttribute("data-theme", t)
  }

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return ctx
}
