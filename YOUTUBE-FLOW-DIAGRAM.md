# YouTube Analysis Data Flow

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER INPUT (Dashboard)                                       │
│    src/app/[locale]/(front)/dashboard/video-analysis/page.tsx  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User enters: https://www.youtube.com/watch?v=dQw4w9WgXcQ      │
│                                                                  │
│  Form submits with:                                             │
│  {                                                              │
│    "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" │
│  }                                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. API ROUTE (Backend)                                          │
│    src/app/api/n8n/youtube-analysis/route.ts                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Receives:                                                      │
│  {                                                              │
│    "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" │
│  }                                                              │
│                                                                  │
│  Validates:                                                     │
│  ✅ User is authenticated                                       │
│  ✅ YouTube URL is provided                                     │
│  ✅ URL format is valid                                         │
│                                                                  │
│  Calls:                                                         │
│  triggerYouTubeAnalysis(youtubeUrl, userId)                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. N8N CLIENT (Integration Layer)                               │
│    src/lib/n8n.ts                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Receives:                                                      │
│  - youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"   │
│  - userId: "user_35HCqsrPN5FQT8845i6wa2hyDzu"                  │
│                                                                  │
│  Constructs webhook URL:                                        │
│  https://twmal.app.n8n.cloud/webhook/ad5ddf87-...              │
│                                                                  │
│  ⚠️  PARAMETER NAME MAPPING (THE FIX!)                          │
│  Transforms payload:                                            │
│  {                                                              │
│    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  │
│    ^^^^^^^^^^                                                   │
│    Changed from "youtubeUrl" to "videoUrl"                     │
│                                                                  │
│    "userId": "user_35HCqsrPN5FQT8845i6wa2hyDzu",               │
│    "timestamp": "2024-01-15T10:30:00.000Z"                     │
│  }                                                              │
│                                                                  │
│  Sends POST request to n8n webhook                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. N8N WEBHOOK (External Service)                               │
│    https://twmal.app.n8n.cloud                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Receives:                                                      │
│  {                                                              │
│    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  │
│    "userId": "user_35HCqsrPN5FQT8845i6wa2hyDzu",               │
│    "timestamp": "2024-01-15T10:30:00.000Z"                     │
│  }                                                              │
│                                                                  │
│  ✅ Now receives actual URL instead of [null]                   │
│                                                                  │
│  Workflow steps:                                                │
│  1. Download YouTube video                                      │
│  2. Extract audio/video content                                 │
│  3. Send to Google Gemini AI for analysis                      │
│  4. Format analysis results                                     │
│  5. Save to Notion database                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. NOTION DATABASE (Final Destination)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Receives analysis results:                                     │
│  - Theme                                                        │
│  - Trend Source                                                 │
│  - Video URL                                                    │
│  - Hashtags                                                     │
│  - Description                                                  │
│  - Popularity                                                   │
│  - Engagement Type                                              │
│  - Script Angle                                                 │
│  - AI Prompt Base                                               │
│  - Language                                                     │
│  - Notes                                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Parameter Name Mapping

### Why the mapping is needed:

| Layer | Parameter Name | Reason |
|-------|---------------|--------|
| Frontend | `youtubeUrl` | Internal naming convention |
| API Route | `youtubeUrl` | Matches frontend |
| n8n Client | `youtubeUrl` → `videoUrl` | **Maps to n8n's expected format** |
| n8n Webhook | `videoUrl` | n8n workflow configuration |

### The Fix in Detail:

**Before (Broken):**
```typescript
// src/lib/n8n.ts
body: JSON.stringify({
  youtubeUrl,  // ❌ n8n doesn't recognize this
  userId,
  timestamp: new Date().toISOString(),
})
```

**After (Fixed):**
```typescript
// src/lib/n8n.ts
body: JSON.stringify({
  videoUrl: youtubeUrl,  // ✅ n8n recognizes this
  userId,
  timestamp: new Date().toISOString(),
})
```

## Testing the Fix

### 1. Test with Script
```bash
npx tsx scripts/test-youtube-payload.ts
```

Expected output:
```
✅ Parameter name: "videoUrl" (correct for n8n)
✅ YouTube URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
✅ Success! n8n received the payload correctly
```

### 2. Test with UI
1. Go to: `http://localhost:3000/dashboard/video-analysis`
2. Click "YouTube URL" tab
3. Enter: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
4. Click "开始分析"
5. Check n8n logs - should show the URL, not `[null]`

### 3. Test with curl
```bash
curl -X POST https://twmal.app.n8n.cloud/webhook/ad5ddf87-5a47-4598-a19e-82aa4c536649 \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "userId": "test-user",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }'
```

## Common Issues and Solutions

### Issue: Still receiving [null]
**Solution:** Make sure you restarted the development server after the fix

### Issue: 404 Not Found
**Solution:** Check that the webhook ID is correct and the workflow is active

### Issue: n8n workflow fails
**Solution:** Check n8n execution logs for detailed error messages

## Summary

✅ **Problem:** n8n received `[null]` for video URL  
✅ **Cause:** Parameter name mismatch (`youtubeUrl` vs `videoUrl`)  
✅ **Solution:** Map `youtubeUrl` to `videoUrl` when sending to n8n  
✅ **Status:** Fixed in `src/lib/n8n.ts` line 138  
✅ **Action:** Restart server and test

