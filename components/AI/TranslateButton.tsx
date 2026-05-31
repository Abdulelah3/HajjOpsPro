'use client'

import { useState } from 'react'
import { Globe, Loader2, Copy, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAppStore } from '@/lib/store/useAppStore'

interface TranslateButtonProps {
  originalText: string
}

export default function TranslateButton({ originalText }: TranslateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState('')
  const [targetLang, setTargetLang] = useState('Urdu (أوردو)')
  const [copied, setCopied] = useState(false)
  const { centerConfig } = useAppStore()

  const languages = [
    'Urdu (أوردو)',
    'Indonesian (إندونيسي)',
    'Turkish (تركي)',
    'Persian (فارسي)',
    'English (إنجليزي)',
    'French (فرنسي)'
  ]

  const handleTranslate = async () => {
    if (!originalText) return
    
    setIsTranslating(true)
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText, targetLang, apiKey: centerConfig?.aiApiKey, provider: centerConfig?.aiProvider, modelId: centerConfig?.aiModel })
      })

      const data = await res.json()
      
      if (res.ok) {
        setTranslatedText(data.translatedText)
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error('فشل في الترجمة')
    } finally {
      setIsTranslating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('تم النسخ')
  }

  if (centerConfig && (centerConfig.aiEnabled === false || centerConfig.aiEnableTranslation === false)) return null;

  return (
    <div className="relative inline-block text-right w-full mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
      >
        <Globe size={14} />
        ترجمة ذكية
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm space-y-3 animate-fadeIn">
          <div className="flex gap-2">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center justify-center min-w-[80px] hover:bg-blue-700 disabled:opacity-50"
            >
              {isTranslating ? <Loader2 size={16} className="animate-spin" /> : 'ترجم'}
            </button>
          </div>

          {translatedText && (
            <div className="relative bg-white border border-gray-200 rounded-lg p-3 pt-8">
              <button
                onClick={copyToClipboard}
                className="absolute top-2 left-2 text-gray-400 hover:text-gray-700"
                title="نسخ"
              >
                {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              <p className="text-sm font-bold text-gray-800 leading-relaxed text-right" dir="auto">
                {translatedText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
