'use client'

import { useAppStore } from '@/lib/store/useAppStore'
import { useEffect } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { centerConfig } = useAppStore()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    // Colors
    root.style.setProperty('--color-primary', centerConfig?.themePrimaryColor || '#1B4332')
    root.style.setProperty('--color-secondary', centerConfig?.themeSecondaryColor || '#BC4749')
    root.style.setProperty('--color-background', centerConfig?.themeBackgroundColor || '#F8F9F7')
    root.style.setProperty('--color-surface', centerConfig?.themeSurfaceColor || '#FFFFFF')
    root.style.setProperty('--color-text', centerConfig?.themeTextColor || '#1F2937')

    // Shapes
    root.style.setProperty('--radius-card', centerConfig?.themeCardRadius || '1.5rem')
    root.style.setProperty('--radius-button', centerConfig?.themeButtonRadius || '0.75rem')
    
  }, [centerConfig])

  return <>{children}</>
}
