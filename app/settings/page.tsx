'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAppStore } from '@/lib/store/useAppStore'
import { GroupConfig, Staff, MediaItem } from '@/lib/types'
import {
  Settings as SettingsIcon,
  Users2,
  BarChart3,
  MonitorPlay,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Edit,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  History,
  Zap,
  Palette
} from 'lucide-react'
import toast from 'react-hot-toast'
import { collection, query, onSnapshot, orderBy, writeBatch, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { AuditLog } from '@/lib/firebaseService'

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('center')
  const {
    centerConfig, groupConfigs, staff, media,
    updateCenterConfig, updateGroupConfig, addGroupConfig, deleteGroupConfig, addStaff, updateStaff, deleteStaff, addMedia, updateMedia, deleteMedia
  } = useAppStore()

  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    centerName: '',
    headName: '',
    totalPilgrimsTarget: 0,
    systemName: '',
    systemLogo: '',
    systemFavicon: '',
    systemCover: '',
    primaryColor: '#1B4332',
    secondaryColor: '#143427',
    pilgrimsTerm: 'حجاج',
    tripsTerm: 'رحلات',
    reportHeader: 'نظام إدارة وتوزيع حجاج مراكز الضيافة',
    // CMS Sidebar Labels & Visibility
    labelDashboard: 'لوحة القيادة', showDashboard: true,
    labelPilgrims: 'الحجاج', showPilgrims: true,
    labelTrips: 'الرحلات والحركات', showTrips: true,
    labelNusuk: 'فهرسة نُسك', showNusuk: true,
    labelStaff: 'الكادر البشري', showStaff: true,
    labelReports: 'التقارير', showReports: true,
    labelNotifications: 'الإشعارات', showNotifications: true,
    labelSettings: 'الإعدادات', showSettings: true,
    // CMS Dashboard Tabs
    labelTabStats: 'الإحصائيات العامة', showTabStats: true,
    labelTabMovements: 'التحركات الميدانية', showTabMovements: true,
    labelTabMaps: 'المواقع والخرائط', showTabMaps: true,
    labelTabOrg: 'الهيكل التنظيمي', showTabOrg: true,
    labelTabMedia: 'المركز الإعلامي', showTabMedia: true,
    // CMS Subpages Titles
    titlePilgrimsPage: 'إدارة شؤون الحجاج', subPilgrimsPage: 'سجل شامل ودقيق لجميع بيانات ضيوف الرحمن وتوزيعهم الفندقي',
    titleTripsPage: 'حركة التفويج والرحلات', subTripsPage: 'متابعة دقيقة لكافة تحركات ضيوف الرحمن ميدانياً',
    titleNusukPage: 'فهرسة بطاقات نُسك', subNusukPage: 'أرشفة إلكترونية شاملة لبطاقات نُسك وجوازات السفر للحجاج',
    // CMS Buttons
    btnPilgrimAdd: 'إضافة حاج جديد',
    btnPilgrimUpload: 'رفع ملف Excel',
    btnTripAdd: 'إضافة حركة جديدة',
    // CMS Login Page
    loginTitle: 'Holiday Inn Bakkah',
    loginSubtitle: 'نظام إدارة عمليات الحج - HajjOpsPro',
    loginBtnText: 'تسجيل الدخول',
    loginFooterText: 'أو تواصل مع الإدارة',
    loginCopyright: 'Holiday Inn Bakkah - جميع الحقوق محفوظة',
    siteCopyright: 'جميع الحقوق محفوظة © 2026',
    developerCopyright: 'تطوير وتشغيل النظام بواسطة ...',
    showDeveloperCopyright: true,
    // Theme Colors & Shapes
    themePrimaryColor: '#1B4332',
    themeSecondaryColor: '#BC4749',
    themeBackgroundColor: '#F8F9F7',
    themeSurfaceColor: '#FFFFFF',
    themeTextColor: '#1F2937',
    themeCardRadius: '1.5rem',
    themeButtonRadius: '0.75rem',
    // TV command center config
    tvTitle: '',
    tvSubtitle: '',
    tvRadarTitle: '',
    tvLiveBadgeText: '',
    tvShowTarget: true,
    tvLabelTarget: '',
    tvShowPresent: true,
    tvLabelPresent: '',
    tvShowArrived: true,
    tvLabelArrived: '',
    tvShowDeparted: true,
    tvLabelDeparted: '',
    tvHeaderBgColor: '#1B4332',
    tvHeaderTextColor: '#ffffff',
    tvPageBgColor: '#F0F4F8',
    tvActiveTripsPastHours: 2,
    tvActiveTripsFutureHours: 6,
    aiEnabled: true,
    aiProvider: 'gemini' as 'gemini' | 'openai' | 'groq' | 'anthropic' | 'openrouter',
    aiModel: '',
    aiApiKey: '',
    aiEnableChat: true,
    aiEnableOcr: true,
    aiEnableInsights: true,
    aiEnableAnomalies: true,
    aiEnableTranslation: true,
  })
  const [statsForm, setStatsForm] = useState({
    manualArrived: 0,
    manualDeparted: 0,
    manualMakkah: 0,
    manualMadina: 0,
    manualPresent: 0,
    manualRemaining: 0,
  })

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    setLoading(false)
    const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog))
      setAuditLogs(logs)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (centerConfig) {
      setFormData({
        centerName: centerConfig.centerName || '',
        headName: centerConfig.headName || '',
        totalPilgrimsTarget: centerConfig.totalPilgrimsTarget || 0,
        systemName: centerConfig.systemName || 'HajjOpsPro',
        systemLogo: centerConfig.systemLogo || '',
        systemFavicon: centerConfig.systemFavicon || '',
        systemCover: centerConfig.systemCover || '',
        primaryColor: centerConfig.primaryColor || '#1B4332',
        secondaryColor: centerConfig.secondaryColor || '#143427',
        pilgrimsTerm: centerConfig.pilgrimsTerm || 'حجاج',
        tripsTerm: centerConfig.tripsTerm || 'رحلات',
        reportHeader: centerConfig.reportHeader || 'نظام إدارة وتوزيع حجاج مراكز الضيافة',
        // CMS Sidebar
        labelDashboard: centerConfig.labelDashboard || 'لوحة القيادة', showDashboard: centerConfig.showDashboard ?? true,
        labelPilgrims: centerConfig.labelPilgrims || 'الحجاج', showPilgrims: centerConfig.showPilgrims ?? true,
        labelTrips: centerConfig.labelTrips || 'الرحلات والحركات', showTrips: centerConfig.showTrips ?? true,
        labelNusuk: centerConfig.labelNusuk || 'فهرسة نُسك', showNusuk: centerConfig.showNusuk ?? true,
        labelStaff: centerConfig.labelStaff || 'الكادر البشري', showStaff: centerConfig.showStaff ?? true,
        labelReports: centerConfig.labelReports || 'التقارير', showReports: centerConfig.showReports ?? true,
        labelNotifications: centerConfig.labelNotifications || 'الإشعارات', showNotifications: centerConfig.showNotifications ?? true,
        labelSettings: centerConfig.labelSettings || 'الإعدادات', showSettings: centerConfig.showSettings ?? true,
        // CMS Dashboard Tabs
        labelTabStats: centerConfig.labelTabStats || 'الإحصائيات العامة', showTabStats: centerConfig.showTabStats ?? true,
        labelTabMovements: centerConfig.labelTabMovements || 'التحركات الميدانية', showTabMovements: centerConfig.showTabMovements ?? true,
        labelTabMaps: centerConfig.labelTabMaps || 'المواقع والخرائط', showTabMaps: centerConfig.showTabMaps ?? true,
        labelTabOrg: centerConfig.labelTabOrg || 'الهيكل التنظيمي', showTabOrg: centerConfig.showTabOrg ?? true,
        labelTabMedia: centerConfig.labelTabMedia || 'المركز الإعلامي', showTabMedia: centerConfig.showTabMedia ?? true,
        // CMS Subpages Titles
        titlePilgrimsPage: centerConfig.titlePilgrimsPage || 'إدارة شؤون الحجاج', subPilgrimsPage: centerConfig.subPilgrimsPage || 'سجل شامل ودقيق لجميع بيانات ضيوف الرحمن وتوزيعهم الفندقي',
        titleTripsPage: centerConfig.titleTripsPage || 'حركة التفويج والرحلات', subTripsPage: centerConfig.subTripsPage || 'متابعة دقيقة لكافة تحركات ضيوف الرحمن ميدانياً',
        titleNusukPage: centerConfig.titleNusukPage || 'فهرسة بطاقات نُسك', subNusukPage: centerConfig.subNusukPage || 'أرشفة إلكترونية شاملة لبطاقات نُسك وجوازات السفر للحجاج',
        // CMS Buttons
        btnPilgrimAdd: centerConfig.btnPilgrimAdd || 'إضافة حاج جديد',
        btnPilgrimUpload: centerConfig.btnPilgrimUpload || 'رفع ملف Excel',
        btnTripAdd: centerConfig.btnTripAdd || 'إضافة حركة جديدة',
        // CMS Login Page
        loginTitle: centerConfig.loginTitle || 'Holiday Inn Bakkah',
        loginSubtitle: centerConfig.loginSubtitle || 'نظام إدارة عمليات الحج - HajjOpsPro',
        loginBtnText: centerConfig.loginBtnText || 'تسجيل الدخول',
        loginFooterText: centerConfig.loginFooterText || 'أو تواصل مع الإدارة',
        loginCopyright: centerConfig.loginCopyright || 'Holiday Inn Bakkah - جميع الحقوق محفوظة',
        siteCopyright: centerConfig.siteCopyright || 'جميع الحقوق محفوظة © 2026',
        developerCopyright: centerConfig.developerCopyright || 'تطوير وتشغيل النظام بواسطة ...',
        showDeveloperCopyright: centerConfig.showDeveloperCopyright ?? true,
        // Theme Colors & Shapes
        themePrimaryColor: centerConfig.themePrimaryColor || '#1B4332',
        themeSecondaryColor: centerConfig.themeSecondaryColor || '#BC4749',
        themeBackgroundColor: centerConfig.themeBackgroundColor || '#F8F9F7',
        themeSurfaceColor: centerConfig.themeSurfaceColor || '#FFFFFF',
        themeTextColor: centerConfig.themeTextColor || '#1F2937',
        themeCardRadius: centerConfig.themeCardRadius || '1.5rem',
        themeButtonRadius: centerConfig.themeButtonRadius || '0.75rem',
        // TV Command Center Customizations
        tvTitle: centerConfig.tvTitle || '',
        tvSubtitle: centerConfig.tvSubtitle || '',
        tvRadarTitle: centerConfig.tvRadarTitle || '',
        tvLiveBadgeText: centerConfig.tvLiveBadgeText || '',
        tvShowTarget: centerConfig.tvShowTarget ?? true,
        tvLabelTarget: centerConfig.tvLabelTarget || '',
        tvShowPresent: centerConfig.tvShowPresent ?? true,
        tvLabelPresent: centerConfig.tvLabelPresent || '',
        tvShowArrived: centerConfig.tvShowArrived ?? true,
        tvLabelArrived: centerConfig.tvLabelArrived || '',
        tvShowDeparted: centerConfig.tvShowDeparted ?? true,
        tvLabelDeparted: centerConfig.tvLabelDeparted || '',
        tvHeaderBgColor: centerConfig.tvHeaderBgColor || '#1B4332',
        tvHeaderTextColor: centerConfig.tvHeaderTextColor || '#ffffff',
        tvPageBgColor: centerConfig.tvPageBgColor || '#F0F4F8',
        tvActiveTripsPastHours: centerConfig.tvActiveTripsPastHours !== undefined ? Number(centerConfig.tvActiveTripsPastHours) : 2,
        tvActiveTripsFutureHours: centerConfig.tvActiveTripsFutureHours !== undefined ? Number(centerConfig.tvActiveTripsFutureHours) : 6,
        aiEnabled: centerConfig.aiEnabled ?? true,
        aiProvider: centerConfig.aiProvider || 'gemini',
        aiModel: centerConfig.aiModel || '',
        aiApiKey: centerConfig.aiApiKey || '',
        aiEnableChat: centerConfig.aiEnableChat ?? true,
        aiEnableOcr: centerConfig.aiEnableOcr ?? true,
        aiEnableInsights: centerConfig.aiEnableInsights ?? true,
        aiEnableAnomalies: centerConfig.aiEnableAnomalies ?? true,
        aiEnableTranslation: centerConfig.aiEnableTranslation ?? true,
      })
      setStatsForm({
        manualArrived: centerConfig.manualArrived || 0,
        manualDeparted: centerConfig.manualDeparted || 0,
        manualMakkah: centerConfig.manualMakkah || 0,
        manualMadina: centerConfig.manualMadina || 0,
        manualPresent: centerConfig.manualPresent || 0,
        manualRemaining: centerConfig.manualRemaining || 0,
      })
    }
  }, [centerConfig])

  const handleUpdateCenter = async () => {
    try {
      let dataToSave = { ...formData }

      // Encrypt the AI API key before saving to Firestore
      if (dataToSave.aiApiKey && dataToSave.aiApiKey.trim() && !dataToSave.aiApiKey.includes(':')) {
        // Only encrypt if the key looks like a raw (unencrypted) key
        try {
          const encRes = await fetch('/api/settings/encrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: dataToSave.aiApiKey })
          })
          const encData = await encRes.json()
          if (encRes.ok && encData.encrypted) {
            dataToSave = { ...dataToSave, aiApiKey: encData.encrypted }
          }
        } catch (encErr) {
          console.warn('Could not encrypt API key, saving as-is:', encErr)
        }
      }

      await updateCenterConfig(centerConfig?.id || '', dataToSave)
      toast.success('تم تحديث بيانات المركز بنجاح')
    } catch (e) {
      console.error(e)
      toast.error('خطأ في التحديث')
    }
  }

  const handleUpdateGroup = async (id: string, data: Partial<GroupConfig>) => {
    try {
      await updateGroupConfig(id, data)
      toast.success('تم تحديث المجموعة')
    } catch (e) {
      toast.error('خطأ في التحديث')
    }
  }

  const moveStaff = async (index: number, direction: 'up' | 'down') => {
    const sortedStaff = [...staff].sort((a, b) => (a.order || 0) - (b.order || 0))
    const newOrderArray = sortedStaff.map(s => s.id)
    
    if (direction === 'up' && index > 0) {
      [newOrderArray[index - 1], newOrderArray[index]] = [newOrderArray[index], newOrderArray[index - 1]]
    } else if (direction === 'down' && index < newOrderArray.length - 1) {
      [newOrderArray[index + 1], newOrderArray[index]] = [newOrderArray[index], newOrderArray[index + 1]]
    } else {
      return
    }

    try {
      const promises = newOrderArray.map((id, newIndex) => updateStaff(id, { order: newIndex }))
      await Promise.all(promises)
    } catch (e) {
      toast.error('حدث خطأ أثناء الترتيب')
    }
  }
  const handleClearLogs = async () => {
    if (!confirm('هل أنت متأكد من مسح جميع سجلات الحركات والأمان؟ لا يمكن التراجع عن هذا الإجراء.')) return
    try {
      const q = query(collection(db, 'audit_logs'))
      const snapshot = await getDocs(q)
      const batch = writeBatch(db)
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref)
      })
      await batch.commit()
      toast.success('تم مسح السجلات بنجاح')
    } catch (e) {
      console.error(e)
      toast.error('فشل مسح السجلات')
    }
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F0F4F8]" dir="rtl">
      <Loader2 className="animate-spin text-[var(--color-primary)] w-12 h-12" />
    </div>
  )

  const handleToggleStatsMode = async () => {
    const newMode = centerConfig?.statsMode === 'manual' ? 'auto' : 'manual'
    await updateCenterConfig(centerConfig?.id || '', { statsMode: newMode })
    toast.success(newMode === 'manual' ? 'تم التبديل للوضع اليدوي' : 'تم التبديل للوضع التلقائي')
  }

  const handleSaveStats = async () => {
    await updateCenterConfig(centerConfig?.id || '', { ...statsForm, statsMode: 'manual' })
    toast.success('تم حفظ الإحصائيات بنجاح')
  }

  const sections = [
    { id: 'center', label: 'تحكم في الموقع', icon: <SettingsIcon size={20} /> },
    { id: 'theme', label: 'تصميم وهوية الموقع', icon: <Palette size={20} /> },
    { id: 'ai', label: 'الذكاء الاصطناعي', icon: <Zap size={20} /> },
    { id: 'tv', label: 'شاشة التلفزيون (TV Mode)', icon: <MonitorPlay size={20} /> },
    { id: 'stats', label: 'إدارة الإحصائيات', icon: <TrendingUp size={20} /> },
    { id: 'groups', label: 'إدارة المجموعات', icon: <BarChart3 size={20} /> },
    { id: 'staff', label: 'الهيكل التنظيمي', icon: <Users2 size={20} /> },
    { id: 'media', label: 'الوسائط والإعلانات', icon: <ImageIcon size={20} /> },
    { id: 'logs', label: 'سجل الحركات والأمان', icon: <History size={20} /> },
  ]

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-l border-gray-100 flex flex-row lg:flex-col p-4 gap-2 overflow-x-auto lg:overflow-x-visible shrink-0">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeSection === s.id ? 'bg-[var(--color-primary)] text-white shadow-xl lg:translate-x-[-8px]' : 'text-gray-400 hover:bg-gray-50'
                  }`}
              >
                {s.icon}
                {s.label}
                {activeSection === s.id && <ChevronRight size={16} className="mr-auto hidden lg:block" />}
              </button>
            ))}
          </div>

          <main className="flex-1 overflow-y-auto p-10">
            <div className="max-w-4xl mx-auto space-y-8">

              {activeSection === 'center' && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-10 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-black text-gray-800">تحكم في الموقع (White-Label SaaS)</h2>
                    <p className="text-gray-400 text-sm font-bold mt-1">تخصيص شامل للهوية، الأسماء، الألوان، والمصطلحات لبيع أو تسليم النظام لأي منشأة أخرى</p>
                  </div>

                  <div className="space-y-8">
                    {/* 1. الأسماء الأساسية */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🏷️</span> الأسماء الرئيسية للمنشأة والنظام
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">اسم المنشأة / الفندق</label>
                          <input
                            type="text"
                            value={formData.centerName}
                            onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                            placeholder="مثال: هوليداي إن بكة، فندق مكة الكبرى..."
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">اسم النظام الرئيسي (البراند)</label>
                          <input
                            type="text"
                            value={formData.systemName}
                            onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                            placeholder="مثال: HajjOpsPro, MakkahOps..."
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">اسم رئيس المركز / المدير العام</label>
                          <input
                            type="text"
                            value={formData.headName}
                            onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">العدد المستهدف للحجاج / الضيوف</label>
                          <input
                            type="number"
                            value={formData.totalPilgrimsTarget}
                            onChange={(e) => setFormData({ ...formData, totalPilgrimsTarget: parseInt(e.target.value) || 0 })}
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800 text-right"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. تخصيص المصطلحات */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🔤</span> تخصيص المصطلحات (لتناسب الفنادق، العمرة، أو الحج)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">مصطلح النزلاء (حجاج / معتمرين / ضيوف)</label>
                          <input
                            type="text"
                            value={formData.pilgrimsTerm}
                            onChange={(e) => setFormData({ ...formData, pilgrimsTerm: e.target.value })}
                            placeholder="مثال: حجاج"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">مصطلح التحركات (رحلات / تفويج / تنقلات)</label>
                          <input
                            type="text"
                            value={formData.tripsTerm}
                            onChange={(e) => setFormData({ ...formData, tripsTerm: e.target.value })}
                            placeholder="مثال: رحلات"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. تخصيص الألوان */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🎨</span> تخصيص الألوان والهوية البصرية
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">اللون الأساسي (Primary Color)</label>
                          <div className="flex items-center gap-4 bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
                            <input
                              type="color"
                              value={formData.primaryColor}
                              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                              className="w-12 h-12 rounded-2xl cursor-pointer border-0 outline-none"
                            />
                            <input
                              type="text"
                              value={formData.primaryColor}
                              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                              className="flex-1 bg-transparent border-none outline-none font-black text-gray-800 text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">اللون الثانوي (Secondary Color)</label>
                          <div className="flex items-center gap-4 bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
                            <input
                              type="color"
                              value={formData.secondaryColor}
                              onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                              className="w-12 h-12 rounded-2xl cursor-pointer border-0 outline-none"
                            />
                            <input
                              type="text"
                              value={formData.secondaryColor}
                              onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                              className="flex-1 bg-transparent border-none outline-none font-black text-gray-800 text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. تخصيص الصور والشعارات */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🖼️</span> تخصيص الصور والشعارات (Logos & Covers)
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">رابط صورة الشعار (Logo URL)</label>
                          <input
                            type="text"
                            value={formData.systemLogo}
                            onChange={(e) => setFormData({ ...formData, systemLogo: e.target.value })}
                            placeholder="https://example.com/logo.png"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800 text-left"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">رابط صورة الغلاف الترحيبية (Cover URL)</label>
                          <input
                            type="text"
                            value={formData.systemCover}
                            onChange={(e) => setFormData({ ...formData, systemCover: e.target.value })}
                            placeholder="https://example.com/cover.jpg"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800 text-left"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">ترويسة التقارير الرسمية (للطباعة)</label>
                          <input
                            type="text"
                            value={formData.reportHeader}
                            onChange={(e) => setFormData({ ...formData, reportHeader: e.target.value })}
                            placeholder="مثال: نظام إدارة وتوزيع حجاج مراكز الضيافة"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5. تخصيص القائمة الجانبية (إخفاء/إظهار وتغيير المسميات) */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🗂️</span> تخصيص أزرار القائمة الجانبية (تغيير المسمى + إخفاء/إظهار)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { key: 'Dashboard', defaultLabel: 'لوحة القيادة' },
                          { key: 'Pilgrims', defaultLabel: 'الحجاج' },
                          { key: 'Trips', defaultLabel: 'الرحلات والحركات' },
                          { key: 'Nusuk', defaultLabel: 'فهرسة نُسك' },
                          { key: 'Staff', defaultLabel: 'الكادر البشري' },
                          { key: 'Reports', defaultLabel: 'التقارير' },
                          { key: 'Notifications', defaultLabel: 'الإشعارات' },
                          { key: 'Settings', defaultLabel: 'الإعدادات' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center gap-4 bg-white p-4 border border-gray-200 rounded-2xl shadow-sm justify-between">
                            <div className="flex-1 space-y-1">
                              <label className="block text-right font-black text-gray-400 text-xs mr-2">{item.defaultLabel}</label>
                              <input
                                type="text"
                                value={(formData as Record<string, any>)[`label${item.key}`]}
                                onChange={(e) => setFormData({ ...formData, [`label${item.key}`]: e.target.value })}
                                className="w-full bg-transparent border-none outline-none font-black text-gray-800 text-right text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, [`show${item.key}`]: !(formData as Record<string, any>)[`show${item.key}`] })}
                              className={`px-4 py-2 rounded-2xl font-black text-xs transition ${(formData as Record<string, any>)[`show${item.key}`] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                            >
                              {(formData as Record<string, any>)[`show${item.key}`] ? 'ظاهر 👁️' : 'مخفي 🚫'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 6. تخصيص تبويبات الصفحة الرئيسية (إخفاء/إظهار وتغيير المسميات) */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🖥️</span> تخصيص تبويبات لوحة التحكم (تغيير المسمى + إخفاء/إظهار)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { key: 'TabStats', defaultLabel: 'الإحصائيات العامة' },
                          { key: 'TabMovements', defaultLabel: 'التحركات الميدانية' },
                          { key: 'TabMaps', defaultLabel: 'المواقع والخرائط' },
                          { key: 'TabOrg', defaultLabel: 'الهيكل التنظيمي' },
                          { key: 'TabMedia', defaultLabel: 'المركز الإعلامي' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center gap-4 bg-white p-4 border border-gray-200 rounded-2xl shadow-sm justify-between">
                            <div className="flex-1 space-y-1">
                              <label className="block text-right font-black text-gray-400 text-xs mr-2">{item.defaultLabel}</label>
                              <input
                                type="text"
                                value={(formData as Record<string, any>)[`label${item.key}`]}
                                onChange={(e) => setFormData({ ...formData, [`label${item.key}`]: e.target.value })}
                                className="w-full bg-transparent border-none outline-none font-black text-gray-800 text-right text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, [`show${item.key}`]: !(formData as Record<string, any>)[`show${item.key}`] })}
                              className={`px-4 py-2 rounded-2xl font-black text-xs transition ${(formData as Record<string, any>)[`show${item.key}`] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                            >
                              {(formData as Record<string, any>)[`show${item.key}`] ? 'ظاهر 👁️' : 'مخفي 🚫'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 7. تخصيص عناوين ووصف الصفحات الفرعية والأزرار */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>📄</span> تخصيص عناوين الصفحات الفرعية ونصوص الأزرار
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <label className="block text-right font-black text-[var(--color-primary)] text-xs">عنوان صفحة الحجاج الرئيسي</label>
                            <input type="text" value={formData.titlePilgrimsPage} onChange={(e) => setFormData({ ...formData, titlePilgrimsPage: e.target.value })} className="w-full font-black text-sm outline-none" />
                            <input type="text" value={formData.subPilgrimsPage} onChange={(e) => setFormData({ ...formData, subPilgrimsPage: e.target.value })} className="w-full text-xs text-gray-400 outline-none mt-2 border-t pt-2" />
                          </div>
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <label className="block text-right font-black text-[var(--color-primary)] text-xs">عنوان صفحة الرحلات الرئيسي</label>
                            <input type="text" value={formData.titleTripsPage} onChange={(e) => setFormData({ ...formData, titleTripsPage: e.target.value })} className="w-full font-black text-sm outline-none" />
                            <input type="text" value={formData.subTripsPage} onChange={(e) => setFormData({ ...formData, subTripsPage: e.target.value })} className="w-full text-xs text-gray-400 outline-none mt-2 border-t pt-2" />
                          </div>
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <label className="block text-right font-black text-[var(--color-primary)] text-xs">عنوان صفحة نُسك الرئيسي</label>
                            <input type="text" value={formData.titleNusukPage} onChange={(e) => setFormData({ ...formData, titleNusukPage: e.target.value })} className="w-full font-black text-sm outline-none" />
                            <input type="text" value={formData.subNusukPage} onChange={(e) => setFormData({ ...formData, subNusukPage: e.target.value })} className="w-full text-xs text-gray-400 outline-none mt-2 border-t pt-2" />
                          </div>
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <label className="block text-right font-black text-[var(--color-primary)] text-xs">نصوص الأزرار الرئيسية</label>
                            <div className="space-y-2 pt-1 border-t">
                              <div className="flex items-center justify-between text-xs font-black"><span className="text-gray-400">زر إضافة حاج:</span><input type="text" value={formData.btnPilgrimAdd} onChange={(e) => setFormData({ ...formData, btnPilgrimAdd: e.target.value })} className="text-left font-black text-[var(--color-primary)] outline-none w-32" /></div>
                              <div className="flex items-center justify-between text-xs font-black"><span className="text-gray-400">زر رفع Excel:</span><input type="text" value={formData.btnPilgrimUpload} onChange={(e) => setFormData({ ...formData, btnPilgrimUpload: e.target.value })} className="text-left font-black text-[var(--color-primary)] outline-none w-32" /></div>
                              <div className="flex items-center justify-between text-xs font-black"><span className="text-gray-400">زر إضافة حركة:</span><input type="text" value={formData.btnTripAdd} onChange={(e) => setFormData({ ...formData, btnTripAdd: e.target.value })} className="text-left font-black text-[var(--color-primary)] outline-none w-32" /></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 8. تخصيص صفحة تسجيل الدخول */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🔐</span> تخصيص صفحة تسجيل الدخول (Login Page Customizer)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                          <label className="block text-right font-black text-[var(--color-primary)] text-xs">عنوان صفحة الدخول (الاسم الرئيسي)</label>
                          <input type="text" value={formData.loginTitle} onChange={(e) => setFormData({ ...formData, loginTitle: e.target.value })} placeholder="Holiday Inn Bakkah" className="w-full font-black text-sm outline-none border-b pb-2 focus:border-[var(--color-primary)]" />
                        </div>
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                          <label className="block text-right font-black text-[var(--color-primary)] text-xs">الوصف الفرعي لصفحة الدخول</label>
                          <input type="text" value={formData.loginSubtitle} onChange={(e) => setFormData({ ...formData, loginSubtitle: e.target.value })} placeholder="نظام إدارة عمليات الحج - HajjOpsPro" className="w-full font-bold text-sm text-gray-600 outline-none border-b pb-2 focus:border-[var(--color-primary)]" />
                        </div>
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                          <label className="block text-right font-black text-[var(--color-primary)] text-xs">نص زر الدخول</label>
                          <input type="text" value={formData.loginBtnText} onChange={(e) => setFormData({ ...formData, loginBtnText: e.target.value })} placeholder="تسجيل الدخول" className="w-full font-black text-sm outline-none border-b pb-2 focus:border-[var(--color-primary)]" />
                        </div>
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                          <label className="block text-right font-black text-[var(--color-primary)] text-xs">نص المساعدة أسفل النموذج</label>
                          <input type="text" value={formData.loginFooterText} onChange={(e) => setFormData({ ...formData, loginFooterText: e.target.value })} placeholder="أو تواصل مع الإدارة" className="w-full font-bold text-sm text-gray-500 outline-none border-b pb-2 focus:border-[var(--color-primary)]" />
                        </div>
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm md:col-span-2">
                          <label className="block text-right font-black text-[var(--color-primary)] text-xs">حقوق النشر (Copyright)</label>
                          <input type="text" value={formData.loginCopyright} onChange={(e) => setFormData({ ...formData, loginCopyright: e.target.value })} placeholder="Holiday Inn Bakkah - جميع الحقوق محفوظة" className="w-full font-bold text-xs text-gray-400 outline-none border-b pb-2 focus:border-[var(--color-primary)]" />
                        </div>
                      </div>
                    </div>

                    {/* حقوق الموقع والملكية */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>⚖️</span> حقوق الموقع والملكية (الفوتر)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">نص حقوق الموقع</label>
                          <input
                            type="text"
                            value={formData.siteCopyright}
                            onChange={(e) => setFormData({ ...formData, siteCopyright: e.target.value })}
                            placeholder="مثال: جميع الحقوق محفوظة لمركز كذا..."
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">نص حقوق المطور / الشركة</label>
                          <input
                            type="text"
                            value={formData.developerCopyright}
                            onChange={(e) => setFormData({ ...formData, developerCopyright: e.target.value })}
                            placeholder="مثال: تم التطوير بواسطة كذا..."
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="flex items-center gap-4 bg-white p-4 border border-gray-200 rounded-2xl shadow-sm justify-between col-span-1 md:col-span-2">
                          <span className="font-black text-gray-800 text-sm">إظهار حقوق المطور في الفوتر</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, showDeveloperCopyright: !formData.showDeveloperCopyright })}
                            className={`px-4 py-2 rounded-2xl font-black text-xs transition ${formData.showDeveloperCopyright ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {formData.showDeveloperCopyright ? 'ظاهر 👁️' : 'مخفي 🚫'}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="flex justify-start">
                    <button
                      onClick={handleUpdateCenter}
                      className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Save size={24} />
                      حفظ التعديلات وتطبيق الهوية
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'theme' && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-10 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-black text-gray-800">تصميم وهوية الموقع (Theme Builder)</h2>
                    <p className="text-gray-400 text-sm font-bold mt-1">تحكم كامل ومفصل في ألوان وزوايا وانحناءات واجهة النظام بالكامل</p>
                  </div>
                  <div className="space-y-8">
                     {/* Colors */}
                     <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                        <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2"><span>🎨</span> الألوان الرئيسية (Colors)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {[
                              { key: 'themePrimaryColor', label: 'اللون الأساسي (Primary)' },
                              { key: 'themeSecondaryColor', label: 'اللون الثانوي (Secondary)' },
                              { key: 'themeBackgroundColor', label: 'لون الخلفية (Background)' },
                              { key: 'themeSurfaceColor', label: 'لون الكروت والأسطح (Surface)' },
                              { key: 'themeTextColor', label: 'لون النصوص الأساسي (Text)' },
                           ].map(color => (
                             <div key={color.key} className="space-y-3">
                               <label className="block text-right font-black text-gray-500 text-sm mr-2">{color.label}</label>
                               <div className="flex items-center gap-4 bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
                                 <input type="color" value={(formData as any)[color.key]} onChange={e => setFormData({ ...formData, [color.key]: e.target.value })} className="w-12 h-12 rounded-2xl cursor-pointer border-0 outline-none" />
                                 <input type="text" value={(formData as any)[color.key]} onChange={e => setFormData({ ...formData, [color.key]: e.target.value })} className="flex-1 bg-transparent border-none outline-none font-black text-gray-800 text-left text-xs" dir="ltr" />
                               </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     {/* Borders & Corners */}
                     <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                        <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2"><span>📐</span> الانحناءات والزوايا (Border Radius)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-3">
                             <label className="block text-right font-black text-gray-500 text-sm mr-2">انحناء الكروت (Cards)</label>
                             <select value={formData.themeCardRadius} onChange={e => setFormData({ ...formData, themeCardRadius: e.target.value })} className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm font-black text-gray-800">
                               <option value="0px">زوايا حادة (0px)</option>
                               <option value="0.5rem">انحناء خفيف (8px)</option>
                               <option value="1rem">انحناء متوسط (16px)</option>
                               <option value="1.5rem">انحناء دائري ملحوظ (24px)</option>
                               <option value="2.5rem">دائري تماماً (40px)</option>
                             </select>
                           </div>
                           <div className="space-y-3">
                             <label className="block text-right font-black text-gray-500 text-sm mr-2">انحناء الأزرار (Buttons)</label>
                             <select value={formData.themeButtonRadius} onChange={e => setFormData({ ...formData, themeButtonRadius: e.target.value })} className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm font-black text-gray-800">
                               <option value="0px">زوايا حادة (0px)</option>
                               <option value="0.5rem">انحناء خفيف (8px)</option>
                               <option value="0.75rem">انحناء متوسط (12px)</option>
                               <option value="9999px">دائري كامل (Pill)</option>
                             </select>
                           </div>
                        </div>
                     </div>

                  </div>
                  <div className="flex justify-start">
                    <button onClick={handleUpdateCenter} className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                      <Save size={24} />
                      حفظ التعديلات وتطبيق الهوية
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'ai' && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-10 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-black text-gray-800">إعدادات الذكاء الاصطناعي (AI)</h2>
                    <p className="text-gray-400 text-sm font-bold mt-1">تحكم كامل في ميزات الذكاء الاصطناعي ومفتاح الـ API الخاص بك</p>
                  </div>

                  <div className="space-y-8">
                    {/* 1. إعدادات المفتاح */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🔑</span> إعدادات الربط والـ API
                      </h3>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">مزود الذكاء الاصطناعي (AI Provider)</label>
                        <select
                          value={formData.aiProvider || 'gemini'}
                          onChange={(e) => setFormData(prev => ({ ...prev, aiProvider: e.target.value as any }))}
                          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-right bg-white outline-none focus:border-purple-500 font-bold transition-colors"
                        >
                          <option value="gemini">Google Gemini</option>
                          <option value="openai">OpenAI (ChatGPT)</option>
                          <option value="groq">Groq</option>
                          <option value="anthropic">Anthropic (Claude)</option>
                          <option value="openrouter">OpenRouter</option>
                        </select>
                      </div>

                      {formData.aiProvider !== 'openrouter' ? (
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">الموديل (AI Model)</label>
                          <select
                            value={formData.aiModel || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, aiModel: e.target.value }))}
                            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-right bg-white outline-none focus:border-purple-500 font-bold transition-colors"
                          >
                            <option value="">الافتراضي للمزود</option>
                            {formData.aiProvider === 'gemini' && (
                              <>
                                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                              </>
                            )}
                            {formData.aiProvider === 'openai' && (
                              <>
                                <option value="gpt-4o">GPT-4o</option>
                                <option value="gpt-4o-mini">GPT-4o Mini</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                              </>
                            )}
                            {formData.aiProvider === 'groq' && (
                              <>
                                <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant</option>
                                <option value="llama-3.1-70b-versatile">Llama 3.1 70B Versatile</option>
                                <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
                                <option value="mixtral-8x7b-32768">Mixtral 8x7b</option>
                              </>
                            )}
                            {formData.aiProvider === 'anthropic' && (
                              <>
                                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                                <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
                                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                              </>
                            )}
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">معرف الموديل (OpenRouter Model ID)</label>
                          <input
                            type="text"
                            value={formData.aiModel || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, aiModel: e.target.value }))}
                            placeholder="مثال: deepseek/deepseek-chat"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800 text-left"
                            dir="ltr"
                          />
                        </div>
                      )}

                      <div className="space-y-3">
                        <label className="block text-right font-black text-gray-500 text-sm mr-2">مفتاح الربط (API Key)</label>
                        <input
                          type="password"
                          value={formData.aiApiKey}
                          onChange={(e) => setFormData({ ...formData, aiApiKey: e.target.value })}
                          onFocus={(e) => {
                            // If the stored key is encrypted (contains ':'), clear it so user can type a new one
                            if (formData.aiApiKey && formData.aiApiKey.includes(':')) {
                              setFormData({ ...formData, aiApiKey: '' })
                            }
                          }}
                          placeholder={centerConfig?.aiApiKey ? '••••••••••••••••  (مفتاح محفوظ ومشفر)' : 'أدخل مفتاح الـ API هنا...'}
                          className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800 text-left"
                          dir="ltr"
                        />
                        {centerConfig?.aiApiKey && (
                          <p className="text-xs font-bold text-green-600 flex items-center gap-1 mr-2">🔒 المفتاح محفوظ ومشفر بأمان على الخادم</p>
                        )}
                      </div>
                    </div>

                    {/* 2. تفعيل وإيقاف الميزات */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                          <span>⚙️</span> التحكم في الميزات
                        </h3>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, aiEnabled: !formData.aiEnabled })}
                          className={`px-4 py-2 rounded-2xl font-black text-xs transition ${formData.aiEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {formData.aiEnabled ? 'الذكاء الاصطناعي مُفعّل بالكامل' : 'الذكاء الاصطناعي مُعطل'}
                        </button>
                      </div>

                      {formData.aiEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: 'Chat', label: 'المساعد الذكي (AI Copilot)', desc: 'محادثة ذكية للاستعلام عن الحجاج والرحلات' },
                            { key: 'Ocr', label: 'استخراج البيانات (OCR)', desc: 'قراءة الجوازات والبطاقات من الصور تلقائياً' },
                            { key: 'Insights', label: 'التحليلات الذكية', desc: 'تحليل أوقات الذروة والتنبؤ بالإنجاز' },
                            { key: 'Anomalies', label: 'مراقب المخاطر (Anomalies)', desc: 'اكتشاف الأخطاء والقصور وتنبيه الإدارة' },
                            { key: 'Translation', label: 'الترجمة الذكية الفورية', desc: 'ترجمة الإشعارات والنصوص بنقرة واحدة' },
                          ].map((feature) => {
                            const isEnabled = (formData as any)[`aiEnable${feature.key}`];
                            return (
                              <div key={feature.key} className="flex items-center gap-4 bg-white p-4 border border-gray-200 rounded-2xl shadow-sm justify-between">
                                <div className="flex-1 space-y-1">
                                  <h4 className="font-black text-gray-800 text-sm">{feature.label}</h4>
                                  <p className="text-xs text-gray-400 font-bold">{feature.desc}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, [`aiEnable${feature.key}`]: !isEnabled })}
                                  className={`px-3 py-1.5 rounded-lg font-black text-xs transition ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                >
                                  {isEnabled ? 'مُفعّل' : 'مُعطل'}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={handleUpdateCenter}
                      className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Save size={24} />
                      حفظ التعديلات
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'tv' && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-10 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-black text-gray-800">تخصيص شاشة العرض والعمليات (TV Mode)</h2>
                    <p className="text-gray-400 text-sm font-bold mt-1">تخصيص شامل وتفصيلي لكل ركن وجزء في شاشة المتابعة المباشرة (شبر شبر)</p>
                  </div>

                  <div className="space-y-8">
                    {/* 1. العناوين والنصوص */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>📝</span> العناوين ونصوص الشاشة
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">العنوان الرئيسي للشاشة</label>
                          <input
                            type="text"
                            value={formData.tvTitle}
                            onChange={(e) => setFormData({ ...formData, tvTitle: e.target.value })}
                            placeholder="مثال: مركز ضيافة رقم ( 1 ) باكستان"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">العنوان الفرعي للشاشة</label>
                          <input
                            type="text"
                            value={formData.tvSubtitle}
                            onChange={(e) => setFormData({ ...formData, tvSubtitle: e.target.value })}
                            placeholder="مثال: غرفة العمليات المركزية - COMMAND CENTER"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">عنوان رادار التحركات</label>
                          <input
                            type="text"
                            value={formData.tvRadarTitle}
                            onChange={(e) => setFormData({ ...formData, tvRadarTitle: e.target.value })}
                            placeholder="مثال: رادار التحركات المباشرة"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">نص شارة البث المباشر</label>
                          <input
                            type="text"
                            value={formData.tvLiveBadgeText}
                            onChange={(e) => setFormData({ ...formData, tvLiveBadgeText: e.target.value })}
                            placeholder="مثال: بث مباشر"
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. الألوان وتنسيق الهوية */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>🎨</span> الألوان والمظهر البصري
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">لون خلفية الهيدر</label>
                          <div className="flex items-center gap-4 bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
                            <input
                              type="color"
                              value={formData.tvHeaderBgColor}
                              onChange={(e) => setFormData({ ...formData, tvHeaderBgColor: e.target.value })}
                              className="w-12 h-12 rounded-2xl cursor-pointer border-0 outline-none"
                            />
                            <input
                              type="text"
                              value={formData.tvHeaderBgColor}
                              onChange={(e) => setFormData({ ...formData, tvHeaderBgColor: e.target.value })}
                              className="flex-1 bg-transparent border-none outline-none font-black text-gray-800 text-left text-xs"
                              dir="ltr"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">لون نصوص الهيدر</label>
                          <div className="flex items-center gap-4 bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
                            <input
                              type="color"
                              value={formData.tvHeaderTextColor}
                              onChange={(e) => setFormData({ ...formData, tvHeaderTextColor: e.target.value })}
                              className="w-12 h-12 rounded-2xl cursor-pointer border-0 outline-none"
                            />
                            <input
                              type="text"
                              value={formData.tvHeaderTextColor}
                              onChange={(e) => setFormData({ ...formData, tvHeaderTextColor: e.target.value })}
                              className="flex-1 bg-transparent border-none outline-none font-black text-gray-800 text-left text-xs"
                              dir="ltr"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">لون خلفية الصفحة</label>
                          <div className="flex items-center gap-4 bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
                            <input
                              type="color"
                              value={formData.tvPageBgColor}
                              onChange={(e) => setFormData({ ...formData, tvPageBgColor: e.target.value })}
                              className="w-12 h-12 rounded-2xl cursor-pointer border-0 outline-none"
                            />
                            <input
                              type="text"
                              value={formData.tvPageBgColor}
                              onChange={(e) => setFormData({ ...formData, tvPageBgColor: e.target.value })}
                              className="flex-1 bg-transparent border-none outline-none font-black text-gray-800 text-left text-xs"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. فلترة الرحلات */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>⏳</span> نطاق فلترة وعرض الرحلات المباشرة (لمنع اختفاء الرحلات)
                      </h3>
                      <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl text-xs font-bold border border-blue-200 leading-relaxed">
                        ⚠️ شاشة الرادار تفلتر الرحلات تلقائياً حسب الوقت. إذا أردت عرض جميع الرحلات بلا فلترة زمنية، قم بتعيين الخيارين إلى <b>999</b>.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">إظهار الرحلات السابقة بحد أقصى (ساعة)</label>
                          <input
                            type="number"
                            value={formData.tvActiveTripsPastHours}
                            onChange={(e) => setFormData({ ...formData, tvActiveTripsPastHours: parseInt(e.target.value) || 0 })}
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800 text-right"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-right font-black text-gray-500 text-sm mr-2">إظهار الرحلات المستقبلية بحد أقصى (ساعة)</label>
                          <input
                            type="number"
                            value={formData.tvActiveTripsFutureHours}
                            onChange={(e) => setFormData({ ...formData, tvActiveTripsFutureHours: parseInt(e.target.value) || 0 })}
                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all font-black text-gray-800 text-right"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. تخصيص وإخفاء كروت الإحصائيات */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                      <h3 className="font-black text-lg text-[var(--color-primary)] flex items-center gap-2">
                        <span>📊</span> التحكم في كروت الإحصائيات الجانبية (تغيير المسميات + إخفاء/إظهار)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { key: 'Target', defaultLabel: 'العدد المستهدف (الموسم)' },
                          { key: 'Present', defaultLabel: 'التواجد الفعلي حالياً' },
                          { key: 'Arrived', defaultLabel: 'إجمالي الواصلين' },
                          { key: 'Departed', defaultLabel: 'إجمالي المغادرين' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center gap-4 bg-white p-4 border border-gray-200 rounded-2xl shadow-sm justify-between">
                            <div className="flex-1 space-y-1">
                              <label className="block text-right font-black text-gray-400 text-xs mr-2">{item.defaultLabel}</label>
                              <input
                                type="text"
                                value={(formData as Record<string, any>)[`tvLabel${item.key}`] || ''}
                                onChange={(e) => setFormData({ ...formData, [`tvLabel${item.key}`]: e.target.value })}
                                className="w-full bg-transparent border-none outline-none font-black text-gray-800 text-right text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, [`tvShow${item.key}`]: !(formData as Record<string, any>)[`tvShow${item.key}`] })}
                              className={`px-4 py-2 rounded-2xl font-black text-xs transition ${(formData as Record<string, any>)[`tvShow${item.key}`] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                            >
                              {(formData as Record<string, any>)[`tvShow${item.key}`] ? 'ظاهر 👁️' : 'مخفي 🚫'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                  <div className="flex justify-start">
                    <button
                      onClick={handleUpdateCenter}
                      className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Save size={24} />
                      حفظ إعدادات شاشة التلفزيون
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'stats' && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-800">الأرصدة الافتتاحية للإحصائيات</h2>
                  </div>

                  <div className="p-4 rounded-2xl text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-start gap-3">
                    <p>
                      💡 هذه الأرقام تُعتبر "أرصدة افتتاحية". سيقوم النظام بجمع هذه الأرقام مع البيانات المحسوبة تلقائياً من تسجيل الحجاج والرحلات.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                      { key: 'manualArrived', label: 'تم وصولهم', icon: '✅' },
                      { key: 'manualDeparted', label: 'تم مغادرتهم', icon: '🔄' },
                      { key: 'manualMakkah', label: 'وصول مكة', icon: '🕋' },
                      { key: 'manualMadina', label: 'وصول المدينة', icon: '🕌' },
                      { key: 'manualPresent', label: 'المتواجدون حالياً', icon: '👥' },
                      { key: 'manualRemaining', label: 'المتبقي للوصول', icon: '⏳' },
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="block text-right font-black text-gray-400 text-xs mr-2">{field.icon} {field.label}</label>
                        <input
                          type="number"
                          value={statsForm[field.key as keyof typeof statsForm]}
                          onChange={(e) => setStatsForm({ ...statsForm, [field.key]: parseInt(e.target.value) || 0 })}
                          className="w-full px-6 py-4 bg-[#F9FAFB] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-gray-200 transition-all font-black text-gray-800 text-center text-lg"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-start">
                    <button
                      onClick={handleSaveStats}
                      className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Save size={24} />
                      حفظ الإحصائيات
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'groups' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800">إدارة المجموعات والأهداف</h2>
                    <AddGroupButton onAdd={addGroupConfig} />
                  </div>
                  <div className="space-y-4">
                    {groupConfigs.map(group => (
                      <GroupRow key={group.id} group={group} onUpdate={handleUpdateGroup} onDelete={deleteGroupConfig} />
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'staff' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800">إدارة الهيكل التنظيمي</h2>
                    <AddStaffButton onAdd={addStaff} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...staff].sort((a, b) => (a.order || 0) - (b.order || 0)).map((member, index, array) => (
                      <div key={member.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="flex flex-col gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                          <button onClick={() => moveStaff(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-[var(--color-primary)] disabled:opacity-30 transition"><ChevronUp size={16} /></button>
                          <button onClick={() => moveStaff(index, 'down')} disabled={index === array.length - 1} className="p-1 text-gray-400 hover:text-[var(--color-primary)] disabled:opacity-30 transition"><ChevronDown size={16} /></button>
                        </div>
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden">
                          <img src={member.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-gray-800">{member.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{member.title}</p>
                        </div>
                        <div className="flex gap-2">
                          <EditStaffButton member={member} onUpdate={updateStaff} />
                          <button onClick={() => deleteStaff(member.id)} className="p-2 text-gray-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'media' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800">إدارة الوسائط والإعلانات</h2>
                    <AddMediaButton onAdd={addMedia} />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {media.map(item => (
                      <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group">
                        <div className="aspect-video relative">
                          <img src={item.thumbnail} className="w-full h-full object-cover" />
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <EditMediaButton item={item} onUpdate={updateMedia} />
                            <button onClick={() => deleteMedia(item.id)} className="p-2 bg-red-500 text-white rounded-2xl shadow-lg"><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="font-black text-gray-800 text-sm truncate">{item.title}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase">{item.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeSection === 'logs' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800">سجل العمليات والتدقيق الأمني</h2>
                    {auditLogs.length > 0 && (
                      <button
                        onClick={handleClearLogs}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2.5 rounded-2xl font-black text-sm transition flex items-center gap-2 border border-red-200"
                      >
                        <Trash2 size={16} />
                        مسح سجل الحركات
                      </button>
                    )}
                  </div>

                  <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden">
                    {auditLogs.length === 0 ? (
                      <div className="text-center py-20 text-gray-400 font-bold">لا توجد عمليات مسجلة في النظام حتى الآن.</div>
                    ) : (
                      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto pr-2">
                        {auditLogs.map((log) => {
                          let actionColor = 'bg-blue-50 text-blue-700 border-blue-100'
                          if (log.action.includes('حذف')) {
                            actionColor = 'bg-red-50 text-red-700 border-red-100'
                          } else if (log.action.includes('إضافة') || log.action.includes('جماعية')) {
                            actionColor = 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          } else if (log.action.includes('تعديل') || log.action.includes('تحديث')) {
                            actionColor = 'bg-amber-50 text-amber-700 border-amber-100'
                          }

                          return (
                            <div key={log.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-black border ${actionColor} shrink-0`}>
                                  {log.action}
                                </span>
                                <div>
                                  <p className="font-black text-gray-800 text-sm">{log.details}</p>
                                  <p className="text-[10px] text-gray-400 font-bold mt-1">بواسطة: {log.user || 'مدير النظام'}</p>
                                </div>
                              </div>
                              <div className="text-left text-xs font-bold text-gray-400 mr-auto md:mr-0 shrink-0">
                                {new Date(log.timestamp).toLocaleString('ar-SA', { hour12: true })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function GroupRow({ group, onUpdate, onDelete }: { group: GroupConfig, onUpdate: (id: string, data: Partial<GroupConfig>) => void, onDelete: (id: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState({ name: group.name, totalCount: group.totalCount, color: group.color || 'bg-green-500', manualArrived: group.manualArrived || 0 })

  const handleSave = async () => {
    await onUpdate(group.id, data)
    setIsEditing(false)
  }

  return (
    <>
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-4 h-12 rounded-full ${group.color || 'bg-green-500'}`}></div>
          <div>
            <p className="text-lg font-black text-gray-800">{group.name}</p>
            <p className="text-xs font-bold text-gray-400">الهدف: {group.totalCount} {(group.manualArrived || 0) > 0 && `| الواصلين (افتتاحي): ${group.manualArrived}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsEditing(true)} className="p-3 text-gray-400 hover:text-blue-500 transition hover:bg-blue-50 rounded-2xl"><Edit size={18} /></button>
          <button onClick={() => { if (confirm('متأكد من حذف المجموعة؟')) onDelete(group.id) }} className="p-3 text-gray-400 hover:text-red-500 transition hover:bg-red-50 rounded-2xl"><Trash2 size={18} /></button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative z-10 space-y-6">
            <h3 className="text-2xl font-black text-gray-800">تعديل المجموعة</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400">اسم المجموعة</label>
                <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:bg-gray-100 transition" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400">العدد المستهدف</label>
                <input type="number" value={data.totalCount} onChange={e => setData({ ...data, totalCount: parseInt(e.target.value) || 0 })} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:bg-gray-100 transition" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-blue-500">الواصلين الفعليين (رصيد افتتاحي)</label>
                <input type="number" value={data.manualArrived} onChange={e => setData({ ...data, manualArrived: parseInt(e.target.value) || 0 })} className="w-full px-6 py-4 bg-blue-50 border border-blue-100 rounded-2xl font-black text-blue-800 outline-none focus:bg-blue-100 transition" />
                <p className="text-[10px] text-gray-400 font-bold mt-1">هذا الرقم سيُضاف للأرقام التلقائية.</p>
              </div>
            </div>

            <button onClick={handleSave} className="w-full bg-[var(--color-primary)] text-white py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition">
              حفظ التعديلات
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function AddGroupButton({ onAdd }: { onAdd: (data: Omit<GroupConfig, 'id'>) => void }) {
  const handleAdd = async () => {
    const newGroup = {
      name: 'مجموعة جديدة',
      totalCount: 0,
      color: 'bg-green-500',
      manualArrived: 0
    }
    await onAdd(newGroup)
    toast.success('تمت إضافة المجموعة بنجاح')
  }
  return (
    <button onClick={handleAdd} className="bg-orange-500 text-white px-6 py-2.5 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition">
      <Plus size={20} />
      إضافة مجموعة
    </button>
  )
}

function AddStaffButton({ onAdd }: { onAdd: (data: Omit<Staff, 'id'>) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState({ name: '', title: '', image: '', level: 'member' as any, order: 0 })
  const handleSubmit = async () => {
    await onAdd(data)
    setIsOpen(false)
    toast.success('تمت إضافة الموظف')
  }
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-orange-500 text-white px-6 py-2.5 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition"><Plus size={20} />إضافة موظف</button>
      {isOpen && <StaffModal data={data} setData={setData} onSubmit={handleSubmit} onClose={() => setIsOpen(false)} title="إضافة موظف جديد" />}
    </>
  )
}

function EditStaffButton({ member, onUpdate }: { member: Staff, onUpdate: (id: string, data: Partial<Staff>) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState({ ...member })
  const handleSubmit = async () => {
    await onUpdate(member.id, data)
    setIsOpen(false)
    toast.success('تم تحديث الموظف')
  }
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 text-gray-300 hover:text-blue-500 transition"><Edit size={16} /></button>
      {isOpen && <StaffModal data={data} setData={setData} onSubmit={handleSubmit} onClose={() => setIsOpen(false)} title="تعديل بيانات الموظف" />}
    </>
  )
}

function StaffModal({ data, setData, onSubmit, onClose, title }: { data: any, setData: any, onSubmit: () => void, onClose: () => void, title: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg space-y-5 animate-zoomIn max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-black">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
          <input value={data.name || ''} placeholder="الاسم الكامل" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold" onChange={e => setData({ ...data, name: e.target.value })} />
          <input value={data.title || ''} placeholder="المنصب الوظيفي" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold" onChange={e => setData({ ...data, title: e.target.value })} />
        </div>
        <input value={data.image || ''} placeholder="رابط الصورة الشخصية" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold" onChange={e => setData({ ...data, image: e.target.value })} />
        <select value={data.level || 'member'} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black" onChange={e => setData({ ...data, level: e.target.value as any })}>
          <option value="head">رئيس المركز</option>
          <option value="vice">نائب رئيس المركز</option>
          <option value="specialist">أخصائي</option>
          <option value="member">عضو</option>
        </select>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400">المسيرة المهنية (كيف وصل لهذا المنصب)</label>
          <textarea
            value={data.bio || ''}
            placeholder="نبذة عن المسيرة المهنية وكيف وصل لهذا المنصب..."
            rows={3}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold resize-none text-sm"
            onChange={e => setData({ ...data, bio: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400">الخبرات والتخصصات</label>
          <textarea
            value={data.experience || ''}
            placeholder="الخبرات والمؤهلات والتخصصات..."
            rows={3}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold resize-none text-sm"
            onChange={e => setData({ ...data, experience: e.target.value })}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onSubmit} className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] transition">حفظ</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black">إلغاء</button>
        </div>
      </div>
    </div>
  )
}

function AddMediaButton({ onAdd }: { onAdd: (data: Omit<MediaItem, 'id'>) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState({ title: '', type: 'image' as any, thumbnail: '', url: '' })
  const handleSubmit = async () => {
    await onAdd(data)
    setIsOpen(false)
    toast.success('تمت إضافة المادة الإعلامية')
  }
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition"><Plus size={20} />إضافة مادة إعلامية</button>
      {isOpen && <MediaModal data={data} setData={setData} onSubmit={handleSubmit} onClose={() => setIsOpen(false)} title="إضافة مادة إعلامية" />}
    </>
  )
}

function EditMediaButton({ item, onUpdate }: { item: MediaItem, onUpdate: (id: string, data: Partial<MediaItem>) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState({ ...item })
  const handleSubmit = async () => {
    await onUpdate(item.id, data)
    setIsOpen(false)
    toast.success('تم تحديث المادة الإعلامية')
  }
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 bg-blue-500 text-white rounded-2xl shadow-lg"><Edit size={16} /></button>
      {isOpen && <MediaModal data={data} setData={setData} onSubmit={handleSubmit} onClose={() => setIsOpen(false)} title="تعديل المادة الإعلامية" />}
    </>
  )
}

function MediaModal({ data, setData, onSubmit, onClose, title }: { data: any, setData: any, onSubmit: () => void, onClose: () => void, title: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md space-y-6 animate-zoomIn">
        <h3 className="text-xl font-black">{title}</h3>
        <input value={data.title} placeholder="العنوان" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" onChange={e => setData({ ...data, title: e.target.value })} />
        <input value={data.thumbnail} placeholder="رابط الصورة المصغرة" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" onChange={e => setData({ ...data, thumbnail: e.target.value })} />
        <input value={data.url} placeholder="رابط الفيديو/الصورة" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" onChange={e => setData({ ...data, url: e.target.value })} />
        <div className="flex gap-3">
          <button onClick={onSubmit} className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-2xl font-black">حفظ</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-2xl font-black">إلغاء</button>
        </div>
      </div>
    </div>
  )
}
