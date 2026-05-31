'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, Menu, User, LogOut, Settings, Loader2, MonitorPlay, Volume2, VolumeX, Maximize, Minimize, AlertTriangle } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { logoutUser } from '@/lib/authService'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import IndicatorsModal from './IndicatorsModal'
import { useAppStore } from '@/lib/store/useAppStore'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { centerConfig, notifications } = useAppStore()
  const aiAlertsCount = notifications?.filter(n => n?.title?.includes('الذكاء الاصطناعي') && !n?.read).length || 0
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showIndicators, setShowIndicators] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Live Clock Timer
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    
    return () => {
      clearInterval(timer)
      unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success('تم تسجيل الخروج بنجاح')
      router.push('/login')
    } catch (error) {
      toast.error('خطأ في تسجيل الخروج')
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => toast.error('لا يمكن تشغيل ملء الشاشة'))
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
      }
    }
  }

  const toggleSound = () => {
    setIsMuted(!isMuted)
    toast.success(!isMuted ? 'تم كتم التنبيهات الصوتية' : 'تم تفعيل التنبيهات الصوتية')
  }

  const formatDate = (date: Date) => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    return `${days[date.getDay()]} • ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false })
  }

  return (
    <>
    <nav className="bg-[var(--color-primary)] text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <Menu size={24} />
          </button>
          <div className="hidden md:flex flex-col items-start min-w-[140px] border-r border-white/10 pr-4">
            <div className="text-xl font-black leading-tight tracking-wider text-white shadow-sm">
              {mounted ? formatTime(currentTime) : '--:--:--'}
            </div>
            <div className="text-[10px] opacity-80 font-bold text-white/90">
              {mounted ? formatDate(currentTime) : 'جاري التحميل...'}
            </div>
          </div>

          <div className="flex items-center gap-2 mr-4">
            <a 
              href="/"
              className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl transition text-xs font-black border border-white/10 text-white"
            >
              <MonitorPlay size={18} />
              <span>لوحة التحكم</span>
            </a>
            
            <a 
              href="/tv"
              target="_blank"
              className="hidden md:flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-4 py-2 rounded-2xl transition text-xs font-black border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <MonitorPlay size={18} className="animate-pulse" />
              <span>شاشة العمليات (TV)</span>
            </a>

            {aiAlertsCount > 0 && (
              <a 
                href="/notifications"
                className="hidden md:flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-2xl transition text-xs font-black border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse"
              >
                <AlertTriangle size={18} />
                <span>{aiAlertsCount} تنبيه ذكي</span>
              </a>
            )}
            
            <button 
              onClick={() => setShowIndicators(true)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl transition text-xs font-black border border-white/10 text-white"
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              </div>
              <span>المؤشرات</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-xl font-black tracking-widest hidden lg:block drop-shadow-md bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-white">{centerConfig?.centerName || 'HOLIDAY INN | BAKKAH'}</span>
          </div>

          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
             <button 
               onClick={toggleSound} 
               className={`p-2 hover:bg-white/10 rounded-full transition ${isMuted ? 'text-red-400 bg-red-500/10' : 'text-white'}`}
               title={isMuted ? 'تشغيل التنبيهات الصوتية' : 'كتم التنبيهات الصوتية'}
             >
               {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
             <button 
               onClick={toggleFullscreen} 
               className={`p-2 hover:bg-white/10 rounded-full transition ${isFullscreen ? 'text-green-400 bg-green-500/10' : 'text-white'}`}
               title={isFullscreen ? 'إنهاء ملء الشاشة' : 'تكبير لملء الشاشة'}
             >
               {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
             </button>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1 hover:bg-white/10 rounded-full transition border border-white/10 pr-4"
            >
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-bold opacity-70 leading-none">مدير النظام</p>
                <p className="text-xs font-black truncate max-w-[100px]">Holiday Inn</p>
              </div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                <User size={20} />
              </div>
            </button>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                <div className="absolute left-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn z-50">
                  <div className="px-4 py-3 text-[10px] text-gray-400 border-b bg-gray-50 truncate font-bold">
                    {user?.email}
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition text-gray-700 text-sm font-black border-b"
                  >
                    <Settings size={18} />
                    <span>الإعدادات الشاملة</span>
                  </Link>
                  <button 
                    onClick={() => { setShowUserMenu(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-red-50 transition text-red-600 text-sm font-black"
                  >
                    <LogOut size={18} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    <IndicatorsModal 
      isOpen={showIndicators} 
      onClose={() => setShowIndicators(false)} 
    />
    </>
  )
}
