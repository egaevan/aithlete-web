'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === 'true'

export default function AILayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!AI_ENABLED && pathname === '/dashboard/ai') {
      router.replace('/dashboard/ai/coming-soon')
    }
  }, [pathname, router])

  if (!AI_ENABLED && pathname === '/dashboard/ai') {
    return null
  }

  return <>{children}</>
}
