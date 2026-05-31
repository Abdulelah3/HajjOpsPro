'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useAppStore } from '@/lib/store/useAppStore'
import { Users, Save, X, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AddPilgrimPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { addPilgrim, groupConfigs } = useAppStore()

  // Use dynamic groups from store or fallback to defaults
  const groups = groupConfigs.length > 0 
    ? groupConfigs.map(g => g.name) 
    : ['القدوس', 'الكفيل', 'البر']

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    group: 'القدوس',
    status: 'مؤكد' as const,
    nationality: '',
    passport: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await addPilgrim({
        ...formData,
        registrationDate: new Date().toISOString()
      })
      toast.success('تم إضافة الحاج بنجاح!')
      router.push('/pilgrims')
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
              <Link href="/pilgrims" className="text-[#228B22] hover:underline font-medium">
                إدارة الحجاج
              </Link>
              <ArrowRight size={16} className="text-gray-400" />
              <span className="text-gray-600">إضافة حاج جديد</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8 text-[#228B22]" />
                إضافة حاج جديد
              </h1>
              <p className="text-gray-600 mt-2">أدخل بيانات الحاج بدقة لإضافته إلى النظام</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">الاسم الكامل <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="أدخل الاسم الكامل"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">رقم الهاتف <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="tel"
                      placeholder="+966501234567"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">البريد الإلكتروني</label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">المجموعة <span className="text-red-500">*</span></label>
                    <select
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.group}
                      onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    >
                      {groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">الجنسية</label>
                    <input
                      type="text"
                      placeholder="السعودية"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">رقم جواز السفر</label>
                    <input
                      type="text"
                      placeholder="أدخل رقم جواز السفر"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={formData.passport}
                      onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                  <Link
                    href="/pilgrims"
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
                    حفظ البيانات
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
