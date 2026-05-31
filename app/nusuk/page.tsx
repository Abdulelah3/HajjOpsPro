'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { FileSpreadsheet, Upload, Info, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export default function NusukIndexingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const { addPilgrimsBulk, centerConfig } = useAppStore()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('عذراً، حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت.')
      e.target.value = ''
      return
    }

    setIsUploading(true)
    
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)

      if (jsonData.length === 0) throw new Error('الملف فارغ أو لا يحتوي على بيانات مقروءة')

      const newPilgrims = jsonData.map((row, index) => ({
        name: String(row['الاسم'] || row['Name'] || row['name'] || `حاج مفهرس ${index + 1}`),
        passport: String(row['رقم الجواز'] || row['Passport'] || row['passport'] || `N-${Date.now().toString().slice(-6)}-${index}`),
        nationality: String(row['الجنسية'] || row['Nationality'] || row['nationality'] || 'تلقائي (نسك)'),
        group: String(row['المجموعة'] || row['Group'] || row['group'] || 'القدوس'),
        status: 'مؤكد' as const,
        phone: String(row['رقم الجوال'] || row['Phone'] || row['phone'] || ''),
        registrationDate: new Date().toLocaleDateString('ar-SA')
      }))

      await addPilgrimsBulk(newPilgrims)
      
      toast.success(`تمت أرشفة وتوزيع ${newPilgrims.length} حاج بنجاح`)
      setIsUploading(false)
      setIsDone(true)
    } catch (error: unknown) {
      setIsUploading(false)
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف'
      toast.error(`حدث خطأ أثناء المعالجة: ${errorMessage}`)
    }
    
    // Reset input
    e.target.value = ''
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-6xl mx-auto space-y-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                       <FileSpreadsheet size={32} />
                    </div>
                    <div>
                       <h1 className="text-3xl font-black text-gray-800">{centerConfig?.titleNusukPage || 'فهرسة بطائق نُسك (Nusuk Indexing)'}</h1>
                       <p className="text-gray-500 font-bold mt-1 text-sm">{centerConfig?.subNusukPage || 'قم برفع وتجهيز ملفات الإكسل المسحوبة من نظام نُسك الرسمي وتوزيعها تلقائياً.'}</p>
                    </div>
                 </div>
                 <label className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-green-700 transition shadow-xl cursor-pointer">
                    <Upload size={20} />
                    رفع ملف إكسل
                    <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
                 </label>
              </div>

              {/* Empty State / Upload Area */}
              {isUploading ? (
                 <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
                    <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                       <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-800">جاري المعالجة والفهرسة...</h3>
                       <p className="text-gray-400 font-bold mt-2">يرجى الانتظار، يتم الآن مطابقة البيانات مع المجموعات.</p>
                    </div>
                 </div>
              ) : isDone ? (
                 <div className="bg-white rounded-[3rem] shadow-sm border border-green-100 p-20 flex flex-col items-center justify-center text-center space-y-6 animate-zoomIn">
                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                       <CheckCircle2 size={64} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-800">تمت الفهرسة بنجاح!</h3>
                       <p className="text-gray-400 font-bold mt-2">تم توزيع الحجاج بنجاح وتحديث قاعدة البيانات.</p>
                    </div>
                    <button onClick={() => setIsDone(false)} className="bg-gray-100 text-gray-600 px-10 py-4 rounded-2xl font-black hover:bg-gray-200 transition">
                       رفع ملف آخر
                    </button>
                 </div>
              ) : (
                 <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                       <FileSpreadsheet size={64} strokeWidth={1} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-800">لا توجد بيانات مؤرشفة</h3>
                       <p className="text-gray-400 font-bold mt-2">قم برفع أول ملف إكسل لتبدأ عملية الفهرسة وتوزيع الحجاج على المجموعات والمواقع.</p>
                    </div>
                    <label className="bg-gray-800 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition cursor-pointer inline-block">
                       ابدأ الرفع الآن
                       <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
                    </label>
                    
                    <div className="mt-12 flex items-center gap-3 text-xs font-bold text-gray-400 bg-gray-50 px-6 py-3 rounded-full">
                       <Info size={16} />
                       <span>تعليمات: يجب أن يكون الملف بصيغة .xlsx أو .xls ومنسق حسب معايير وزارة الحج.</span>
                    </div>
                 </div>
              )}
           </div>
        </main>
      </div>
    </div>
  )
}
