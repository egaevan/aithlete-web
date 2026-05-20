'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { type ReactNode } from 'react'
import {
  Activity,
  Dumbbell,
  BarChart3,
  Brain,
  Library,
  TrendingUp,
  LogOut,
  User,
  Calendar,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { useLogout } from '@/services/auth.queries'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === 'true'

const navItems = [
  { icon: Activity, label: 'Dashboard', href: '/dashboard' },
  { icon: Dumbbell, label: 'Workouts', href: '/dashboard/workouts' },
  { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
  { icon: Target, label: 'Goals', href: '/dashboard/goals' },
  { icon: Library, label: 'Exercises', href: '/dashboard/exercises' },
  { icon: TrendingUp, label: 'Progress', href: '/dashboard/progress' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Brain, label: 'AI Coach', href: AI_ENABLED ? '/dashboard/ai' : '/dashboard/ai/coming-soon' },
]

export function Sidebar({ className, mobile = false }: { className?: string; mobile?: boolean }) {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">AITHLETE</span>
      </div>

      <Separator className="bg-border/50" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-border/50" />

      {/* User Profile */}
      <div className="p-4">
        <Link
          href="/dashboard/profile"
          onClick={() => mobile && setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary/50"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user?.name || 'User'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || ''}</p>
          </div>
          <User className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start text-muted-foreground"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border/50',
        mobile
          ? cn(
              'fixed inset-y-0 left-0 z-50 w-64 transform bg-card transition-transform duration-300 ease-in-out',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            )
          : cn('hidden lg:flex lg:w-64 lg:flex-shrink-0', className),
      )}
    >
      {sidebarContent}
    </aside>
  )
}
