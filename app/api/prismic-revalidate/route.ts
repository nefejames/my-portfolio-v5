import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.secret !== process.env.PRISMIC_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  // Second arg is the cache-life profile for refetched data; 3600s matches
  // the revalidate setting on the Prismic client in prismicio.ts.
  revalidateTag('prismic', { expire: 3600 })

  return NextResponse.json({ revalidated: true })
}
