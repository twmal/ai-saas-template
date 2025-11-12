# 🎬 Video Analysis Dashboard - Implementation Guide

## 📋 Overview

This guide covers the complete implementation of:
1. **User Access Control** (Email Whitelist)
2. **n8n Integration** for Video Analysis
3. **Dashboard with Sidebar Navigation**

---

## ✅ What Has Been Implemented

### 1. **User Access Control (Email Whitelist)**

#### Files Modified/Created:
- `.env.local` - Added `ALLOWED_USER_EMAILS` configuration
- `src/env.ts` - Added whitelist validation functions
- `src/middleware.ts` - Added email whitelist checking
- `src/app/[locale]/unauthorized/page.tsx` - Updated unauthorized page

#### How It Works:
1. Users can register with Clerk authentication
2. After login, middleware checks if their email is in the whitelist
3. If not whitelisted → redirected to `/unauthorized` page
4. If whitelisted → full access to the dashboard

#### Configuration:
Edit `.env.local`:
```env
ALLOWED_USER_EMAILS=your-email@gmail.com,friend@example.com,another@example.com
```

**Important:** 
- Separate multiple emails with commas
- No spaces between emails
- Case-insensitive matching
- If `ALLOWED_USER_EMAILS` is empty or not set, ALL users can access (open mode)

---

### 2. **Stripe Configuration - DISABLED**

#### Changes Made:
```env
# Payments disabled for personal use
ENABLE_PAYMENT_FEATURES=false
NEXT_PUBLIC_ENABLE_PAYMENT_FEATURES=false

# Stripe webhook secret - skip for now
STRIPE_WEBHOOK_SECRET=whsec_placeholder_optional_for_now
```

**When to Enable:**
- When you're ready to monetize and charge users
- Follow the Stripe setup guide in the original response

---

### 3. **n8n Integration**

#### Files Created:
- `src/lib/n8n.ts` - n8n client library
- `src/app/api/n8n/video-analysis/route.ts` - Video upload API
- `src/app/api/n8n/youtube-analysis/route.ts` - YouTube URL API

#### Configuration Required:
Edit `.env.local`:
```env
# Your n8n instance URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com

# Webhook ID from your n8n workflow (from the JSON you provided)
N8N_VIDEO_ANALYSIS_WEBHOOK_ID=c2838e30-aa6c-4232-b20e-e8366aadab20

# YouTube workflow webhook ID (create a similar workflow for YouTube)
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=your-youtube-webhook-id-here

# Optional: n8n API key for advanced features
N8N_API_KEY=your_n8n_api_key_here
```

#### How to Get Your n8n Webhook URL:

**Option A: n8n Cloud**
1. Go to your n8n cloud instance (e.g., `https://yourname.app.n8n.cloud`)
2. Your webhook URL will be: `https://yourname.app.n8n.cloud`

**Option B: Self-Hosted n8n**
1. If running locally: `http://localhost:5678`
2. If deployed: Your server URL (e.g., `https://n8n.yourdomain.com`)

#### How to Get Webhook IDs:

1. Open your n8n workflow
2. Click on the **Form Trigger** node (or Webhook node)
3. Look for the **Webhook ID** in the node settings
4. Copy the ID (e.g., `c2838e30-aa6c-4232-b20e-e8366aadab20`)

**For Video Analysis:**
- You already have it: `c2838e30-aa6c-4232-b20e-e8366aadab20`

**For YouTube Analysis:**
- Create a similar workflow in n8n for YouTube URLs
- Get the webhook ID from that workflow
- Add it to `.env.local`

---

### 4. **Dashboard with Sidebar Navigation**

#### Files Created:
- `src/components/layout/dashboard-sidebar.tsx` - Sidebar component
- `src/app/[locale]/(front)/dashboard/layout.tsx` - Dashboard layout
- `src/app/[locale]/(front)/dashboard/page.tsx` - Dashboard home (updated)
- `src/app/[locale]/(front)/dashboard/video-analysis/page.tsx` - Video analysis page

#### Dashboard Structure:
```
📊 Dashboard
├── 概览 (Overview) - /dashboard
├── 视频分析 (Video Analysis) - /dashboard/video-analysis
├── YouTube 分析 (YouTube Analysis) - /dashboard/youtube-analysis
├── 分析历史 (History) - /dashboard/history
└── 设置 (Settings) - /dashboard/settings
```

---

## 🚀 Setup Instructions

### Step 1: Update Environment Variables

1. Open `.env.local`
2. Update these values:

```env
# Add your email to the whitelist
ALLOWED_USER_EMAILS=your-actual-email@gmail.com

# Add your n8n instance URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com

# Webhook IDs are already set from your workflow
N8N_VIDEO_ANALYSIS_WEBHOOK_ID=c2838e30-aa6c-4232-b20e-e8366aadab20
```

### Step 2: Test n8n Connection

1. Make sure your n8n workflow is **active** (not paused)
2. Test the webhook URL manually:

```bash
curl -X POST https://your-n8n-instance.com/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20 \
  -F "Video=@/path/to/test-video.mp4"
```

3. Check n8n executions to see if it received the request

### Step 3: Run the Application

```bash
# Install dependencies (if needed)
pnpm install

# Run development server
pnpm dev
```

### Step 4: Test the Dashboard

1. Go to `http://localhost:3000`
2. Sign in with your whitelisted email
3. Navigate to Dashboard → Video Analysis
4. Upload a test video or enter a YouTube URL
5. Check your n8n instance for workflow execution
6. Check your Notion database for the results

---

## 🔧 How the Video Analysis Works

### Workflow:

```
User uploads video
    ↓
Next.js API (/api/n8n/video-analysis)
    ↓
Sends to n8n webhook
    ↓
n8n uploads to Google Gemini
    ↓
Gemini analyzes video
    ↓
n8n extracts JSON data
    ↓
n8n saves to Notion database
    ↓
User sees success message
```

### File Upload Limits:
- **Max file size:** 100MB
- **Supported formats:** MP4, MOV, AVI, MPEG
- **Validation:** Done on both client and server side

### YouTube Analysis:
- **URL validation:** Checks for valid YouTube URL format
- **Supported formats:** 
  - `https://www.youtube.com/watch?v=...`
  - `https://youtu.be/...`

---

## 📝 Next Steps (Optional)

### 1. Create YouTube Analysis Workflow in n8n

Your current workflow handles video file uploads. To support YouTube URLs:

1. Duplicate your existing workflow in n8n
2. Replace the **Form Trigger** with a **Webhook** node that accepts JSON
3. Add a node to download the YouTube video (use n8n's HTTP Request or YouTube node)
4. Keep the rest of the workflow the same
5. Get the new webhook ID and add it to `.env.local`

### 2. Create History Page

Create `src/app/[locale]/(front)/dashboard/history/page.tsx` to show:
- List of analyzed videos
- Analysis results
- Links to Notion pages
- Filter by date, type, etc.

### 3. Add Real-time Status Updates

Implement webhooks from n8n back to your app:
- Create `/api/n8n/callback` endpoint
- n8n sends status updates during processing
- Show real-time progress to users
- Use WebSockets or Server-Sent Events for live updates

### 4. Add Analytics

Track:
- Number of videos analyzed
- Success/failure rates
- Processing times
- Popular video types

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" after login

**Solution:**
1. Check `.env.local` - make sure your email is in `ALLOWED_USER_EMAILS`
2. Restart the dev server after changing `.env.local`
3. Clear browser cookies and try again

### Issue: "n8n webhook configuration is missing"

**Solution:**
1. Check `.env.local` has `N8N_WEBHOOK_URL` and `N8N_VIDEO_ANALYSIS_WEBHOOK_ID`
2. Make sure there are no typos
3. Restart the dev server

### Issue: Video upload fails

**Solution:**
1. Check file size (max 100MB)
2. Check file format (MP4, MOV, AVI, MPEG only)
3. Check n8n workflow is active
4. Check n8n webhook URL is correct
5. Look at browser console for errors
6. Check n8n execution logs

### Issue: Results not appearing in Notion

**Solution:**
1. Check n8n workflow execution logs
2. Make sure Notion integration is connected in n8n
3. Check Notion database ID is correct in n8n
4. Verify Notion database has all required fields

---

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Clerk Authentication](https://clerk.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Notion API](https://developers.notion.com/)

---

## 🎉 You're All Set!

Your video analysis dashboard is now ready to use. Start uploading videos and watch them automatically get analyzed and saved to Notion!

**Questions?** Check the troubleshooting section or review the code comments in the implementation files.

