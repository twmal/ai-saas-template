# 🚀 Quick Reference Card

## ⚡ 2-Minute Setup

### 1. Find Your n8n URL

**n8n Cloud**: `https://yourname.app.n8n.cloud`  
**Local**: `http://localhost:5678`  
**Self-hosted**: `https://n8n.yourdomain.com`

### 2. Update `.env.local`

```env
N8N_WEBHOOK_URL=https://your-actual-n8n-url-here
```

### 3. Activate Workflow

Open n8n → Find "Analyze Video (Nov 9 at 13:02:33)" → Toggle **Active** ON

### 4. Start & Test

```bash
pnpm dev
```

Go to: `http://localhost:3000/dashboard/video-analysis`

---

## 🧪 Quick Test

```bash
# Test n8n webhook directly
curl -X POST YOUR_N8N_URL/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20 \
  -F "Video=@test-video.mp4"
```

---

## 📊 What Happens

```
Upload Video → Dashboard → API → n8n → Gemini AI → Notion
```

---

## ❌ Quick Fixes

| Problem | Fix |
|---------|-----|
| "webhook configuration missing" | Update `N8N_WEBHOOK_URL` in `.env.local` |
| Upload fails | Check workflow is **Active** in n8n |
| No Notion results | Check n8n execution logs |

---

## 📁 Key Files

- **Dashboard**: `src/app/[locale]/(front)/dashboard/video-analysis/page.tsx`
- **API**: `src/app/api/n8n/video-analysis/route.ts`
- **n8n Client**: `src/lib/n8n.ts`
- **Config**: `.env.local`

---

## 🔑 Environment Variables

```env
# Required
N8N_WEBHOOK_URL=https://your-n8n-instance.com
N8N_VIDEO_ANALYSIS_WEBHOOK_ID=c2838e30-aa6c-4232-b20e-e8366aadab20

# Optional (for YouTube analysis)
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=your-youtube-webhook-id
```

---

## ✅ Checklist

- [ ] Updated `N8N_WEBHOOK_URL`
- [ ] Workflow is **Active**
- [ ] Restarted dev server
- [ ] Tested upload
- [ ] Checked Notion

---

## 📚 Full Documentation

- **Setup**: `N8N_SETUP_GUIDE.md`
- **Testing**: `TEST_N8N_CONNECTION.md`
- **Overview**: `INTEGRATION_SUMMARY.md`

---

## 🎯 Webhook Details

**Full URL Format**:
```
{N8N_WEBHOOK_URL}/webhook/{WEBHOOK_ID}
```

**Example**:
```
https://john.app.n8n.cloud/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20
```

**FormData Sent**:
- `Video` - Video file
- `userId` - User ID
- `timestamp` - Upload time

---

## 🎨 File Limits

- **Max Size**: 100 MB
- **Formats**: MP4, MOV, AVI, MPEG
- **Change Limit**: Edit line 125 in `page.tsx`

---

## 🔍 Debugging

**Check n8n Logs**:
1. n8n Dashboard → Executions
2. Click latest execution
3. Review each node

**Check Browser Console**:
1. F12 or Cmd+Option+I
2. Console tab
3. Network tab

**Check Terminal**:
Look for error messages when running `pnpm dev`

---

## 💡 Pro Tips

✅ Test with small videos first (< 10MB)  
✅ Keep n8n workflow Active  
✅ Monitor Gemini API quota  
✅ Check n8n logs if upload fails  
✅ Use curl to test webhook directly  

---

## 🆘 Need Help?

1. Check `N8N_SETUP_GUIDE.md` for detailed troubleshooting
2. Review n8n execution logs
3. Verify environment variables
4. Make sure workflow is Active
5. Test webhook with curl

---

**That's all you need to know! 🎉**

