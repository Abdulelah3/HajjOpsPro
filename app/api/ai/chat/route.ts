import { NextResponse } from 'next/server'
import { generateText } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const { message, context, apiKey, provider, modelId } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = `أنت مساعد ذكي (AI Copilot) متقدم لنظام إدارة الحجاج (HajjOpsPro).
مهمتك هي مساعدة إدارة الفندق/المركز في الاستعلام عن الحجاج، الرحلات، الإحصائيات، والعمليات.
يجب أن تجيب بأسلوب احترافي، واضح، ومختصر باللغة العربية.
استخدم البيانات المقدمة لك في السياق (Context) للإجابة على سؤال المستخدم بشكل دقيق. لا تخترع بيانات من عندك.

السياق الحالي (البيانات الحية من النظام):
${JSON.stringify(context, null, 2)}
`

    const prompt = `${systemPrompt}\n\nسؤال المستخدم: ${message}\n\nالإجابة:`

    const text = await generateText(prompt, provider, apiKey, modelId)

    return NextResponse.json({ reply: text })
  } catch (error: any) {
    console.error('Error in AI Chat API:', error)
    return NextResponse.json({ error: error.message || 'Failed to process AI chat request' }, { status: 500 })
  }
}
