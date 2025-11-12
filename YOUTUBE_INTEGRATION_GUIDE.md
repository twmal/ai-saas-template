# 🎬 YouTube URL Analysis Integration Guide

## 📋 Overview

Your YouTube URL analysis feature is **already coded and ready**! You just need to:
1. Find the webhook ID from your n8n workflow
2. Add it to `.env.local`
3. Activate the workflow
4. Test it!

---

## 🔍 Step 1: Find Your YouTube Webhook ID

### Method 1: From the Workflow Editor (Easiest)

1. **Open your YouTube workflow in n8n:**
   - Go to: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh

2. **Find the Webhook or Form Trigger node:**
   - Look for a node named something like:
     - "Webhook"
     - "Form Trigger"
     - "On form submission"
     - "YouTube Trigger"
   - It's usually the **first node** (leftmost) in your workflow

3. **Click on that node to open its settings**

4. **Look for the Webhook URL field:**
   - You'll see a URL that looks like:
     ```
     https://twmal.app.n8n.cloud/webhook/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     ```
   - Or it might show just the webhook ID:
     ```
     XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     ```

5. **Copy the webhook ID:**
   - The webhook ID is the part after `/webhook/`
   - It's a UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Example: `a7b8c9d0-1234-5678-90ab-cdef12345678`

### Method 2: From the Workflow JSON

1. **Open your workflow:** https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh

2. **Click the three dots menu** (⋮) in the top right

3. **Select "Download"** or "Export workflow"

4. **Open the downloaded JSON file** in a text editor

5. **Search for "webhookId"** or "path":**
   ```json
   {
     "parameters": {
       "path": "your-webhook-id-here",
       "webhookId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
     }
   }
   ```

6. **Copy the webhook ID**

### Method 3: Test the Workflow

1. **Activate your workflow** in n8n (toggle to ON)

2. **Click on the Webhook/Form Trigger node**

3. **Look for "Test URL" or "Production URL":**
   - Test URL: `https://twmal.app.n8n.cloud/webhook-test/WEBHOOK_ID`
   - Production URL: `https://twmal.app.n8n.cloud/webhook/WEBHOOK_ID`

4. **Copy the webhook ID from the URL**

---

## ⚙️ Step 2: Update Your Environment Variables

Once you have the webhook ID, update your `.env.local` file.

### What You Need to Add:

Open `.env.local` and find this line (around line 90):
```env
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=your-youtube-webhook-id-here
```

Replace it with your actual webhook ID:
```env
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=a7b8c9d0-1234-5678-90ab-cdef12345678
```

### Example Configuration:

Your `.env.local` should have both webhook IDs configured:

```env
# n8n Integration
N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud

# Video upload webhook (already working)
N8N_VIDEO_ANALYSIS_WEBHOOK_ID=c2838e30-aa6c-4232-b20e-e8366aadab20

# YouTube analysis webhook (add this)
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=your-actual-webhook-id-here
```

---

## 🔄 Step 3: Restart Your Dev Server

**Important:** You must restart the dev server for the changes to take effect!

```bash
# Press Ctrl+C to stop the server
# Then run:
pnpm dev
```

---

## ✅ Step 4: Activate Your YouTube Workflow

1. Go to: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh
2. Look for the **"Active"** toggle at the top
3. Make sure it's **ON** (green/blue)
4. If it's off, click it to activate

---

## 🧪 Step 5: Test the YouTube Analysis Feature

### Test 1: Through the Dashboard

1. **Start your dev server** (if not already running):
   ```bash
   pnpm dev
   ```

2. **Open the dashboard:**
   - Go to: http://localhost:3000/dashboard/video-analysis

3. **Click on the "YouTube URL" tab**

4. **Enter a YouTube URL:**
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Or: `https://youtu.be/dQw4w9WgXcQ`

5. **Click "开始分析" (Start Analysis)**

6. **Watch for the success message:**
   - Should see: "YouTube 视频已成功提交分析！"
   - Toast notification should appear

### Test 2: Check n8n Execution

1. Go to your n8n dashboard
2. Click **"Executions"** in the left sidebar
3. Look for a new execution of your YouTube workflow
4. Click on it to see the details
5. Verify the YouTube URL was received correctly

### Test 3: Check Notion

1. Wait for the workflow to complete (may take a few minutes)
2. Open your Notion database
3. Look for a new entry with the YouTube video analysis
4. Verify the AI-generated content is there

---

## 📊 How It Works

### Data Flow:

```
User enters YouTube URL
    ↓
Dashboard validates URL format
    ↓
POST to /api/n8n/youtube-analysis
    ↓
API checks authentication
    ↓
API validates YouTube URL format
    ↓
API calls triggerYouTubeAnalysis()
    ↓
Sends JSON to n8n webhook:
  {
    "youtubeUrl": "https://youtube.com/watch?v=...",
    "userId": "user_xxx",
    "timestamp": "2024-01-15T10:30:00Z"
  }
    ↓
n8n Webhook receives data
    ↓
n8n downloads/processes YouTube video
    ↓
n8n sends to Google Gemini AI
    ↓
Gemini analyzes video content
    ↓
n8n formats results
    ↓
n8n saves to Notion database
    ↓
User sees success message
    ↓
User checks Notion for results
```

### Request Format:

The dashboard sends this JSON to n8n:
```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "userId": "user_2abc123def456",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Webhook URL:

The full webhook URL is constructed as:
```
https://twmal.app.n8n.cloud/webhook/{YOUR_YOUTUBE_WEBHOOK_ID}
```

---

## 🎯 Supported YouTube URL Formats

The code validates and accepts these formats:

✅ **Standard YouTube URLs:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `http://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`

✅ **Short YouTube URLs:**
- `https://youtu.be/VIDEO_ID`
- `http://youtu.be/VIDEO_ID`

✅ **With or without www:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`

❌ **Invalid formats:**
- `youtube.com/watch?v=VIDEO_ID` (missing protocol)
- `www.youtube.com/watch?v=VIDEO_ID` (missing protocol)
- `https://vimeo.com/...` (not YouTube)

---

## 🔧 Configuration Summary

### Environment Variables:

```env
# Base n8n URL (already configured)
N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud

# Video upload webhook (already working)
N8N_VIDEO_ANALYSIS_WEBHOOK_ID=c2838e30-aa6c-4232-b20e-e8366aadab20

# YouTube analysis webhook (you need to add this)
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=your-webhook-id-here
```

### Files Already Configured:

- ✅ **Frontend**: `src/app/[locale]/(front)/dashboard/video-analysis/page.tsx`
- ✅ **API Route**: `src/app/api/n8n/youtube-analysis/route.ts`
- ✅ **n8n Client**: `src/lib/n8n.ts` (triggerYouTubeAnalysis function)
- ✅ **Environment Config**: `src/env.ts`

---

## ❌ Troubleshooting

### Issue: "n8n YouTube webhook configuration is missing"

**Cause:** Webhook ID not set in `.env.local`

**Solution:**
1. Add `N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID` to `.env.local`
2. Restart dev server

### Issue: "Invalid YouTube URL format"

**Cause:** URL doesn't match the expected format

**Solution:**
- Make sure URL starts with `http://` or `https://`
- Use `youtube.com` or `youtu.be` domain
- Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

### Issue: Request succeeds but no n8n execution

**Cause:** Workflow not active or wrong webhook ID

**Solution:**
1. Check workflow is **Active** in n8n
2. Verify webhook ID is correct
3. Check n8n execution logs for errors

### Issue: n8n execution fails

**Possible causes:**
1. YouTube video is private/unavailable
2. Gemini API error
3. Notion integration issue

**Solution:**
1. Check n8n execution logs for specific error
2. Verify Gemini API key is configured
3. Check Notion integration is connected
4. Try with a different YouTube URL

---

## 🧪 Test URLs

Use these public YouTube videos for testing:

1. **Short video (good for quick tests):**
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

2. **Educational content:**
   ```
   https://www.youtube.com/watch?v=9bZkp7q19f0
   ```

3. **Short URL format:**
   ```
   https://youtu.be/dQw4w9WgXcQ
   ```

---

## 📝 Quick Checklist

Before testing:
- [ ] Found YouTube webhook ID from n8n workflow
- [ ] Added webhook ID to `.env.local`
- [ ] Restarted dev server
- [ ] YouTube workflow is **Active** in n8n
- [ ] Gemini API key is configured in n8n
- [ ] Notion integration is connected in n8n

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ No error message when submitting YouTube URL
2. ✅ Success message appears in dashboard
3. ✅ Toast notification shows
4. ✅ New execution appears in n8n
5. ✅ Execution completes successfully
6. ✅ New entry appears in Notion with YouTube analysis

---

## 💡 Pro Tips

- Test with short YouTube videos first (under 5 minutes)
- Keep n8n execution logs open while testing
- Use public YouTube videos (not private or unlisted)
- Check both terminal and browser console for errors
- Monitor your Gemini API quota

---

**Once you have the webhook ID, update `.env.local` and you're ready to go!** 🚀

