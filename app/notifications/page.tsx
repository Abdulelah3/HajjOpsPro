'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Bell, Clock, CheckCircle, AlertTriangle, Info, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import TranslateButton from '@/components/AI/TranslateButton'

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { notifications, deleteNotification, clearAllNotifications } = useAppStore()

  const handleClearAll = async () => {
    if (notifications.length === 0) return
    if (confirm('هل أنت متأكد من مسح كافة التنبيهات؟')) {
      try {
        await clearAllNotifications()
        toast.success('تم مسح كافة التنبيهات بنجاح')
      } catch {
        toast.error('حدث خطأ أثناء المسح')
      }
    }
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                 <div>
                    <h1 className="text-3xl font-black text-gray-800">مركز التنبيهات</h1>
                    <p className="text-gray-500 font-bold mt-1">متابعة لحظية لكافة الأحداث والعمليات الميدانية</p>
                 </div>
                 <button 
                   onClick={handleClearAll}
                   className="text-sm font-black text-red-500 hover:bg-red-50 px-4 py-2 rounded-2xl transition"
                 >
                    مسح كافة التنبيهات
                 </button>
              </div>

              <div className="space-y-4">
                 {notifications.length > 0 ? notifications.map((note) => (
                   <div key={note.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-start gap-6 hover:shadow-md transition group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                         note.type === 'success' ? 'bg-green-50 text-green-500' :
                         note.type === 'warning' ? 'bg-orange-50 text-orange-500' :
                         note.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                         {note.type === 'success' ? <CheckCircle size={28} /> : 
                          note.type === 'warning' ? <AlertTriangle size={28} /> : <Info size={28} />}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <h3 className="text-lg font-black text-gray-800">{note.title}</h3>
                            <div className="flex items-center gap-3">
                               <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px]">
                                  <Clock size={14} />
                                  {note.time}
                               </div>
                               <button 
                                 onClick={() => deleteNotification(note.id)}
                                 className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </div>
                         </div>
                         <p className="text-gray-500 text-sm mt-2 font-bold leading-relaxed">{note.message}</p>
                         <TranslateButton originalText={note.message} />
                      </div>
                   </div>
                 )) : (
                   <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-300 opacity-50">
                      <Bell size={64} strokeWidth={1} />
                      <p className="mt-4 font-black text-xl italic">لا توجد تنبيهات جديدة حالياً</p>
                   </div>
                 )}
              </div>
           </div>
        </main>
      </div>
    </div>
  )
}
