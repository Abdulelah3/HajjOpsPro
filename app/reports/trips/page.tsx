'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Printer, Download, Search, Plane, Filter, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function TripReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const { trips, fetchTrips } = useAppStore()



  const filteredTrips = trips.filter(t => 
    (t.flightNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.groupName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.destination || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExportExcel = () => {
    setIsExporting(true)
    const worksheet = XLSX.utils.json_to_sheet(filteredTrips)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trips")
    XLSX.writeFile(workbook, "Trips_Report.xlsx")
    setIsExporting(false)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text("جدول الرحلات - HajjOpsPro", 10, 10)
    autoTable(doc, {
      head: [['رقم الرحلة', 'المجموعة', 'الوجهة', 'عدد الحجاج', 'التاريخ']],
      body: filteredTrips.map(t => [t.flightNumber || '', t.groupName || '', t.destination || '', t.pilgrimsCount || 0, t.date || '']),
      styles: { font: 'courier' }
    })
    doc.save("Trips_Report.pdf")
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
                    <h1 className="text-3xl font-black text-gray-800">جدولة تقارير الرحلات</h1>
                    <p className="text-gray-500 font-bold mt-1 text-sm">متابعة دقيقة لكافة رحلات الوصول والمغادرة والتحركات الداخلية</p>
                 </div>
                 <div className="flex gap-3">
                    <button 
                      onClick={handlePrint}
                      className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition"
                    >
                       <Printer size={20} />
                       طباعة الجدول
                    </button>
                    <button 
                      onClick={handleExportExcel}
                      disabled={isExporting}
                      className="bg-gray-800 text-white px-6 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition"
                    >
                       {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                       تحميل Excel
                    </button>
                 </div>
              </div>

              {/* Search Bar for Trips */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between no-print mb-6">
                 <div className="relative w-96">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="بحث برقم الرحلة أو المجموعة..." 
                      className="w-full pr-12 pl-4 py-3 bg-gray-50 rounded-2xl outline-none font-bold"
                    />
                 </div>
              </div>

              {/* Trips Table */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-right">
                       <thead>
                          <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                             <th className="px-8 py-4">م</th>
                             <th className="px-8 py-4">نوع الحركة</th>
                             <th className="px-8 py-4">رقم الرحلة</th>
                             <th className="px-8 py-4">المجموعة</th>
                             <th className="px-8 py-4">المطار / الوجهة</th>
                             <th className="px-8 py-4">عدد الحجاج</th>
                             <th className="px-8 py-4 text-center">التاريخ والوقت</th>
                             <th className="px-8 py-4">الحالة</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {filteredTrips.map((t, i) => (
                            <tr key={t.id} className="hover:bg-gray-50 transition group">
                               <td className="px-8 py-5 text-xs font-bold text-gray-400">{i + 1}</td>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${t.movementType === 'وصول' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                     <span className="text-xs font-black text-gray-800">{t.movementType}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-2">
                                     <Plane size={14} className="text-gray-300" />
                                     <span className="font-mono text-sm font-black text-blue-600">{t.flightNumber}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5 font-black text-gray-700 text-sm">{t.groupName}</td>
                               <td className="px-8 py-5">
                                  <p className="text-sm font-bold text-gray-800">{t.airport}</p>
                                  <p className="text-[10px] text-gray-400 font-bold">{t.destination}</p>
                               </td>
                               <td className="px-8 py-5 font-black text-gray-800">{t.pilgrimsCount}</td>
                               <td className="px-8 py-5 text-center">
                                  <p className="text-xs font-black text-gray-800">{t.date}</p>
                                  <p className="text-[10px] text-gray-400 font-bold">{t.time}</p>
                               </td>
                               <td className="px-8 py-5">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                     t.status === 'تم الاعتماد' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                  }`}>
                                     {t.status}
                                  </span>
                               </td>
                            </tr>
                          ))}
                          {filteredTrips.length === 0 && (
                            <tr>
                               <td colSpan={8} className="px-8 py-20 text-center text-gray-300 font-black text-xl italic">
                                  {searchTerm ? 'لا توجد رحلات تطابق بحثك' : 'لا توجد بيانات رحلات مسجلة حالياً'}
                               </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Print Style */}
           <style jsx global>{`
              @media print {
                .no-print { display: none !important; }
                body { background: white !important; }
                main { padding: 0 !important; }
                .shadow-sm { box-shadow: none !important; border: 1px solid #eee !important; }
                table { width: 100% !important; border-collapse: collapse !important; }
                th, td { border: 1px solid #ddd !important; padding: 8px !important; }
              }
           `}</style>
        </main>
      </div>
    </div>
  )
}
