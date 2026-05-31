'use client'

import { ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from '@/lib/store/useAppStore'
import AIChatPanel from '@/components/AI/AIChatPanel'
import AnomalyMonitor from '@/components/AI/AnomalyMonitor'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import ThemeProvider from '@/components/ThemeProvider'

// Centralized data subscriber - subscribes once when authenticated
function DataSubscriber() {
  const subscribeToAll = useAppStore(state => state.subscribeToAll)

  useEffect(() => {
    let unsubData: (() => void) | null = null

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubData = subscribeToAll()
      } else {
        if (unsubData) {
          unsubData()
          unsubData = null
        }
      }
    })

    return () => {
      unsubAuth()
      if (unsubData) unsubData()
    }
  }, [subscribeToAll])

  return null
}

// Register Service Worker for PWA offline support
function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('✅ Service Worker registered successfully.', reg.scope)
        })
        .catch((err) => {
          console.warn('⚠️ Service Worker registration failed:', err)
        })
    }
  }, [])
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <DataSubscriber />
      <ServiceWorkerRegistrar />
      <ThemeProvider>
        {children}
        <Toaster position="top-right" />
        <AIChatPanel />
        <AnomalyMonitor />
      </ThemeProvider>
    </>
  )
}
