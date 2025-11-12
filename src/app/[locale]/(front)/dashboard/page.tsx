'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@clerk/nextjs'
import {
  Video,
  Youtube,
  History,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          欢迎回来，{user?.firstName || '用户'}！
        </h1>
        <p className="text-muted-foreground mt-2">
          使用 AI 分析视频内容，自动保存到 Notion 数据库
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日分析</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              视频分析次数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本周分析</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              累计分析视频
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总计</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              历史记录
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>上传视频分析</CardTitle>
                <CardDescription>
                  上传本地视频文件进行 AI 分析
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard/video-analysis">
                开始分析
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Youtube className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle>YouTube 分析</CardTitle>
                <CardDescription>
                  输入 YouTube URL 进行分析
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg" variant="outline">
              <Link href="/dashboard/video-analysis">
                开始分析
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            最近活动
          </CardTitle>
          <CardDescription>
            您最近的视频分析记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>暂无分析记录</p>
            <p className="text-sm mt-2">
              开始上传视频或输入 YouTube URL 进行分析
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/dashboard/video-analysis">
                立即开始
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            功能说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>✨ 使用 Google Gemini AI 分析视频内容</p>
          <p>📊 自动提取主题、标签、描述、热度等信息</p>
          <p>💾 分析结果自动保存到 Notion 数据库</p>
          <p>🎯 支持视频文件上传和 YouTube URL 分析</p>
        </CardContent>
      </Card>
    </div>
  )
}
