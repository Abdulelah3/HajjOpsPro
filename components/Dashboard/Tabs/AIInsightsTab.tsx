'use client'

import { useState, useEffect } from 'react'
import { Zap, Clock, AlertTriangle, Lightbulb, RefreshCw, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import { toast } from 'react-hot-toast'

interface InsightsData {
  completionEstimate: string
  peakHours: string
  risks: string[]
  recommendations: string[]
}

export default function AIInsightsTab() {
  const { pilgrims, trips, centerConfig } = useAppStore()
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const generateInsights = async () => {
    setIsLoading(true)
    try {
      const arrived = pilgrims.length
      const departed = trips.filter(t => t.movementType === 'مغادرة').reduce((acc, t) => acc + (Number(t.pilgrimsCount) || 0), 0)
      
      const context = {
        totalPilgrimsTarget: centerConfig?.totalPilgrimsTarget || 0,
        currentArrived: arrived,
        currentDeparted: departed,
        activeTripsCount: trips.length,
        groupsCount: new Set(pilgrims.map(p => p.group)).size
      }

      const res = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, apiKey: centerConfig?.aiApiKey, provider: centerConfig?.aiProvider, modelId: centerConfig?.aiModel })
      })

      const data = await res.json()
      
      if (res.ok) {
        setInsights(data)
        setLastUpdated(new Date())
        toast.success('تم تحديث التحليلات الذكية بنجاح')
      } else {
        throw new Error(data.error || 'فشل توليد التحليلات')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Load once on mount if empty
  useEffect(() => {
    if (!insights && !isLoading) {
      generateInsights()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (centerConfig && (centerConfig.aiEnabled === false || centerConfig.aiEnableInsights === false)) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800">التحليلات الذكية والتنبؤية</h2>
            <p className="text-sm font-bold text-gray-400 mt-1">
              {lastUpdated ? `آخر تحديث: ${lastUpdated.toLocaleTimeString('ar-SA')}` : 'جاري التحليل الأول...'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={generateInsights}
          disabled={isLoading}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-colors font-bold disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>تحديث التحليل</span>
        </button>
      </div>

      {isLoading && !insights ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 size={40} className="animate-spin text-purple-600" />
          <p className="font-bold text-gray-500">يقوم الذكاء الاصطناعي الآن بقراءة وتحليل بيانات المركز...</p>
        </div>
      ) : insights ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estimate */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[2.5rem] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white text-blue-600 p-2 rounded-2xl shadow-sm"><Clock size={20} /></div>
              <h3 className="font-black text-gray-800 text-lg">تنبؤات الإنجاز</h3>
            </div>
            <p className="text-gray-700 font-bold leading-relaxed">{insights.completionEstimate}</p>
          </div>

          {/* Peak */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-[2.5rem] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white text-orange-600 p-2 rounded-2xl shadow-sm"><AlertTriangle size={20} /></div>
              <h3 className="font-black text-gray-800 text-lg">أوقات الذروة المتوقعة</h3>
            </div>
            <p className="text-gray-700 font-bold leading-relaxed">{insights.peakHours}</p>
          </div>

          {/* Recommendations */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-2xl"><Lightbulb size={20} /></div>
              <h3 className="font-black text-gray-800 text-lg">توصيات الذكاء الاصطناعي</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 bg-gray-50 rounded-2xl p-4">
                  <div className="w-8 h-8 shrink-0 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black">{i+1}</div>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed pt-1">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-50 text-red-600 p-2 rounded-2xl"><AlertTriangle size={20} /></div>
              <h3 className="font-black text-gray-800 text-lg">مخاطر محتملة يجب الانتباه لها</h3>
            </div>
            <div className="space-y-3">
              {insights.risks.map((risk, i) => (
                <div key={i} className="flex items-center gap-3 bg-red-50/50 rounded-2xl p-4 border border-red-100">
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                  <p className="text-sm font-bold text-gray-700">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
