# n8n Form Trigger vs Webhook Trigger Issue

## Problem Analysis

You're experiencing `videoUrl [null]` because **n8n Form Trigger** and **n8n Webhook Trigger** handle data differently.

### Key Difference:

| Trigger Type | Data Format | Use Case |
|-------------|-------------|----------|
| **Form Trigger** | Expects `application/x-www-form-urlencoded` or `multipart/form-data` | HTML forms, file uploads |
| **Webhook Trigger** | Accepts `application/json` | API integrations, JSON payloads |

### Your Current Setup:

✅ **Code sends:** `application/json` with JSON body  
❌ **Form Trigger expects:** Form data (not JSON)  
❌ **Result:** Form Trigger can't parse JSON → `videoUrl [null]`

## Solution Options

### Option 1: Change n8n to Use Webhook Trigger (RECOMMENDED)

**Pros:**
- ✅ No code changes needed
- ✅ Cleaner JSON-based integration
- ✅ Easier to debug
- ✅ Better for API integrations

**Steps:**
1. Open your n8n workflow
2. Delete the Form Trigger node
3. Add a new **Webhook** node (not Form Trigger)
4. Configure the Webhook node:
   - **HTTP Method:** POST
   - **Path:** Leave as generated (or customize)
   - **Response Mode:** Respond Immediately
   - **Response Data:** First Entry JSON
5. Copy the new webhook URL
6. Update `.env.local` with the new webhook ID
7. Restart your dev server

### Option 2: Keep Form Trigger and Send Form Data

**Pros:**
- ✅ Keeps existing n8n workflow

**Cons:**
- ❌ Requires code changes
- ❌ More complex for JSON data
- ❌ Less suitable for API integrations

**Code changes needed:**
```typescript
// Change from JSON to FormData
const formData = new URLSearchParams()
formData.append('videoUrl', youtubeUrl)
formData.append('userId', userId)
formData.append('timestamp', new Date().toISOString())

const response = await fetch(fullWebhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formData.toString(),
})
```

## Recommended Solution: Use Webhook Trigger

### Step-by-Step Guide:

#### 1. Update n8n Workflow

**In n8n:**

1. **Open your workflow** with the Form Trigger
2. **Click on the Form Trigger node** to select it
3. **Delete it** (press Delete key or right-click → Delete)
4. **Add a new node:**
   - Click the "+" button
   - Search for "Webhook"
   - Select **"Webhook"** (not "Form Trigger")
5. **Configure the Webhook node:**
   - **HTTP Method:** POST
   - **Path:** (auto-generated, or set to `youtube-analysis`)
   - **Authentication:** None (or as needed)
   - **Response Mode:** Respond Immediately
   - **Response Code:** 200
   - **Response Data:** First Entry JSON
6. **Copy the webhook URL:**
   - Look for the "Test URL" or "Production URL"
   - It will look like: `https://twmal.app.n8n.cloud/webhook/NEW-WEBHOOK-ID`
   - Copy the webhook ID (the part after `/webhook/`)

#### 2. Update Environment Variables

**In your project:**

1. Open `.env.local`
2. Update the webhook ID:
   ```env
   N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=NEW-WEBHOOK-ID-HERE
   ```
3. Also update `.env` to match:
   ```env
   N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=NEW-WEBHOOK-ID-HERE
   ```

#### 3. Restart Development Server

```bash
# Stop the server (Ctrl+C)
pnpm dev
```

#### 4. Test the Integration

**Option A: Use the test script**
```bash
npx tsx scripts/test-youtube-payload.ts
```

**Option B: Use the UI**
1. Go to: `http://localhost:3000/dashboard/video-analysis`
2. Click "YouTube URL" tab
3. Enter: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
4. Click "开始分析"

**Option C: Use curl**
```bash
curl -X POST https://twmal.app.n8n.cloud/webhook/NEW-WEBHOOK-ID \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "userId": "test-user",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }'
```

#### 5. Verify in n8n

1. Go to n8n workflow
2. Click "Execute Workflow" or wait for a real request
3. Check the Webhook node output
4. You should see:
   ```json
   {
     "body": {
       "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
       "userId": "test-user",
       "timestamp": "2024-01-15T10:30:00.000Z"
     }
   }
   ```

#### 6. Update Workflow to Use Webhook Data

**In your n8n workflow nodes:**

Change references from:
```
{{ $json.videoUrl }}
```

To:
```
{{ $json.body.videoUrl }}
```

Or use an expression like:
```
{{ $json.body?.videoUrl || $json.videoUrl }}
```

This handles both Form Trigger (old) and Webhook (new) formats.

## Debugging Steps

### 1. Verify Code is Sending Correct Data

Run this in your terminal:
```bash
node -e "
const payload = {
  videoUrl: 'https://www.youtube.com/watch?v=test',
  userId: 'test-user',
  timestamp: new Date().toISOString()
};
console.log('Payload:', JSON.stringify(payload, null, 2));
"
```

### 2. Test with curl (Direct to n8n)

```bash
# Test current webhook
curl -X POST https://twmal.app.n8n.cloud/webhook/ad5ddf87-5a47-4598-a19e-82aa4c536649 \
  -H "Content-Type: application/json" \
  -d '{"videoUrl":"https://www.youtube.com/watch?v=test","userId":"test","timestamp":"2024-01-15T10:30:00Z"}' \
  -v
```

Look for:
- Response code (should be 200)
- Response body
- Any error messages

### 3. Check n8n Execution Logs

1. Go to n8n
2. Click "Executions" in the left sidebar
3. Find the most recent execution
4. Click on it to see details
5. Check what data the Form Trigger received

### 4. Enable n8n Debug Mode

In the Webhook/Form Trigger node:
1. Click on the node
2. Look for "Options" or "Settings"
3. Enable "Raw Body" if available
4. This will show exactly what n8n receives

## Why Form Trigger Shows [null]

### Form Trigger Data Structure:

When you send JSON to a Form Trigger, n8n tries to parse it as form data:

**What you send:**
```json
{
  "videoUrl": "https://youtube.com/...",
  "userId": "user_xxx"
}
```

**What Form Trigger expects:**
```
videoUrl=https://youtube.com/...&userId=user_xxx
```

**What Form Trigger receives:**
```
Raw body: {"videoUrl":"https://youtube.com/...","userId":"user_xxx"}
Parsed fields: (none - can't parse JSON as form data)
Result: videoUrl = null
```

### Webhook Trigger Data Structure:

**What you send:**
```json
{
  "videoUrl": "https://youtube.com/...",
  "userId": "user_xxx"
}
```

**What Webhook receives:**
```json
{
  "body": {
    "videoUrl": "https://youtube.com/...",
    "userId": "user_xxx"
  },
  "headers": {...},
  "query": {...}
}
```

**Result:** ✅ `$json.body.videoUrl` contains the URL

## Comparison: Your Working Video Upload

Let me check how your video upload works:

**Video Upload (Working):**
- Uses FormData (multipart/form-data)
- Sends actual file
- Form Trigger can handle this

**YouTube URL (Not Working):**
- Uses JSON (application/json)
- Sends URL string
- Form Trigger can't parse JSON

## Final Recommendation

**Switch to Webhook Trigger** because:

1. ✅ Your code already sends JSON
2. ✅ No code changes needed
3. ✅ More appropriate for API integrations
4. ✅ Easier to debug
5. ✅ Consistent with modern API practices

**Keep Form Trigger only if:**
- You need to upload files (like video upload)
- You're submitting actual HTML forms
- You need multipart/form-data support

## Summary

| Issue | Cause | Solution |
|-------|-------|----------|
| `videoUrl [null]` | Form Trigger can't parse JSON | Use Webhook Trigger instead |
| Code sends JSON | Correct for APIs | ✅ No change needed |
| Form Trigger expects form data | Wrong trigger type | Replace with Webhook |

**Action Items:**
1. ✅ Code is correct (sends JSON with `videoUrl`)
2. ⚠️ Change n8n Form Trigger → Webhook Trigger
3. ⚠️ Update webhook ID in `.env.local`
4. ⚠️ Restart dev server
5. ✅ Test and verify

