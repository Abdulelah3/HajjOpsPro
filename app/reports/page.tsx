'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { FileText, Printer, Download, Users, Plane, ClipboardList, ShieldCheck, Map, HelpCircle, FileCheck, Search } from 'lucide-react'

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pilgrims, trips, centerConfig } = useAppStore()



  const reportCards = [
    {
      title: 'كشف أسماء الحجاج (المسار الإلكتروني)',
      desc: 'كشف معتمد يضم كافة أسماء الحجاج المسجلين بالموقع الرسمي.',
      icon: <Users className="text-green-600" />,
      type: 'pilgrims',
      category: 'بيانات'
    },
    {
      title: 'تقرير الوصول اليومي للبعثة',
      desc: 'تقرير يوضح أعداد الوصول اليومي ومواقع تواجد المجموعات.',
      icon: <FileCheck className="text-green-600" />,
      type: 'arrival',
      category: 'تقارير'
    },
    {
      title: 'خطاب طلب تصريح دخول للمشاعر',
      desc: 'نموذج رسمي لطلب تصاريح دخول السيارات والمنظمين للمشاعر.',
      icon: <ShieldCheck className="text-green-600" />,
      type: 'permit',
      category: 'تصاريح'
    },
    {
      title: 'جدول الرحلات والمغادرة المعتمد',
      desc: 'الجدول النهائي المعتمد لتفويج الحجاج ونقلهم للمطارات.',
      icon: <ClipboardList className="text-green-600" />,
      type: 'trips',
      category: 'تقارير'
    },
    {
      title: 'بيان استلام وتسليم جوازات سفر',
      desc: 'نموذج توثيق استلام جوازات السفر بين البعثة والجهات المختصة.',
      icon: <FileText className="text-green-600" />,
      type: 'passports',
      category: 'إداري'
    },
    {
      title: 'نموذج معاينة السكن والخدمات',
      desc: 'تقرير فني لمدى جاهزية الفنادق والمخيمات قبل وصول الحجاج.',
      icon: <Map className="text-green-600" />,
      type: 'inspection',
      category: 'ميداني'
    }
  ]

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto space-y-10">
              
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText size={120} />
                 </div>
                 <h1 className="text-4xl font-black text-gray-800">مرحباً، هوليداي إن</h1>
                 <p className="text-gray-500 font-bold mt-2 text-lg">مركز النماذج والتقارير الرسمية</p>
                 <p className="text-gray-400 font-bold mt-1 text-sm">قم باستخراج وطباعة كافة النماذج الرسمية لبعتكم بضغطة واحدة وبمعلومات دقيقة ولحظية.</p>
                 
                 <div className="mt-8 relative max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      placeholder="ابحث عن نموذج..." 
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-bold focus:border-green-500/30 transition"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {reportCards.map((card, i) => (
                   <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all group relative overflow-hidden">
                      <div className="absolute top-4 left-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">{card.category}</div>
                      <div className="space-y-4">
                         <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                            {card.icon}
                         </div>
                         <h3 className="text-xl font-black text-gray-800 leading-tight">{card.title}</h3>
                         <p className="text-xs font-bold text-gray-400 leading-relaxed">{card.desc}</p>
                      </div>
                      
                      <div className="mt-10 flex gap-3">
                         <button 
                           onClick={() => window.open(`/reports/print?type=${card.type}`, '_blank')}
                           className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
                         >
                            <Printer size={18} />
                            طباعة / PDF
                         </button>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Need Special Form Banner (Matches Image) */}
              <div className="bg-green-600/5 p-10 rounded-[3rem] border-2 border-dashed border-green-600/20 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-green-600 text-white rounded-[2rem] flex items-center justify-center shadow-lg shadow-green-600/20">
                       <HelpCircle size={40} />
                    </div>
                    <div>
                       <h4 className="text-2xl font-black text-gray-800">هل تحتاج إلى نموذج خاص؟</h4>
                       <p className="text-sm font-bold text-gray-500 mt-2 max-w-xl leading-relaxed">
                          يمكننا تخصيص وبرمجة نماذج إضافية حسب احتياجات بعتكم الرسمية، تواصل مع الدعم الفني لطلب نموذج مخصص وسيتم إضافته فوراً لنظامكم.
                       </p>
                    </div>
                 </div>
                 <button className="bg-gray-800 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-black transition shadow-xl shrink-0">
                    تواصل مع الدعم الفني
                 </button>
              </div>
           </div>
        </main>
      </div>
    </div>
  )
}
