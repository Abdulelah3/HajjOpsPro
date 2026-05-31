'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useAppStore } from '@/lib/store/useAppStore'
import { Bus, Save, X, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CreateTripPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { addTrip } = useAppStore()

  const [formData, setFormData] = useState({
    name: '',
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    pilgrims: 0,
    status: 'في الانتظار' as const,
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await addTrip(formData)
      toast.success('تم إنشاء الرحلة بنجاح!')
      router.push('/trips')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      toast.error('حدث خطأ: ' + message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-8">
              <Link href="/trips" className="text-[#228B22] hover:underline font-medium">
                إدارة الرحلات
              </Link>
              <ArrowRight size={16} className="text-gray-400" />
              <span className="text-gray-600">إنشاء رحلة جديدة</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Bus className="w-8 h-8 text-[#228B22]" />
                إنشاء رحلة جديدة
              </h1>
              <p className="text-gray-600 mt-2">خطط لمسار الرحلة وحدد وقت الانطلاق وعدد الحجاج</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">اسم الرحلة <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: رحلة المسجد الحرام - المجموعة A"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">من (نقطة الانطلاق) <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="الفندق الرئيسي"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">إلى (الوجهة) <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="المسجد الحرام"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">التاريخ</label>
                    <input
                      required
                      type="date"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">وقت الانطلاق</label>
                    <input
                      required
                      type="time"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">عدد الحجاج المتوقع</label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.pilgrims}
                      onChange={(e) => setFormData({ ...formData, pilgrims: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">الحالة</label>
                    <select
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="في الانتظار">في الانتظار</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="مكتملة">مكتملة</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">ملاحظات إضافية</label>
                  <textarea
                    rows={3}
                    placeholder="أضف ملاحظات عن الرحلة..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                  <Link
                    href="/trips"
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                  >
                    <X className="w-5 h-5" />
                    إلغاء
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-[#228B22] hover:bg-[#1a6b1a] text-white px-8 py-2.5 rounded-lg transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    حفظ الرحلة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
