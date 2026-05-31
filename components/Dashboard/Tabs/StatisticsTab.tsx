'use client'

import { Users, UserCheck, UserMinus, Clock, MapPin, TrendingUp, Activity } from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { useAppStore } from '@/lib/store/useAppStore'

import { Pilgrim, Trip } from '@/lib/types'

interface StatisticsTabProps {
  pilgrims: Pilgrim[]
  trips: Trip[]
}

export default function StatisticsTab({ pilgrims, trips }: StatisticsTabProps) {
  const { centerConfig, groupConfigs } = useAppStore()

  const isManual = centerConfig?.statsMode === 'manual'

  // Auto calculations
  const target = Number(centerConfig?.totalPilgrimsTarget) || 0
  const autoArrived = pilgrims.length
  const autoDeparted = trips.filter(t => t.movementType === 'مغادرة').reduce((acc, t) => acc + (Number(t.pilgrimsCount) || 0), 0)
  const autoMakkah = pilgrims.filter(p => p.location?.includes('مكة') || p.status?.includes('مكة')).length
  const autoMadina = pilgrims.filter(p => p.location?.includes('المدينة') || p.status?.includes('المدينة')).length
  const autoPresent = Math.max(0, autoArrived - autoDeparted)
  const autoRemaining = Math.max(0, target - autoArrived)
  // Combined calculations (Manual Baseline OR Auto from DB)
  const arrived = isManual ? (centerConfig?.manualArrived ?? 0) : autoArrived
  const departed = isManual ? (centerConfig?.manualDeparted ?? 0) : autoDeparted
  const makkah = isManual ? (centerConfig?.manualMakkah ?? 0) : autoMakkah
  const madina = isManual ? (centerConfig?.manualMadina ?? 0) : autoMadina
  const present = isManual ? (centerConfig?.manualPresent ?? 0) : autoPresent
  const remaining = Math.max(0, target - arrived)

  const completionRate = target > 0 ? ((arrived / target) * 100).toFixed(1) : "0.0"
  const makkahPercent = arrived > 0 ? ((makkah / arrived) * 100).toFixed(0) : "0"
  const medinaPercent = arrived > 0 ? ((madina / arrived) * 100).toFixed(0) : "0"

  // Chart Data Processing
  const processedData = () => {
    const dailyCounts: { [key: string]: number } = {}

    // 1. Count pilgrims by their registration date (from Nusuk indexing / manual add)
    if (pilgrims && pilgrims.length > 0) {
      pilgrims.forEach(pilgrim => {
        let dateKey = ''
        const rd = pilgrim.registrationDate
        if (rd) {
          // Handle ISO format (2026-05-21T...) or locale format
          if (rd.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(rd)) {
            dateKey = rd.substring(0, 10) // extract YYYY-MM-DD
          } else {
            // Fallback: try to parse locale date, default to today
            try {
              const parsed = new Date(rd)
              dateKey = !isNaN(parsed.getTime()) ? parsed.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
            } catch {
              dateKey = new Date().toLocaleDateString('en-CA')
            }
          }
        } else {
          dateKey = new Date().toLocaleDateString('en-CA')
        }
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1
      })
    }

    // 2. Also add arrival trips pilgrim counts (avoid double-counting by adding to same dates)
    if (trips && trips.length > 0) {
      trips.forEach(trip => {
        if (trip.movementType === 'وصول') {
          const date = trip.date || new Date().toLocaleDateString('en-CA')
          dailyCounts[date] = (dailyCounts[date] || 0) + (Number(trip.pilgrimsCount) || 0)
        }
      })
    }

    const existingDates = Object.keys(dailyCounts).sort()

    // 3. Cumulative calculation with timeline padding
    let baseCumulative = isManual ? (centerConfig?.manualArrived ?? 0) : 0
    
    if (existingDates.length === 0) {
      // Return last 5 days as a flat line
      const res = []
      for (let i = 4; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        res.push({ name: d.toLocaleDateString('en-CA'), value: baseCumulative })
      }
      return res
    }

    // Determine start and end dates
    const firstDateStr = existingDates[0]
    const lastDateStr = existingDates[existingDates.length - 1]
    
    const startDate = new Date(firstDateStr)
    const lastDate = new Date(lastDateStr)
    const today = new Date()
    
    let endDate = today > lastDate ? today : lastDate

    // If start and end are close or the same, pad the start date by 4 days to make a proper line chart
    const daysDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    if (daysDiff < 4) {
      startDate.setDate(endDate.getDate() - 4)
    }

    const chartRes = []
    let currentCumulative = baseCumulative

    // Calculate accumulation strictly before the start date (if any data existed before the padded start date, though unlikely with our logic, it's good practice)
    for (const dStr of existingDates) {
      if (new Date(dStr) < startDate) {
        currentCumulative += dailyCounts[dStr]
      }
    }

    // Loop through each day to build the timeline
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toLocaleDateString('en-CA')
      if (dailyCounts[dateStr]) {
        currentCumulative += dailyCounts[dateStr]
      }
      chartRes.push({ name: dateStr, value: currentCumulative })
    }

    return chartRes
  }
  const chartData = processedData()

  const stats = [
    { label: 'إجمالي الحجاج', value: target, icon: <TrendingUp className="text-blue-500" />, subValue: `${completionRate}% تم إنجازه`, color: 'border-blue-500' },
    { label: 'تم وصولهم', value: arrived, icon: <UserCheck className="text-green-500" />, color: 'border-green-500' },
    { label: 'تم مغادرتهم', value: departed, icon: <UserMinus className="text-orange-500" />, color: 'border-orange-500' },
    { label: 'وصول مكة', value: makkah, icon: <MapPin className="text-cyan-500" />, color: 'border-cyan-500' },
    { label: 'وصول المدينة', value: madina, icon: <MapPin className="text-orange-400" />, color: 'border-orange-400' },
    { label: 'المتبقي للوصول', value: remaining, icon: <Clock className="text-purple-500" />, color: 'border-purple-500' },
    { label: 'المتواجدون حالياً', value: present, icon: <Users className="text-indigo-500" />, color: 'border-indigo-500' },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Mode Indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isManual ? 'bg-orange-400' : 'bg-green-500'} animate-pulse`}></div>
        <span className="text-[10px] font-black text-gray-400">
          {isManual ? 'الوضع اليدوي — الأرقام مُدخلة يدوياً من الإعدادات' : 'الوضع التلقائي — الأرقام تُحسب من قاعدة البيانات'}
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-4 rounded-2xl shadow-sm border-b-4 ${stat.color} flex flex-col items-center text-center space-y-2 transform hover:scale-105 transition`}>
            <div className="p-2 bg-gray-50 rounded-full">{stat.icon}</div>
            <p className="text-[10px] font-black text-gray-400 uppercase">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value.toLocaleString()}</p>
            {stat.subValue && <p className="text-[10px] text-green-600 font-bold">{stat.subValue}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Distribution */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="font-black text-gray-800 flex items-center gap-2 mb-6">
            <MapPin size={18} className="text-[var(--color-primary)]" />
            توزيع المواقع الفعلي
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold"><span>مكة المكرمة</span><span>{makkahPercent}%</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-primary)] transition-all duration-1000" style={{ width: `${makkahPercent}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold"><span>المدينة المنورة</span><span>{medinaPercent}%</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 transition-all duration-1000" style={{ width: `${medinaPercent}%` }}></div>
              </div>
            </div>
            {arrived === 0 && <p className="text-[10px] text-gray-400 font-bold text-center mt-4">لا توجد بيانات وصول حالياً</p>}
          </div>
        </div>

        {/* Groups */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {groupConfigs.map((group, i) => {
            const groupArrived = (group.manualArrived || 0) + pilgrims.filter(p => p.group === group.name).length
            const groupPercent = group.totalCount > 0 ? ((groupArrived / group.totalCount) * 100).toFixed(0) : "0"
            return (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-gray-800">{group.name}</h4>
                  <span className="text-[10px] font-bold text-gray-400">العدد الكلي {group.totalCount}</span>
                </div>
                <div className="flex items-end justify-between mt-8">
                  <div className="text-center">
                    <p className="text-xl font-black text-gray-900">{groupArrived}</p>
                    <p className="text-[10px] font-bold text-gray-400">الواصلين فعلياً</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-blue-600">{groupPercent}%</p>
                    <p className="text-[10px] font-bold text-gray-400">نسبة الإنجاز</p>
                  </div>
                </div>
                <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${group.color} transition-all duration-1000`} style={{ width: `${groupPercent}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="font-black text-gray-800 flex items-center gap-2 mb-8">
          <Activity size={18} className="text-[var(--color-primary)]" />
          مخطط حركة الوصول اليومي (تراكمي)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4332" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1B4332" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#9ca3af'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#9ca3af'}} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              <Area type="monotone" dataKey="value" stroke="#1B4332" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
