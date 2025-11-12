'use client'

import { AuthGuardClient } from '@/components/auth'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuardClient requireAuth>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto ml-64">
          <div className="container mx-auto p-6 max-w-7xl">{children}</div>
        </main>
      </div>
    </AuthGuardClient>
  )
}

