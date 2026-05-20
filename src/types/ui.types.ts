export interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  active?: boolean
  badge?: number
}

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
}
