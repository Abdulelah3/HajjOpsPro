import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(apiKey || '')

export function getTextModel(customApiKey?: string) {
  const key = customApiKey || apiKey
  if (!key) throw new Error('Gemini API key is required. Please set it in Settings.')
  const client = new GoogleGenerativeAI(key)
  return client.getGenerativeModel({ model: 'gemini-2.0-flash' })
}

export function getVisionModel(customApiKey?: string) {
  const key = customApiKey || apiKey
  if (!key) throw new Error('Gemini API key is required. Please set it in Settings.')
  const client = new GoogleGenerativeAI(key)
  return client.getGenerativeModel({ model: 'gemini-2.0-flash' })
}
