import { NextResponse } from 'next/server'
import { generateText } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const { text, targetLang, apiKey, provider, modelId } = await req.json()

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Text and Target Language are required' }, { status: 400 })
    }

    const prompt = `أنت مترجم محترف وخبير في لغات دول العالم الإسلامي وحجاج بيت الله الحرام.
يرجى ترجمة النص التالي إلى اللغة: ${targetLang}
النص: "${text}"

يجب أن تكون الترجمة دقيقة، واضحة، ומحترمة (تليق بضيوف الرحمن).
قم بإرجاع النص المترجم فقط بدون أي إضافات أو علامات.
`

    const resultText = await generateText(prompt, provider, apiKey, modelId)
    const translatedText = resultText.trim()

    return NextResponse.json({ translatedText })
  } catch (error: any) {
    console.error('Error in AI Translate API:', error)
    return NextResponse.json({ error: error.message || 'Failed to process AI translation' }, { status: 500 })
  }
}
