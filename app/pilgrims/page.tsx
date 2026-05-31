'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Plus, Search, Trash2, Edit, UserPlus, Filter, X, FileSpreadsheet } from 'lucide-react'
import toast from 'react-hot-toast'

import { useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'
import OCRUploadButton from '@/components/AI/OCRUploadButton'

const ITEMS_PER_PAGE = 50

export default function PilgrimsPage() {
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPilgrimId, setEditingPilgrimId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { pilgrims, addPilgrim, addPilgrimsBulk, updatePilgrim, deletePilgrim, deletePilgrimsBulk, centerConfig } = useAppStore()

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setIsModalOpen(true)
    }
  }, [searchParams])
  
  const [formData, setFormData] = useState({
    name: '',
    passport: '',
    nationality: 'باكستان',
    group: 'القدوس',
    status: 'مؤكد',
    phone: '',
    registrationDate: new Date().toLocaleDateString('ar-SA')
  })

  const filteredPilgrims = useMemo(() => {
    if (!searchTerm) return pilgrims
    const term = searchTerm.toLowerCase()
    return pilgrims.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.passport && p.passport.toLowerCase().includes(term)) ||
      p.phone.includes(searchTerm) ||
      (p.nationality && p.nationality.toLowerCase().includes(term))
    )
  }, [pilgrims, searchTerm])

  const paginatedPilgrims = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPilgrims.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredPilgrims, currentPage])

  const totalPages = Math.ceil(filteredPilgrims.length / ITEMS_PER_PAGE)

  const handleEdit = (pilgrim: typeof pilgrims[0]) => {
    setEditingPilgrimId(pilgrim.id)
    setFormData({
      name: pilgrim.name || '',
      passport: pilgrim.passport || '',
      nationality: pilgrim.nationality || 'باكستان',
      group: pilgrim.group || 'القدوس',
      status: pilgrim.status || 'مؤكد',
      phone: pilgrim.phone || '',
      registrationDate: pilgrim.registrationDate || new Date().toLocaleDateString('ar-SA')
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      passport: '',
      nationality: 'باكستان',
      group: 'القدوس',
      status: 'مؤكد',
      phone: '',
      registrationDate: new Date().toLocaleDateString('ar-SA')
    })
    setEditingPilgrimId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.passport) {
      toast.error('يرجى ملء البيانات الأساسية')
      return
    }
    try {
      if (editingPilgrimId) {
        await updatePilgrim(editingPilgrimId, formData)
        toast.success('تم تحديث بيانات الحاج بنجاح')
      } else {
        await addPilgrim(formData)
        toast.success('تم إضافة الحاج بنجاح')
      }
      setIsModalOpen(false)
      resetForm()
    } catch {
      toast.error('حدث خطأ أثناء العملية')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الحاج؟')) {
      try {
        await deletePilgrim(id)
        toast.success('تم الحذف بنجاح')
      } catch {
        toast.error('خطأ في الحذف')
      }
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPilgrims.map(p => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} حاج؟`)) {
      try {
        await deletePilgrimsBulk(selectedIds)
        toast.success('تم الحذف الجماعي بنجاح')
        setSelectedIds([])
      } catch {
        toast.error('خطأ في الحذف الجماعي')
      }
    }
  }

  const handleOpenAdd = () => {
    resetForm()
    setIsModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="text-3xl font-black text-gray-800">{centerConfig?.titlePilgrimsPage || 'إدارة الحجاج'}</h1>
                    <p className="text-gray-500 font-bold mt-1">{centerConfig?.subPilgrimsPage || 'إضافة ومتابعة كافة بيانات ضيوف الرحمن'}</p>
                 </div>
                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className="bg-white text-[var(--color-primary)] border-2 border-deep-green px-8 py-4 rounded-2xl font-black shadow-sm flex items-center gap-2 hover:bg-green-50 transition cursor-pointer">
                       <FileSpreadsheet size={20} />
                       {centerConfig?.btnPilgrimUpload || 'رفع ملف إكسل'}
                       <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={async (e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           const promise = new Promise<void>(async (resolve, reject) => {
                             try {
                               const data = await file.arrayBuffer()
                               const workbook = XLSX.read(data)
                               const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                               const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)

                               if (jsonData.length === 0) throw new Error('الملف فارغ')

                               const newPilgrims = jsonData.map(row => ({
                                 name: String(row['الاسم'] || row['Name'] || row['name'] || 'بدون اسم'),
                                 passport: String(row['رقم الجواز'] || row['Passport'] || row['passport'] || 'بدون جواز'),
                                 nationality: String(row['الجنسية'] || row['Nationality'] || row['nationality'] || 'باكستان'),
                                 group: String(row['المجموعة'] || row['Group'] || row['group'] || 'القدوس'),
                                 status: String(row['الحالة'] || row['Status'] || row['status'] || 'مؤكد') as 'مؤكد' | 'في الانتظار' | 'ملغي',
                                 phone: String(row['رقم الجوال'] || row['Phone'] || row['phone'] || ''),
                                 registrationDate: new Date().toLocaleDateString('ar-SA')
                               }))

                               await addPilgrimsBulk(newPilgrims)
                               resolve()
                             } catch (error) {
                               reject(error)
                             }
                           });
                           
                           toast.promise(promise, {
                             loading: 'جاري استخراج البيانات من الملف...',
                             success: 'تم استيراد جميع الحجاج بنجاح!',
                             error: 'حدث خطأ في الملف أو أثناء الرفع'
                           });
                           
                           e.target.value = ''
                         }
                       }} />
                    </label>
                    <button 
                      onClick={handleOpenAdd}
                      className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition"
                    >
                       <UserPlus size={20} />
                       {centerConfig?.btnPilgrimAdd || 'إضافة حاج جديد'}
                    </button>
                 </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {[
                   { label: 'إجمالي المسجلين', count: pilgrims.length, color: 'text-blue-600', bg: 'bg-blue-50' },
                   { label: 'مجموعة القدوس', count: pilgrims.filter(p => p.group === 'القدوس').length, color: 'text-green-600', bg: 'bg-green-50' },
                   { label: 'مجموعة الكفيل', count: pilgrims.filter(p => p.group === 'الكفيل').length, color: 'text-orange-600', bg: 'bg-orange-50' },
                   { label: 'مجموعة البر', count: pilgrims.filter(p => p.group === 'البر').length, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                 ].map((s, i) => (
                   <div key={i} className={`${s.bg} p-6 rounded-[2.5rem] border border-white/50 flex flex-col items-center justify-center`}>
                      <p className="text-[10px] font-black opacity-60 uppercase mb-1">{s.label}</p>
                      <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
                   </div>
                 ))}
              </div>

              {/* Table */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="relative w-96">
                          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            placeholder="بحث بالاسم أو رقم الجواز..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pr-12 pl-4 py-3 bg-gray-50 rounded-2xl outline-none font-bold"
                          />
                       </div>
                       {selectedIds.length > 0 && (
                          <button onClick={handleBulkDelete} className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl font-black hover:bg-red-100 transition flex items-center gap-2">
                             <Trash2 size={18} />
                             حذف المحدد ({selectedIds.length})
                          </button>
                       )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-400">
                        {filteredPilgrims.length} نتيجة
                      </span>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                           <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                              <th className="px-8 py-4 w-10">
                                 <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredPilgrims.length && filteredPilgrims.length > 0} className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-deep-green" />
                              </th>
                              <th className="px-8 py-4">الاسم</th>
                              <th className="px-8 py-4">رقم الجواز</th>
                             <th className="px-8 py-4">المجموعة</th>
                             <th className="px-8 py-4">الحالة</th>
                             <th className="px-8 py-4 text-center">الإجراءات</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                           {paginatedPilgrims.map((p) => (
                             <tr key={p.id} className={`transition ${selectedIds.includes(p.id) ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}>
                                <td className="px-8 py-5">
                                   <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => handleSelect(p.id)} className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-deep-green" />
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-black">
                                         {p.name[0]}
                                      </div>
                                      <div>
                                         <p className="font-black text-gray-800">{p.name}</p>
                                         <p className="text-[10px] text-gray-400 font-bold">{p.phone}</p>
                                      </div>
                                   </div>
                                </td>
                               <td className="px-8 py-5 font-mono text-sm font-bold text-gray-600">{p.passport}</td>
                               <td className="px-8 py-5">
                                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black">
                                     {p.group}
                                  </span>
                               </td>
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${p.status === 'مؤكد' ? 'bg-green-500' : p.status === 'ملغي' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                     <span className="text-xs font-black text-gray-700">{p.status}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-5 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                     <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 transition"><Edit size={18} /></button>
                                     <button 
                                       onClick={() => handleDelete(p.id)}
                                       className="p-2 text-gray-400 hover:text-red-600 transition"
                                     >
                                        <Trash2 size={18} />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 {/* Pagination */}
                 {totalPages > 1 && (
                   <div className="p-6 border-t border-gray-50 flex items-center justify-center gap-2">
                     <button
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       disabled={currentPage === 1}
                       className="px-4 py-2 rounded-2xl font-black text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition"
                     >
                       السابق
                     </button>
                     <span className="px-4 py-2 text-sm font-black text-gray-500">
                       {currentPage} / {totalPages}
                     </span>
                     <button
                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                       disabled={currentPage === totalPages}
                       className="px-4 py-2 rounded-2xl font-black text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition"
                     >
                       التالي
                     </button>
                   </div>
                 )}
              </div>
           </div>
        </main>
      </div>

      {/* Add Pilgrim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); resetForm(); }}></div>
           <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-zoomIn">
              <div className="bg-[var(--color-primary)] p-8 text-white flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black">{editingPilgrimId ? 'تعديل بيانات الحاج' : 'إضافة حاج جديد'}</h2>
                    <p className="text-white/60 text-sm font-bold mt-1">أدخل البيانات الأساسية بدقة</p>
                 </div>
                 <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="p-8 space-y-5">
                 {!editingPilgrimId && (
                   <div className="mb-6">
                     <OCRUploadButton onDataExtracted={(data) => {
                       setFormData(prev => ({
                         ...prev,
                         name: data.name || prev.name,
                         passport: data.passportNumber || prev.passport,
                         nationality: data.nationality || prev.nationality
                       }))
                     }} />
                   </div>
                 )}
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 pr-2">الاسم الكامل (كما في الجواز)</label>
                    <input 
                      className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-deep-green/30 outline-none font-bold transition"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="مثال: أحمد محمد علي"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 pr-2">رقم الجواز</label>
                       <input 
                         className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-deep-green/30 outline-none font-bold transition"
                         value={formData.passport}
                         onChange={e => setFormData({...formData, passport: e.target.value})}
                         placeholder="P-123456"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 pr-2">رقم الجوال</label>
                       <input 
                         className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-deep-green/30 outline-none font-bold transition"
                         value={formData.phone}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                         placeholder="05xxxxxxx"
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 pr-2">المجموعة</label>
                       <select 
                         className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
                         value={formData.group}
                         onChange={e => setFormData({...formData, group: e.target.value})}
                       >
                          <option value="القدوس">مجموعة القدوس</option>
                          <option value="الكفيل">مجموعة الكفيل</option>
                          <option value="البر">مجموعة البر</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 pr-2">الحالة</label>
                       <select 
                         className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
                         value={formData.status}
                         onChange={e => setFormData({...formData, status: e.target.value})}
                       >
                          <option value="مؤكد">مؤكد</option>
                          <option value="تحت المعالجة">تحت المعالجة</option>
                       </select>
                    </div>
                 </div>
                 
                 <button type="submit" className="w-full bg-[var(--color-primary)] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-deep-green/20 hover:scale-[1.02] active:scale-[0.98] transition">
                    {editingPilgrimId ? 'حفظ التعديلات' : 'تأكيد وإضافة الحاج'}
                 </button>
              </div>
           </form>
        </div>
      )}
    </div>
  )
}
