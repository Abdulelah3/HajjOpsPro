import { getTextModel, getVisionModel } from './gemini'
import { decrypt } from './crypto'

export type AIProvider = 'gemini' | 'openai' | 'groq' | 'anthropic' | 'openrouter'

export async function generateText(prompt: string, provider: AIProvider = 'gemini', apiKey?: string, modelId?: string) {
  // Decrypt the API key if it was encrypted in Firestore
  const key = apiKey ? decrypt(apiKey) : undefined

  if (provider === 'openai') {
    if (!key) throw new Error('OpenAI API Key is required. Please set it in Settings.')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: modelId || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.choices[0].message.content
  } else if (provider === 'groq') {
    if (!key) throw new Error('Groq API Key is required. Please set it in Settings.')
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: modelId || 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.choices[0].message.content
  } else if (provider === 'anthropic') {
    if (!key) throw new Error('Anthropic API Key is required. Please set it in Settings.')
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelId || 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.content[0].text
  } else if (provider === 'openrouter') {
    if (!key) throw new Error('OpenRouter API Key is required. Please set it in Settings.')
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: modelId || 'google/gemini-2.0-flash',
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.choices[0].message.content
  } else {
    // gemini
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const geminiKey = key || process.env.GEMINI_API_KEY
    if (!geminiKey) throw new Error('Gemini API Key is required. Please set it in Settings.')
    const client = new GoogleGenerativeAI(geminiKey)
    const model = client.getGenerativeModel({ model: modelId || 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  }
}

export async function generateVision(prompt: string, base64Data: string, mimeType: string, provider: AIProvider = 'gemini', apiKey?: string, modelId?: string) {
  // Decrypt the API key if it was encrypted in Firestore
  const key = apiKey ? decrypt(apiKey) : undefined

  if (provider === 'openai') {
    if (!key) throw new Error('OpenAI API Key is required. Please set it in Settings.')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: modelId || 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
            ]
          }
        ]
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.choices[0].message.content
  } else if (provider === 'groq') {
    if (!key) throw new Error('Groq API Key is required. Please set it in Settings.')
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview', // Force vision model for groq as it differs from text
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
            ]
          }
        ]
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.choices[0].message.content
  } else if (provider === 'anthropic') {
    if (!key) throw new Error('Anthropic API Key is required. Please set it in Settings.')
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelId || 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mimeType as any, data: base64Data } },
              { type: 'text', text: prompt }
            ]
          }
        ]
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.content[0].text
  } else if (provider === 'openrouter') {
    if (!key) throw new Error('OpenRouter API Key is required. Please set it in Settings.')
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: modelId || 'google/gemini-2.0-flash',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
            ]
          }
        ]
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.choices[0].message.content
  } else {
    // gemini
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const geminiKey = key || process.env.GEMINI_API_KEY
    if (!geminiKey) throw new Error('Gemini API Key is required. Please set it in Settings.')
    const client = new GoogleGenerativeAI(geminiKey)
    const model = client.getGenerativeModel({ model: modelId || 'gemini-2.0-flash' })
    const image = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    }
    const result = await model.generateContent([prompt, image])
    const response = await result.response
    return response.text()
  }
}
