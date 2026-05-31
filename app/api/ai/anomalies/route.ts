import { NextResponse } from 'next/server'
import { generateText } from '@/lib/ai'

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { context, apiKey, provider, modelId } = await req.json()

    if (!context) {
      return NextResponse.json({ error: 'Context is required' }, { status: 400 })
    }

    const prompt = `أنت نظام مراقبة ذكي (Anomaly Detector) مخصص لمراقبة عمليات الحج.
لديك البيانات الحالية التالية:
${JSON.stringify(context, null, 2)}

مهمتك هي اكتشاف أي حالات شاذة أو مشاكل محتملة في العمليات. 
أمثلة للحالات الشاذة:
- رحلة متأخرة عن وقتها المتوقع بكثير.
- تناقض بين أعداد الحجاج المسجلين والهدف المطلوب.
- حجاج بدون حالة مؤكدة (تحت المعالجة).
- عدد كبير من الحجاج في موقع واحد يتجاوز السعة.

إذا وجدت حالات شاذة، قم بإرجاع مصفوفة من التنبيهات بصيغة JSON.
تنسيق الـ JSON المطلوب (مصفوفة من الكائنات، إذا لم يكن هناك شيء أرجع مصفوفة فارغة []):
[
  {
    "type": "error" | "warning" | "info",
    "title": "عنوان التنبيه",
    "message": "تفاصيل التنبيه والسبب"
  }
]
يجب ألا تعيد أي نصوص أو markdown إضافي غير الـ JSON.
`

    let text = await generateText(prompt, provider, apiKey, modelId)
    
    // Clean up potential markdown formatting from Gemini
    if (text.includes('```json')) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    }

    const parsedData = JSON.parse(text)
    return NextResponse.json(Array.isArray(parsedData) ? parsedData : [])
  } catch (error: any) {
    console.error('Error in AI Anomalies API:', error)
    return NextResponse.json({ error: error.message || 'Failed to process AI anomalies' }, { status: 500 })
  }
}
