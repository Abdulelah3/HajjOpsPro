'use client'

import { useEffect, useState } from 'react'
import { Users, Bus, CheckCircle, AlertTriangle, Loader2, MapPin, AlertCircle } from 'lucide-react'
import { getStatistics } from '@/lib/firebaseService'

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalPilgrims: 0,
    activeTrips: 0,
    completedTrips: 0,
    alerts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStatistics()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    {
      label: 'إجمالي الحجاج',
      value: stats.totalPilgrims.toLocaleString(),
      icon: Users,
      color: 'blue',
    },
    {
      label: 'الرحلات النشطة',
      value: stats.activeTrips.toLocaleString(),
      icon: MapPin,
      color: 'green',
    },
    {
      label: 'المكتملة',
      value: stats.completedTrips.toLocaleString(),
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      label: 'التنبيهات',
      value: stats.alerts.toLocaleString(),
      icon: AlertCircle,
      color: 'orange',
    },
  ]

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 h-32 flex items-center justify-center border-t-4 border-[#228B22]">
            <Loader2 className="w-8 h-8 text-[#228B22] animate-spin" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition border-t-4 border-[#228B22]"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                colorClasses[stat.color as keyof typeof colorClasses]
              }`}
            >
              <stat.icon size={24} />
            </div>
          </div>
          <p className="text-gray-600 text-sm">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
