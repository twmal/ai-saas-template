import { env } from '@/env'
import { logger } from '@/lib/logger'

/**
 * n8n Integration Library
 * Handles communication with n8n workflows
 */

export interface VideoAnalysisResult {
  Theme: string
  'Trend Source': string
  'Video URL': string
  Hashtags: string[]
  Description: string
  Popularity: number
  'Engagement Type': string[]
  'Script Angle': string
  'AI Prompt Base': string
  Language: string
  Notes: string
  Status?: string
}

export interface N8nWebhookResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

/**
 * Trigger video analysis workflow in n8n
 * @param videoFile - The video file to analyze (as FormData)
 * @param userId - The user ID triggering the analysis
 */
export async function triggerVideoAnalysis(
  videoFile: File,
  userId: string
): Promise<N8nWebhookResponse> {
  try {
    const webhookUrl = env.N8N_WEBHOOK_URL
    const webhookId = env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID

    if (!webhookUrl || !webhookId) {
      throw new Error('n8n webhook configuration is missing')
    }

    // Construct the full webhook URL
    const fullWebhookUrl = `${webhookUrl}/webhook/${webhookId}`

    // Create FormData to send the video file
    const formData = new FormData()
    formData.append('Video', videoFile)
    formData.append('userId', userId)
    formData.append('timestamp', new Date().toISOString())

    logger.info('Triggering n8n video analysis workflow', {
      webhookUrl: fullWebhookUrl,
      userId,
      fileName: videoFile.name,
      fileSize: videoFile.size,
    })

    // Send request to n8n webhook
    const response = await fetch(fullWebhookUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`)
    }

    const result = await response.json()

    logger.info('n8n video analysis workflow triggered successfully', {
      userId,
      result,
    })

    return {
      success: true,
      message: 'Video analysis started successfully',
      data: result,
    }
  } catch (error) {
    logger.error('Failed to trigger n8n video analysis workflow', error as Error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Trigger YouTube analysis workflow in n8n
 * @param youtubeUrl - The YouTube URL to analyze
 * @param userId - The user ID triggering the analysis
 */
export async function triggerYouTubeAnalysis(
  youtubeUrl: string,
  userId: string
): Promise<N8nWebhookResponse> {
  try {
    const webhookUrl = env.N8N_WEBHOOK_URL
    const webhookId = env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID

    // Enhanced error checking with detailed messages
    if (!webhookUrl) {
      const error = 'N8N_WEBHOOK_URL is not configured. Please add it to your .env.local file and restart the server.'
      logger.error(error)
      throw new Error(error)
    }

    if (!webhookId) {
      const error = 'N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID is not configured. Please add it to your .env.local file and restart the server.'
      logger.error(error)
      throw new Error(error)
    }

    // Construct the full webhook URL
    const fullWebhookUrl = `${webhookUrl}/webhook/${webhookId}`

    logger.info('Triggering n8n YouTube analysis workflow', {
      webhookUrl: fullWebhookUrl,
      userId,
      youtubeUrl,
    })

    // Send request to n8n webhook
    // Note: n8n expects "videoUrl" parameter, not "youtubeUrl"
    const response = await fetch(fullWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoUrl: youtubeUrl, // n8n expects "videoUrl" parameter
        userId,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`)
    }

    const result = await response.json()

    logger.info('n8n YouTube analysis workflow triggered successfully', {
      userId,
      result,
    })

    return {
      success: true,
      message: 'YouTube analysis started successfully',
      data: result,
    }
  } catch (error) {
    logger.error(
      'Failed to trigger n8n YouTube analysis workflow',
      error as Error
    )
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check if n8n is configured
 */
export function isN8nConfigured(): boolean {
  return !!(env.N8N_WEBHOOK_URL && env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID)
}

/**
 * Get n8n configuration status
 */
export function getN8nStatus() {
  return {
    configured: isN8nConfigured(),
    webhookUrl: env.N8N_WEBHOOK_URL ? '✓ Configured' : '✗ Not configured',
    videoAnalysisWebhook: env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID
      ? '✓ Configured'
      : '✗ Not configured',
    youtubeAnalysisWebhook: env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID
      ? '✓ Configured'
      : '✗ Not configured',
  }
}

