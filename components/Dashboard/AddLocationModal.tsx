'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2, MapPin } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import toast from 'react-hot-toast'
import { Location } from '@/lib/types'

interface AddLocationModalProps {
  isOpen: boolean
  onClose: () => void
  editingLocation?: Location | null
}

export default function AddLocationModal({ isOpen, onClose, editingLocation }: AddLocationModalProps) {
  const { addLocation, updateLocation } = useAppStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<Omit<Location, 'id'>>({
    name: '',
    company: '',
    pilgrimsCount: 0,
    address: '',
    lat: 21.4225,
    lng: 39.8262,
    type: 'فندق'
  })

  useEffect(() => {
    if (editingLocation) {
      setFormData({
        name: editingLocation.name || '',
        company: editingLocation.company || '',
        pilgrimsCount: editingLocation.pilgrimsCount || 0,
        address: editingLocation.address || '',
        lat: editingLocation.lat || 21.4225,
        lng: editingLocation.lng || 39.8262,
        type: editingLocation.type || 'فندق'
      })
    } else {
      setFormData({
        name: '',
        company: '',
        pilgrimsCount: 0,
        address: '',
        lat: 21.4225,
        lng: 39.8262,
        type: 'فندق'
      })
    }
  }, [editingLocation, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, formData)
        toast.success('تم تحديث الموقع بنجاح')
      } else {
        await addLocation(formData)
        toast.success('تم إضافة الموقع بنجاح')
      }
      onClose()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      toast.error('حدث خطأ: ' + message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[var(--color-primary)] p-5 flex items-center justify-between text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapPin size={20} />
            {editingLocation ? 'تعديل بيانات الموقع' : 'إضافة موقع جديد'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-soft-gray">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">اسم الموقع / الفندق</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">الشركة المشغلة</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">عدد الحجاج</label>
              <input
                required
                type="number"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none"
                value={formData.pilgrimsCount}
                onChange={(e) => setFormData({ ...formData, pilgrimsCount: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">النوع</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="فندق">فندق</option>
                <option value="مقر">مقر</option>
                <option value="موقع">موقع</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">العنوان بالتفصيل</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">خط العرض (Lat)</label>
              <input
                required
                type="number"
                step="any"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">خط الطول (Lng)</label>
              <input
                required
                type="number"
                step="any"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-2xl font-bold transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              حفظ الموقع
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
