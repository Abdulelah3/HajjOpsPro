'use client'

import { useState } from 'react'
import { X, Save, Loader2, PlaneLanding, PlaneTakeoff } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import toast from 'react-hot-toast'
import { Trip } from '@/lib/types'

interface AddMovementModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Trip | null
}

export default function AddMovementModal({ isOpen, onClose, initialData }: AddMovementModalProps) {
  const { addTrip, updateTrip } = useAppStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<Omit<Trip, 'id'>>({
    movementType: initialData?.movementType || 'وصول',
    groupName: initialData?.groupName || '',
    flightNumber: initialData?.flightNumber || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || '08:00',
    airport: initialData?.airport || '',
    status: initialData?.status || 'تحت المعالجة',
    destination: initialData?.destination || '',
    accommodation: initialData?.accommodation || '',
    pilgrimsCount: initialData?.pilgrimsCount || 0,
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        await updateTrip(initialData.id, formData)
        toast.success('تم تحديث الحركة بنجاح')
      } else {
        await addTrip(formData)
        toast.success('تم إضافة الحركة بنجاح')
      }
      onClose()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      toast.error('حدث خطأ: ' + message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getThemeColor = () => {
    switch (formData.movementType) {
      case 'وصول': return 'bg-[var(--color-primary)]'
      case 'مغادرة': return 'bg-brand-red'
      case 'داخلي': return 'bg-blue-600'
      default: return 'bg-[var(--color-primary)]'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className={`${getThemeColor()} p-5 flex items-center justify-between text-white transition-colors duration-500`}>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">إضافة حركة جديدة</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-soft-gray">
          {/* Movement Type Tabs */}
          <div className="flex p-1 bg-gray-200 rounded-2xl">
            {(['وصول', 'داخلي', 'مغادرة'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, movementType: type })}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  formData.movementType === type 
                    ? `${getThemeColor()} text-white shadow-md` 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Group Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">اسم المجموعة</label>
              <input
                required
                type="text"
                placeholder="مثال: مجموعة ماليزيا (أ)"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-deep-green/20 outline-none transition"
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              />
            </div>

            {/* Flight Number */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">رقم/اسم الرحلة</label>
              <input
                required
                type="text"
                placeholder="مثال: SV-123"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-deep-green/20 outline-none transition"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">التاريخ</label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-deep-green/20 outline-none transition"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">الوقت</label>
              <input
                required
                type="time"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-deep-green/20 outline-none transition"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            {/* Airport */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">المطار</label>
              <input
                required
                type="text"
                placeholder="مثال: مطار الملك عبدالعزيز"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-deep-green/20 outline-none transition"
                value={formData.airport}
                onChange={(e) => setFormData({ ...formData, airport: e.target.value })}
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">الحالة</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-deep-green/20 outline-none transition appearance-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="تحت المعالجة">تحت المعالجة</option>
                <option value="تم الاعتماد">تم الاعتماد</option>
                <option value="ملغي">ملغي</option>
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">الوجهة</label>
              <input
                required
                type="text"
                placeholder="مثال: مكة المكرمة"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-deep-green/20 outline-none transition"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>

            {/* Accommodation */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">السكن</label>
              <input
                required
                type="text"
                placeholder="اسم الفندق / المركز"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-deep-green/20 outline-none transition"
                value={formData.accommodation}
                onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 ${getThemeColor()} text-white py-3 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              إضافة السجل
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition shadow-sm"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
