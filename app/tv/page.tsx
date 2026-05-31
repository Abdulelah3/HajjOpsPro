'use client'

import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Trip, Pilgrim, CenterConfig } from '@/lib/types'
import { useAppStore } from '@/lib/store/useAppStore'
import { Plane, Clock, Activity, AlertTriangle, Users, MapPin, Minimize, Maximize, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TVCommandCenter() {
  const router = useRouter()
  const { centerConfig: storeConfig } = useAppStore()
  const [localConfig, setLocalConfig] = useState<CenterConfig | null>(null)
  const centerConfig = localConfig || storeConfig
  const [trips, setTrips] = useState<Trip[]>([])
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Listen to Trips
    const tripsQ = query(collection(db, 'trips'), orderBy('createdAt', 'desc'))
    const unsubscribeTrips = onSnapshot(tripsQ, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip))
      setTrips(tripsData)
    })

    // Listen to Pilgrims
    const pilgrimsQ = query(collection(db, 'pilgrims'))
    const unsubscribePilgrims = onSnapshot(pilgrimsQ, (snapshot) => {
      const pilgrimsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pilgrim))
      setPilgrims(pilgrimsData)
    })

    // Listen to Config
    const configQ = query(collection(db, 'config'))
    const unsubscribeConfig = onSnapshot(configQ, (snapshot) => {
      if (!snapshot.empty) {
        setLocalConfig({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as CenterConfig)
      }
    })

    return () => {
      unsubscribeTrips()
      unsubscribePilgrims()
      unsubscribeConfig()
    }
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
      }
    }
  }

  // Stats Calcs
  const isManual = centerConfig?.statsMode === 'manual'
  const target = Number(centerConfig?.totalPilgrimsTarget) || 0

  const autoArrived = pilgrims.length
  const autoDeparted = trips.filter(t => t.movementType === 'مغادرة').reduce((acc, t) => acc + (Number(t.pilgrimsCount) || 0), 0)
  const autoPresent = Math.max(0, autoArrived - autoDeparted)

  const arrived = isManual ? (centerConfig?.manualArrived ?? 0) : autoArrived
  const departed = isManual ? (centerConfig?.manualDeparted ?? 0) : autoDeparted
  const present = isManual ? (centerConfig?.manualPresent ?? 0) : autoPresent

  const completionRate = target > 0 ? ((arrived / target) * 100).toFixed(1) : "0"

  // Active Trips
  const parseTripDateTime = (dateStr?: string, timeStr?: string): Date => {
    if (!dateStr) return new Date()
    const baseDate = new Date(dateStr)
    if (!timeStr) return baseDate
    const cleanTime = timeStr.trim()
    const match = cleanTime.match(/(\d+):(\d+)\s*(AM|PM|am|pm)?/)
    let hours = 0, minutes = 0
    if (match) {
      hours = parseInt(match[1], 10); minutes = parseInt(match[2], 10)
      const meridiem = match[3]?.toUpperCase()
      if (meridiem === 'PM' && hours < 12) hours += 12
      if (meridiem === 'AM' && hours === 12) hours = 0
    } else {
      const parts = cleanTime.split(':')
      hours = parseInt(parts[0], 10) || 0; minutes = parseInt(parts[1], 10) || 0
    }
    baseDate.setHours(hours, minutes, 0, 0)
    if (hours < 12 && baseDate.getTime() < Date.now() - 6 * 3600 * 1000) baseDate.setHours(hours + 12)
    return baseDate
  }

  // Filter configuration
  const pastHours = centerConfig?.tvActiveTripsPastHours !== undefined ? Number(centerConfig.tvActiveTripsPastHours) : 2
  const futureHours = centerConfig?.tvActiveTripsFutureHours !== undefined ? Number(centerConfig.tvActiveTripsFutureHours) : 6

  const activeTrips = trips.filter(trip => {
    // If the ranges are set to 0 or negative values like -1, maybe show all trips?
    // Let's implement an option: if pastHours is 999 or futureHours is 999, don't filter by time
    if (pastHours === 999 && futureHours === 999) return true
    
    const tripDateTime = parseTripDateTime(trip.date, trip.time)
    const diffMinutes = Math.round((tripDateTime.getTime() - currentTime.getTime()) / 60000)
    return diffMinutes >= -(pastHours * 60) && diffMinutes <= (futureHours * 60)
  }).sort((a, b) => parseTripDateTime(a.date, a.time).getTime() - parseTripDateTime(b.date, b.time).getTime())

  // Customizable colors and styles
  const headerBgColor = centerConfig?.tvHeaderBgColor || '#1B4332'
  const headerTextColor = centerConfig?.tvHeaderTextColor || '#ffffff'
  const pageBgColor = centerConfig?.tvPageBgColor || '#F0F4F8'

  // Card visibilities
  const showTarget = centerConfig?.tvShowTarget ?? true
  const showPresent = centerConfig?.tvShowPresent ?? true
  const showArrived = centerConfig?.tvShowArrived ?? true
  const showDeparted = centerConfig?.tvShowDeparted ?? true

  return (
    <div 
      className="min-h-screen text-gray-800 overflow-hidden font-cairo" 
      style={{ backgroundColor: pageBgColor }}
      suppressHydrationWarning
    >
      {/* Top Header */}
      <div 
        className="flex items-center justify-between px-8 py-4 shadow-md transition-colors duration-300"
        style={{ backgroundColor: headerBgColor, color: headerTextColor }}
      >
        <div className="flex items-center gap-6">
           {centerConfig?.systemLogo && <img src={centerConfig.systemLogo} alt="Logo" className="h-14 w-auto object-contain drop-shadow-lg" />}
           <div>
             <h1 className="text-3xl font-black">
               {centerConfig?.tvTitle || centerConfig?.centerName || 'HOLIDAY INN BAKKAH'}
             </h1>
             <p className="opacity-80 font-bold tracking-wider mt-0.5 text-xs">
               {centerConfig?.tvSubtitle || 'غرفة العمليات المركزية - COMMAND CENTER'}
             </p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')} 
            className="p-2.5 bg-white/10 hover:bg-white/15 rounded-2xl transition border border-white/10 flex items-center gap-2"
            style={{ color: headerTextColor }}
            title="العودة للوحة التحكم"
          >
            <LayoutDashboard size={18} />
            <span className="text-xs font-black hidden md:inline">لوحة التحكم</span>
          </button>
          <button 
            onClick={toggleFullscreen} 
            className="p-2.5 bg-white/10 hover:bg-white/15 rounded-2xl transition border border-white/10"
            style={{ color: headerTextColor }}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <div className="text-right border-r border-white/20 pr-6 min-w-[150px]">
            {mounted ? (
              <>
                <div className="text-4xl font-black tracking-widest">
                  {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                </div>
                <div className="font-bold text-xs mt-0.5 opacity-80">
                  {currentTime.toLocaleDateString('ar-SA')}
                </div>
              </>
            ) : (
              <div className="animate-pulse">
                <div className="h-9 bg-white/20 rounded-lg w-28 mb-1.5"></div>
                <div className="h-3 bg-white/10 rounded w-20 ml-auto"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-8 grid grid-cols-12 gap-8 h-[calc(100vh-88px)]">
        
        {/* Left Col: Live Radar & Active Trips (8 cols or 12 cols depending on right col visibility) */}
        <div className={`${(showTarget || showPresent || showArrived || showDeparted) ? 'col-span-8' : 'col-span-12'} flex flex-col gap-5 h-full`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-2.5 text-gray-800">
              <Activity className="text-green-700 animate-pulse" /> {centerConfig?.tvRadarTitle || 'رادار التحركات المباشرة'}
            </h2>
            <div>
              <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span> {centerConfig?.tvLiveBadgeText || 'بث مباشر'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-200/80 p-6 flex-1 overflow-hidden relative shadow-sm">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.01)_0%,transparent_70%)] pointer-events-none"></div>
             
             {/* Table Header */}
             <div className="grid grid-cols-12 gap-4 text-gray-400 font-bold text-xs uppercase tracking-wider pb-4 border-b border-gray-100 mb-4">
               <div className="col-span-2">الحالة</div>
               <div className="col-span-3">المنظم</div>
               <div className="col-span-2 text-center">الوقت</div>
               <div className="col-span-2 text-center">العدد</div>
               <div className="col-span-3 text-center">الوجهة</div>
             </div>

             {/* Trips List */}
             <div className="space-y-3.5 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
               {activeTrips.length === 0 ? (
                 <div className="text-center py-20 text-gray-400 font-bold text-lg">لا توجد رحلات نشطة حالياً</div>
               ) : (
                 activeTrips.map(trip => {
                   const tripTime = parseTripDateTime(trip.date, trip.time)
                   const diffMins = Math.round((tripTime.getTime() - currentTime.getTime()) / 60000)
                   
                   const isNow = diffMins <= 15 && diffMins >= -60
                   const isApproaching = diffMins > 15 && diffMins <= 120
                   
                   let rowStyle = 'bg-gray-50/50 border-gray-100 text-gray-700 hover:bg-gray-50'
                   let statusBadge = <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold border border-gray-200/60">بعد {Math.round(diffMins/60)} ساعة</span>
                   
                   if (isNow) {
                     rowStyle = 'bg-red-50/80 border-red-200 text-red-900 shadow-[0_0_15px_rgba(239,68,68,0.08)] animate-pulse'
                     statusBadge = <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs font-black border border-red-200 flex items-center gap-1.5"><AlertTriangle size={14} className="animate-bounce" /> الآن مباشر</span>
                   } else if (isApproaching) {
                     rowStyle = 'bg-amber-50/80 border-amber-200 text-amber-900'
                     statusBadge = <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-black border border-amber-200">متبقي {diffMins} دقيقة</span>
                   }

                   return (
                     <div key={trip.id} className={`grid grid-cols-12 gap-4 items-center p-4.5 rounded-2xl border ${rowStyle} transition-all`}>
                       <div className="col-span-2">
                         <span className={`px-4 py-2 rounded-2xl text-xs font-black inline-block text-center min-w-[70px] ${trip.movementType === 'وصول' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                           {trip.movementType}
                         </span>
                       </div>
                       <div className="col-span-3 text-lg font-black text-gray-800 truncate">{trip.groupName}</div>
                       <div className="col-span-2 text-center text-xl font-black text-green-700 tracking-wider font-mono">{trip.time}</div>
                       <div className="col-span-2 text-center text-2xl font-black text-gray-850">{trip.pilgrimsCount}</div>
                       <div className="col-span-3 text-center">{statusBadge}</div>
                     </div>
                   )
                 })
               )}
             </div>
          </div>
        </div>

        {/* Right Col: Big Stats (4 cols) */}
        {(showTarget || showPresent || showArrived || showDeparted) && (
          <div className="col-span-4 flex flex-col gap-6 h-full">
            {showTarget && (
              <div className="bg-white rounded-[2.5rem] border border-gray-200/80 p-8 flex flex-col justify-center relative overflow-hidden group shadow-sm">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/5 rounded-full blur-3xl"></div>
                <Users className="text-green-700/5 w-32 h-32 absolute -left-4 -bottom-4 group-hover:scale-105 transition-transform" />
                <div className="relative z-10">
                  <p className="text-gray-500 font-bold text-lg mb-2">{centerConfig?.tvLabelTarget || 'العدد المستهدف (الموسم)'}</p>
                  <p className="text-6xl font-black text-gray-800 drop-shadow-sm">{mounted ? target.toLocaleString('en-US') : '0'}</p>
                  <div className="mt-6 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200/60">
                     <div className="h-full bg-gradient-to-r from-[#1B4332] to-[#2D6A4F]" style={{ width: `${mounted ? completionRate : '0'}%` }}></div>
                  </div>
                  <p className="text-green-700 font-bold text-sm mt-3 text-left">{mounted ? completionRate : '0'}% نسبة الإنجاز</p>
                </div>
              </div>
            )}

            {showPresent && (
              <div className="bg-white rounded-[2.5rem] border border-gray-200/80 p-8 flex flex-col justify-center relative overflow-hidden group shadow-sm">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <MapPin className="text-[var(--color-primary)]/5 w-32 h-32 absolute -left-4 -bottom-4 group-hover:scale-105 transition-transform" />
                <div className="relative z-10">
                  <p className="text-gray-500 font-bold text-lg mb-2">{centerConfig?.tvLabelPresent || 'التواجد الفعلي حالياً'}</p>
                  <p className="text-7xl font-black text-[var(--color-primary)]">{mounted ? present.toLocaleString('en-US') : '0'}</p>
                  <p className="text-green-700 font-bold text-base mt-2 tracking-wide">حاج داخل المركز</p>
                </div>
              </div>
            )}

            {(showArrived || showDeparted) && (
              <div className="grid grid-cols-2 gap-6 flex-1">
                {showArrived && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-200/80 p-6 flex flex-col justify-center text-center shadow-sm">
                      <p className="text-gray-400 font-bold mb-2">{centerConfig?.tvLabelArrived || 'إجمالي الواصلين'}</p>
                      <p className="text-3xl font-black text-gray-800">{mounted ? arrived.toLocaleString('en-US') : '0'}</p>
                  </div>
                )}
                {showDeparted && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-200/80 p-6 flex flex-col justify-center text-center shadow-sm">
                      <p className="text-gray-400 font-bold mb-2">{centerConfig?.tvLabelDeparted || 'إجمالي المغادرين'}</p>
                      <p className="text-3xl font-black text-gray-800">{mounted ? departed.toLocaleString('en-US') : '0'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
