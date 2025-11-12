# Quick Fix: YouTube Webhook Not Working

## The Problem
Your YouTube URL analysis is failing with "n8n webhook failed: Not Found" because the environment variable `N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID` was added to `.env.local` **after** the server started.

## The Solution (2 Steps)

### Step 1: Restart Your Development Server

```bash
# Stop the current server (press Ctrl+C in the terminal where it's running)
# Then restart:
npm run dev
```

That's it! This should fix the issue.

### Step 2: Verify It's Working

Run the diagnostic script:

```bash
npx tsx scripts/check-n8n-config.ts
```

You should see:
```
✅ N8N_WEBHOOK_URL: https://twmal.app.n8n.cloud
✅ N8N_VIDEO_ANALYSIS_WEBHOOK_ID: c2838e30-aa6c-4232-b20e-e8366aadab20
✅ N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID: ad5ddf87-5a47-4598-a19e-82aa4c536649
```

## Why This Happened

**Next.js loads environment variables at startup, not dynamically.**

Timeline of what happened:
1. ✅ You started the server with `N8N_VIDEO_ANALYSIS_WEBHOOK_ID` configured
2. ✅ Video upload worked because the env var was loaded
3. ➕ You added `N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID` to `.env.local`
4. ❌ YouTube analysis failed because the server was still using the old environment
5. 🔄 **Restart needed** to load the new environment variable

## Test the Fix

After restarting, test the YouTube analysis:

1. Go to your dashboard
2. Enter a YouTube URL: `https://www.youtube.com/shorts/ayQFLhlICeQ`
3. Click "Analyze YouTube URL"
4. Should work now! ✅

## Optional: Test Webhooks Directly

You can also test the webhooks with the test script:

```bash
npx tsx scripts/test-n8n-webhooks.ts
```

This will:
- ✅ Verify all environment variables are loaded
- 🧪 Test the YouTube webhook with a sample request
- 📊 Show you the results

## What I Changed

I also improved the error messages in `src/lib/n8n.ts` so if this happens again, you'll get a clearer error message:

**Before:**
```
Error: n8n YouTube webhook configuration is missing
```

**After:**
```
Error: N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID is not configured. 
Please add it to your .env.local file and restart the server.
```

## Comparison: Why Video Upload Works

| Feature | Video Upload | YouTube Analysis |
|---------|-------------|------------------|
| Webhook ID | `c2838e30-aa6c-4232-b20e-e8366aadab20` | `ad5ddf87-5a47-4598-a19e-82aa4c536649` |
| Configured When | Before server start ✅ | After server start ❌ |
| Loaded by Server | Yes ✅ | No ❌ (until restart) |
| Status | Working ✅ | Fixed after restart ✅ |

## If It Still Doesn't Work

If restarting doesn't fix it, check these:

1. **Verify the webhook ID is correct:**
   - Go to your n8n workflow
   - Check the webhook trigger node
   - The ID should be: `ad5ddf87-5a47-4598-a19e-82aa4c536649`

2. **Make sure the workflow is active:**
   - In n8n, check that the workflow is turned ON
   - Inactive workflows return 404

3. **Test the webhook directly:**
   ```bash
   curl -X POST https://twmal.app.n8n.cloud/webhook/ad5ddf87-5a47-4598-a19e-82aa4c536649 \
     -H "Content-Type: application/json" \
     -d '{"youtubeUrl":"https://www.youtube.com/watch?v=test","userId":"test","timestamp":"2024-01-01T00:00:00Z"}'
   ```
   
   Expected: 200 OK response
   If you get 404: The webhook ID is wrong or workflow is inactive

## Files Created/Modified

I created these helpful files for you:

1. **`scripts/check-n8n-config.ts`** - Diagnostic script to check configuration
2. **`scripts/test-n8n-webhooks.ts`** - Test script to verify webhooks work
3. **`TROUBLESHOOTING-N8N.md`** - Comprehensive troubleshooting guide
4. **`FIX-YOUTUBE-WEBHOOK.md`** - This quick fix guide
5. **`src/lib/n8n.ts`** - Improved error messages

## Summary

**The fix is simple: Restart your development server!**

```bash
# Stop server (Ctrl+C)
npm run dev
```

Then test the YouTube analysis feature - it should work now! 🎉

