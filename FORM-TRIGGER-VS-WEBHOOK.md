# Form Trigger vs Webhook Trigger in n8n

## Quick Comparison

| Feature | Form Trigger | Webhook Trigger |
|---------|-------------|-----------------|
| **Accepts JSON** | ❌ No | ✅ Yes |
| **Accepts Form Data** | ✅ Yes | ✅ Yes |
| **File Uploads** | ✅ Yes | ⚠️ Limited |
| **API Integration** | ❌ Not ideal | ✅ Perfect |
| **Your Use Case** | ❌ Wrong choice | ✅ Right choice |

## Visual Comparison

### Form Trigger (Current - Not Working)

```
┌─────────────────────────────────────────────────────────────┐
│ Your Application                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Sends:                                                      │
│  POST /webhook/ad5ddf87-5a47-4598-a19e-82aa4c536649         │
│  Content-Type: application/json                             │
│                                                              │
│  {                                                           │
│    "videoUrl": "https://youtube.com/watch?v=...",           │
│    "userId": "user_xxx",                                    │
│    "timestamp": "2024-01-15T10:30:00Z"                      │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ n8n Form Trigger                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Expects:                                                    │
│  Content-Type: application/x-www-form-urlencoded            │
│  OR                                                          │
│  Content-Type: multipart/form-data                          │
│                                                              │
│  Receives JSON instead:                                      │
│  ❌ Cannot parse JSON as form data                          │
│                                                              │
│  Result:                                                     │
│  {                                                           │
│    "videoUrl": null,  ← ❌ PROBLEM!                         │
│    "userId": null,                                          │
│    "timestamp": null                                        │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Webhook Trigger (Recommended - Will Work)

```
┌─────────────────────────────────────────────────────────────┐
│ Your Application                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Sends:                                                      │
│  POST /webhook/NEW-WEBHOOK-ID                               │
│  Content-Type: application/json                             │
│                                                              │
│  {                                                           │
│    "videoUrl": "https://youtube.com/watch?v=...",           │
│    "userId": "user_xxx",                                    │
│    "timestamp": "2024-01-15T10:30:00Z"                      │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ n8n Webhook Trigger                                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Accepts:                                                    │
│  ✅ application/json                                         │
│  ✅ application/x-www-form-urlencoded                        │
│  ✅ multipart/form-data                                      │
│  ✅ text/plain                                               │
│                                                              │
│  Receives JSON:                                              │
│  ✅ Parses correctly                                         │
│                                                              │
│  Result:                                                     │
│  {                                                           │
│    "body": {                                                │
│      "videoUrl": "https://youtube.com/...",  ← ✅ WORKS!    │
│      "userId": "user_xxx",                                  │
│      "timestamp": "2024-01-15T10:30:00Z"                    │
│    },                                                        │
│    "headers": {...},                                        │
│    "query": {...}                                           │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## How to Switch from Form Trigger to Webhook Trigger

### Step 1: In n8n Workflow

1. **Open your workflow**
2. **Delete the Form Trigger node**
   - Click on it
   - Press Delete or right-click → Delete

3. **Add Webhook node**
   - Click "+" to add a node
   - Search for "Webhook"
   - Select "Webhook" (not "Form Trigger")

4. **Configure Webhook**
   ```
   HTTP Method: POST
   Path: youtube-analysis (or leave auto-generated)
   Authentication: None
   Response Mode: Respond Immediately
   Response Code: 200
   ```

5. **Copy the webhook URL**
   - Look for "Test URL" or "Production URL"
   - Example: `https://twmal.app.n8n.cloud/webhook/abc123def456`
   - Copy the ID part: `abc123def456`

### Step 2: Update Your Code

1. **Update `.env.local`:**
   ```env
   N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=abc123def456
   ```

2. **Update `.env`:**
   ```env
   N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=abc123def456
   ```

3. **Restart server:**
   ```bash
   pnpm dev
   ```

### Step 3: Update Workflow References

In your n8n workflow nodes, change:

**Old (Form Trigger):**
```javascript
{{ $json.videoUrl }}
{{ $json.userId }}
```

**New (Webhook):**
```javascript
{{ $json.body.videoUrl }}
{{ $json.body.userId }}
```

**Or use a safe expression:**
```javascript
{{ $json.body?.videoUrl || $json.videoUrl }}
{{ $json.body?.userId || $json.userId }}
```

## Testing Both Approaches

### Test 1: Current Code (JSON)

```bash
npx tsx scripts/debug-n8n-request.ts
```

This will test:
- ✅ JSON payload (what your code sends)
- ✅ Form data payload (alternative)

### Test 2: Direct curl Test

**Test with JSON (for Webhook Trigger):**
```bash
curl -X POST https://twmal.app.n8n.cloud/webhook/YOUR-WEBHOOK-ID \
  -H "Content-Type: application/json" \
  -d '{"videoUrl":"https://youtube.com/watch?v=test","userId":"test","timestamp":"2024-01-15T10:30:00Z"}'
```

**Test with Form Data (for Form Trigger):**
```bash
curl -X POST https://twmal.app.n8n.cloud/webhook/YOUR-WEBHOOK-ID \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "videoUrl=https://youtube.com/watch?v=test&userId=test&timestamp=2024-01-15T10:30:00Z"
```

## Why Your Video Upload Works

Your video upload uses **FormData** which Form Trigger can handle:

```typescript
// Video upload (works with Form Trigger)
const formData = new FormData()
formData.append('Video', videoFile)  // Actual file
formData.append('userId', userId)
// Content-Type: multipart/form-data (automatic)
```

But YouTube URL uses **JSON** which Form Trigger cannot handle:

```typescript
// YouTube URL (doesn't work with Form Trigger)
body: JSON.stringify({
  videoUrl: youtubeUrl,  // JSON object
  userId,
})
// Content-Type: application/json
```

## Recommendation

### For YouTube URL Analysis:
**Use Webhook Trigger** ✅

**Reasons:**
1. Your code sends JSON
2. No code changes needed
3. Better for API integrations
4. Easier to debug
5. More flexible

### For Video File Upload:
**Keep Form Trigger** ✅

**Reasons:**
1. Handles file uploads well
2. Supports multipart/form-data
3. Already working

## Alternative: Keep Form Trigger, Change Code

If you really want to keep Form Trigger, change the code:

```typescript
// In src/lib/n8n.ts
// Replace JSON with Form Data
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

**But this is NOT recommended** because:
- ❌ Less clean than JSON
- ❌ Harder to debug
- ❌ Not standard for API integrations
- ❌ More code changes needed

## Summary

| Scenario | Solution | Effort |
|----------|----------|--------|
| **Switch to Webhook Trigger** | Update n8n workflow + env vars | ⭐ Easy (Recommended) |
| **Keep Form Trigger** | Change code to send form data | ⭐⭐⭐ Medium (Not recommended) |

**Best approach:** Switch to Webhook Trigger in n8n! 🎯

