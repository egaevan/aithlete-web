import { DashboardShell } from '@/components/layout/dashboard-shell'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <DashboardShell>{children}</DashboardShell>
      <Toaster />
    </QueryProvider>
  )
}
