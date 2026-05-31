'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { FileText, Printer, Download, Users, Plane, ClipboardList, ShieldCheck, Map, HelpCircle } from 'lucide-react'

export default function ComprehensiveReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pilgrims, trips, centerConfig } = useAppStore()

  const reportCards = [
    {
      title: 'كشف أسماء الحجاج (المسار الإلكتروني)',
      desc: 'كشف أسماء الحجاج والمناسك والمخيمات والمواقع والمشاعر.',
      icon: <Users className="text-blue-500" />,
      type: 'pilgrims'
    },
    {
      title: 'تقرير الوصول اليومي للبعثة',
      desc: 'تقرير يومي مفصل لعدد الحجاج الواصلين ومواقعهم وسكنهم.',
      icon: <Plane className="text-green-500" />,
      type: 'arrival'
    },
    {
      title: 'خطاب طلب تصريح دخول للمشاعر',
      desc: 'نموذج رسمي لطلب تصاريح دخول السيارات والمنظمين للمشاعر المقدسة.',
      icon: <ShieldCheck className="text-orange-500" />,
      type: 'permit'
    },
    {
      title: 'جدول الرحلات والمغادرة المعتمد',
      desc: 'الجدول الزمني النهائي لتفويج الحجاج للمغادرة والنقل للمطارات.',
      icon: <ClipboardList className="text-purple-500" />,
      type: 'trips'
    },
    {
      title: 'بيان استلام وتسليم جوازات سفر',
      desc: 'نموذج لتوثيق حركة جوازات سفر الحجاج بين المنظم والمطوف والبعثة.',
      icon: <FileText className="text-cyan-500" />,
      type: 'passports'
    },
    {
      title: 'نموذج معاينة السكن والخدمات',
      desc: 'تقرير فني لمدى جاهزية الفنادق والمخيمات والخدمات قبل وصول الحجاج.',
      icon: <Map className="text-indigo-500" />,
      type: 'inspection'
    }
  ]

  const handlePrint = (type: string) => {
    // We will implement a specialized print view for each
    window.print()
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-6xl mx-auto space-y-10">
              <div className="flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-black text-gray-800">التقارير الشاملة</h1>
                   <p className="text-gray-500 font-bold mt-1 text-sm">توليد وتصدير المستندات الرسمية بناءً على البيانات الحية</p>
                </div>
                <div className="flex gap-4">
                   <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase">إجمالي الحجاج</p>
                      <p className="text-xl font-black text-[var(--color-primary)]">{pilgrims.length}</p>
                   </div>
                   <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase">الرحلات النشطة</p>
                      <p className="text-xl font-black text-orange-500">{trips.length}</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {reportCards.map((card, i) => (
                   <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all group">
                      <div className="space-y-4">
                         <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                            {card.icon}
                         </div>
                         <h3 className="text-lg font-black text-gray-800 leading-tight">{card.title}</h3>
                         <p className="text-xs font-bold text-gray-400 leading-relaxed">{card.desc}</p>
                      </div>
                      
                      <div className="mt-8 flex gap-3">
                         <button 
                           onClick={() => handlePrint(card.type)}
                           className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
                         >
                            <Printer size={18} />
                            طباعة
                         </button>
                         <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition">
                            <Download size={18} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Support Section */}
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                       <HelpCircle size={32} />
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-gray-800">هل تحتاج إلى نموذج خاص؟</h4>
                       <p className="text-xs font-bold text-gray-400 mt-1">يمكننا تخصيص وبرمجة نماذج إضافية حسب احتياجات بعتكم الرسمية، تواصل مع الدعم الفني لطلب نموذج مخصص.</p>
                    </div>
                 </div>
                 <button className="bg-gray-800 text-white px-8 py-3 rounded-2xl font-black hover:bg-black transition">
                    تواصل معنا
                 </button>
              </div>
           </div>

           {/* Hidden Print Content (Populated automatically) */}
           <div id="print-area" className="hidden print:block p-10 bg-white text-black font-serif">
              <div className="flex justify-between items-center border-b-4 border-black pb-6 mb-8">
                 <div className="text-center w-48">
                    <p className="font-bold">المملكة العربية السعودية</p>
                    <p className="text-sm">وزارة الحج والعمرة</p>
                 </div>
                 <div className="text-center">
                    <h1 className="text-3xl font-bold">تقرير رسمي</h1>
                    <p className="text-sm mt-2">{centerConfig?.centerName || 'مركز ضيافة رقم 1'}</p>
                 </div>
                 <div className="w-48 text-left">
                    <p className="text-sm font-bold">التاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
                 </div>
              </div>
              
              <table className="w-full border-collapse border border-black text-sm">
                 <thead className="bg-gray-100">
                    <tr>
                       <th className="border border-black p-2">م</th>
                       <th className="border border-black p-2">الاسم</th>
                       <th className="border border-black p-2">المجموعة</th>
                       <th className="border border-black p-2">الحالة</th>
                    </tr>
                 </thead>
                 <tbody>
                    {pilgrims.slice(0, 50).map((p, i) => (
                      <tr key={p.id}>
                         <td className="border border-black p-2 text-center">{i + 1}</td>
                         <td className="border border-black p-2 font-bold">{p.name}</td>
                         <td className="border border-black p-2 text-center">{p.group}</td>
                         <td className="border border-black p-2 text-center">{p.status}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </main>
      </div>
    </div>
  )
}
