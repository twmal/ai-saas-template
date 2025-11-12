import { logger } from '@/lib/logger'
import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

/**
 * Debug endpoint for Clerk webhooks
 * This endpoint helps diagnose webhook signature verification issues
 * 
 * Usage: Point your Clerk webhook to this endpoint temporarily to see
 * what headers and body format are being received
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()

    // Collect all headers
    const allHeaders: Record<string, string> = {}
    headersList.forEach((value, key) => {
      allHeaders[key] = value
    })

    // Extract Svix headers specifically
    const svixHeaders = {
      'svix-id': headersList.get('svix-id'),
      'svix-timestamp': headersList.get('svix-timestamp'),
      'svix-signature': headersList.get('svix-signature'),
    }

    // Parse body as JSON for inspection
    let parsedBody: any = null
    try {
      parsedBody = JSON.parse(body)
    } catch (e) {
      parsedBody = { error: 'Body is not valid JSON', rawBody: body }
    }

    const debugInfo = {
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.url,
        bodyLength: body.length,
        bodyPreview: body.substring(0, 200),
      },
      headers: {
        all: allHeaders,
        svix: svixHeaders,
      },
      body: {
        parsed: parsedBody,
        eventType: parsedBody?.type || 'unknown',
        eventId: parsedBody?.id || 'unknown',
      },
      environment: {
        hasWebhookSecret: !!process.env.CLERK_WEBHOOK_SECRET,
        webhookSecretPrefix: process.env.CLERK_WEBHOOK_SECRET?.substring(0, 8),
        webhookSecretLength: process.env.CLERK_WEBHOOK_SECRET?.length,
      },
    }

    // Log the debug info
    logger.info('🔍 Clerk Webhook Debug Info:', debugInfo)

    // Return the debug info as response
    return NextResponse.json(
      {
        success: true,
        message: 'Debug information logged and returned',
        debug: debugInfo,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Debug endpoint error:', error as Error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// Also support GET for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Clerk webhook debug endpoint is active',
    usage: 'Send POST requests from Clerk Dashboard to this endpoint to debug webhook issues',
  })
}

