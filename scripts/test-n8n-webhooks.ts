#!/usr/bin/env tsx

/**
 * Test script to verify n8n webhooks are working
 * Run with: npx tsx scripts/test-n8n-webhooks.ts
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

async function testWebhook(
  name: string,
  webhookUrl: string,
  payload: any
): Promise<boolean> {
  log(`\n🧪 Testing ${name}...`, 'cyan')
  log(`   URL: ${webhookUrl}`, 'blue')

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    log(`   Status: ${response.status} ${response.statusText}`, 'blue')

    if (response.ok) {
      const data = await response.json()
      log(`   ✅ Success!`, 'green')
      log(`   Response: ${JSON.stringify(data, null, 2)}`, 'blue')
      return true
    } else {
      const errorText = await response.text()
      log(`   ❌ Failed!`, 'red')
      log(`   Error: ${errorText}`, 'red')
      return false
    }
  } catch (error) {
    log(`   ❌ Error!`, 'red')
    log(`   ${error instanceof Error ? error.message : String(error)}`, 'red')
    return false
  }
}

async function main() {
  log('🚀 n8n Webhook Test Suite', 'cyan')
  log('━'.repeat(60), 'blue')

  // Check configuration
  log('\n📋 Configuration Check:', 'cyan')
  const hasWebhookUrl = !!env.N8N_WEBHOOK_URL
  const hasVideoWebhook = !!env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID
  const hasYouTubeWebhook = !!env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID

  log(
    `   N8N_WEBHOOK_URL: ${hasWebhookUrl ? '✅' : '❌'} ${env.N8N_WEBHOOK_URL || '(not set)'}`,
    hasWebhookUrl ? 'green' : 'red'
  )
  log(
    `   N8N_VIDEO_ANALYSIS_WEBHOOK_ID: ${hasVideoWebhook ? '✅' : '❌'} ${env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID || '(not set)'}`,
    hasVideoWebhook ? 'green' : 'red'
  )
  log(
    `   N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID: ${hasYouTubeWebhook ? '✅' : '❌'} ${env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID || '(not set)'}`,
    hasYouTubeWebhook ? 'green' : 'red'
  )

  if (!hasWebhookUrl) {
    log('\n❌ N8N_WEBHOOK_URL is not configured!', 'red')
    log('   Add it to your .env.local file and restart the server.', 'yellow')
    process.exit(1)
  }

  const results: { name: string; success: boolean }[] = []

  // Test YouTube Analysis Webhook (if configured)
  if (hasYouTubeWebhook) {
    log('\n━'.repeat(60), 'blue')
    const webhookUrl = `${env.N8N_WEBHOOK_URL}/webhook/${env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID}`
    const payload = {
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      userId: 'test-user-' + Date.now(),
      timestamp: new Date().toISOString(),
      test: true,
    }

    const success = await testWebhook('YouTube Analysis Webhook', webhookUrl, payload)
    results.push({ name: 'YouTube Analysis', success })
  } else {
    log('\n⚠️  YouTube Analysis Webhook not configured - skipping test', 'yellow')
  }

  // Note: We don't test video upload webhook here because it requires FormData with actual file
  if (hasVideoWebhook) {
    log('\n━'.repeat(60), 'blue')
    log('\n📹 Video Upload Webhook:', 'cyan')
    log(`   URL: ${env.N8N_WEBHOOK_URL}/webhook/${env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID}`, 'blue')
    log('   ⚠️  Skipping test (requires file upload)', 'yellow')
    log('   Test this webhook through the UI by uploading a video', 'yellow')
  }

  // Summary
  log('\n━'.repeat(60), 'blue')
  log('\n📊 Test Summary:', 'cyan')

  if (results.length === 0) {
    log('   No webhooks were tested', 'yellow')
  } else {
    const passed = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    results.forEach(({ name, success }) => {
      log(`   ${success ? '✅' : '❌'} ${name}`, success ? 'green' : 'red')
    })

    log(`\n   Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`, 'blue')

    if (failed > 0) {
      log('\n💡 Troubleshooting Tips:', 'yellow')
      log('   1. Make sure your n8n workflows are active', 'yellow')
      log('   2. Check that the webhook IDs are correct', 'yellow')
      log('   3. Verify the webhook URLs in n8n match your configuration', 'yellow')
      log('   4. Check n8n execution logs for errors', 'yellow')
      log('   5. Try testing the webhook directly in n8n', 'yellow')
    }
  }

  log('\n━'.repeat(60), 'blue')

  // Exit with error code if any tests failed
  const anyFailed = results.some(r => !r.success)
  process.exit(anyFailed ? 1 : 0)
}

main().catch(error => {
  log('\n❌ Unexpected error:', 'red')
  console.error(error)
  process.exit(1)
})

