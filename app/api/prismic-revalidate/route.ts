import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.secret !== process.env.PRISMIC_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  revalidateTag('prismic', { expire: 3600 })

  // Explicitly bust the full route cache for all Prismic-driven pages
  revalidatePath('/', 'layout')

  return NextResponse.json({ revalidated: true })
}
