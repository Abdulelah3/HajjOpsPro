'use client'

import { X, Users, PlaneLanding, PlaneTakeoff, Info, TrendingUp, Target } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'

interface IndicatorsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function IndicatorsModal({ isOpen, onClose }: IndicatorsModalProps) {
  const { pilgrims, trips, centerConfig } = useAppStore()

  if (!isOpen) return null

  // Auto values
  const autoRegistered = pilgrims.length
  const autoArrivals = trips.filter(t => t.movementType === 'وصول').reduce((acc, t) => acc + (Number(t.pilgrimsCount) || 0), 0)
  const autoDepartures = trips.filter(t => t.movementType === 'مغادرة').reduce((acc, t) => acc + (Number(t.pilgrimsCount) || 0), 0)
  const target = Number(centerConfig?.totalPilgrimsTarget) || 0

  // Final combined values
  const registered = (centerConfig?.manualArrived ?? 0) + autoRegistered
  const arrivals = (centerConfig?.manualArrived ?? 0) + autoArrivals
  const departures = (centerConfig?.manualDeparted ?? 0) + autoDepartures

  const progress = target > 0 ? Math.min(Math.round((registered / target) * 100), 100) : 0

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn" onClick={onClose}></div>
       
       <div className="relative bg-[#F8FAFC] w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white animate-zoomIn">
          {/* Header */}
          <div className="bg-[var(--color-primary)] p-8 text-white">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-white/10 rounded-2xl">
                      <TrendingUp size={24} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black">مؤشرات الأداء الحية</h2>
                      <p className="text-white/60 text-xs font-bold mt-1">إحصائيات فورية من واقع الميدان</p>
                   </div>
                </div>
                <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                   <X size={24} />
                </button>
             </div>
          </div>

          <div className="p-10 space-y-8">
             {/* Main Indicator */}
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition duration-500">
                   <Users size={120} />
                </div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">إجمالي الحجاج</p>
                <div className="text-6xl font-black text-[var(--color-primary)] tracking-tighter mb-4">
                   {registered.toLocaleString()}
                </div>
                
                {/* Progress Bar */}
                <div className="max-w-xs mx-auto">
                   <div className="flex justify-between text-[10px] font-black mb-2 px-1">
                      <span className="text-[var(--color-primary)]">{progress}% مكتمل</span>
                      <span className="text-gray-400">الهدف: {target}</span>
                   </div>
                   <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50">
                      <div 
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000 shadow-sm"
                        style={{ width: `${progress}%` }}
                      ></div>
                   </div>
                </div>
             </div>

             {/* Secondary Stats */}
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:bg-blue-50 transition">
                   <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition">
                      <PlaneLanding size={32} />
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">إجمالي الواصلين</p>
                   <p className="text-3xl font-black text-gray-800">{arrivals}</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:bg-orange-50 transition">
                   <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition">
                      <PlaneTakeoff size={32} />
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">إجمالي المغادرين</p>
                   <p className="text-3xl font-black text-gray-800">{departures}</p>
                </div>
             </div>

             {/* Footer Note */}
             <div className="p-6 rounded-[2.5rem] border flex items-center gap-4 bg-blue-50 border-blue-200 text-blue-700">
                <Target size={24} />
                <p className="text-xs font-bold leading-relaxed">
                   🔄 هذه المؤشرات حية: يتم جمع الأرصدة الافتتاحية مع العمليات الميدانية للحجاج وتحديثها بشكل لحظي.
                </p>
             </div>
          </div>

          <div className="p-8 bg-gray-50 border-t border-gray-100">
             <button 
               onClick={onClose}
               className="w-full bg-gray-800 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition"
             >
                العودة للوحة التحكم
             </button>
          </div>
       </div>
    </div>
  )
}
