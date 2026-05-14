'use client'

import { usePathname } from 'next/navigation'

const PLATFORM_PATHS = ['/dashboard', '/training', '/progress', '/certificates', '/schedule', '/admin']

export default function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPlatform = PLATFORM_PATHS.some(p => pathname.startsWith(p))

  if (isPlatform) {
    return <>{children}</>
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden">
      {children}
    </main>
  )
}
