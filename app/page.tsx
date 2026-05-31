'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { 
  Loader2, 
  Search, 
  Map as MapIcon, 
  BarChart3, 
  Activity, 
  Users2, 
  MonitorPlay,
  Plus,
  Trash2,
  Edit,
  Play,
  Pause,
  Zap,
} from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import { Location } from '@/lib/types'

// Components for Tabs
import StatisticsTab from '@/components/Dashboard/Tabs/StatisticsTab'
import MovementsTab from '@/components/Dashboard/Tabs/MovementsTab'
import OrgChartTab from '@/components/Dashboard/Tabs/OrgChartTab'
import MediaTab from '@/components/Dashboard/Tabs/MediaTab'
import AIInsightsTab from '@/components/Dashboard/Tabs/AIInsightsTab'
import RealMap from '@/components/Dashboard/RealMap'
import AddLocationModal from '@/components/Dashboard/AddLocationModal'

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('statistics')
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [locationSearch, setLocationSearch] = useState('')
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const router = useRouter()
  
  const { pilgrims, locations, trips, deleteLocation, centerConfig } = useAppStore()

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    })
    return () => {
      unsubAuth()
    }
  }, [router])

  const tabs = useMemo(() => [
    { id: 'statistics', label: centerConfig?.labelTabStats || 'الإحصائيات العامة', icon: <BarChart3 size={18} />, show: centerConfig?.showTabStats ?? true },
    { id: 'movements', label: centerConfig?.labelTabMovements || 'التحركات الميدانية', icon: <Activity size={18} />, show: centerConfig?.showTabMovements ?? true },
    { id: 'maps', label: centerConfig?.labelTabMaps || 'المواقع والخرائط', icon: <MapIcon size={18} />, show: centerConfig?.showTabMaps ?? true },
    { id: 'ai', label: 'التحليلات الذكية', icon: <Zap size={18} />, show: true },
    { id: 'org', label: centerConfig?.labelTabOrg || 'الهيكل التنظيمي', icon: <Users2 size={18} />, show: centerConfig?.showTabOrg ?? true },
    { id: 'media', label: centerConfig?.labelTabMedia || 'المركز الإعلامي', icon: <MonitorPlay size={18} />, show: centerConfig?.showTabMedia ?? true },
  ].filter(t => t.show !== false), [centerConfig])

  // Auto Play Effect for Tabs
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveTab((currentTab) => {
        const currentIndex = tabs.findIndex(t => t.id === currentTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex].id;
      });
    }, 10000); // الانتقال كل 10 ثواني
    return () => clearInterval(interval);
  }, [isAutoPlay, tabs]);

  const filteredLocations = locations.filter(loc => 
    locationSearch === '' || 
    loc.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    (loc.company && loc.company.toLowerCase().includes(locationSearch.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center" dir="rtl">
        <Loader2 className="w-12 h-12 text-green-700 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          {/* Custom Cover & Green Overlay Banner */}
          <div className="relative bg-[var(--color-primary)] text-white py-10 px-12 text-center space-y-6 overflow-hidden shadow-xl">
             {/* 1. Background Cover & Green Overlay Wrapper (Isolated from space-y and flex) */}
             {centerConfig?.systemCover && (
               <div className="absolute inset-0 z-0 !m-0 overflow-hidden pointer-events-none">
                 <img 
                   src={centerConfig.systemCover} 
                   alt="System Cover" 
                   className="absolute inset-0 w-full h-full object-cover !m-0"
                 />
                 <div className="absolute inset-0 bg-[var(--color-primary)]/80 backdrop-blur-md !m-0 z-10"></div>
               </div>
             )}
             
             {/* 2. Main Content */}
             <div className="relative z-20 max-w-4xl mx-auto">
                 <h1 className="text-4xl font-black mb-2 tracking-tight drop-shadow-md text-white">
                   {centerConfig?.centerName || 'هوليداي إن بكة - Holiday Inn BAKKAH'}
                 </h1>
                 <p className="text-sm font-bold opacity-90 mt-2 tracking-wide max-w-2xl mx-auto bg-white/10 py-1.5 px-6 rounded-full border border-white/20 backdrop-blur-md inline-block">
                   {centerConfig?.headName ? `رئيس المركز: ${centerConfig.headName}` : 'نظام إدارة وتوزيع حجاج مراكز الضيافة'}
                 </p>
             </div>

             <div className="flex flex-wrap justify-center gap-6 mt-6 relative z-20">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-2xl min-w-[160px] shadow-lg hover:bg-white/15 transition transform hover:-translate-y-1">
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">إجمالي {centerConfig?.pilgrimsTerm || 'الحجاج'}</p>
                    <p className="text-3xl font-black tracking-tight">{pilgrims.length.toLocaleString()}</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-2xl min-w-[160px] shadow-lg hover:bg-white/15 transition transform hover:-translate-y-1">
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">المواقع</p>
                    <p className="text-3xl font-black tracking-tight">{locations.length}</p>
                 </div>
                 {centerConfig && centerConfig.totalPilgrimsTarget > 0 && (
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-2xl min-w-[160px] shadow-lg hover:bg-white/15 transition transform hover:-translate-y-1">
                      <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">العدد المستهدف</p>
                      <p className="text-3xl font-black tracking-tight">{centerConfig.totalPilgrimsTarget.toLocaleString()}</p>
                   </div>
                 )}
             </div>
          </div>

          <div className="max-w-[1600px] mx-auto p-8 space-y-8">
            {/* Tabs Navigation & Auto Play Button */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-3 rounded-[2.5rem] border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 w-full lg:w-auto justify-center lg:justify-start">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap border-2 ${
                      activeTab === tab.id 
                      ? 'bg-green-700 border-green-700 text-white shadow-xl scale-105' 
                      : 'bg-white border-transparent text-gray-400 hover:border-gray-100 shadow-sm'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-md w-full lg:w-auto shrink-0 border ${
                  isAutoPlay 
                  ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 animate-pulse shadow-red-500/20' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {isAutoPlay ? <Pause size={18} /> : <Play size={18} />}
                <span>{isAutoPlay ? 'إيقاف العرض التلقائي' : 'تشغيل العرض التلقائي'}</span>
              </button>
            </div>

            {/* Active Content */}
            <div className="mt-8">
              {activeTab === 'statistics' && <StatisticsTab pilgrims={pilgrims} trips={trips} />}
              {activeTab === 'movements' && <MovementsTab trips={trips} />}
              {activeTab === 'org' && <OrgChartTab />}
              {activeTab === 'ai' && <AIInsightsTab />}
              {activeTab === 'media' && <MediaTab />}
              {activeTab === 'maps' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white relative">
                     <RealMap locations={locations} />
                     <button 
                       onClick={() => setIsAddLocationOpen(true)}
                       className="absolute bottom-8 left-8 bg-green-700 text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 transition flex items-center gap-2 z-10"
                     >
                        <Plus size={24} />
                        إضافة موقع جديد
                     </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative max-w-2xl mx-auto">
                     <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                     <input 
                       placeholder="بحث باسم الفندق أو الشركة..." 
                       value={locationSearch}
                       onChange={(e) => setLocationSearch(e.target.value)}
                       className="w-full pr-16 pl-6 py-5 bg-white rounded-full shadow-lg outline-none font-bold text-lg border-2 border-transparent focus:border-green-700/20 transition"
                     />
                  </div>

                  {/* Locations Table */}
                  <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                       <table className="w-full text-right">
                          <thead className="bg-green-900 text-white text-sm font-black">
                             <tr>
                                <th className="px-8 py-5">م</th>
                                <th className="px-8 py-5">اسم الفندق / الموقع</th>
                                <th className="px-8 py-5">الشركة</th>
                                <th className="px-8 py-5">عدد الحجاج</th>
                                <th className="px-8 py-5">العنوان</th>
                                <th className="px-8 py-5">الإجراءات</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {filteredLocations.map((loc, i) => (
                               <tr key={loc.id} className="hover:bg-gray-50 transition group">
                                  <td className="px-8 py-6 font-bold text-gray-400">{i + 1}</td>
                                  <td className="px-8 py-6 font-black text-gray-800">{loc.name}</td>
                                  <td className="px-8 py-6 font-bold text-gray-500">{loc.company || 'غير محدد'}</td>
                                  <td className="px-8 py-6">
                                     <span className="bg-green-700 text-white px-4 py-1 rounded-full font-black text-sm">
                                        {pilgrims.filter(p => p.location === loc.name).length}
                                     </span>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="text-xs font-bold text-gray-400">
                                        <p>{loc.address || 'لم يتم تحديد العنوان'}</p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="flex items-center justify-center gap-3">
                                        <button 
                                          onClick={() => { setEditingLocation(loc); setIsAddLocationOpen(true); }}
                                          className="p-2 text-gray-400 hover:text-green-700 transition"
                                        >
                                           <Edit size={20} />
                                        </button>
                                        <button 
                                          onClick={() => {
                                             if(confirm('هل أنت متأكد من حذف هذا الموقع؟')) deleteLocation(loc.id)
                                          }}
                                          className="p-2 text-gray-400 hover:text-red-500 transition"
                                        >
                                           <Trash2 size={20} />
                                        </button>
                                     </div>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <AddLocationModal 
          isOpen={isAddLocationOpen} 
          onClose={() => { setIsAddLocationOpen(false); setEditingLocation(null); }} 
          editingLocation={editingLocation}
        />
      </div>
    </div>
  )
}
