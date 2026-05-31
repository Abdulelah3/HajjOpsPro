'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Plane, Car, CheckCircle2, ChevronLeft, AlertTriangle } from 'lucide-react'
import { Trip } from '@/lib/types'

interface MovementsTabProps {
  trips: Trip[]
}

export default function MovementsTab({ trips }: MovementsTabProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Update current time every 30 seconds for live countdowns
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  // Smart Helper to parse Date & Time strings into a robust Date object
  const parseTripDateTime = (dateStr?: string, timeStr?: string): Date => {
    if (!dateStr) return new Date()
    const baseDate = new Date(dateStr)
    if (isNaN(baseDate.getTime())) return new Date()
    
    if (!timeStr) return baseDate
    
    let hours = 0
    let minutes = 0
    const cleanTime = timeStr.trim()
    const match = cleanTime.match(/(\d+):(\d+)\s*(AM|PM|am|pm)?/)
    
    if (match) {
      hours = parseInt(match[1], 10)
      minutes = parseInt(match[2], 10)
      const meridiem = match[3]?.toUpperCase()
      
      if (meridiem === 'PM' && hours < 12) hours += 12
      if (meridiem === 'AM' && hours === 12) hours = 0
    } else {
      const parts = cleanTime.split(':')
      hours = parseInt(parts[0], 10) || 0
      minutes = parseInt(parts[1], 10) || 0
    }
    
    baseDate.setHours(hours, minutes, 0, 0)

    // Smart heuristic: if user wrote e.g. "03:08" meaning PM but omitted PM, 
    // and 3:08 AM is > 6 hours in the past, assume they meant PM (15:08).
    if (hours < 12 && baseDate.getTime() < Date.now() - 6 * 3600 * 1000) {
      baseDate.setHours(hours + 12)
    }

    return baseDate
  }

  // Sort trips by date/time
  const displayTrips = trips.sort((a, b) => {
    const timeA = parseTripDateTime(a.date, a.time).getTime()
    const timeB = parseTripDateTime(b.date, b.time).getTime()
    return timeB - timeA
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
          <Plane className="text-[var(--color-primary)] transform -rotate-45" size={28} />
          التحركات الميدانية المباشرة
        </h2>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-2xl animate-pulse">
             <AlertTriangle size={18} className="text-red-600" />
             <span className="text-xs font-black text-red-700">تنبيه الرحلات المقتربة (وميض حي 🚨)</span>
           </div>
           <div className="flex gap-2">
              <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black border border-green-200">وصول</span>
              <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black border border-blue-200">مغادرة</span>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Table Header Styled for Screen */}
        <div className="grid grid-cols-12 gap-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
           <div className="col-span-1">النوع</div>
           <div className="col-span-2">اسم المنظم</div>
           <div className="col-span-2 text-center">التاريخ والوقت</div>
           <div className="col-span-1 text-center">الرحلة</div>
           <div className="col-span-1 text-center">المطار</div>
           <div className="col-span-1 text-center">العدد</div>
           <div className="col-span-1 text-center">الوجهة</div>
           <div className="col-span-2 text-center">السكن</div>
           <div className="col-span-1 text-center">الحالة المباشرة</div>
        </div>

        {displayTrips.map((trip) => {
          const tripDateTime = parseTripDateTime(trip.date, trip.time)
          const diffMinutes = Math.round((tripDateTime.getTime() - currentTime.getTime()) / 60000)
          
          // Determine status categories
          const isApproaching = diffMinutes > 0 && diffMinutes <= 180 // within 3 hours
          const isNow = diffMinutes <= 0 && diffMinutes >= -60 // happening now
          const isPast = diffMinutes < -60
          const isFuture = diffMinutes > 180

          // Determine row styling based on status
          let borderStyle = trip.movementType === 'وصول' ? 'border-green-500/30' : 'border-blue-500/30'
          let bgStyle = 'bg-white'
          
          if (isApproaching) {
            borderStyle = 'border-red-500 animate-pulse shadow-xl shadow-red-500/20 ring-4 ring-red-500/20'
            bgStyle = 'bg-gradient-to-r from-red-50/80 via-white to-red-50/80'
          } else if (isNow) {
            borderStyle = 'border-orange-500 animate-pulse shadow-lg ring-4 ring-orange-500/20'
            bgStyle = 'bg-orange-50/50'
          }

          return (
            <div 
              key={trip.id} 
              className={`grid grid-cols-12 gap-4 p-6 rounded-[2rem] shadow-sm border-2 transition hover:scale-[1.02] items-center ${bgStyle} ${borderStyle}`}
            >
              <div className="col-span-1">
                 <span className={`px-4 py-2 rounded-2xl text-[10px] font-black ${
                   trip.movementType === 'وصول' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                 }`}>
                   {trip.movementType}
                 </span>
              </div>
              
              <div className="col-span-2 font-black text-gray-900 text-lg flex items-center gap-2">
                 {trip.groupName}
                 {isApproaching && (
                   <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                 )}
              </div>

              <div className="col-span-2 flex flex-col items-center gap-1">
                 <span className="text-sm font-black text-gray-700">{trip.date}</span>
                 <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                   isApproaching ? 'bg-red-100 border-red-300 text-red-700 font-black animate-pulse' : 'bg-gray-50 border-gray-100 text-[var(--color-primary)]'
                 }`}>
                    <Clock size={12} />
                    <span className="text-xs font-bold">{trip.time}</span>
                 </div>
              </div>

              <div className="col-span-1 text-center font-black text-gray-600">
                 {trip.flightNumber || '—'}
              </div>

              <div className="col-span-1 text-center font-black text-gray-900">
                 {trip.airport || '—'}
              </div>

              <div className="col-span-1 text-center">
                 <span className="text-2xl font-black text-[var(--color-primary)]">{trip.pilgrimsCount || 0}</span>
              </div>

              <div className="col-span-1 text-center font-black text-orange-600">
                 {trip.destination || '—'}
              </div>

              <div className="col-span-2 text-center font-black text-gray-900 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                 {trip.accommodation || '—'}
              </div>

              <div className="col-span-1 text-center">
                 <div className="flex flex-col items-center gap-1.5">
                    {isApproaching && (
                      <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black animate-pulse shadow-md shadow-red-600/30 flex items-center gap-1">
                        🚨 متبقي {diffMinutes} دقيقة
                      </span>
                    )}
                    {isNow && (
                      <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black animate-pulse shadow-md shadow-orange-500/30 flex items-center gap-1">
                        ⚡ الآن (مباشر)
                      </span>
                    )}
                    {isFuture && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-200">
                        ⏰ بعد {Math.round(diffMinutes / 60)} ساعة
                      </span>
                    )}
                    {isPast && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-200">
                        ✅ مكتملة
                      </span>
                    )}
                    <span className="text-[9px] font-black text-gray-500 uppercase">{trip.status}</span>
                 </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
