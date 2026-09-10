import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  const errors: string[] = []

  // Add to audience list
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (audienceId) {
    try {
      await resend.contacts.create({ audienceId, email, unsubscribed: false })
    } catch (err) {
      errors.push(`audience: ${err}`)
    }
  }

  // Notify site owner with article context
  try {
    await resend.emails.send({
      from: 'Portfolio <noreply@nefeatori.com>',
      to: 'nefejames1@gmail.com',
      subject: `New reader waiting: "${articleTitle}"`,
      text: `${email} signed up to be notified when "${articleTitle}" drops.\n\nArticle slug: ${articleSlug}`,
    })
  } catch (err) {
    errors.push(`email: ${err}`)
  }

  if (errors.length === 2) {
    // Both failed — surface the error to the user
    console.error('notify-me failed:', errors)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
