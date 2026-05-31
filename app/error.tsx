'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-8" dir="rtl">
      <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-16 max-w-lg w-full text-center space-y-8">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={48} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">حدث خطأ غير متوقع</h2>
          <p className="text-gray-500 font-bold mt-3 leading-relaxed">
            نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.
          </p>
          {error.message && (
            <p className="text-xs text-red-400 font-mono mt-4 bg-red-50 p-3 rounded-2xl">
              {error.message}
            </p>
          )}
        </div>
        <button
          onClick={reset}
          className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
        >
          <RotateCcw size={20} />
          إعادة المحاولة
        </button>
      </div>
    </div>
  )
}
