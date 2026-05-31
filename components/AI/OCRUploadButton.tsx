'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAppStore } from '@/lib/store/useAppStore'

interface OCRUploadButtonProps {
  onDataExtracted: (data: { name?: string, passportNumber?: string, nationality?: string }) => void
}

export default function OCRUploadButton({ onDataExtracted }: OCRUploadButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { centerConfig } = useAppStore()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة صالحة')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('جاري قراءة الوثيقة باستخدام الذكاء الاصطناعي...')

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = async () => {
        const base64 = reader.result as string
        
        const res = await fetch('/api/ai/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, apiKey: centerConfig?.aiApiKey, provider: centerConfig?.aiProvider, modelId: centerConfig?.aiModel })
        })

        const data = await res.json()
        
        if (res.ok) {
          onDataExtracted(data)
          toast.success('تم استخراج البيانات بنجاح!', { id: loadingToast })
        } else {
          throw new Error(data.error || 'حدث خطأ غير متوقع')
        }
        setIsProcessing(false)
        if (fileInputRef.current) fileInputRef.current.value = '' // reset
      }
      
      reader.onerror = () => {
        throw new Error('فشل في قراءة ملف الصورة')
      }
    } catch (error: any) {
      toast.error(`عذراً، حدث خطأ: ${error.message}`, { id: loadingToast })
      setIsProcessing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (centerConfig && (centerConfig.aiEnabled === false || centerConfig.aiEnableOcr === false)) return null;

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 border-2 border-dashed border-emerald-200 text-emerald-700 rounded-2xl hover:bg-emerald-100 hover:border-emerald-300 transition-all font-bold disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>جاري القراءة الذكية...</span>
          </>
        ) : (
          <>
            <Camera size={20} />
            <span>قراءة ذكية من صورة (OCR)</span>
          </>
        )}
      </button>
      <p className="text-[10px] text-gray-400 text-center mt-2">
        ارفع صورة جواز سفر أو بطاقة نُسك لتعبئة البيانات تلقائياً
      </p>
    </div>
  )
}
