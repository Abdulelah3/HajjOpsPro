import { NextResponse } from 'next/server'
import { generateText } from '@/lib/ai'

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { context, apiKey, provider, modelId } = await req.json()

    if (!context) {
      return NextResponse.json({ error: 'Context is required' }, { status: 400 })
    }

    const prompt = `أنت خبير استراتيجي في إدارة الحشود وعمليات الحج.
بناءً على البيانات الحية التالية من نظام إدارة الحجاج:
${JSON.stringify(context, null, 2)}

يرجى تقديم تحليل تنبؤي وتوصيات للإدارة. 
قم بإرجاع الاستجابة بتنسيق JSON فقط وبدون أي نصوص إضافية أو علامات Markdown.
يجب أن يحتوي الـ JSON على المفاتيح التالية:
- completionEstimate (نص: توقع متى سيكتمل وصول جميع الحجاج المتبقين بناء على سرعة العمل الحالية)
- peakHours (نص: توقع أوقات الذروة لحركة الباصات والازدحام)
- risks (مصفوفة نصوص: 2-3 مخاطر محتملة حالية)
- recommendations (مصفوفة نصوص: 3 توصيات ذكية للإدارة لتحسين الكفاءة)
`

    let text = await generateText(prompt, provider, apiKey, modelId)
    
    // Clean up potential markdown formatting from Gemini
    if (text.includes('```json')) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    }

    const parsedData = JSON.parse(text)
    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error('Error in AI Predict API:', error)
    return NextResponse.json({ error: error.message || 'Failed to process AI prediction' }, { status: 500 })
  }
}
