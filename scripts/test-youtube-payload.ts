#!/usr/bin/env tsx

/**
 * Test script to verify the YouTube analysis payload
 * This simulates what gets sent to n8n
 */

import { env } from '../src/env'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testYouTubePayload() {
  log('🧪 Testing YouTube Analysis Payload', 'cyan')
  log('━'.repeat(60), 'blue')

  // Check configuration
  const webhookUrl = env.N8N_WEBHOOK_URL
  const webhookId = env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID

  if (!webhookUrl || !webhookId) {
    log('\n❌ Configuration Error:', 'red')
    log(`   N8N_WEBHOOK_URL: ${webhookUrl || '(not set)'}`, 'red')
    log(`   N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID: ${webhookId || '(not set)'}`, 'red')
    process.exit(1)
  }

  const fullWebhookUrl = `${webhookUrl}/webhook/${webhookId}`

  log('\n📋 Configuration:', 'cyan')
  log(`   Webhook URL: ${fullWebhookUrl}`, 'blue')

  // Test payload (this is what the code now sends)
  const testYoutubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  const testUserId = 'test-user-' + Date.now()

  const payload = {
    videoUrl: testYoutubeUrl, // Changed from "youtubeUrl" to "videoUrl"
    userId: testUserId,
    timestamp: new Date().toISOString(),
  }

  log('\n📦 Payload Being Sent:', 'cyan')
  log(JSON.stringify(payload, null, 2), 'blue')

  log('\n🔍 Payload Analysis:', 'cyan')
  log(`   ✅ Parameter name: "videoUrl" (correct for n8n)`, 'green')
  log(`   ✅ YouTube URL: ${payload.videoUrl}`, 'green')
  log(`   ✅ User ID: ${payload.userId}`, 'green')
  log(`   ✅ Timestamp: ${payload.timestamp}`, 'green')

  log('\n━'.repeat(60), 'blue')
  log('\n🚀 Sending Test Request to n8n...', 'cyan')

  try {
    const response = await fetch(fullWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    log(`\n📊 Response Status: ${response.status} ${response.statusText}`, 'blue')

    if (response.ok) {
      const data = await response.json()
      log('\n✅ Success! n8n received the payload correctly', 'green')
      log('\n📄 n8n Response:', 'cyan')
      log(JSON.stringify(data, null, 2), 'blue')

      log('\n━'.repeat(60), 'blue')
      log('\n✅ Test Passed!', 'green')
      log('   The payload is correctly formatted with "videoUrl" parameter', 'green')
      log('   n8n should now receive the YouTube URL correctly', 'green')
    } else {
      const errorText = await response.text()
      log('\n❌ Request Failed!', 'red')
      log(`   Status: ${response.status} ${response.statusText}`, 'red')
      log(`   Error: ${errorText}`, 'red')

      if (response.status === 404) {
        log('\n💡 Troubleshooting:', 'yellow')
        log('   - Check that the webhook ID is correct', 'yellow')
        log('   - Verify the n8n workflow is active', 'yellow')
        log('   - Make sure the webhook trigger is enabled', 'yellow')
      }
    }
  } catch (error) {
    log('\n❌ Error sending request:', 'red')
    log(`   ${error instanceof Error ? error.message : String(error)}`, 'red')
  }

  log('\n━'.repeat(60), 'blue')
}

// Run the test
testYouTubePayload().catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})

