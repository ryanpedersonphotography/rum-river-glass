/* FILE: src/system/recipes/GlassToolbar/ThemeToggle.tsx */
"use client"

import * as React from "react"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"

type ThemeMode = "light" | "dark" | "system"

export type ThemeToggleProps = {
  className?: string
  iconClassName?: string
  storageKey?: string
}

function getSystemTheme(): "light" | "dark" {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
  return prefersDark ? "dark" : "light"
}

function readStored(storageKey: string): ThemeMode | null {
  try {
    const v = window.localStorage.getItem(storageKey)
    if (v === "light" || v === "dark" || v === "system") return v
    return null
  } catch {
    return null
  }
}

function writeStored(storageKey: string, value: ThemeMode) {
  try {
    window.localStorage.setItem(storageKey, value)
  } catch {
    // ignore
  }
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

export function ThemeToggle({ className, iconClassName, storageKey = "zen-theme" }: ThemeToggleProps) {
  const [mode, setMode] = React.useState<ThemeMode>("system")
  const [resolved, setResolved] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const stored = readStored(storageKey)
    const initialMode: ThemeMode = stored ?? "system"
    setMode(initialMode)

    const next = initialMode === "system" ? getSystemTheme() : initialMode
    setResolved(next)
    applyTheme(next)

    const mql = window.matchMedia?.("(prefers-color-scheme: dark)")
    if (!mql) return

    const onChange = () => {
      if (readStored(storageKey) === "system") {
        const sys = getSystemTheme()
        setResolved(sys)
        applyTheme(sys)
      }
    }

    // Safari compatibility: addListener/removeListener fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyMql = mql as any
    if (anyMql.addEventListener) anyMql.addEventListener("change", onChange)
    else if (anyMql.addListener) anyMql.addListener(onChange)

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyMql2 = mql as any
      if (anyMql2.removeEventListener) anyMql2.removeEventListener("change", onChange)
      else if (anyMql2.removeListener) anyMql2.removeListener(onChange)
    }
  }, [storageKey])

  const toggle = React.useCallback(() => {
    // Simple behavior: flip between light/dark and persist explicit choice.
    const next = resolved === "dark" ? "light" : "dark"
    setMode(next)
    setResolved(next)
    writeStored(storageKey, next)
    applyTheme(next)
  }, [resolved, storageKey])

  return (
    <button
      type="button"
      className={className}
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      data-theme-mode={mode}
    >
      <SunIcon className={iconClassName} aria-hidden="true" data-hide-on-theme="light" />
      <MoonIcon className={iconClassName} aria-hidden="true" data-hide-on-theme="dark" />
    </button>
  )
}
