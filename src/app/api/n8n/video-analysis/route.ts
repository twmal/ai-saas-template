import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { triggerVideoAnalysis } from '@/lib/n8n'
import { logger } from '@/lib/logger'

/**
 * API Route: POST /api/n8n/video-analysis
 * Triggers n8n video analysis workflow
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the form data
    const formData = await req.formData()
    const videoFile = formData.get('video') as File

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
    if (!allowedTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a video file (MP4, MOV, AVI, MPEG)' },
        { status: 400 }
      )
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB' },
        { status: 400 }
      )
    }

    logger.info('Received video analysis request', {
      userId,
      fileName: videoFile.name,
      fileSize: videoFile.size,
      fileType: videoFile.type,
    })

    // Trigger n8n workflow
    const result = await triggerVideoAnalysis(videoFile, userId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to trigger video analysis' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Video analysis started successfully',
      data: result.data,
    })
  } catch (error) {
    logger.error('Error in video analysis API route', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

