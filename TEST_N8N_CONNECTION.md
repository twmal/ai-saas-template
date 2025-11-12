# 🧪 Test Your n8n Connection

## Quick Test Commands

### Before You Start

Make sure you have:
1. Your n8n instance URL
2. Your workflow is **Active** in n8n

---

## Method 1: Test with curl (Recommended)

This tests if your n8n webhook is working correctly.

### Step 1: Create a small test video

If you don't have a test video, you can create a simple one:

**On Mac:**
```bash
# Create a 5-second test video (requires ffmpeg)
# Install ffmpeg first: brew install ffmpeg
ffmpeg -f lavfi -i testsrc=duration=5:size=320x240:rate=1 -pix_fmt yuv420p test-video.mp4
```

**Or just use any small MP4 file you have on your computer.**

### Step 2: Test the n8n webhook directly

Replace `YOUR_N8N_URL` with your actual n8n instance URL:

```bash
curl -X POST YOUR_N8N_URL/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20 \
  -F "Video=@test-video.mp4" \
  -F "userId=test-user" \
  -F "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

**Example for n8n Cloud:**
```bash
curl -X POST https://john.app.n8n.cloud/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20 \
  -F "Video=@test-video.mp4" \
  -F "userId=test-user" \
  -F "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

**Example for Local n8n:**
```bash
curl -X POST http://localhost:5678/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20 \
  -F "Video=@test-video.mp4" \
  -F "userId=test-user" \
  -F "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

### Expected Response

If successful, you should see:
- A JSON response from n8n (the exact format depends on your workflow)
- A new execution in your n8n dashboard
- A new entry in your Notion database (after processing completes)

---

## Method 2: Test Through Your Dashboard

This tests the full integration.

### Step 1: Start your dev server

```bash
pnpm dev
```

### Step 2: Open the dashboard

1. Go to `http://localhost:3000`
2. Sign in with your account
3. Navigate to **Dashboard** → **Video Analysis**

### Step 3: Upload a test video

1. Click on the **"上传视频"** (Upload Video) tab
2. Select a small test video
3. Click **"开始分析"** (Start Analysis)
4. Watch for the success message

### Step 4: Check the browser console

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to the **Console** tab
3. Look for any error messages
4. Check the **Network** tab to see the API request

---

## Method 3: Test with Postman or Insomnia

If you prefer using API testing tools:

### Configuration

- **Method**: POST
- **URL**: `YOUR_N8N_URL/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20`
- **Body Type**: form-data
- **Fields**:
  - `Video` (file): Select your test video file
  - `userId` (text): `test-user`
  - `timestamp` (text): `2024-01-15T10:30:00Z`

---

## 🔍 What to Check

### In n8n Dashboard

1. Go to **Executions** in the left sidebar
2. Look for a new execution
3. Click on it to see details
4. Check each node to see if it processed correctly
5. Look for any error messages

### In Notion

1. Open your Notion database
2. Look for a new entry
3. Check if all fields are populated correctly
4. Verify the AI analysis makes sense

### In Your App Logs

If running the dev server, check the terminal for logs:

```
✓ Triggering n8n video analysis workflow
✓ n8n video analysis workflow triggered successfully
```

---

## ❌ Common Issues and Solutions

### Issue: "Connection refused" or "Network error"

**Possible causes:**
1. n8n instance is not running
2. Wrong URL in `.env.local`
3. Firewall blocking the connection
4. n8n workflow is not active

**Solutions:**
1. Check if you can access your n8n instance in a browser
2. Verify the URL in `.env.local` is correct
3. Make sure the workflow is **Active** (toggle is ON)
4. If self-hosted, check firewall rules

### Issue: "404 Not Found"

**Possible causes:**
1. Wrong webhook ID
2. Workflow doesn't exist or was deleted
3. Webhook path is incorrect

**Solutions:**
1. Verify the webhook ID: `c2838e30-aa6c-4232-b20e-e8366aadab20`
2. Check if the workflow exists in n8n
3. Make sure the workflow has a Form Trigger node

### Issue: "401 Unauthorized" or "403 Forbidden"

**Possible causes:**
1. n8n requires authentication
2. Webhook is not publicly accessible

**Solutions:**
1. Check n8n webhook settings
2. Make sure the Form Trigger is set to accept requests without authentication
3. If using n8n Cloud, check workspace settings

### Issue: Request succeeds but no Notion entry

**Possible causes:**
1. Notion integration not connected
2. Wrong database ID
3. Missing required fields in Notion
4. Gemini API error

**Solutions:**
1. Check n8n execution logs for errors
2. Verify Notion integration in n8n
3. Check Gemini API key is configured
4. Look at the error details in the failed execution

---

## 📊 Expected Flow

```
User uploads video
    ↓
Dashboard validates file
    ↓
POST to /api/n8n/video-analysis
    ↓
API checks authentication
    ↓
API forwards to n8n webhook
    ↓
n8n Form Trigger receives video
    ↓
n8n sends video to Google Gemini
    ↓
Gemini analyzes video content
    ↓
n8n receives analysis results
    ↓
n8n saves to Notion database
    ↓
User sees success message
    ↓
User checks Notion for results
```

---

## 🎯 Success Criteria

Your integration is working correctly if:

- ✅ curl command returns a successful response
- ✅ New execution appears in n8n dashboard
- ✅ Execution shows all nodes completed successfully
- ✅ New entry appears in Notion database
- ✅ Notion entry contains AI-generated analysis
- ✅ Dashboard shows success message
- ✅ No errors in browser console
- ✅ No errors in terminal logs

---

## 🚀 Next Steps After Successful Test

1. **Test with different video formats** (MP4, MOV, AVI)
2. **Test with different file sizes** (small, medium, large)
3. **Test error handling** (try uploading a non-video file)
4. **Monitor performance** (how long does analysis take?)
5. **Set up error notifications** in n8n
6. **Consider adding a progress indicator** in the dashboard

---

## 💡 Pro Tips

- Start with small videos (under 10MB) for faster testing
- Keep the n8n execution log open while testing
- Use the browser DevTools Network tab to debug API calls
- Check both the terminal and browser console for errors
- Test the curl command first before testing through the dashboard
- If something fails, check n8n execution logs first

---

## 📝 Debugging Checklist

If something isn't working, go through this checklist:

- [ ] n8n instance is accessible in browser
- [ ] n8n workflow is **Active** (toggle is ON)
- [ ] `N8N_WEBHOOK_URL` is correct in `.env.local`
- [ ] Webhook ID is `c2838e30-aa6c-4232-b20e-e8366aadab20`
- [ ] Dev server was restarted after changing `.env.local`
- [ ] Test video file exists and is a valid video format
- [ ] Google Gemini API key is configured in n8n
- [ ] Notion integration is connected in n8n
- [ ] Notion database ID is correct in n8n workflow
- [ ] All required fields exist in Notion database
- [ ] No errors in browser console
- [ ] No errors in terminal logs
- [ ] No errors in n8n execution logs

---

**Still having issues?** Check the `N8N_SETUP_GUIDE.md` for more detailed troubleshooting steps.

