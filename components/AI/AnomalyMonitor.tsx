'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import { toast } from 'react-hot-toast'

export default function AnomalyMonitor() {
  const { pilgrims, trips, addNotification, centerConfig } = useAppStore()
  const hasRun = useRef(false) // Run once per session on mount, or change to interval

  useEffect(() => {
    // Only run if we have loaded data and haven't run yet
    if (pilgrims.length === 0 && trips.length === 0) return
    if (centerConfig && (centerConfig.aiEnabled === false || centerConfig.aiEnableAnomalies === false)) return
    if (hasRun.current) return

    const checkAnomalies = async () => {
      hasRun.current = true
      try {
        const context = {
          currentTime: new Date().toISOString(),
          pilgrimsCount: pilgrims.length,
          pendingPilgrims: pilgrims.filter(p => p.status !== 'مؤكد').length,
          tripsCount: trips.length,
          recentTrips: trips.slice(0, 5), // Send just a sample to keep payload small
          target: centerConfig?.totalPilgrimsTarget
        }

        const res = await fetch('/api/ai/anomalies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context, apiKey: centerConfig?.aiApiKey, provider: centerConfig?.aiProvider, modelId: centerConfig?.aiModel })
        })

        if (!res.ok) return

        const anomalies: Array<{ type: 'error' | 'warning' | 'info', title: string, message: string }> = await res.json()
        
        anomalies.forEach(anomaly => {
          // Add to notifications store
          addNotification({
            title: `[مراقب الذكاء الاصطناعي] ${anomaly.title}`,
            message: anomaly.message,
            time: new Date().toLocaleTimeString('ar-SA'),
            read: false,
            type: anomaly.type
          })
          
          // Show toast
          if (anomaly.type === 'error') {
            toast.error(anomaly.title, { duration: 6000 })
          } else {
            toast(anomaly.title, { icon: '🤖', duration: 5000 })
          }
        })
      } catch (error) {
        console.error('Failed to run anomaly monitor', error)
      }
    }

    // Run after 10 seconds of app load to not block initial render
    const timer = setTimeout(() => {
      checkAnomalies()
    }, 10000)

    // And set up an interval to run every 30 minutes
    const interval = setInterval(() => {
      checkAnomalies()
    }, 30 * 60 * 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [pilgrims.length, trips.length, addNotification, centerConfig])

  // This is a headless component, it renders nothing
  return null
}
