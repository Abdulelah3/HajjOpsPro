'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'assistant',
    content: 'مرحباً بك! أنا المساعد الذكي لنظام HajjOpsPro. كيف يمكنني مساعدتك اليوم بخصوص الحجاج، الرحلات، أو الإحصائيات؟'
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Data for context
  const { pilgrims, trips, centerConfig } = useAppStore()

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const quickPrompts = [
    'كم عدد الحجاج المتواجدين حالياً؟',
    'كم رحلة نشطة لدينا اليوم؟',
    'أعطني ملخصاً للحجاج المتبقين',
  ]

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build optimized lightweight context from store
      const arrived = pilgrims.length
      const departed = trips.filter(t => t.movementType === 'مغادرة').reduce((acc, t) => acc + (Number(t.pilgrimsCount) || 0), 0)
      const present = Math.max(0, arrived - departed)

      // Lightweight pilgrim roster: name, group, status only (max 150 to prevent token overflow)
      const pilgrimRoster = pilgrims.slice(0, 150).map(p => ({
        name: p.name,
        group: p.group,
        status: p.status,
        nationality: p.nationality || ''
      }))

      // Group breakdown stats
      const groupBreakdown: Record<string, number> = {}
      pilgrims.forEach(p => {
        groupBreakdown[p.group] = (groupBreakdown[p.group] || 0) + 1
      })
      
      const context = {
        centerName: centerConfig?.centerName || 'المركز',
        stats: {
          totalTarget: centerConfig?.totalPilgrimsTarget || 0,
          arrived,
          departed,
          present,
          remaining: Math.max(0, (centerConfig?.totalPilgrimsTarget || 0) - arrived)
        },
        activeTripsCount: trips.length,
        pilgrimsCount: pilgrims.length,
        pilgrimRoster,
        pilgrimRosterNote: pilgrims.length > 150 ? `يوجد ${pilgrims.length} حاج إجمالاً، تم عرض أول 150 فقط. اطلب من المستخدم تحديد اسم الحاج للبحث.` : undefined,
        groupBreakdown,
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context, apiKey: centerConfig?.aiApiKey, provider: centerConfig?.aiProvider, modelId: centerConfig?.aiModel })
      })

      const data = await res.json()
      
      if (res.ok) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.reply }])
      } else {
        throw new Error(data.error || 'حدث خطأ غير متوقع')
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `عذراً، حدث خطأ: ${error.message}` }])
    } finally {
      setIsLoading(false)
    }
  }

  if (centerConfig && (centerConfig.aiEnabled === false || centerConfig.aiEnableChat === false)) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 bg-[var(--color-primary)] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fadeIn" dir="rtl" style={{ height: '500px', maxHeight: '80vh' }}>
          
          {/* Header */}
          <div className="bg-[var(--color-primary)] text-white p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-2xl">
              <Sparkles size={20} className="text-yellow-300" />
            </div>
            <div>
              <h3 className="font-black text-sm">المساعد الذكي (AI Copilot)</h3>
              <p className="text-[10px] text-white/70 font-bold">مدعوم بـ Google Gemini</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm font-bold leading-relaxed max-w-[80%] ${msg.role === 'user' ? 'bg-[var(--color-primary)] text-white rounded-tl-sm' : 'bg-white border border-gray-100 shadow-sm text-gray-700 rounded-tr-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-700 rounded-tr-sm">
                  <Loader2 size={16} className="animate-spin text-emerald-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
              {quickPrompts.map((prompt, idx) => (
                <button 
                  key={idx}
                  onClick={() => sendMessage(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="اسألني أي شيء..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all"
            />
            <button 
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-2xl flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-transform"
            >
              <Send size={16} className="rotate-180" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
