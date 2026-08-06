'use client'

import posthog from 'posthog-js'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    posthog.capture('$pageview')
    return () => {
      posthog.capture('$pageleave')
    }
  }, [pathname, searchParams])

  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // instrumentation-client.ts initialises PostHog before hydration when both
    // env vars are present. This useEffect is the fallback: if the build ran
    // before the env vars were set (so instrumentation-client skipped init),
    // we initialise here instead. posthog.__loaded guards against double-init.
    const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
    if (key && host && !posthog.__loaded) {
      const apiHost = host.startsWith('http') ? host : `https://${host}`
      posthog.init(key, {
        api_host: apiHost,
        defaults: '2026-05-30',
        capture_exceptions: true,
        capture_pageview: false,
        capture_pageleave: true,
      })
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  )
}
