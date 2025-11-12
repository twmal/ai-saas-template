'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClerk } from '@clerk/nextjs'
import { ArrowLeft, Shield, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            访问受限
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              您的账户未被授权访问此应用
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              此应用目前仅对特定用户开放。如果您认为这是一个错误，请联系管理员。
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </Button>

            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              需要帮助？请联系管理员获取访问权限
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
