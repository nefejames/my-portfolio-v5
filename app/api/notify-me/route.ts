import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let body: { email?: string; articleTitle?: string; articleSlug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, articleTitle, articleSlug } = body

  if (!email || !articleTitle || !articleSlug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const record = { email, articleTitle, articleSlug, signedUpAt: new Date().toISOString() }
  const key = `notify-me/${articleSlug}/${Date.now()}-${email.replace(/[^a-z0-9]/gi, '_')}.json`

  try {
    await put(key, JSON.stringify(record), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    })
  } catch (err) {
    console.error('notify-me blob write failed:', err)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
