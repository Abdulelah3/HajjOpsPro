'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useAppStore } from '@/lib/store/useAppStore'
import { Search, Filter, Users, Loader2, MapPin, Phone, Mail } from 'lucide-react'

export default function SearchPilgrimsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGroup, setFilterGroup] = useState('الكل')
  const [filterStatus, setFilterStatus] = useState('الكل')

  const { pilgrims, groupConfigs, loading, fetchPilgrims } = useAppStore()

  // Use dynamic groups from store or fallback to defaults
  const groups = groupConfigs.length > 0 
    ? groupConfigs.map(g => g.name) 
    : ['القدوس', 'الكفيل', 'البر']

  useEffect(() => {
    fetchPilgrims()
  }, [fetchPilgrims])

  const filtered = pilgrims.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.phone.includes(searchTerm) || (p.email || '').includes(searchTerm)
    const matchesGroup = filterGroup === 'الكل' || p.group === filterGroup
    const matchesStatus = filterStatus === 'الكل' || p.status === filterStatus
    return matchesSearch && matchesGroup && matchesStatus
  })

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">البحث والتصفية</h1>

            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">بحث نصي</label>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="الاسم، الهاتف، الإيميل..."
                      className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">المجموعة</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                  >
                    <option>الكل</option>
                    {groups.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الحالة</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22]/20 focus:border-[#228B22]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>الكل</option>
                    <option>مؤكد</option>
                    <option>في الانتظار</option>
                    <option>ملغي</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterGroup('الكل')
                    setFilterStatus('الكل')
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-semibold text-sm"
                >
                  إعادة تعيين
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <p className="text-gray-600 font-semibold">
                  وجدنا <span className="text-[#228B22]">{filtered.length}</span> نتيجة
                </p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-[#228B22] animate-spin mb-4" />
                  <p className="text-gray-500">جاري البحث...</p>
                </div>
              ) : filtered.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">الاسم</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">الهاتف</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">البريد</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">المجموعة</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">الحالة</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                          <td className="px-6 py-4 text-gray-600">{p.phone}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{p.email}</td>
                          <td className="px-6 py-4 text-gray-600">{p.group}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              p.status === 'مؤكد' ? 'bg-green-100 text-green-700' :
                              p.status === 'في الانتظار' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {p.registrationDate ? new Date(p.registrationDate).toLocaleDateString('ar-SA') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Filter size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">لم يتم العثور على نتائج</p>
                  <p className="text-gray-400 text-sm mt-2">حاول تغيير معايير البحث</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
