'use client'

import dynamic from 'next/dynamic'

import { Location } from '@/lib/types'

const MapWrapper = dynamic(() => import('./MapWrapper'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-deep-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-bold">جاري تحميل الخريطة...</p>
      </div>
    </div>
  )
})

interface RealMapProps {
  locations: Location[]
}

export default function RealMap({ locations }: RealMapProps) {
  return <MapWrapper locations={locations} />
}
