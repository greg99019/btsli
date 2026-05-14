'use client'

import { usePathname } from 'next/navigation'

const PLATFORM_PATHS = ['/dashboard', '/training', '/progress', '/certificates', '/schedule', '/admin']

export default function ConditionalHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPlatform = PLATFORM_PATHS.some(p => pathname.startsWith(p))
  if (isPlatform) return null
  return <>{children}</>
}
