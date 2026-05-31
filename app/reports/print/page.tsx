'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store/useAppStore'

function PrintReportContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const { pilgrims, trips, centerConfig } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Small delay to ensure styles and data are loaded before print dialog
    setTimeout(() => {
      window.print()
    }, 1000)
  }, [])

  if (!mounted) return <div className="p-10 text-center font-bold">جاري تجهيز التقرير للطباعة...</div>

  const printDate = new Date().toLocaleDateString('ar-SA')
  const printTime = new Date().toLocaleTimeString('ar-SA')

  return (
    <div className="bg-white text-black min-h-screen font-cairo" dir="rtl">
      {/* A4 Print Container */}
      <div className="w-full max-w-[210mm] mx-auto bg-white p-8">
        
        {/* Official Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
          <div className="text-right flex-1">
            <h1 className="text-2xl font-black">{centerConfig?.centerName || 'مركز ضيافة الحجاج'}</h1>
            <p className="font-bold mt-1 text-gray-700">إدارة العمليات الميدانية</p>
            <p className="text-sm mt-1">تاريخ الطباعة: {printDate} | {printTime}</p>
          </div>
          <div className="flex-1 flex justify-center">
            {centerConfig?.systemLogo && (
              <img src={centerConfig.systemLogo} alt="Logo" className="h-20 object-contain grayscale" />
            )}
          </div>
          <div className="text-left flex-1">
            <h1 className="text-xl font-black">Kingdom of Saudi Arabia</h1>
            <p className="font-bold mt-1 text-gray-700">Ministry of Hajj</p>
            <p className="text-sm mt-1">Ref: {Math.floor(Math.random() * 100000)}/HJP</p>
          </div>
        </div>

        {/* Report Content */}
        {type === 'pilgrims' && (
          <div>
            <h2 className="text-3xl font-black text-center mb-8 bg-gray-100 py-3 rounded-lg border border-gray-300">
              كشف أسماء الحجاج (المسار الإلكتروني)
            </h2>
            <div className="mb-4 text-sm font-bold flex justify-between">
              <span>إجمالي الحجاج في هذا الكشف: {pilgrims.length} حاج</span>
              <span>رئيس المركز: {centerConfig?.headName || 'ــــــــــــــــــــ'}</span>
            </div>
            <table className="w-full text-sm text-right border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black p-2 w-12 text-center">م</th>
                  <th className="border border-black p-2">اسم الحاج</th>
                  <th className="border border-black p-2">رقم الجواز</th>
                  <th className="border border-black p-2">الجنسية</th>
                  <th className="border border-black p-2">المجموعة</th>
                  <th className="border border-black p-2">السكن (الموقع)</th>
                </tr>
              </thead>
              <tbody>
                {pilgrims.map((p, i) => (
                  <tr key={p.id}>
                    <td className="border border-black p-2 text-center">{i + 1}</td>
                    <td className="border border-black p-2 font-bold">{p.name}</td>
                    <td className="border border-black p-2">{p.passportNumber || p.passport || '---'}</td>
                    <td className="border border-black p-2">{p.nationality || '---'}</td>
                    <td className="border border-black p-2">{p.group}</td>
                    <td className="border border-black p-2">{p.location || '---'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {type === 'trips' && (
          <div>
            <h2 className="text-3xl font-black text-center mb-8 bg-gray-100 py-3 rounded-lg border border-gray-300">
              الجدول المعتمد للرحلات الميدانية (حركة التفويج)
            </h2>
            <div className="mb-4 text-sm font-bold flex justify-between">
              <span>إجمالي الرحلات المسجلة: {trips.length} رحلة</span>
              <span>رئيس المركز: {centerConfig?.headName || 'ــــــــــــــــــــ'}</span>
            </div>
            <table className="w-full text-sm text-right border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black p-2 w-12 text-center">م</th>
                  <th className="border border-black p-2">النوع</th>
                  <th className="border border-black p-2">اسم المنظم</th>
                  <th className="border border-black p-2">التاريخ والوقت</th>
                  <th className="border border-black p-2 text-center">العدد</th>
                  <th className="border border-black p-2">الوجهة</th>
                  <th className="border border-black p-2">رقم الرحلة / الحافلة</th>
                </tr>
              </thead>
              <tbody>
                {trips.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((t, i) => (
                  <tr key={t.id}>
                    <td className="border border-black p-2 text-center">{i + 1}</td>
                    <td className="border border-black p-2 font-bold">{t.movementType || '---'}</td>
                    <td className="border border-black p-2">{t.groupName || t.name || '---'}</td>
                    <td className="border border-black p-2" dir="ltr" style={{textAlign: 'right'}}>{t.date} | {t.time}</td>
                    <td className="border border-black p-2 text-center font-bold">{t.pilgrimsCount || t.pilgrims || 0}</td>
                    <td className="border border-black p-2">{t.destination || t.to || '---'}</td>
                    <td className="border border-black p-2">{t.flightNumber || t.busNumber || '---'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Signatures */}
        <div className="mt-20 pt-10 grid grid-cols-3 text-center break-inside-avoid">
          <div>
            <p className="font-bold mb-10">المعد (مسؤول النظام)</p>
            <p className="text-gray-400">....................................</p>
          </div>
          <div>
            <p className="font-bold mb-10">الختم الرسمي</p>
            <p className="text-gray-400">....................................</p>
          </div>
          <div>
            <p className="font-bold mb-10">اعتماد رئيس المركز</p>
            <p className="text-gray-400">....................................</p>
          </div>
        </div>

        {/* System Watermark */}
        <div className="mt-12 text-center text-[10px] text-gray-400 border-t border-gray-200 pt-4">
          تم إنشاء هذا التقرير آلياً بواسطة نظام HajjOpsPro لإدارة عمليات ضيوف الرحمن
        </div>

      </div>

      {/* Print Specific CSS to hide everything else and style the page */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; }
          @page { size: A4; margin: 10mm; }
          /* Add basic printable table styles */
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
      `}} />
    </div>
  )
}

import { Suspense } from 'react'

export default function PrintReportPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold">جاري تحميل البيانات...</div>}>
      <PrintReportContent />
    </Suspense>
  )
}
