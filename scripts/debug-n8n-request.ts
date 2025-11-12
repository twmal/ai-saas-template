#!/usr/bin/env tsx

/**
 * Debug script to see exactly what's being sent to n8n
 * This intercepts the request and shows the payload
 */

import { env } from '../src/env'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function debugN8nRequest() {
  log('🔍 Debugging n8n Request', 'cyan')
  log('━'.repeat(70), 'blue')

  const webhookUrl = env.N8N_WEBHOOK_URL
  const webhookId = env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID

  if (!webhookUrl || !webhookId) {
    log('\n❌ Configuration missing!', 'red')
    process.exit(1)
  }

  const fullWebhookUrl = `${webhookUrl}/webhook/${webhookId}`
  const testYoutubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  const testUserId = 'debug-test-' + Date.now()

  log('\n📋 Configuration:', 'cyan')
  log(`   Webhook URL: ${fullWebhookUrl}`, 'blue')
  log(`   Webhook ID: ${webhookId}`, 'blue')

  // Test 1: JSON Payload (Current Implementation)
  log('\n━'.repeat(70), 'blue')
  log('\n🧪 TEST 1: JSON Payload (Current Implementation)', 'cyan')
  log('━'.repeat(70), 'blue')

  const jsonPayload = {
    videoUrl: testYoutubeUrl,
    userId: testUserId,
    timestamp: new Date().toISOString(),
  }

  log('\n📦 Payload Object:', 'cyan')
  console.log(jsonPayload)

  log('\n📝 JSON String:', 'cyan')
  const jsonString = JSON.stringify(jsonPayload, null, 2)
  console.log(jsonString)

  log('\n📊 Request Details:', 'cyan')
  log(`   Method: POST`, 'blue')
  log(`   Content-Type: application/json`, 'blue')
  log(`   Body Length: ${jsonString.length} bytes`, 'blue')

  log('\n🚀 Sending JSON request...', 'yellow')

  try {
    const response = await fetch(fullWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonString,
    })

    log(`\n📊 Response Status: ${response.status} ${response.statusText}`, 
        response.ok ? 'green' : 'red')
    
    log('\n📄 Response Headers:', 'cyan')
    response.headers.forEach((value, key) => {
      log(`   ${key}: ${value}`, 'blue')
    })

    const responseText = await response.text()
    log('\n📄 Response Body:', 'cyan')
    try {
      const responseJson = JSON.parse(responseText)
      console.log(JSON.stringify(responseJson, null, 2))
    } catch {
      console.log(responseText)
    }

    if (response.ok) {
      log('\n✅ JSON Request Successful!', 'green')
      log('   If n8n still shows [null], the issue is with Form Trigger.', 'yellow')
      log('   Form Trigger cannot parse JSON - you need Webhook Trigger.', 'yellow')
    } else {
      log('\n❌ JSON Request Failed!', 'red')
    }
  } catch (error) {
    log('\n❌ Error sending JSON request:', 'red')
    console.error(error)
  }

  // Test 2: Form Data (Alternative for Form Trigger)
  log('\n━'.repeat(70), 'blue')
  log('\n🧪 TEST 2: Form Data (Alternative for Form Trigger)', 'cyan')
  log('━'.repeat(70), 'blue')

  const formData = new URLSearchParams()
  formData.append('videoUrl', testYoutubeUrl)
  formData.append('userId', testUserId)
  formData.append('timestamp', new Date().toISOString())

  log('\n📦 Form Data:', 'cyan')
  console.log(formData.toString())

  log('\n📊 Request Details:', 'cyan')
  log(`   Method: POST`, 'blue')
  log(`   Content-Type: application/x-www-form-urlencoded`, 'blue')
  log(`   Body Length: ${formData.toString().length} bytes`, 'blue')

  log('\n🚀 Sending Form Data request...', 'yellow')

  try {
    const response = await fetch(fullWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    log(`\n📊 Response Status: ${response.status} ${response.statusText}`, 
        response.ok ? 'green' : 'red')

    const responseText = await response.text()
    log('\n📄 Response Body:', 'cyan')
    try {
      const responseJson = JSON.parse(responseText)
      console.log(JSON.stringify(responseJson, null, 2))
    } catch {
      console.log(responseText)
    }

    if (response.ok) {
      log('\n✅ Form Data Request Successful!', 'green')
      log('   If this works but JSON doesn\'t, you have a Form Trigger.', 'yellow')
      log('   Recommendation: Switch to Webhook Trigger for JSON support.', 'yellow')
    } else {
      log('\n❌ Form Data Request Failed!', 'red')
    }
  } catch (error) {
    log('\n❌ Error sending Form Data request:', 'red')
    console.error(error)
  }

  // Summary
  log('\n━'.repeat(70), 'blue')
  log('\n📊 SUMMARY & RECOMMENDATIONS', 'cyan')
  log('━'.repeat(70), 'blue')

  log('\n🔍 Diagnosis:', 'cyan')
  log('   1. If JSON test succeeds but n8n shows [null]:', 'yellow')
  log('      → You have a Form Trigger (can\'t parse JSON)', 'yellow')
  log('      → Solution: Replace with Webhook Trigger in n8n', 'green')
  log('', 'reset')
  log('   2. If Form Data test succeeds:', 'yellow')
  log('      → Form Trigger is working', 'yellow')
  log('      → Option A: Keep Form Trigger, change code to send form data', 'blue')
  log('      → Option B: Switch to Webhook Trigger (recommended)', 'green')
  log('', 'reset')
  log('   3. If both tests fail:', 'yellow')
  log('      → Check webhook ID is correct', 'yellow')
  log('      → Verify n8n workflow is active', 'yellow')
  log('      → Check n8n execution logs', 'yellow')

  log('\n💡 Recommended Action:', 'cyan')
  log('   Replace Form Trigger with Webhook Trigger in n8n', 'green')
  log('   This allows JSON payloads and is better for API integrations', 'green')

  log('\n📚 See N8N-FORM-TRIGGER-ISSUE.md for detailed instructions', 'blue')
  log('\n━'.repeat(70), 'blue')
}

// Run the debug
debugN8nRequest().catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})

