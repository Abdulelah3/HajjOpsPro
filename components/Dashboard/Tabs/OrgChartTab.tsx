'use client'

import { User, Award, Briefcase, Star } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'

export default function OrgChartTab() {
  const { staff, centerConfig } = useAppStore()

  // Sort by order to give full manual control
  const sortedStaff = [...staff].sort((a, b) => (a.order || 0) - (b.order || 0))

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'head': return { text: 'رئيس المركز' }
      case 'vice': return { text: 'نائب رئيس المركز' }
      case 'specialist': return { text: 'أخصائي' }
      default: return { text: 'عضو' }
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Custom Cover & Green Overlay Banner */}
      <div className="relative bg-[var(--color-primary)] rounded-[2.5rem] p-10 text-white overflow-hidden shadow-xl border border-gray-100/20">
        {/* 1. Background Cover & Green Overlay Wrapper (Isolated from space-y and flex) */}
        {centerConfig?.systemCover && (
          <div className="absolute inset-0 z-0 !m-0 overflow-hidden pointer-events-none">
            <img 
              src={centerConfig.systemCover} 
              alt="System Cover" 
              className="absolute inset-0 w-full h-full object-cover !m-0"
            />
            <div className="absolute inset-0 bg-[var(--color-primary)]/80 backdrop-blur-md !m-0 z-10"></div>
          </div>
        )}
        
        {/* 2. Main Content */}
        <div className="relative z-20 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">الهيكل التنظيمي</h2>
            <p className="text-white/90 font-bold text-sm tracking-wide bg-white/10 py-1 px-4 rounded-full border border-white/20 backdrop-blur-md inline-block mt-1">
              {centerConfig?.centerName || 'مركز ضيافة الحجاج'}
            </p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl shadow-inner">
            <div className="text-4xl font-black tracking-tight text-white">{staff.length}</div>
            <p className="text-white/80 text-xs font-bold mt-1 uppercase tracking-wider">إجمالي الكادر</p>
          </div>
        </div>
      </div>

      {/* All Staff - Same Design, Stacked Vertically */}
      {sortedStaff.map((member) => {
        const badge = getLevelBadge(member.level)
        return (
          <div key={member.id} className="bg-white rounded-[2.5rem] shadow-sm border-2 border-[var(--color-primary)]/20 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Photo Side */}
              <div className="md:w-72 bg-gradient-to-b from-gray-50 to-gray-100/30 flex flex-col items-center justify-center p-8 flex-shrink-0">
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-[var(--color-primary)] shadow-2xl bg-white p-1 ring-4 ring-[var(--color-primary)]/15">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-[1.5rem] flex items-center justify-center">
                      <User size={40} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg">
                    <Star size={12} />
                    {member.title}
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mt-3">{member.name}</h3>
                </div>
              </div>

              {/* Info Side */}
              <div className="flex-1 p-8 space-y-5">
                <div>
                  <h4 className="text-base font-black text-gray-800 flex items-center gap-2 mb-3">
                    <Briefcase size={18} className="text-orange-400" />
                    المسيرة المهنية
                  </h4>
                  <p className="text-gray-600 font-bold leading-relaxed text-sm bg-gray-50 p-5 rounded-2xl">
                    {member.bio || 'لم يتم إضافة نبذة عن المسيرة المهنية بعد. يمكنك التعديل من صفحة الإعدادات.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-black text-gray-800 flex items-center gap-2 mb-3">
                    <Award size={18} className="text-[var(--color-primary)]" />
                    الخبرات والتخصصات
                  </h4>
                  <p className="text-gray-600 font-bold leading-relaxed text-sm bg-gray-50 p-5 rounded-2xl">
                    {member.experience || 'لم يتم إضافة الخبرات بعد. يمكنك التعديل من صفحة الإعدادات.'}
                  </p>
                </div>

                {member.specializations && member.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {member.specializations.map((spec: string, i: number) => (
                      <span key={i} className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-2xl text-xs font-black">{spec}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Empty State */}
      {staff.length === 0 && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center p-20 text-gray-300">
          <User size={64} strokeWidth={1} />
          <p className="mt-4 font-black text-xl text-center">لا توجد بيانات موظفين حالياً<br /><span className="text-xs">يرجى الإضافة من الإعدادات ← الهيكل التنظيمي</span></p>
        </div>
      )}
    </div>
  )
}
