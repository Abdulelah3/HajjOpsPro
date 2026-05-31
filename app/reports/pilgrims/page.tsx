'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Printer, Download, Search, Filter, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function PilgrimReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const { pilgrims, fetchPilgrims } = useAppStore()



  const filteredPilgrims = pilgrims.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.passport || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExportExcel = () => {
    setIsExporting(true)
    const worksheet = XLSX.utils.json_to_sheet(filteredPilgrims)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pilgrims")
    XLSX.writeFile(workbook, "Pilgrim_Report.xlsx")
    setIsExporting(false)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text("تقرير الحجاج - HajjOpsPro", 10, 10)
    autoTable(doc, {
      head: [['الاسم', 'الجواز', 'المجموعة', 'الحالة']],
      body: filteredPilgrims.map(p => [p.name || '', p.passport || '', p.group || '', p.status || '']),
      styles: { font: 'courier' }
    })
    doc.save("Pilgrim_Report.pdf")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex items-center justify-between no-print">
                 <div>
                    <h1 className="text-3xl font-black text-gray-800">تقارير الحجاج</h1>
                    <p className="text-gray-500 font-bold mt-1">كشف تفصيلي لكافة الحجاج المسجلين في النظام</p>
                 </div>
                 <div className="flex gap-3">
                    <button 
                      onClick={handlePrint}
                      className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition"
                    >
                       <Printer size={20} />
                       طباعة الكشف
                    </button>
                    <button 
                      onClick={handleExportExcel}
                      disabled={isExporting}
                      className="bg-gray-800 text-white px-6 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition"
                    >
                       {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                       تصدير Excel
                    </button>
                 </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-6 border-b border-gray-50 flex items-center justify-between no-print">
                    <div className="relative w-96">
                       <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         placeholder="بحث برقم الجواز أو الاسم..." 
                         className="w-full pr-12 pl-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-deep-green/20 font-bold"
                       />
                    </div>
                    <button className="flex items-center gap-2 text-gray-500 font-bold hover:text-[var(--color-primary)]">
                       <Filter size={18} />
                       تصفية النتائج
                    </button>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-right">
                       <thead>
                          <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                             <th className="px-8 py-4">م</th>
                             <th className="px-8 py-4">الاسم الكامل</th>
                             <th className="px-8 py-4">الجنسية</th>
                             <th className="px-8 py-4">رقم الجواز</th>
                             <th className="px-8 py-4">المجموعة</th>
                             <th className="px-8 py-4">الحالة</th>
                             <th className="px-8 py-4 text-center no-print">الإجراءات</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {filteredPilgrims.map((p, i) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition group">
                               <td className="px-8 py-5 text-xs font-bold text-gray-400">{i + 1}</td>
                               <td className="px-8 py-5">
                                  <p className="font-black text-gray-800">{p.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold">{p.phone || 'بدون رقم'}</p>
                               </td>
                               <td className="px-8 py-5 font-bold text-gray-600 text-sm">{p.nationality || 'باكستان'}</td>
                               <td className="px-8 py-5 font-mono text-gray-500 text-xs">{p.passport || 'P-123456'}</td>
                               <td className="px-8 py-5">
                                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">
                                     {p.group}
                                  </span>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${p.status === 'مؤكد' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                     <span className="text-xs font-black text-gray-700">{p.status}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5 text-center no-print">
                                  <button onClick={handleExportPDF} className="p-2 text-gray-400 hover:text-red-500 transition">
                                     <Download size={16} />
                                  </button>
                               </td>
                            </tr>
                          ))}
                          {filteredPilgrims.length === 0 && (
                            <tr>
                               <td colSpan={7} className="px-8 py-20 text-center text-gray-300 font-black text-xl italic">
                                  {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد بيانات حجاج مسجلة حالياً'}
                               </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Print Header (Visible only when printing) */}
           <div className="hidden print:block p-8 mb-8 border-b-2 border-black">
              <div className="flex justify-between items-center">
                 <div className="text-center">
                    <p className="font-bold">المملكة العربية السعودية</p>
                    <p>وزارة الحج والعمرة</p>
                    <p className="text-xs">Holiday Inn Bakkah</p>
                 </div>
                 <div className="text-center">
                    <h1 className="text-2xl font-bold">كشف بأسماء الحجاج وتوزيع المجموعات</h1>
                    <p className="text-sm mt-2">موسم حج 1447هـ</p>
                 </div>
                 <div className="text-left">
                    <p className="text-sm">التاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
                    <p className="text-sm">عدد الحجاج: {pilgrims.length}</p>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  )
}
