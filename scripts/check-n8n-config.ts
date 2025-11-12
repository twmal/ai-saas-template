#!/usr/bin/env tsx

/**
 * Diagnostic script to check n8n configuration
 * Run with: npx tsx scripts/check-n8n-config.ts
 */

import { env } from '../src/env'

console.log('🔍 Checking n8n Configuration...\n')

console.log('Environment Variables:')
console.log('━'.repeat(60))

const configs = [
  {
    name: 'N8N_WEBHOOK_URL',
    value: env.N8N_WEBHOOK_URL,
    required: true,
  },
  {
    name: 'N8N_VIDEO_ANALYSIS_WEBHOOK_ID',
    value: env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID,
    required: true,
  },
  {
    name: 'N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID',
    value: env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID,
    required: false,
  },
  {
    name: 'N8N_API_KEY',
    value: env.N8N_API_KEY,
    required: false,
  },
]

let hasErrors = false

configs.forEach(({ name, value, required }) => {
  const status = value ? '✅' : required ? '❌' : '⚠️'
  const displayValue = value || '(not set)'
  console.log(`${status} ${name}: ${displayValue}`)
  
  if (required && !value) {
    hasErrors = true
  }
})

console.log('━'.repeat(60))

if (env.N8N_WEBHOOK_URL && env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID) {
  console.log('\n📍 Full Webhook URLs:')
  console.log('━'.repeat(60))
  console.log(
    `Video Analysis: ${env.N8N_WEBHOOK_URL}/webhook/${env.N8N_VIDEO_ANALYSIS_WEBHOOK_ID}`
  )
  
  if (env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID) {
    console.log(
      `YouTube Analysis: ${env.N8N_WEBHOOK_URL}/webhook/${env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID}`
    )
  } else {
    console.log('YouTube Analysis: ⚠️  Not configured')
  }
  console.log('━'.repeat(60))
}

console.log('\n📊 Configuration Status:')
console.log('━'.repeat(60))

if (hasErrors) {
  console.log('❌ Configuration has errors - required variables are missing')
  process.exit(1)
} else if (!env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID) {
  console.log('⚠️  Configuration is partial - YouTube analysis not configured')
  console.log('   Video upload will work, but YouTube URL analysis will not.')
} else {
  console.log('✅ All n8n configurations are set correctly!')
}

console.log('━'.repeat(60))

console.log('\n💡 Next Steps:')
if (!env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID) {
  console.log('1. Add N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID to your .env.local file')
  console.log('2. Restart your Next.js development server')
  console.log('3. Run this script again to verify')
} else {
  console.log('✅ Configuration looks good!')
  console.log('   If you still have issues:')
  console.log('   1. Make sure your n8n workflows are active')
  console.log('   2. Test the webhook URLs directly with curl or Postman')
  console.log('   3. Check n8n logs for any errors')
}

