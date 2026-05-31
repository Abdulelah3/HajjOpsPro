'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Users, UserPlus, Search, Shield, Edit, Trash2, X, Upload } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import toast from 'react-hot-toast'

export default function StaffPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { staff, addStaff, updateStaff, deleteStaff } = useAppStore()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    image: '',
    level: 'member',
    order: 1
  })



  const handleEdit = (s: typeof staff[0]) => {
    setEditingId(s.id)
    setFormData({
      name: s.name,
      title: s.title,
      image: s.image || '',
      level: s.level || 'member',
      order: s.order || 1
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      try {
        await deleteStaff(id)
        toast.success('تم الحذف بنجاح')
      } catch (e) {
        toast.error('حدث خطأ أثناء الحذف')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.title) {
      toast.error('يرجى كتابة الاسم والمسمى الوظيفي')
      return
    }
    
    try {
      if (editingId) {
        await updateStaff(editingId, formData as any)
        toast.success('تم تحديث البيانات بنجاح')
      } else {
        await addStaff(formData as any)
        toast.success('تمت إضافة الموظف بنجاح')
      }
      setIsModalOpen(false)
      setEditingId(null)
      setFormData({ name: '', title: '', image: '', level: 'member', order: 1 })
    } catch (e) {
      toast.error('حدث خطأ أثناء الحفظ')
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
                    <h1 className="text-3xl font-black text-gray-800">إدارة الكادر البشري</h1>
                    <p className="text-gray-500 font-bold mt-1 text-sm">إدارة صلاحيات الموظفين والمشرفين الميدانيين والبعثة.</p>
                 </div>
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-green-700 transition shadow-xl"
                 >
                    <UserPlus size={24} />
                    إضافة موظف
                 </button>
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-8 border-b border-gray-50 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                       <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input 
                         placeholder="ابحث عن موظف بالاسم أو الجوال..." 
                         className="w-full pr-12 pl-4 py-3 bg-gray-50 rounded-2xl outline-none border border-gray-100 font-bold text-sm"
                       />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-green-50 px-4 py-2 rounded-lg">
                       <Shield size={14} className="text-green-600" />
                       <span>عدد الموظفين في النظام: {staff.length}</span>
                    </div>
                 </div>

                 {staff.length === 0 ? (
                   <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                         <Users size={48} strokeWidth={1} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-gray-800">لا توجد بيانات موظفين حالياً</h3>
                         <p className="text-gray-400 font-bold mt-2">أضف أول موظف للبدء في توزيع المهام الميدانية.</p>
                      </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                     {staff.sort((a, b) => (a.order || 99) - (b.order || 99)).map(s => (
                       <div key={s.id} className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-xl transition">
                         <img src={s.image || 'https://ui-avatars.com/api/?name='+s.name+'&background=random'} className="w-16 h-16 rounded-2xl object-cover bg-white" alt={s.name} />
                         <div className="flex-1">
                           <h4 className="font-black text-gray-800 text-lg">{s.name}</h4>
                           <p className="text-xs font-bold text-gray-500">{s.title}</p>
                           <p className="text-[10px] text-green-600 font-black mt-1 bg-green-100 inline-block px-2 py-0.5 rounded-full">{s.level === 'head' ? 'رئيس' : s.level === 'vice' ? 'نائب' : s.level === 'specialist' ? 'أخصائي' : 'عضو'}</p>
                         </div>
                         <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                           <button onClick={() => handleEdit(s)} className="p-2 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200"><Edit size={16} /></button>
                           <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200"><Trash2 size={16} /></button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
           </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative z-10 animate-zoomIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800">{editingId ? 'تعديل موظف' : 'إضافة موظف جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-gray-600 mb-2">الاسم</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-gray-100 transition font-bold" placeholder="مثال: أحمد محمد" />
              </div>
              
              <div>
                <label className="block text-sm font-black text-gray-600 mb-2">المسمى الوظيفي</label>
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-gray-100 transition font-bold" placeholder="مثال: مدير المركز" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-600 mb-2">المستوى التنظيمي</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-gray-100 transition font-bold">
                    <option value="head">رئيس</option>
                    <option value="vice">نائب</option>
                    <option value="specialist">أخصائي</option>
                    <option value="member">عضو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-600 mb-2">الترتيب (الأهمية)</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)||1})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-gray-100 transition font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-600 mb-2">رابط الصورة (اختياري)</label>
                <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-gray-100 transition text-left" dir="ltr" placeholder="https://..." />
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-black mt-4 shadow-xl hover:bg-green-700 transition">
                {editingId ? 'حفظ التعديلات' : 'إضافة الموظف'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
