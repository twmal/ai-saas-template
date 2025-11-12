# Quick Test Guide - Clerk Webhook Fix

## 🚀 5-Minute Testing Procedure

### Prerequisites
- ✅ Development server running: `npm run dev`
- ✅ Cloudflare Tunnel running: `cloudflared tunnel run`
- ✅ `.env.local` has `CLERK_WEBHOOK_SECRET=whsec_APlnDxOSx6avZwsHtMDBV56qnRKabEaA`

---

## Test 1: Database Connection (30 seconds)

```bash
npx tsx scripts/test-db-connection.ts
```

**✅ Success looks like:**
```
✅ Database connection successful
✅ Users table exists: true
✅ Total users in database: X
```

**❌ If it fails:**
- Check `DATABASE_URL` in `.env.local`
- Verify Neon database is accessible
- Check internet connection

---

## Test 2: Webhook Configuration (30 seconds)

```bash
npx tsx scripts/test-webhook-verification.ts
```

**✅ Success looks like:**
```
✅ Webhook secret is configured
✅ Webhook secret has correct format
✅ Ready to receive webhooks from Clerk
```

**❌ If it fails:**
- Check `CLERK_WEBHOOK_SECRET` in `.env.local`
- Ensure secret starts with `whsec_`
- Restart dev server

---

## Test 3: Debug Endpoint (2 minutes)

### Step 3.1: Update Clerk Webhook URL

1. Go to: https://dashboard.clerk.com
2. Navigate to: **Webhooks** → Your endpoint
3. Change URL to: `https://tunnel.ugreel.com/api/webhook/clerk/debug`
4. Click **Save**

### Step 3.2: Send Test Event

1. Click **"Send Test Event"** button
2. Select event type: `user.created`
3. Click **Send**

### Step 3.3: Check Logs

Look for in your terminal:
```
🔍 Clerk Webhook Debug Info:
```

**✅ Success looks like:**
```json
{
  "headers": {
    "svix": {
      "svix-id": "msg_xxx",
      "svix-timestamp": "1234567890",
      "svix-signature": "v1,xxx"
    }
  },
  "body": {
    "eventType": "user.created"
  }
}
```

**❌ If headers are missing:**
- Check Cloudflare Tunnel configuration
- Verify tunnel is running
- Check for header filtering in tunnel config

---

## Test 4: Production Endpoint (2 minutes)

### Step 4.1: Update Clerk Webhook URL

1. Go back to Clerk Dashboard → Webhooks
2. Change URL to: `https://tunnel.ugreel.com/api/webhook/clerk`
3. Click **Save**

### Step 4.2: Send Test Event

1. Click **"Send Test Event"**
2. Select: `user.created`
3. Click **Send**

### Step 4.3: Check Logs

**✅ Success looks like:**
```
收到Clerk webhook请求
✅ Clerk webhook验证成功: user.created
开始处理用户创建事件
用户创建成功: user_xxx (test@example.com)
```

**❌ If verification fails:**
```
❌ Clerk webhook签名验证失败
```

**Fix:**
1. Regenerate webhook secret in Clerk Dashboard
2. Update `.env.local` with new secret
3. Restart dev server
4. Try again

---

## Test 5: Verify Database (30 seconds)

```bash
npx tsx scripts/test-db-connection.ts
```

**✅ Success looks like:**
```
✅ Total users in database: 1
Sample users:
  1. test@example.com (user_xxx)
```

**❌ If no users:**
- Check webhook verification passed (Test 4)
- Check for database errors in logs
- Verify `handleUserCreated` was called

---

## Test 6: Real User Registration (1 minute)

### Step 6.1: Register New User

1. Open: http://localhost:3000/auth/sign-up
2. Enter email and password
3. Complete registration

### Step 6.2: Check Database

```bash
npx tsx scripts/test-db-connection.ts
```

**✅ Success looks like:**
```
✅ Total users in database: 2
Sample users:
  1. test@example.com (user_xxx)
  2. your-email@example.com (user_yyy)
```

---

## 🎯 Quick Troubleshooting

### Problem: Webhook verification fails

**Quick Fix:**
```bash
# 1. Regenerate secret in Clerk Dashboard
# 2. Update .env.local
CLERK_WEBHOOK_SECRET=whsec_NEW_SECRET_HERE

# 3. Restart server
# Press Ctrl+C, then:
npm run dev
```

### Problem: No users in database

**Check:**
1. Webhook verification passes? → Check Test 4 logs
2. Database connection works? → Run Test 1
3. Errors in logs? → Look for "处理user.created失败"

### Problem: Headers missing in debug endpoint

**Check:**
1. Cloudflare Tunnel running? → `cloudflared tunnel info`
2. Correct URL in Clerk? → Should be `https://tunnel.ugreel.com/...`
3. Tunnel config? → Check `~/.cloudflared/config.yml`

---

## 📋 Success Checklist

After all tests pass:

- [x] Test 1: Database connection ✅
- [x] Test 2: Webhook configuration ✅
- [x] Test 3: Debug endpoint receives data ✅
- [x] Test 4: Production endpoint verifies signature ✅
- [x] Test 5: User appears in database ✅
- [x] Test 6: Real registration works ✅

**All green? You're done! 🎉**

---

## 🔄 After Testing

### Clean Up (Optional)

1. **Remove debug endpoint** (or keep for future debugging):
   ```bash
   rm src/app/api/webhook/clerk/debug/route.ts
   ```

2. **Keep test scripts** for future use:
   - `scripts/test-db-connection.ts`
   - `scripts/test-webhook-verification.ts`

### Monitor

1. **Clerk Dashboard**: Check webhook delivery status
2. **Application Logs**: Monitor for errors
3. **Database**: Verify users are syncing

---

## 📞 Need Help?

If any test fails, check:

1. **WEBHOOK_TROUBLESHOOTING.md** - Detailed troubleshooting guide
2. **WEBHOOK_FIX_README.md** - Complete documentation
3. **Application logs** - Enhanced logging shows exact errors

**Share when asking for help:**
- Which test failed
- Error messages from logs
- Debug endpoint output (if applicable)
- Clerk Dashboard webhook delivery status

---

**Estimated Total Time: 5-7 minutes** ⏱️

Good luck! 🚀

