import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center" dir="rtl">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="w-16 h-16 text-[var(--color-primary)] animate-spin" />
        <p className="text-gray-500 font-black text-lg">جاري التحميل...</p>
      </div>
    </div>
  )
}
