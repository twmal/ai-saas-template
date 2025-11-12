# 🚀 YouTube Integration - Quick Start

## ⚡ 3-Step Setup

### Step 1: Find Your Webhook ID (2 minutes)

1. **Open your YouTube workflow:**
   ```
   https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh
   ```

2. **Click on the first node** (Webhook or Form Trigger)

3. **Copy the webhook ID** from the settings panel
   - It looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Example: `a7b8c9d0-1234-5678-90ab-cdef12345678`

**Need help?** See `FIND_YOUTUBE_WEBHOOK_ID.md` for detailed instructions.

---

### Step 2: Update `.env.local` (1 minute)

Open `.env.local` and find this line (around line 90):

```env
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=your-youtube-webhook-id-here
```

Replace with your actual webhook ID:

```env
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=a7b8c9d0-1234-5678-90ab-cdef12345678
```

**Your complete n8n configuration should look like:**

```env
# n8n Integration
N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud

# Video upload webhook (already working ✅)
N8N_VIDEO_ANALYSIS_WEBHOOK_ID=c2838e30-aa6c-4232-b20e-e8366aadab20

# YouTube analysis webhook (add your webhook ID here)
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=a7b8c9d0-1234-5678-90ab-cdef12345678
```

---

### Step 3: Restart & Test (1 minute)

1. **Restart your dev server:**
   ```bash
   # Press Ctrl+C to stop
   pnpm dev
   ```

2. **Open the dashboard:**
   ```
   http://localhost:3000/dashboard/video-analysis
   ```

3. **Click the "YouTube URL" tab**

4. **Enter a test YouTube URL:**
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

5. **Click "开始分析" (Start Analysis)**

6. **Check for success message!** ✅

---

## 🧪 Quick Test (Optional)

Before updating `.env.local`, test your webhook ID:

```bash
chmod +x test-youtube-webhook.sh
./test-youtube-webhook.sh YOUR_WEBHOOK_ID_HERE
```

If it returns HTTP 200, your webhook ID is correct! ✅

---

## ✅ Success Checklist

- [ ] Found webhook ID from n8n workflow
- [ ] Updated `N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID` in `.env.local`
- [ ] Restarted dev server
- [ ] YouTube workflow is **Active** in n8n
- [ ] Tested with a YouTube URL
- [ ] Success message appeared
- [ ] Checked n8n execution logs
- [ ] Verified results in Notion

---

## 🎯 What Happens When You Submit a YouTube URL

```
1. User enters YouTube URL
   ↓
2. Dashboard validates URL format
   ↓
3. Sends to /api/n8n/youtube-analysis
   ↓
4. API sends to n8n webhook
   ↓
5. n8n processes YouTube video
   ↓
6. Gemini AI analyzes content
   ↓
7. Results saved to Notion
   ↓
8. User sees success message
```

---

## 📊 Supported YouTube URL Formats

✅ **These work:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `http://www.youtube.com/watch?v=VIDEO_ID`

❌ **These don't work:**
- `youtube.com/watch?v=VIDEO_ID` (missing protocol)
- `www.youtube.com/watch?v=VIDEO_ID` (missing protocol)
- `https://vimeo.com/...` (not YouTube)

---

## ❌ Troubleshooting

### "n8n YouTube webhook configuration is missing"

**Solution:** 
- Add webhook ID to `.env.local`
- Restart dev server

### "Invalid YouTube URL format"

**Solution:**
- Make sure URL starts with `http://` or `https://`
- Use `youtube.com` or `youtu.be` domain

### Request succeeds but no n8n execution

**Solution:**
- Check workflow is **Active** in n8n
- Verify webhook ID is correct
- Check n8n execution logs

### n8n execution fails

**Solution:**
- Check n8n execution logs for specific error
- Verify Gemini API key is configured
- Check Notion integration is connected
- Try with a different YouTube URL

---

## 🎬 Test YouTube URLs

Use these for testing:

1. **Rick Astley - Never Gonna Give You Up:**
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

2. **Short URL format:**
   ```
   https://youtu.be/dQw4w9WgXcQ
   ```

3. **Any public YouTube video you like!**

---

## 📚 Need More Help?

- **Finding webhook ID:** `FIND_YOUTUBE_WEBHOOK_ID.md`
- **Detailed guide:** `YOUTUBE_INTEGRATION_GUIDE.md`
- **Testing:** `test-youtube-webhook.sh`

---

## 🎉 That's It!

Your YouTube analysis integration is ready to use!

**Just 3 steps:**
1. Find webhook ID
2. Update `.env.local`
3. Restart & test

**Happy analyzing! 🚀**

