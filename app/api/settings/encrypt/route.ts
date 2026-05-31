import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/crypto'

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json()

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 400 })
    }

    const encrypted = encrypt(apiKey.trim())

    return NextResponse.json({ encrypted })
  } catch (error: any) {
    console.error('Encryption error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to encrypt API key' },
      { status: 500 }
    )
  }
}
