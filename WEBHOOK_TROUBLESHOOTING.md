# Clerk Webhook Troubleshooting Guide

## Current Issues Diagnosed

### Problem 1: Webhook Signature Verification Failing
**Error**: "Base64Coder: incorrect characters for decoding"

### Problem 2: No User Data in Neon Database
**Cause**: Webhook failures preventing user sync

---

## Step-by-Step Troubleshooting

### Step 1: Verify Environment Variables

Check your `.env.local` file has the correct webhook secret:

```bash
# Your current secret (CORRECT FORMAT):
CLERK_WEBHOOK_SECRET=whsec_APlnDxOSx6avZwsHtMDBV56qnRKabEaA
```

✅ **Verified**: Your secret has the correct `whsec_` prefix and format.

### Step 2: Test Database Connection

Run the database connection test:

```bash
npx tsx scripts/test-db-connection.ts
```

This will verify:
- Database connection is working
- Users table exists
- Current user count
- Table structure

### Step 3: Use Debug Endpoint

**Temporarily** update your Clerk webhook URL to the debug endpoint:

1. Go to Clerk Dashboard → Webhooks
2. Change URL from:
   ```
   https://tunnel.ugreel.com/api/webhook/clerk
   ```
   To:
   ```
   https://tunnel.ugreel.com/api/webhook/clerk/debug
   ```

3. Send a test event from Clerk Dashboard
4. Check your application logs for detailed debug information
5. The debug endpoint will show you:
   - All headers received
   - Body format
   - Svix signature headers
   - Environment configuration

### Step 4: Check Application Logs

After sending a test webhook, check your logs for:

```
🔍 Clerk Webhook Debug Info:
```

This will show you exactly what's being received.

### Step 5: Verify Webhook Configuration in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Webhooks** section
3. Verify:
   - ✅ Endpoint URL: `https://tunnel.ugreel.com/api/webhook/clerk`
   - ✅ Events subscribed: `user.created`, `user.updated`, `session.created`
   - ✅ Signing secret matches your `.env.local`

### Step 6: Test with Production Endpoint

Once debug endpoint shows correct data:

1. Change webhook URL back to:
   ```
   https://tunnel.ugreel.com/api/webhook/clerk
   ```

2. Send test event from Clerk Dashboard

3. Check logs for:
   ```
   ✅ Clerk webhook验证成功: user.created
   ```

### Step 7: Verify User Creation

After successful webhook:

```bash
# Check database for new users
npx tsx scripts/test-db-connection.ts
```

Or query directly:
```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

---

## Common Issues and Solutions

### Issue: "缺少Svix签名头"

**Solution**: 
- Verify Clerk webhook is configured correctly
- Check that Cloudflare Tunnel is not stripping headers
- Ensure webhook URL is exactly correct

### Issue: "Invalid webhook signature"

**Possible Causes**:
1. **Wrong secret**: Copy secret again from Clerk Dashboard
2. **Body modification**: Middleware or proxy modifying request body
3. **Encoding issues**: Body encoding mismatch

**Solutions**:
1. Regenerate webhook secret in Clerk Dashboard
2. Update `.env.local` with new secret
3. Restart your development server

### Issue: Users not appearing in database

**Check**:
1. Webhook verification is passing (check logs)
2. `handleUserCreated` function is being called
3. No database errors in logs
4. Database connection is working

---

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Database connection test passes
- [ ] Debug endpoint receives webhook data
- [ ] Svix headers are present in debug output
- [ ] Production endpoint verifies signature successfully
- [ ] User creation handler is called
- [ ] Users appear in database
- [ ] Session events update lastLoginAt

---

## Enhanced Logging

The updated webhook implementation now includes:

1. **Request logging**: Headers, body length, Svix headers
2. **Verification logging**: Secret format, signature verification steps
3. **Success logging**: Event type, event ID
4. **Error logging**: Detailed error messages, stack traces
5. **Database logging**: User creation, updates, errors

Check your application logs for these markers:
- `🔍` - Debug information
- `✅` - Success
- `❌` - Error
- `⚠️` - Warning

---

## Next Steps After Fix

1. **Remove debug endpoint** (or keep for future debugging)
2. **Monitor webhook deliveries** in Clerk Dashboard
3. **Set up alerts** for webhook failures
4. **Test user registration flow** end-to-end
5. **Verify all webhook events** (created, updated, deleted, session)

---

## MCP Toolkit Recommendations

### Should you install Clerk MCP Toolkit?

**Answer**: Not necessary for this issue. The problem is with webhook signature verification, not with Clerk API interactions. The toolkit would be useful for:
- Programmatically managing Clerk users
- Automating Clerk configuration
- Building Clerk integrations

### Should you install Neon MCP Server?

**Answer**: Optional but helpful. The Neon MCP server would help with:
- Monitoring database queries
- Debugging database issues
- Managing database schema

However, the current issue is webhook verification, not database connectivity.

**Recommendation**: Fix the webhook issue first, then consider these tools for ongoing development.

---

## Support Resources

- [Clerk Webhook Documentation](https://clerk.com/docs/integrations/webhooks)
- [Svix Webhook Verification](https://docs.svix.com/receiving/verifying-payloads/how)
- [Neon Database Docs](https://neon.tech/docs)

---

## Quick Fix Summary

The changes made:

1. ✅ Enhanced webhook verification with detailed logging
2. ✅ Added debug endpoint for troubleshooting
3. ✅ Improved error handling and reporting
4. ✅ Created database connection test script
5. ✅ Added comprehensive logging throughout webhook flow

**Next Action**: Run the debug endpoint and check logs to see exactly what's happening.

