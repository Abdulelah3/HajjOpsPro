'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  Home,
  UserCheck,
  MonitorPlay
} from 'lucide-react'
import { logoutUser } from '@/lib/authService'
import toast from 'react-hot-toast'
import { useAppStore } from '@/lib/store/useAppStore'

interface SubMenuItem {
  label: string
  href: string
}

interface MenuItem {
  icon: LucideIcon
  label: string
  href: string
  submenu?: SubMenuItem[]
  target?: string
}

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { centerConfig } = useAppStore()

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: centerConfig?.labelDashboard || 'لوحة القيادة',
      href: '/',
      show: centerConfig?.showDashboard ?? true,
    },
    {
      icon: Users,
      label: centerConfig?.labelPilgrims || 'الحجاج',
      href: '/pilgrims',
      show: centerConfig?.showPilgrims ?? true,
      submenu: [
        { label: 'جميع الحجاج', href: '/pilgrims' },
        { label: 'البحث والتصفية', href: '/pilgrims/search' },
      ],
    },
    {
      icon: MapPin,
      label: centerConfig?.labelTrips || 'الرحلات والحركات',
      href: '/trips',
      show: centerConfig?.showTrips ?? true,
      submenu: [
        { label: 'جميع الحركات', href: '/trips' },
        { label: 'تتبع الرحلة', href: '/trips/tracking' },
      ],
    },
    {
      icon: Home,
      label: centerConfig?.labelNusuk || 'فهرسة نُسك',
      href: '/nusuk',
      show: centerConfig?.showNusuk ?? true,
    },
    {
      icon: UserCheck,
      label: centerConfig?.labelStaff || 'الكادر البشري',
      href: '/staff',
      show: centerConfig?.showStaff ?? true,
    },
    {
      icon: FileText,
      label: centerConfig?.labelReports || 'التقارير',
      href: '/reports',
      show: centerConfig?.showReports ?? true,
      submenu: [
        { label: 'النماذج الرسمية', href: '/reports' },
        { label: 'التقارير الشاملة', href: '/reports/comprehensive' },
      ],
    },
    {
      icon: Bell,
      label: centerConfig?.labelNotifications || 'الإشعارات',
      href: '/notifications',
      show: centerConfig?.showNotifications ?? true,
    }
  ].filter(item => item.show !== false)

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu) {
      setExpandedMenu(expandedMenu === item.label ? null : item.label)
    } else {
      if (item.target === '_blank') {
        window.open(item.href, '_blank')
      } else {
        router.push(item.href)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success('تم تسجيل الخروج بنجاح')
      router.push('/login')
    } catch {
      toast.error('خطأ في تسجيل الخروج')
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" 
          onClick={() => {}}
        />
      )}
      <aside
        className={`${
          isOpen ? 'translate-x-0 w-64' : 'translate-x-full w-0'
        } text-white transition-all duration-300 overflow-hidden flex flex-col shadow-lg z-[60] h-screen fixed lg:sticky top-0 right-0 shrink-0`}
        style={{ backgroundColor: centerConfig?.primaryColor || '#1B4332' }}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {centerConfig?.systemLogo ? (
              <img src={centerConfig.systemLogo} alt="Logo" className="w-10 h-10 rounded-2xl object-contain bg-white/10 p-1 shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <Home size={22} />
              </div>
            )}
            <div className={`${!isOpen && 'opacity-0'} transition-opacity whitespace-nowrap`}>
              <h1 className="font-black text-lg">{centerConfig?.systemName || 'HajjOpsPro'}</h1>
              <p className="text-[10px] font-bold text-white/50">{centerConfig?.centerName || 'Holiday Inn Bakkah'}</p>
            </div>
          </div>
        </div>

      {/* Menu Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const isExpanded = expandedMenu === item.label
          const IconComponent = item.icon

          return (
            <div key={item.label}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-6 py-4 transition-all group ${
                  isActive ? 'bg-white/10 border-r-4 border-white' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <IconComponent size={20} className={isActive ? 'text-white' : 'text-white/60'} />
                  <span className="font-black text-sm">{item.label}</span>
                </div>
                {item.submenu && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 text-white/40 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Submenu - Simple List Style */}
              {item.submenu && isExpanded && (
                <div className="bg-black/20 py-2">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      className={`flex items-center gap-3 px-14 py-3 text-xs font-bold transition hover:text-white ${
                        pathname === subitem.href ? 'text-white' : 'text-white/50'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${pathname === subitem.href ? 'bg-white' : 'bg-white/20'}`}></div>
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 shrink-0 space-y-1">
        {(centerConfig?.showSettings ?? true) && (
          <Link
            href="/settings"
            className="flex items-center gap-4 px-6 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition"
          >
            <Settings size={18} />
            <span className="font-black text-sm">{centerConfig?.labelSettings || 'الإعدادات'}</span>
          </Link>
        )}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition"
        >
          <LogOut size={18} />
          <span className="font-black text-sm">تسجيل الخروج</span>
        </button>

        {/* Copyrights */}
        <div className="pt-4 mt-2 border-t border-white/5 text-center flex flex-col gap-1">
           <p className="text-[10px] text-white/40 font-black leading-tight">{centerConfig?.siteCopyright || 'جميع الحقوق محفوظة © 2026'}</p>
           {(centerConfig?.showDeveloperCopyright ?? true) && (
              <p className="text-[9px] text-white/30 font-bold mt-1 leading-tight">{centerConfig?.developerCopyright || 'تطوير وتشغيل النظام'}</p>
           )}
        </div>
      </div>
    </aside>
    </>
  )
}
