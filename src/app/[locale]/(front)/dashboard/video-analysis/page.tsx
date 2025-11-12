'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  Youtube, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileVideo,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function VideoAnalysisPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFile) {
      toast.error('请选择要上传的视频文件')
      return
    }

    setIsUploading(true)
    setUploadStatus('idle')
    setStatusMessage('')

    try {
      const formData = new FormData()
      formData.append('video', videoFile)

      const response = await fetch('/api/n8n/video-analysis', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '上传失败')
      }

      setUploadStatus('success')
      setStatusMessage('视频已成功提交分析！n8n 工作流正在处理中，完成后将自动保存到 Notion。')
      toast.success('视频分析已启动！')
      
      // Reset form
      setVideoFile(null)
      const fileInput = document.getElementById('video-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error) {
      setUploadStatus('error')
      setStatusMessage(error instanceof Error ? error.message : '上传失败，请重试')
      toast.error('上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  const handleYouTubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!youtubeUrl) {
      toast.error('请输入 YouTube URL')
      return
    }

    setIsUploading(true)
    setUploadStatus('idle')
    setStatusMessage('')

    try {
      const response = await fetch('/api/n8n/youtube-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '提交失败')
      }

      setUploadStatus('success')
      setStatusMessage('YouTube 视频已成功提交分析！n8n 工作流正在处理中，完成后将自动保存到 Notion。')
      toast.success('YouTube 分析已启动！')
      
      // Reset form
      setYoutubeUrl('')
    } catch (error) {
      setUploadStatus('error')
      setStatusMessage(error instanceof Error ? error.message : '提交失败，请重试')
      toast.error('提交失败')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
      if (!allowedTypes.includes(file.type)) {
        toast.error('不支持的文件格式。请上传 MP4、MOV、AVI 或 MPEG 格式的视频。')
        return
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('文件太大。最大支持 100MB。')
        return
      }

      setVideoFile(file)
      setUploadStatus('idle')
      setStatusMessage('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          视频分析
        </h1>
        <p className="text-muted-foreground mt-2">
          上传视频文件或输入 YouTube URL，AI 将自动分析并保存到 Notion
        </p>
      </div>

      {/* Status Alert */}
      {uploadStatus !== 'idle' && (
        <Alert variant={uploadStatus === 'success' ? 'default' : 'destructive'}>
          {uploadStatus === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            上传视频
          </TabsTrigger>
          <TabsTrigger value="youtube">
            <Youtube className="h-4 w-4 mr-2" />
            YouTube URL
          </TabsTrigger>
        </TabsList>

        {/* Video Upload Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>上传视频文件</CardTitle>
              <CardDescription>
                支持 MP4、MOV、AVI、MPEG 格式，最大 100MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVideoUpload} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="video-upload">选择视频文件</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="flex-1"
                    />
                  </div>
                  {videoFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileVideo className="h-4 w-4" />
                      <span>{videoFile.name}</span>
                      <span className="text-xs">
                        ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!videoFile || isUploading}
                  className="w-full"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      上传中...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      开始分析
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* YouTube URL Tab */}
        <TabsContent value="youtube">
          <Card>
            <CardHeader>
              <CardTitle>YouTube 视频分析</CardTitle>
              <CardDescription>
                输入 YouTube 视频链接进行分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleYouTubeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube URL</Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    支持 youtube.com 和 youtu.be 链接
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!youtubeUrl || isUploading}
                  className="w-full"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Youtube className="mr-2 h-4 w-4" />
                      开始分析
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            工作流程说明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 dark:text-blue-200 space-y-2">
          <p>1. 上传视频或输入 YouTube URL</p>
          <p>2. n8n 工作流自动启动，使用 Google Gemini AI 分析视频内容</p>
          <p>3. 提取主题、标签、描述、热度等信息</p>
          <p>4. 分析结果自动保存到您的 Notion 数据库</p>
          <p className="text-sm mt-4">
            💡 提示：分析过程可能需要几分钟，请稍后在 Notion 中查看结果
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

