#!/usr/bin/env node

/**
 * Simple environment variable checker that doesn't use the env validation
 * Run with: node scripts/check-env-simple.js
 */

// Load .env.local manually
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Checking n8n Environment Variables (Direct Check)\n')
console.log('━'.repeat(60))

const vars = [
  'N8N_WEBHOOK_URL',
  'N8N_VIDEO_ANALYSIS_WEBHOOK_ID',
  'N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID',
  'N8N_API_KEY',
]

vars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '❌'
  const display = value || '(not set)'
  console.log(`${status} ${varName}:`)
  console.log(`   ${display}`)
  console.log()
})

console.log('━'.repeat(60))

if (process.env.N8N_WEBHOOK_URL && process.env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID) {
  console.log('\n📍 Full YouTube Webhook URL:')
  console.log(`${process.env.N8N_WEBHOOK_URL}/webhook/${process.env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID}`)
} else {
  console.log('\n❌ Cannot construct webhook URL - missing variables')
}

console.log('\n━'.repeat(60))

