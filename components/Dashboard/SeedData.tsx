'use client'

import { useState } from 'react'
import { addPilgrim, addTrip, addNotification } from '@/lib/firebaseService'
import { Database, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SeedData() {
  const [loading, setLoading] = useState(false)

  const seedData = async () => {
    setLoading(true)
    try {
      // 1. Seed Pilgrims
      const samplePilgrims = [
        { name: 'أحمد محمد علي', phone: '0501234567', email: 'ahmed@example.com', group: 'المجموعة A', status: 'مؤكد', passportNumber: 'P123456' },
        { name: 'فاطمة الزهراء', phone: '0559876543', email: 'fatima@example.com', group: 'المجموعة B', status: 'في الانتظار', passportNumber: 'P789012' },
        { name: 'عمر خالد', phone: '0543210987', email: 'omar@example.com', group: 'المجموعة A', status: 'مؤكد', passportNumber: 'P345678' },
        { name: 'سارة حسن', phone: '0567891234', email: 'sarah@example.com', group: 'المجموعة C', status: 'مؤكد', passportNumber: 'P901234' },
      ]

      for (const p of samplePilgrims) {
        await addPilgrim(p)
      }

      // 2. Seed Trips
      const sampleTrips = [
        { name: 'رحلة الحرم - صباحي', from: 'فندق هوليداي إن', to: 'الحرم المكي', time: '08:00 AM', pilgrims: 45, status: 'قيد التنفيذ' },
        { name: 'رحلة عرفات - تجريبية', from: 'مكة', to: 'عرفات', time: '10:00 AM', pilgrims: 50, status: 'مكتملة' },
        { name: 'رحلة المدينة - المساء', from: 'مكة', to: 'المدينة المنورة', time: '04:00 PM', pilgrims: 40, status: 'قيد التنفيذ' },
      ]

      for (const t of sampleTrips) {
        await addTrip(t as any)
      }

      // 3. Seed Notifications
      const sampleNotifications = [
        { title: 'اكتمال تسجيل الحجاج', message: 'تم تسجيل جميع حجاج المجموعة A بنجاح', type: 'info', read: false },
        { title: 'تأخير في الرحلة رقم 104', message: 'هناك تأخير لمدة 15 دقيقة بسبب الزحام', type: 'warning', read: false },
      ]

      for (const n of sampleNotifications) {
        await addNotification(n as any)
      }

      toast.success('تم ملء قاعدة البيانات بالبيانات التجريبية بنجاح!')
      window.location.reload() // Reload to show new stats
    } catch (error: unknown) {
      console.error('Error seeding data:', error)
      // إظهار الخطأ بالتحديد للمساعدة في التشخيص
      const errorMsg = (error as any)?.code === 'permission-denied' 
        ? 'تم رفض الوصول (تأكد من قواعد الحماية في Firebase)' 
        : ((error as Error)?.message || 'فشل في ملء البيانات')
      toast.error(`خطأ: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#228B22]/10 border border-[#228B22]/20 rounded-2xl p-4 flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg text-[#228B22]">
          <Database size={20} />
        </div>
        <div>
          <p className="text-[#228B22] font-bold text-sm">تنشيط قاعدة البيانات</p>
          <p className="text-[#228B22]/70 text-xs">إذا كانت لوحة التحكم فارغة، اضغط هنا لملء بيانات تجريبية.</p>
        </div>
      </div>
      <button
        onClick={seedData}
        disabled={loading}
        className="px-4 py-2 bg-[#228B22] text-white rounded-lg text-xs font-bold hover:bg-[#1a6b1a] transition flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
        ملء بيانات تجريبية
      </button>
    </div>
  )
}
