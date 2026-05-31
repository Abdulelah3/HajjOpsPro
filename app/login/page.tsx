'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store/useAppStore'
import { loginUser } from '@/lib/authService'
import { Loader2, Lock, Mail, Hotel } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { centerConfig } = useAppStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await loginUser(email, password)
      toast.success('تم تسجيل الدخول بنجاح')
      router.push('/')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      toast.error('خطأ في تسجيل الدخول: ' + message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl" suppressHydrationWarning>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#228B22] text-white mb-6 shadow-lg overflow-hidden">
          {centerConfig?.systemLogo ? (
            <img src={centerConfig.systemLogo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <Hotel className="w-10 h-10" />
          )}
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">{centerConfig?.loginTitle || 'Holiday Inn Bakkah'}</h2>
        <p className="mt-2 text-sm text-gray-600 font-medium">{centerConfig?.loginSubtitle || 'نظام إدارة عمليات الحج - HajjOpsPro'}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#228B22] focus:border-[#228B22] transition-all"
                  placeholder="admin@holidayinn.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#228B22] focus:border-[#228B22] transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#228B22] focus:ring-[#228B22] border-gray-300 rounded transition"
                />
                <label className="mr-2 block text-sm text-gray-900">تذكرني</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#228B22] hover:text-[#1a6b1a] transition">
                  نسيت كلمة المرور؟
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-md text-sm font-bold text-white bg-[#228B22] hover:bg-[#1a6b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#228B22] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  centerConfig?.loginBtnText || 'تسجيل الدخول'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{centerConfig?.loginFooterText || 'أو تواصل مع الإدارة'}</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 font-bold mb-1">{centerConfig?.siteCopyright || 'Holiday Inn Bakkah - جميع الحقوق محفوظة ©'}</p>
              {(centerConfig?.showDeveloperCopyright ?? true) && (
                <p className="text-[10px] text-gray-300 font-bold">{centerConfig?.developerCopyright || 'تطوير وتشغيل النظام'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
