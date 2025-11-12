# n8n Webhook Integration Troubleshooting Guide

## Problem Summary
YouTube URL analysis feature fails with "n8n webhook failed: Not Found" error, while video upload feature works correctly.

## Root Cause
**Environment variables are not loaded dynamically in Next.js.** When you add or modify environment variables in `.env.local`, you must restart the development server for the changes to take effect.

## Solution Steps

### 1. Verify Environment Variables
Check that your `.env.local` file has the correct configuration:

```bash
# n8n Configuration
N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud
N8N_VIDEO_ANALYSIS_WEBHOOK_ID=c2838e30-aa6c-4232-b20e-e8366aadab20
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=ad5ddf87-5a47-4598-a19e-82aa4c536649
```

✅ Your `.env.local` file already has these values configured correctly!

### 2. Restart Development Server

**IMPORTANT:** This is the most likely fix for your issue.

```bash
# Stop the current server (Ctrl+C if running)
# Then restart:
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 3. Verify Configuration

After restarting, run the diagnostic script:

```bash
npx tsx scripts/check-n8n-config.ts
```

This will show you:
- ✅ Which environment variables are loaded
- 📍 The full webhook URLs being used
- 💡 Next steps if there are issues

### 4. Test the Integration

Try analyzing a YouTube URL again:
1. Go to your dashboard
2. Enter a YouTube URL (e.g., `https://www.youtube.com/shorts/ayQFLhlICeQ`)
3. Click "Analyze YouTube URL"

## Why This Happens

### Environment Variable Loading in Next.js
- Environment variables are loaded at **build time** or **server startup**
- Changes to `.env.local` require a **server restart**
- The `@t3-oss/env-nextjs` package validates and loads env vars once at startup

### What Was Happening
1. Server started with only `N8N_VIDEO_ANALYSIS_WEBHOOK_ID` configured
2. You added `N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID` to `.env.local`
3. Server was still using old environment (where this variable was undefined)
4. Code tried to construct webhook URL with undefined ID → 404 error

## Verification Checklist

- [ ] `.env.local` has `N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=ad5ddf87-5a47-4598-a19e-82aa4c536649`
- [ ] Development server has been restarted
- [ ] Diagnostic script shows all variables loaded
- [ ] n8n workflow is active and accessible
- [ ] Webhook URL is correct in n8n

## Testing Webhook Directly

You can test the webhook URL directly with curl:

```bash
# Test YouTube Analysis Webhook
curl -X POST https://twmal.app.n8n.cloud/webhook/ad5ddf87-5a47-4598-a19e-82aa4c536649 \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeUrl": "https://www.youtube.com/shorts/ayQFLhlICeQ",
    "userId": "test-user",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }'
```

Expected response:
- ✅ 200 OK with JSON response
- ❌ 404 Not Found → Webhook ID is incorrect or workflow is not active

## Common Issues

### Issue 1: Still Getting 404 After Restart
**Possible causes:**
- Webhook ID is incorrect
- n8n workflow is not active
- Webhook was deleted/recreated in n8n

**Solution:**
1. Go to your n8n workflow
2. Check the webhook trigger node
3. Copy the webhook ID from the URL
4. Update `.env.local` with the correct ID
5. Restart server

### Issue 2: Environment Variable Shows as Undefined
**Possible causes:**
- Typo in variable name
- `.env.local` not in the correct location
- Server not restarted

**Solution:**
1. Check `.env.local` is in project root
2. Verify variable name matches exactly (case-sensitive)
3. Restart development server
4. Run diagnostic script

### Issue 3: Works in Development but Not in Production
**Possible causes:**
- Environment variables not set in Vercel
- Different webhook IDs for production

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all n8n variables:
   - `N8N_WEBHOOK_URL`
   - `N8N_VIDEO_ANALYSIS_WEBHOOK_ID`
   - `N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID`
3. Redeploy your application

## Code Reference

### Where Environment Variables Are Used

**Environment Configuration:** `src/env.ts`
```typescript
N8N_WEBHOOK_URL: z.string().url().optional(),
N8N_VIDEO_ANALYSIS_WEBHOOK_ID: z.string().optional(),
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID: z.string().optional(),
```

**YouTube Analysis Function:** `src/lib/n8n.ts`
```typescript
const webhookUrl = env.N8N_WEBHOOK_URL
const webhookId = env.N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID
const fullWebhookUrl = `${webhookUrl}/webhook/${webhookId}`
```

**API Route:** `src/app/api/n8n/youtube-analysis/route.ts`
```typescript
const result = await triggerYouTubeAnalysis(youtubeUrl, userId)
```

## Next Steps After Fix

Once the YouTube analysis is working:

1. **Test with different YouTube URLs:**
   - Regular videos: `https://www.youtube.com/watch?v=...`
   - Shorts: `https://www.youtube.com/shorts/...`
   - Short URLs: `https://youtu.be/...`

2. **Monitor n8n workflow:**
   - Check execution history
   - Verify data is being saved to Notion
   - Check for any errors in processing

3. **Add error handling:**
   - Consider adding retry logic
   - Add user-friendly error messages
   - Log errors for debugging

## Support

If you continue to have issues after following these steps:

1. Check the browser console for errors
2. Check the server logs for detailed error messages
3. Verify the n8n workflow is active and working
4. Test the webhook URL directly with curl
5. Check n8n execution logs for errors

