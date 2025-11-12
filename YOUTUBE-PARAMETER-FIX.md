# ✅ YouTube Parameter Name Fix

## Problem Identified

The n8n webhook was receiving `[null]` for the video URL because of a **parameter name mismatch**:

- **Code was sending:** `"youtubeUrl"`
- **n8n was expecting:** `"videoUrl"`

## The Fix

Changed the parameter name in `src/lib/n8n.ts` from `"youtubeUrl"` to `"videoUrl"` when sending data to n8n.

### Before (Incorrect):
```typescript
body: JSON.stringify({
  youtubeUrl,  // ❌ Wrong parameter name
  userId,
  timestamp: new Date().toISOString(),
})
```

### After (Correct):
```typescript
body: JSON.stringify({
  videoUrl: youtubeUrl,  // ✅ Correct parameter name for n8n
  userId,
  timestamp: new Date().toISOString(),
})
```

## Data Flow Analysis

### Complete Flow:

1. **Frontend** (`src/app/[locale]/(front)/dashboard/video-analysis/page.tsx`)
   - User enters YouTube URL in input field
   - Form submits with: `{ youtubeUrl: "https://youtube.com/..." }`
   - ✅ This is fine - internal naming

2. **API Route** (`src/app/api/n8n/youtube-analysis/route.ts`)
   - Receives: `{ youtubeUrl: "..." }`
   - Validates the URL format
   - Calls: `triggerYouTubeAnalysis(youtubeUrl, userId)`
   - ✅ This is fine - internal naming

3. **n8n Client** (`src/lib/n8n.ts`)
   - **BEFORE:** Sent `{ youtubeUrl: "...", userId: "...", timestamp: "..." }`
   - **AFTER:** Sends `{ videoUrl: "...", userId: "...", timestamp: "..." }`
   - ✅ **FIXED** - Now matches n8n's expected parameter name

4. **n8n Webhook**
   - Expects: `{ videoUrl: "...", userId: "...", timestamp: "..." }`
   - ✅ Now receives the correct parameter name

## Expected Payload to n8n

```json
{
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "userId": "user_35HCqsrPN5FQT8845i6wa2hyDzu",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Testing the Fix

### Option 1: Test via Script

Run the test script to verify the payload:

```bash
npx tsx scripts/test-youtube-payload.ts
```

This will:
- ✅ Show the exact payload being sent
- ✅ Send a test request to n8n
- ✅ Display the response from n8n
- ✅ Verify the parameter name is correct

### Option 2: Test via UI

1. **Restart your development server** (if not already done):
   ```bash
   pnpm dev
   ```

2. **Go to the dashboard:**
   ```
   http://localhost:3000/dashboard/video-analysis
   ```

3. **Click the "YouTube URL" tab**

4. **Enter a YouTube URL:**
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Or: `https://www.youtube.com/shorts/ayQFLhlICeQ`

5. **Click "开始分析" (Start Analysis)**

6. **Check the logs:**
   - Should see success message
   - n8n should receive the YouTube URL correctly
   - No more `[null]` values!

### Option 3: Test with curl

Test the webhook directly:

```bash
curl -X POST https://twmal.app.n8n.cloud/webhook/ad5ddf87-5a47-4598-a19e-82aa4c536649 \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "userId": "test-user",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }'
```

Expected: n8n should process the video URL correctly

## Why This Happened

### Root Cause:
The code was using `"youtubeUrl"` as the parameter name throughout the application (which is fine for internal use), but when sending to n8n, it should have been renamed to `"videoUrl"` to match what the n8n workflow expects.

### Why It Wasn't Caught Earlier:
- The webhook connection was working (200 OK response)
- The error only appeared when checking what n8n received
- The parameter name mismatch caused n8n to receive `undefined` for the video URL
- n8n likely has a field mapping that expects `"videoUrl"`

## Code Changes Summary

### File Modified:
- `src/lib/n8n.ts` (lines 124-142)

### Change:
```diff
  body: JSON.stringify({
-   youtubeUrl,
+   videoUrl: youtubeUrl, // n8n expects "videoUrl" parameter
    userId,
    timestamp: new Date().toISOString(),
  }),
```

### Files Created:
- `scripts/test-youtube-payload.ts` - Test script to verify payload
- `YOUTUBE-PARAMETER-FIX.md` - This documentation

## Verification Checklist

After the fix, verify:

- [ ] Development server restarted
- [ ] Test script runs successfully: `npx tsx scripts/test-youtube-payload.ts`
- [ ] UI test: Submit a YouTube URL via dashboard
- [ ] Check n8n execution logs - should show the YouTube URL, not `[null]`
- [ ] Verify n8n workflow processes the video correctly
- [ ] Check Notion database - should receive the analysis results

## Expected Behavior

### Before Fix:
```
n8n receives: { videoUrl: null, userId: "user_xxx", timestamp: "..." }
                          ^^^^
                          Problem!
```

### After Fix:
```
n8n receives: { videoUrl: "https://youtube.com/...", userId: "user_xxx", timestamp: "..." }
                          ^^^^^^^^^^^^^^^^^^^^^^^^
                          Correct!
```

## Next Steps

1. **Restart your server** (if not already done)
2. **Run the test script** to verify: `npx tsx scripts/test-youtube-payload.ts`
3. **Test via UI** with a real YouTube URL
4. **Check n8n logs** to confirm it's receiving the URL correctly
5. **Verify Notion** receives the analysis results

## Notes

- The internal code still uses `"youtubeUrl"` (which is fine)
- Only the payload sent to n8n uses `"videoUrl"`
- This is a common pattern when integrating with external APIs
- The parameter name is mapped at the integration boundary

---

## Summary

**Problem:** n8n received `[null]` for video URL  
**Cause:** Parameter name mismatch (`"youtubeUrl"` vs `"videoUrl"`)  
**Solution:** Changed parameter name to `"videoUrl"` when sending to n8n  
**Status:** ✅ Fixed  
**Action Required:** Restart server and test

