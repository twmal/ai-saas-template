#!/usr/bin/env node

/**
 * Check environment variables in the order Next.js loads them
 * Run with: node scripts/check-nextjs-env.js
 */

// Load in Next.js order: .env.local, then .env
const dotenv = require('dotenv')
const path = require('path')

console.log('🔍 Checking Environment Variables (Next.js Load Order)\n')
console.log('━'.repeat(60))

// First load .env
const envPath = path.resolve(process.cwd(), '.env')
const envLocalPath = path.resolve(process.cwd(), '.env.local')

console.log('Loading .env file...')
const envResult = dotenv.config({ path: envPath })
if (envResult.error) {
  console.log('❌ Error loading .env:', envResult.error.message)
} else {
  console.log('✅ Loaded .env')
}

console.log('\nLoading .env.local file (will override .env)...')
const envLocalResult = dotenv.config({ path: envLocalPath, override: true })
if (envLocalResult.error) {
  console.log('❌ Error loading .env.local:', envLocalResult.error.message)
} else {
  console.log('✅ Loaded .env.local')
}

console.log('\n━'.repeat(60))
console.log('\n📊 Final Environment Variables:\n')

const vars = [
  'N8N_WEBHOOK_URL',
  'N8N_VIDEO_ANALYSIS_WEBHOOK_ID',
  'N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID',
  'N8N_API_KEY',
]

vars.forEach(varName => {
  const value = process.env[varName]
  const status = value && !value.includes('your-') && !value.includes('placeholder') ? '✅' : '⚠️'
  const display = value || '(not set)'
  console.log(`${status} ${varName}:`)
  console.log(`   ${display}`)
  console.log()
})

console.log('━'.repeat(60))

if (process.env.N8N_WEBHOOK_URL && process.env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID) {
  console.log('\n📍 Full YouTube Webhook URL:')
  const url = `${process.env.N8N_WEBHOOK_URL}/webhook/${process.env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID}`
  console.log(url)
  
  if (url.includes('your-') || url.includes('placeholder')) {
    console.log('\n❌ WARNING: Webhook URL contains placeholder values!')
    console.log('   This will cause 404 errors.')
  } else {
    console.log('\n✅ Webhook URL looks good!')
  }
} else {
  console.log('\n❌ Cannot construct webhook URL - missing variables')
}

console.log('\n━'.repeat(60))

