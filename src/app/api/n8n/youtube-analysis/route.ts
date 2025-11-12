import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { triggerYouTubeAnalysis } from '@/lib/n8n'
import { logger } from '@/lib/logger'

/**
 * API Route: POST /api/n8n/youtube-analysis
 * Triggers n8n YouTube analysis workflow
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

    // Get the request body
    const body = await req.json()
    const { youtubeUrl } = body

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'No YouTube URL provided' },
        { status: 400 }
      )
    }

    // Validate YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL format' },
        { status: 400 }
      )
    }

    logger.info('Received YouTube analysis request', {
      userId,
      youtubeUrl,
    })

    // Trigger n8n workflow
    const result = await triggerYouTubeAnalysis(youtubeUrl, userId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to trigger YouTube analysis' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'YouTube analysis started successfully',
      data: result.data,
    })
  } catch (error) {
    logger.error('Error in YouTube analysis API route', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

