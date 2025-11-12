# 🎯 n8n Integration Setup Guide

## ✅ Your Integration is Already Built!

Good news! The code to connect your dashboard with n8n is already implemented. You just need to configure it.

---

## 📋 What You Need

1. **Your n8n instance URL** - Where your n8n is hosted
2. **Your workflow webhook ID** - Already configured: `c2838e30-aa6c-4232-b20e-e8366aadab20`

---

## 🔧 Setup Steps

### Step 1: Find Your n8n Instance URL

Your n8n instance URL depends on how you're running n8n:

#### Option A: n8n Cloud
- Format: `https://yourname.app.n8n.cloud`
- Example: `https://john.app.n8n.cloud`
- Find it: Look at the URL when you're logged into n8n

#### Option B: Self-Hosted n8n
- Format: `http://your-server-ip:5678` or `https://your-domain.com`
- Example: `http://localhost:5678` (if running locally)
- Example: `https://n8n.mycompany.com` (if using a domain)

### Step 2: Update `.env.local`

Open the `.env.local` file in your project and find this line (around line 85):

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com
```

Replace `https://your-n8n-instance.com` with your actual n8n URL:

**Example for n8n Cloud:**
```env
N8N_WEBHOOK_URL=https://john.app.n8n.cloud
```

**Example for Local n8n:**
```env
N8N_WEBHOOK_URL=http://localhost:5678
```

**Example for Self-Hosted with Domain:**
```env
N8N_WEBHOOK_URL=https://n8n.mycompany.com
```

### Step 3: Make Sure Your n8n Workflow is Active

1. Open your n8n workflow: "Analyze Video (Nov 9 at 13:02:33)"
2. Look for the **"Active"** toggle at the top
3. Make sure it's **ON** (green/blue color)
4. If it's off, click it to activate the workflow

### Step 4: Restart Your Development Server

If your dev server is running, restart it to load the new environment variables:

```bash
# Press Ctrl+C to stop the server, then run:
pnpm dev
```

---

## 🧪 Testing the Integration

### Test 1: Upload a Video

1. Go to `http://localhost:3000`
2. Sign in with your account
3. Navigate to **Dashboard** → **Video Analysis**
4. Click on the **"上传视频"** (Upload Video) tab
5. Select a small test video (MP4, MOV, AVI, or MPEG format, max 100MB)
6. Click **"开始分析"** (Start Analysis)
7. You should see a success message

### Test 2: Check n8n Execution

1. Go to your n8n instance
2. Click on **"Executions"** in the left sidebar
3. You should see a new execution for your workflow
4. Click on it to see the details
5. Check if the video was received and processed

### Test 3: Check Notion

1. Open your Notion database
2. Look for a new entry with the video analysis results
3. It should contain the AI-generated analysis from Google Gemini

---

## 🔍 How It Works

Here's what happens when you upload a video:

1. **User uploads video** → Dashboard receives the file
2. **Dashboard sends to API** → `/api/n8n/video-analysis` endpoint
3. **API forwards to n8n** → Sends FormData with video to your n8n webhook
4. **n8n processes** → Your workflow receives the video
5. **Gemini analyzes** → Google Gemini AI analyzes the video content
6. **Saves to Notion** → Results are automatically saved to your Notion database

---

## 📁 Technical Details

### Webhook URL Structure

The full webhook URL is constructed as:
```
{N8N_WEBHOOK_URL}/webhook/{N8N_VIDEO_ANALYSIS_WEBHOOK_ID}
```

Example:
```
https://john.app.n8n.cloud/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20
```

### Form Data Sent to n8n

When a video is uploaded, the dashboard sends:
- `Video` - The video file (matches your n8n Form Trigger field name)
- `userId` - The Clerk user ID of the person uploading
- `timestamp` - When the upload occurred

### File Validation

The dashboard validates:
- **File types**: MP4, MOV, AVI, MPEG only
- **File size**: Maximum 100MB
- **Required**: At least one file must be selected

---

## ❌ Troubleshooting

### Problem: "n8n webhook configuration is missing"

**Solution:**
1. Check that `N8N_WEBHOOK_URL` is set in `.env.local`
2. Make sure there are no typos
3. Restart your dev server with `pnpm dev`

### Problem: Video upload fails with network error

**Solution:**
1. Check that your n8n instance is accessible
2. Test the webhook URL manually:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20 \
     -F "Video=@/path/to/test-video.mp4"
   ```
3. Make sure your n8n workflow is **Active** (not paused)
4. Check n8n firewall/security settings if self-hosted

### Problem: n8n receives the request but fails

**Solution:**
1. Check n8n execution logs for errors
2. Verify your Google Gemini API key is configured in n8n
3. Check your Notion integration is connected in n8n
4. Verify the Notion database ID is correct

### Problem: Results don't appear in Notion

**Solution:**
1. Check the n8n execution completed successfully
2. Verify the Notion node in your workflow has the correct database ID
3. Make sure your Notion database has all required fields
4. Check Notion integration permissions

### Problem: CORS errors in browser console

**Solution:**
- This shouldn't happen since the request goes through your Next.js API route
- If it does, check that you're using the API route (`/api/n8n/video-analysis`) and not calling n8n directly from the frontend

---

## 🎨 Customization Options

### Change File Size Limit

Edit `src/app/[locale]/(front)/dashboard/video-analysis/page.tsx` line 125:

```typescript
// Change from 100MB to 200MB
const maxSize = 200 * 1024 * 1024
```

### Add More File Types

Edit the same file, line 118:

```typescript
const allowedTypes = [
  'video/mp4', 
  'video/mpeg', 
  'video/quicktime', 
  'video/x-msvideo',
  'video/webm',  // Add WebM support
  'video/x-matroska'  // Add MKV support
]
```

### Change Success Messages

Edit the same file, line 56 and 100 to customize the success messages shown to users.

---

## 📚 Related Files

If you want to understand or modify the integration:

- **Frontend**: `src/app/[locale]/(front)/dashboard/video-analysis/page.tsx`
- **API Route**: `src/app/api/n8n/video-analysis/route.ts`
- **n8n Client**: `src/lib/n8n.ts`
- **Environment Config**: `src/env.ts`

---

## 🚀 Next Steps

Once you have the basic integration working:

1. **Test with different video formats** to ensure compatibility
2. **Monitor n8n execution logs** to catch any issues
3. **Check Notion database** to verify data is being saved correctly
4. **Consider adding error notifications** (email/Slack) in n8n for failed executions
5. **Set up YouTube URL analysis** if you want that feature too

---

## 💡 Tips

- Keep your n8n workflow **Active** at all times
- Monitor your Google Gemini API usage/quota
- Check Notion API rate limits if processing many videos
- Consider adding a queue system if you expect high volume
- Test with small videos first (under 10MB) to verify everything works

---

## ✅ Checklist

- [ ] Found my n8n instance URL
- [ ] Updated `N8N_WEBHOOK_URL` in `.env.local`
- [ ] Verified webhook ID is `c2838e30-aa6c-4232-b20e-e8366aadab20`
- [ ] n8n workflow is **Active**
- [ ] Restarted dev server
- [ ] Tested video upload
- [ ] Checked n8n execution logs
- [ ] Verified results in Notion

---

**Need Help?** Check the main `IMPLEMENTATION_GUIDE.md` for more details or the `QUICK_START.md` for a simplified guide.

