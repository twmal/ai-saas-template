'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Video,
  Youtube,
  History,
  Settings,
  Sparkles,
  ChevronRight,
  Home,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string | null
  children?: NavItem[]
}

const dashboardNavItems: NavItem[] = [
  {
    title: '概览',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: '视频分析',
    href: '/dashboard/video-analysis',
    icon: Video,
    badge: null,
  },
  {
    title: 'YouTube 分析',
    href: '/dashboard/youtube-analysis',
    icon: Youtube,
    badge: null,
  },
  {
    title: '分析历史',
    href: '/dashboard/history',
    icon: History,
    badge: null,
  },
  {
    title: '设置',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    // Auto-expand menu items containing current path
    const expandedItem = dashboardNavItems.find(item =>
      item.children?.some(child => pathname.startsWith(child.href))
    )
    if (expandedItem) {
      setExpandedItems([expandedItem.href])
    }
  }, [pathname])

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center mb-2">
          <div className="relative">
            <span className="text-xl font-bold gradient-text">Video</span>
            <span className="text-xl font-bold text-sidebar-foreground ml-1">
              AI
            </span>
            <Sparkles className="absolute -top-1 -right-4 h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-sidebar-foreground/70">视频分析工作台</p>
        <Badge variant="secondary" className="mt-2 text-xs">
          个人版
        </Badge>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.firstName || user.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
        {dashboardNavItems.map(item => {
          const Icon = item.icon
          const isExpanded = expandedItems.includes(item.href)
          const hasChildren = item.children && item.children.length > 0
          const isActive =
            mounted &&
            !hasChildren &&
            (pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href)))
          const hasActiveChild =
            mounted &&
            hasChildren &&
            item.children?.some(child => pathname.startsWith(child.href))

          return (
            <div key={item.href}>
              {/* Main menu item */}
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleExpanded(item.href)}
                  className={cn(
                    'group flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    hasActiveChild
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <div className="flex items-center">
                    <Icon
                      className={cn(
                        'h-4 w-4 mr-3 transition-colors',
                        hasActiveChild
                          ? 'text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/70'
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <div className="flex items-center">
                    <Icon
                      className={cn(
                        'h-4 w-4 mr-3 transition-colors',
                        isActive
                          ? 'text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/70'
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}

              {/* Submenu items */}
              {hasChildren && isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children?.map(child => {
                    const ChildIcon = child.icon
                    const isChildActive = pathname.startsWith(child.href)

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200',
                          isChildActive
                            ? 'bg-sidebar-accent/50 text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground'
                        )}
                      >
                        <ChildIcon className="h-3.5 w-3.5 mr-2" />
                        <span>{child.title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  )
}

