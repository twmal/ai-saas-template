# 🔧 Fix Guide - n8n Integration Issues

## 🔴 Problems Identified

### Problem 1: Wrong URL Format ❌
You included the workflow editor path in your n8n URL:
```env
N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud/workflow/N9PoLmsGSelCmc8j
```

**Why this is wrong:**
- `/workflow/N9PoLmsGSelCmc8j` is the path to edit your workflow in the n8n UI
- The webhook endpoint needs only the base URL
- The code will append `/webhook/{webhook-id}` automatically

### Problem 2: Dev Server Not Restarted ❌
The error log shows:
```
webhookUrl: 'https://your-n8n-instance.com/webhook/...'
```

This means your dev server is still using the old placeholder value from before you updated `.env.local`.

---

## ✅ Solution Applied

I've fixed your `.env.local` file. The correct configuration is now:

```env
N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud
```

**What changed:**
- ❌ Removed: `/workflow/N9PoLmsGSelCmc8j`
- ✅ Kept: `https://twmal.app.n8n.cloud`

---

## 🚀 Next Steps (Do These Now!)

### Step 1: Restart Your Dev Server ⚡

**If your dev server is running:**
1. Press `Ctrl+C` in the terminal to stop it
2. Run `pnpm dev` to start it again

**Why this is important:**
- Next.js only reads `.env.local` when the server starts
- Changes to environment variables require a restart
- Without restarting, it will keep using the old value

### Step 2: Verify Your n8n Workflow is Active 🟢

1. Go to https://twmal.app.n8n.cloud
2. Find your workflow: "Analyze Video (Nov 9 at 13:02:33)"
3. Look for the **"Active"** toggle at the top
4. Make sure it's **ON** (should be green/blue)
5. If it's off, click it to activate

### Step 3: Test the Webhook Connection 🧪

Run the test script I created:

```bash
chmod +x test-n8n-webhook.sh
./test-n8n-webhook.sh
```

This will verify:
- ✅ Your n8n instance is accessible
- ✅ The webhook endpoint responds
- ✅ The URL format is correct

### Step 4: Test Video Upload 📹

1. Make sure dev server is running: `pnpm dev`
2. Go to: http://localhost:3000/dashboard/video-analysis
3. Upload a small test video (under 10MB)
4. Watch for success message

---

## 🔍 How the URL Works

### Understanding the URL Structure

**Your n8n base URL:**
```
https://twmal.app.n8n.cloud
```

**The webhook ID (already configured):**
```
c2838e30-aa6c-4232-b20e-e8366aadab20
```

**The code automatically constructs the full webhook URL:**
```javascript
const fullWebhookUrl = `${webhookUrl}/webhook/${webhookId}`
// Results in: https://twmal.app.n8n.cloud/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20
```

**What you see in the browser (workflow editor):**
```
https://twmal.app.n8n.cloud/workflow/N9PoLmsGSelCmc8j
```
This is NOT the webhook URL - it's just the editor URL!

---

## 📊 URL Comparison

| Type | URL | Purpose |
|------|-----|---------|
| ✅ **Base URL** | `https://twmal.app.n8n.cloud` | What you put in `.env.local` |
| ✅ **Webhook URL** | `https://twmal.app.n8n.cloud/webhook/c2838e30...` | Auto-constructed by code |
| ❌ **Editor URL** | `https://twmal.app.n8n.cloud/workflow/N9PoLmsG...` | For editing workflow (not for webhooks!) |

---

## 🧪 Testing Checklist

After restarting your dev server, verify:

- [ ] Dev server restarted successfully
- [ ] No errors in terminal on startup
- [ ] n8n workflow is **Active**
- [ ] Test script passes all checks
- [ ] Can access dashboard at http://localhost:3000
- [ ] Video upload form loads without errors
- [ ] Browser console shows no errors (F12)

---

## 🎯 Expected Behavior After Fix

### When You Upload a Video:

1. **Dashboard validates the file**
   - Checks file type (MP4, MOV, AVI, MPEG)
   - Checks file size (max 100MB)

2. **API receives the request**
   - Terminal shows: `[INFO] Triggering n8n video analysis workflow`
   - Webhook URL should now show: `https://twmal.app.n8n.cloud/webhook/c2838e30...`

3. **n8n receives the video**
   - New execution appears in n8n dashboard
   - Workflow processes the video

4. **Success message appears**
   - Dashboard shows: "视频已成功提交分析！"
   - Toast notification appears

5. **Results saved to Notion**
   - Check your Notion database
   - New entry with AI analysis

---

## ❌ Troubleshooting

### Issue: Still seeing "your-n8n-instance.com" in logs

**Solution:**
- You didn't restart the dev server
- Press `Ctrl+C` and run `pnpm dev` again

### Issue: "Connection refused" or "Network error"

**Possible causes:**
1. n8n workflow is not active
2. Wrong webhook ID
3. n8n instance is down

**Solutions:**
1. Check workflow is **Active** in n8n
2. Verify webhook ID: `c2838e30-aa6c-4232-b20e-e8366aadab20`
3. Try accessing https://twmal.app.n8n.cloud in browser

### Issue: "404 Not Found"

**Possible causes:**
1. Workflow doesn't exist
2. Webhook ID is wrong
3. Workflow was deleted

**Solutions:**
1. Check if workflow exists in n8n
2. Verify the webhook ID in your Form Trigger node
3. Make sure you're using the correct workflow

### Issue: Upload succeeds but no Notion entry

**Possible causes:**
1. Gemini API error
2. Notion integration not connected
3. Wrong database ID

**Solutions:**
1. Check n8n execution logs for errors
2. Verify Notion integration in n8n
3. Check Gemini API key is configured

---

## 🔍 How to Check n8n Execution Logs

1. Go to https://twmal.app.n8n.cloud
2. Click **"Executions"** in the left sidebar
3. Find the latest execution
4. Click on it to see details
5. Check each node for errors
6. Look at the data passed between nodes

---

## 📝 Quick Reference

### Correct Configuration

```env
# .env.local
N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud
N8N_VIDEO_ANALYSIS_WEBHOOK_ID=c2838e30-aa6c-4232-b20e-e8366aadab20
```

### Full Webhook URL (auto-constructed)

```
https://twmal.app.n8n.cloud/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20
```

### Test with curl

```bash
curl -X POST https://twmal.app.n8n.cloud/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20 \
  -F "Video=@test-video.mp4" \
  -F "userId=test-user" \
  -F "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Terminal shows correct webhook URL (with `twmal.app.n8n.cloud`)
2. ✅ No connection timeout errors
3. ✅ Success message appears in dashboard
4. ✅ New execution appears in n8n
5. ✅ Execution completes successfully
6. ✅ New entry appears in Notion

---

## 🎉 After It Works

Once you've verified everything works:

1. **Test with different video formats** (MP4, MOV, AVI)
2. **Test with different file sizes** (small, medium, large)
3. **Monitor n8n execution times**
4. **Check Notion data quality**
5. **Set up error notifications** in n8n (optional)

---

## 💡 Pro Tips

- Always restart dev server after changing `.env.local`
- Keep n8n execution logs open while testing
- Use browser DevTools (F12) to see network requests
- Start with small test videos (under 10MB)
- Check both terminal and browser console for errors

---

## 🆘 Still Having Issues?

If you're still stuck after following this guide:

1. **Check the test script output** - Run `./test-n8n-webhook.sh`
2. **Verify environment variables** - Run `echo $N8N_WEBHOOK_URL` in terminal
3. **Check n8n execution logs** - Look for specific error messages
4. **Test webhook directly** - Use the curl command above
5. **Verify workflow configuration** - Check Form Trigger settings in n8n

---

**The fix has been applied! Now restart your dev server and try again.** 🚀

