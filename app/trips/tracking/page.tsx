'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { getTripById } from '@/lib/firebaseService'
import { Trip } from '@/lib/types'
import { MapPin, Bus, Users, Clock, Loader2, ArrowRight, Navigation } from 'lucide-react'
import Link from 'next/link'

function TrackingContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const tripId = searchParams.get('id')

  useEffect(() => {
    async function loadTrip() {
      if (tripId) {
        try {
          const data = await getTripById(tripId)
          setTrip(data)
        } catch (error) {
          console.error('Error loading trip:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    loadTrip()
  }, [tripId])

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm mb-8">
              <Link href="/trips" className="text-[#228B22] hover:underline font-medium">
                إدارة الرحلات
              </Link>
              <ArrowRight size={16} className="text-gray-400" />
              <span className="text-gray-600">تتبع الرحلة الحية</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-md">
                <Loader2 className="w-12 h-12 text-[#228B22] animate-spin mb-4" />
                <p className="text-gray-500">جاري تحميل بيانات التتبع...</p>
              </div>
            ) : trip ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-[500px] relative">
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <Navigation className="w-16 h-16 text-[#228B22] animate-pulse mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">خريطة التتبع المباشر</p>
                        <p className="text-xs text-gray-400 mt-2">يتم الآن محاكاة موقع الحافلة الفعلي...</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#228B22] rounded-full animate-ping"></div>
                        <span className="text-xs font-bold text-gray-700">مباشر: الحافلة رقم 104</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">تفاصيل الرحلة</h2>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Bus className="w-6 h-6 text-[#228B22]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">اسم الرحلة</p>
                          <p className="font-bold text-gray-900">{trip.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">المسار</p>
                          <p className="font-bold text-gray-900">{trip.from} ← {trip.to}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <Users className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">عدد الحجاج</p>
                          <p className="font-bold text-gray-900">{trip.pilgrims} حاج</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">وقت الانطلاق</p>
                          <p className="font-bold text-gray-900">{trip.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">التقدم الحالي</span>
                        <span className="text-sm font-bold text-[#228B22]">65%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-[#228B22] h-2.5 rounded-full w-[65%] shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-[#228B22] hover:bg-[#1a6b1a] text-white py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                    <Navigation className="w-5 h-5" />
                    فتح في خرائط Google
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-20 flex flex-col items-center justify-center">
                <p className="text-gray-500">لم يتم العثور على الرحلة المطلوبة</p>
                <Link href="/trips" className="mt-4 text-[#228B22] font-bold">العودة للرحلات</Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function TripTrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#228B22] animate-spin" />
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}
