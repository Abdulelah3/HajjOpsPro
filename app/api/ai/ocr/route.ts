import { NextResponse } from 'next/server'
import { generateVision } from '@/lib/ai'

export const maxDuration = 60; // Allow more time for vision processing

export async function POST(req: Request) {
  try {
    const { imageBase64, apiKey, provider, modelId } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })
    }

    // Remove the data:image/jpeg;base64, part if present
    const base64Data = imageBase64.split(',')[1] || imageBase64
    const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg'

    const prompt = `أنت مساعد ذكي لاستخراج البيانات من وثائق الهوية (جواز سفر، بطاقة نُسك، تأشيرة).
مهمتك هي قراءة الصورة واستخراج بيانات الحاج بدقة تامة.
قم بإرجاع البيانات بتنسيق JSON فقط وبدون أي نصوص إضافية أو علامات Markdown. 
يجب أن يحتوي الـ JSON على المفاتيح التالية (إذا لم تجد المعلومة اتركها فارغة ""):
- name (الاسم باللغة العربية، أو الإنجليزية إذا لم يوجد عربي)
- passportNumber (رقم الجواز)
- nationality (الجنسية باللغة العربية)
`

    let text = await generateVision(prompt, base64Data, mimeType, provider, apiKey, modelId)
    
    // Clean up potential markdown formatting from Gemini
    if (text.includes('```json')) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    }

    const parsedData = JSON.parse(text)
    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error('Error in AI OCR API:', error)
    return NextResponse.json({ error: error.message || 'Failed to process OCR request' }, { status: 500 })
  }
}
