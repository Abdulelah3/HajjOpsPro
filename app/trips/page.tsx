'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Plus, Trash2, Edit, X, Calendar, Clock, MapPin, Plane, Building2, Users, FileSpreadsheet } from 'lucide-react'
import toast from 'react-hot-toast'

import { useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'

export default function TripsPage() {
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [movementType, setMovementType] = useState<'وصول' | 'داخلي' | 'مغادرة'>('وصول')
  const [editingTripId, setEditingTripId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { trips, groupConfigs, addTrip, addTripsBulk, updateTrip, deleteTrip, deleteTripsBulk, centerConfig } = useAppStore()

  // Use dynamic groups from store or fallback to defaults
  const groups = groupConfigs.length > 0 
    ? groupConfigs.map(g => g.name) 
    : ['القدوس', 'الكفيل', 'البر']

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setIsModalOpen(true)
    }
  }, [searchParams])
  
  const [formData, setFormData] = useState({
    groupName: groups[0] || 'القدوس',
    flightNumber: '',
    airport: '',
    destination: '',
    pilgrimsCount: 0,
    time: '08:08',
    date: new Date().toISOString().split('T')[0],
    status: 'تحت المعالجة',
    accommodation: ''
  })



  const handleEdit = (trip: any) => {
    setEditingTripId(trip.id)
    setMovementType(trip.movementType)
    setFormData({
      groupName: trip.groupName || '',
      flightNumber: trip.flightNumber || '',
      airport: trip.airport || '',
      destination: trip.destination || '',
      pilgrimsCount: trip.pilgrimsCount || 0,
      time: trip.time || '08:08',
      date: trip.date || '',
      status: trip.status || 'تحت المعالجة',
      accommodation: trip.accommodation || ''
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTripId) {
        await updateTrip(editingTripId, { ...formData, movementType })
        toast.success('تم تحديث الحركة بنجاح')
      } else {
        await addTrip({ ...formData, movementType })
        toast.success('تم إضافة الحركة بنجاح')
      }
      setIsModalOpen(false)
      setEditingTripId(null)
    } catch (error) {
      toast.error('حدث خطأ أثناء العملية')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الحركة؟')) {
      try {
        await deleteTrip(id)
        toast.success('تم الحذف بنجاح')
      } catch (error) {
        toast.error('خطأ في الحذف')
      }
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(trips.map(t => t.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} حركة؟`)) {
      try {
        await deleteTripsBulk(selectedIds)
        toast.success('تم الحذف الجماعي بنجاح')
        setSelectedIds([])
      } catch {
        toast.error('خطأ في الحذف الجماعي')
      }
    }
  }

  const getThemeColor = (type: string) => {
    if (type === 'وصول') return 'bg-[#1DB954]'
    if (type === 'داخلي') return 'bg-[#2D60FF]'
    return 'bg-[#E94949]'
  }

  const isImminent = (date: string, time: string) => {
    if (!date || !time) return false
    try {
      const tripDate = new Date(`${date}T${time}`)
      const now = new Date()
      const diffMs = tripDate.getTime() - now.getTime()
      const diffMins = diffMs / (1000 * 60)
      return diffMins > 0 && diffMins <= 60 // Less than 1 hour and in the future
    } catch (e) {
      return false
    }
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8]" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                 <div>
                    <h1 className="text-3xl font-black text-gray-800">{centerConfig?.titleTripsPage || 'إضافة حركة جديدة'}</h1>
                    <p className="text-gray-500 font-bold mt-1 text-sm">{centerConfig?.subTripsPage || 'متابعة دقيقة لكافة تحركات ضيوف الرحمن ميدانياً'}</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <label className="bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)] px-8 py-4 rounded-2xl font-black shadow-sm flex items-center gap-2 hover:bg-green-50 transition cursor-pointer">
                       <FileSpreadsheet size={20} />
                       رفع ملف إكسل / PDF
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

                               const newTrips = jsonData.map(row => ({
                                 movementType: String(row['نوع الحركة'] || row['Type'] || 'وصول'),
                                 groupName: String(row['المجموعة'] || row['Group'] || 'القدوس'),
                                 pilgrimsCount: parseInt(String(row['العدد'] || row['Count'])) || 0,
                                 date: String(row['التاريخ'] || row['Date'] || new Date().toLocaleDateString('en-CA')),
                                 time: String(row['الوقت'] || row['Time'] || '12:00'),
                                 fromLocation: String(row['من'] || row['From'] || 'غير محدد'),
                                 toLocation: String(row['إلى'] || row['To'] || 'غير محدد'),
                                 status: String(row['الحالة'] || row['Status'] || 'مجدولة'),
                                 transportCompany: String(row['شركة النقل'] || row['Company'] || 'غير محدد'),
                                 busNumber: String(row['رقم الحافلة'] || row['Bus'] || '0')
                               }))

                               await addTripsBulk(newTrips)
                               resolve()
                             } catch (error) {
                               reject(error)
                             }
                           })
                           
                           toast.promise(promise, {
                             loading: 'جاري قراءة واستخراج الحركات من الملف...',
                             success: 'تم استيراد الحركات وإضافتها بنجاح!',
                             error: 'حدث خطأ في الملف أو أثناء الرفع'
                           });
                           
                           e.target.value = ''
                         }
                       }} />
                    </label>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition flex items-center gap-2"
                    >
                       <Plus size={24} />
                       {centerConfig?.btnTripAdd || 'إضافة حركة جديدة'}
                    </button>
                 </div>
              </div>

              {selectedIds.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-2xl flex items-center justify-between border border-red-100">
                     <span className="text-red-600 font-bold px-4">تم تحديد {selectedIds.length} حركة</span>
                     <button onClick={handleBulkDelete} className="bg-red-600 text-white px-6 py-2 rounded-2xl font-black hover:bg-red-700 transition flex items-center gap-2 shadow-sm">
                        <Trash2 size={18} />
                        حذف المحدد
                     </button>
                  </div>
               )}

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                 <table className="w-full text-right">
                    <thead>
                       <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                          <th className="px-8 py-5 w-10">
                              <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === trips.length && trips.length > 0} className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                           </th>
                          <th className="px-8 py-5">نوع الحركة</th>
                          <th className="px-8 py-5">المجموعة</th>
                          <th className="px-8 py-5">العدد</th>
                          <th className="px-8 py-5">التاريخ والوقت</th>
                          <th className="px-8 py-5">الحالة</th>
                          <th className="px-8 py-5 text-center">الإجراءات</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {trips.map((trip) => {
                          const imminent = isImminent(trip.date, trip.time)
                          return (
                          <tr key={trip.id} className={`transition group ${imminent ? 'animate-flicker' : ''} ${selectedIds.includes(trip.id) ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}>
                             <td className="px-8 py-6">
                                 <input type="checkbox" checked={selectedIds.includes(trip.id)} onChange={() => handleSelect(trip.id)} className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                              </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
                                     trip.movementType === 'وصول' ? 'bg-green-100 text-green-700' :
                                     trip.movementType === 'مغادرة' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                     {trip.movementType}
                                  </span>
                                  {imminent && (
                                    <span className="bg-red-500 text-white text-[8px] px-2.5 py-1 rounded-full animate-pulse font-black shadow-lg">⚠ وصول وشيك</span>
                                  )}
                                </div>
                             </td>
                             <td className="px-8 py-6 font-black text-gray-800">{trip.groupName}</td>
                             <td className="px-8 py-6 font-black text-green-600">{trip.pilgrimsCount}</td>
                             <td className="px-8 py-6">
                                <div className="flex flex-col text-xs font-bold text-gray-500">
                                   <span>{trip.date}</span>
                                   <span className="text-[10px] opacity-60">{trip.time}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-sm font-black text-gray-400">{trip.status}</td>
                             <td className="px-8 py-6 text-center">
                                <div className="flex items-center justify-center gap-3">
                                   <button onClick={() => handleEdit(trip)} className="text-gray-300 hover:text-green-600 transition-colors"><Edit size={18} /></button>
                                   <button onClick={() => handleDelete(trip.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                </div>
                             </td>
                          </tr>
                          )
                       })}
                    </tbody>
                 </table>
              </div>
           </div>
        </main>
      </div>

      {/* Modal - Compact & Functional */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => { setIsModalOpen(false); setEditingTripId(null); }}></div>
           <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoomIn">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                 <h2 className="text-xl font-black text-gray-800">{editingTripId ? 'تعديل الحركة' : 'إضافة حركة جديدة'}</h2>
                 <button type="button" onClick={() => { setIsModalOpen(false); setEditingTripId(null); }} className="text-gray-400 hover:text-gray-600 p-2">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 space-y-6">
                 {/* Type Selector */}
                 <div className="space-y-2">
                    <label className="block text-right text-[10px] font-black text-gray-400 pr-2 uppercase">نوع الحركة</label>
                    <div className="flex bg-[#F9FAFB] p-1 rounded-full border border-gray-100">
                       {(['وصول', 'داخلي', 'مغادرة'] as const).map(type => (
                         <button
                           key={type}
                           type="button"
                           onClick={() => setMovementType(type)}
                           className={`flex-1 py-2.5 rounded-full font-black text-xs transition-all ${
                             movementType === type 
                               ? (type === 'وصول' ? 'bg-[#1DB954] text-white shadow-md' : type === 'داخلي' ? 'bg-[#2D60FF] text-white shadow-md' : 'bg-[#E94949] text-white shadow-md')
                               : 'text-gray-400 hover:text-gray-600'
                           }`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">اسم المجموعة</label>
                       <select 
                         className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold text-xs"
                         value={formData.groupName}
                         onChange={e => setFormData({...formData, groupName: e.target.value})}
                       >
                         {groups.map(g => <option key={g} value={g}>{g}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">العدد</label>
                       <input 
                         type="number"
                         className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold text-xs"
                         value={formData.pilgrimsCount || ''}
                         onChange={e => setFormData({...formData, pilgrimsCount: parseInt(e.target.value) || 0})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">رقم/اسم الرحلة</label>
                       <input 
                         className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold placeholder:text-gray-300 text-xs"
                         placeholder="مثال: SV-123"
                         value={formData.flightNumber}
                         onChange={e => setFormData({...formData, flightNumber: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">التاريخ</label>
                       <div className="relative">
                          <input 
                            type="date"
                            className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold text-xs text-right cursor-pointer"
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                          />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">الوقت</label>
                       <div className="relative">
                          <input 
                            type="time"
                            className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold text-xs text-right cursor-pointer"
                            value={formData.time}
                            onChange={e => setFormData({...formData, time: e.target.value})}
                          />
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">الحالة</label>
                       <select 
                         className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold text-xs appearance-none"
                         value={formData.status}
                         onChange={e => setFormData({...formData, status: e.target.value})}
                       >
                          <option>تحت المعالجة</option>
                          <option>تم الوصول</option>
                          <option>تم المغادرة</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">المطار</label>
                       <input 
                         className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold placeholder:text-gray-300 text-xs"
                         placeholder="مثال: مطار الملك عبدالعزيز"
                         value={formData.airport}
                         onChange={e => setFormData({...formData, airport: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">الوجهة</label>
                       <input 
                         className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold placeholder:text-gray-300 text-xs"
                         placeholder="مثال: مكة المكرمة"
                         value={formData.destination}
                         onChange={e => setFormData({...formData, destination: e.target.value})}
                       />
                    </div>

                    <div className="col-span-2 space-y-2">
                       <label className="block text-right text-[10px] font-black text-gray-400 pr-2">السكن</label>
                       <input 
                         className="w-full p-3 bg-[#F9FAFB] rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 outline-none font-bold placeholder:text-gray-300 text-xs"
                         placeholder="اسم الفندق / المركز"
                         value={formData.accommodation}
                         onChange={e => setFormData({...formData, accommodation: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="submit" 
                      className={`flex-[2] ${getThemeColor(movementType)} text-white py-4 rounded-2xl font-black text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all`}
                    >
                       إضافة السجل
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-[#F3F4F6] text-gray-500 py-4 rounded-2xl font-black text-base hover:bg-gray-200 transition"
                    >
                       إلغاء
                    </button>
                 </div>
              </div>
           </form>
        </div>
      )}
    </div>
  )
}
