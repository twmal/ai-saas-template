# 🚀 Quick Start Guide

## ⚡ 3-Minute Setup

### 1. Update Your Email Whitelist

Open `.env.local` and replace with your actual email:

```env
ALLOWED_USER_EMAILS=your-actual-email@gmail.com
```

### 2. Configure n8n Connection

In `.env.local`, update:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com
```

**How to find your n8n URL:**
- **n8n Cloud:** `https://yourname.app.n8n.cloud`
- **Self-hosted:** Your server URL (e.g., `http://localhost:5678`)

### 3. Activate Your n8n Workflow

1. Open your n8n workflow
2. Click the **"Active"** toggle to turn it ON
3. Make sure it's not paused

### 4. Run the App

```bash
pnpm dev
```

### 5. Test It!

1. Go to `http://localhost:3000`
2. Sign in with your whitelisted email
3. Click **Dashboard** in the navigation
4. Go to **Video Analysis**
5. Upload a test video or paste a YouTube URL
6. Check your Notion database for results!

---

## ✅ Checklist

- [ ] Updated `ALLOWED_USER_EMAILS` with my email
- [ ] Updated `N8N_WEBHOOK_URL` with my n8n instance URL
- [ ] n8n workflow is **ACTIVE** (not paused)
- [ ] Notion integration is connected in n8n
- [ ] Ran `pnpm dev` successfully
- [ ] Tested video upload
- [ ] Checked Notion for results

---

## 🎯 What You Get

### ✅ Implemented Features:

1. **Email Whitelist Access Control**
   - Only you (and whitelisted users) can access the dashboard
   - Others see "Access Restricted" page

2. **Stripe Payments DISABLED**
   - No payment features for personal use
   - Can enable later when monetizing

3. **Video Analysis Dashboard**
   - Upload video files (MP4, MOV, AVI, MPEG)
   - Paste YouTube URLs
   - Automatic AI analysis with Google Gemini
   - Auto-save to Notion database

4. **Sidebar Navigation**
   - Clean, modern dashboard layout
   - Easy navigation between features
   - User profile display

---

## 🔑 Key Files Modified

```
.env.local                                    # Configuration
src/env.ts                                    # Environment validation
src/middleware.ts                             # Access control
src/lib/n8n.ts                               # n8n integration
src/app/api/n8n/video-analysis/route.ts      # Video upload API
src/app/api/n8n/youtube-analysis/route.ts    # YouTube API
src/components/layout/dashboard-sidebar.tsx  # Sidebar component
src/app/[locale]/(front)/dashboard/          # Dashboard pages
```

---

## 📖 Full Documentation

See `IMPLEMENTATION_GUIDE.md` for:
- Detailed setup instructions
- How everything works
- Troubleshooting guide
- Next steps and enhancements

---

## 🆘 Quick Troubleshooting

**Can't access dashboard after login?**
→ Check your email is in `ALLOWED_USER_EMAILS` in `.env.local`

**Video upload fails?**
→ Make sure n8n workflow is ACTIVE and `N8N_WEBHOOK_URL` is correct

**Results not in Notion?**
→ Check n8n execution logs and Notion integration

---

## 🎉 That's It!

You're ready to start analyzing videos with AI!

**Need help?** Check `IMPLEMENTATION_GUIDE.md` for detailed documentation.

