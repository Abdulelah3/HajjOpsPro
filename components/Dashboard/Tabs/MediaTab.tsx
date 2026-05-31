'use client'

import { MonitorPlay, Image as ImageIcon, PlayCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'

export default function MediaTab() {
  const { media } = useAppStore()

  const displayMedia = media

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
      {displayMedia.map((item, i) => (
        <div key={i} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 transition-all hover:scale-105 hover:shadow-xl cursor-pointer">
          <div className="aspect-video relative">
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
              {item.type === 'video' ? <PlayCircle className="text-white opacity-80" size={48} /> : <ImageIcon className="text-white opacity-80" size={48} />}
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="flex items-center gap-2 mb-2">
               <span className={`text-[10px] font-black px-2 py-1 rounded-full ${item.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.type === 'video' ? 'فيديو' : 'ألبوم صور'}
               </span>
            </div>
            <h4 className="font-black text-gray-800">{item.title}</h4>
          </div>
        </div>
      ))}

      {/* Empty States */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-gray-300">
           <MonitorPlay size={40} className="mb-2 opacity-30" />
           <p className="text-xs font-bold">إعلان شاغر</p>
        </div>
      ))}
    </div>
  )
}
