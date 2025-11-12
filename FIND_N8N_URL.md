# 🔍 How to Find Your n8n URL

## Method 1: n8n Cloud (Most Common)

### Step 1: Log into n8n
Go to your n8n instance in your browser.

### Step 2: Look at the Browser Address Bar
The URL in your browser's address bar is your n8n URL!

**Example**:
```
https://john.app.n8n.cloud
```

**Format**:
```
https://[your-username].app.n8n.cloud
```

### Step 3: Copy the Base URL
Copy everything **before** `/workflow/` or `/executions/`

**Full URL in browser**:
```
https://john.app.n8n.cloud/workflow/abc123/executions
```

**What you need**:
```
https://john.app.n8n.cloud
```

---

## Method 2: Self-Hosted n8n

### If Running Locally

**Default URL**:
```
http://localhost:5678
```

**Custom Port**:
```
http://localhost:YOUR_PORT
```

### If Running on a Server

**With Domain**:
```
https://n8n.yourdomain.com
```

**With IP Address**:
```
http://123.456.789.012:5678
```

**With Subdomain**:
```
https://automation.yourcompany.com
```

---

## Method 3: Check n8n Settings

### Step 1: Open n8n Settings
1. Log into your n8n instance
2. Click on your profile icon (top right)
3. Click **"Settings"**

### Step 2: Look for Webhook URL
Some n8n installations show the webhook base URL in settings.

---

## Method 4: Check Your Workflow

### Step 1: Open Your Workflow
1. Go to n8n
2. Open "Analyze Video (Nov 9 at 13:02:33)"

### Step 2: Click on Form Trigger Node
1. Click on the "On form submission1" node
2. Look for the **"Webhook URL"** field
3. It will show something like:
   ```
   https://john.app.n8n.cloud/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20
   ```

### Step 3: Extract Base URL
Take everything **before** `/webhook/`:
```
https://john.app.n8n.cloud
```

---

## Common n8n URL Patterns

### n8n Cloud
```
https://[username].app.n8n.cloud
https://[company].app.n8n.cloud
```

### Self-Hosted with Docker
```
http://localhost:5678
http://n8n:5678 (if using Docker network)
```

### Self-Hosted with Domain
```
https://n8n.example.com
https://automation.example.com
https://workflows.example.com
```

### Self-Hosted with Subdirectory
```
https://example.com/n8n
```

---

## ✅ How to Verify Your URL

### Test 1: Open in Browser
Try opening your n8n URL in a browser:
```
https://your-n8n-url
```

You should see the n8n login page or dashboard.

### Test 2: Ping the Webhook
Try accessing the webhook URL:
```
https://your-n8n-url/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20
```

You should get a response (even if it's an error, it means the URL is correct).

### Test 3: Use curl
```bash
curl https://your-n8n-url
```

You should get an HTML response (the n8n login page).

---

## 🎯 What to Put in `.env.local`

Once you have your n8n URL, update `.env.local`:

### Example 1: n8n Cloud
```env
N8N_WEBHOOK_URL=https://john.app.n8n.cloud
```

### Example 2: Local n8n
```env
N8N_WEBHOOK_URL=http://localhost:5678
```

### Example 3: Self-Hosted with Domain
```env
N8N_WEBHOOK_URL=https://n8n.mycompany.com
```

### Example 4: Self-Hosted with IP
```env
N8N_WEBHOOK_URL=http://192.168.1.100:5678
```

---

## ❌ Common Mistakes

### ❌ Wrong: Including the webhook path
```env
N8N_WEBHOOK_URL=https://john.app.n8n.cloud/webhook/c2838e30-aa6c-4232-b20e-e8366aadab20
```

### ✅ Correct: Just the base URL
```env
N8N_WEBHOOK_URL=https://john.app.n8n.cloud
```

---

### ❌ Wrong: Including trailing slash
```env
N8N_WEBHOOK_URL=https://john.app.n8n.cloud/
```

### ✅ Correct: No trailing slash
```env
N8N_WEBHOOK_URL=https://john.app.n8n.cloud
```

---

### ❌ Wrong: Including workflow path
```env
N8N_WEBHOOK_URL=https://john.app.n8n.cloud/workflow/abc123
```

### ✅ Correct: Just the base URL
```env
N8N_WEBHOOK_URL=https://john.app.n8n.cloud
```

---

## 🔐 Security Notes

### For Production

If you're using n8n in production:

1. **Always use HTTPS** (not HTTP)
2. **Use a custom domain** (not localhost)
3. **Enable authentication** on n8n
4. **Use environment variables** (never hardcode URLs)

### For Development

For local testing:
- `http://localhost:5678` is fine
- Make sure your Next.js app can reach n8n
- If using Docker, use the container name or network IP

---

## 🆘 Still Can't Find It?

### Option 1: Check Your n8n Installation Method

**How did you install n8n?**

- **n8n Cloud**: Check your email for the welcome message
- **Docker**: Check your `docker-compose.yml` for the port
- **npm**: Check the port you specified when starting n8n
- **Desktop App**: Usually `http://localhost:5678`

### Option 2: Check Your Browser History

Look for URLs containing:
- `n8n.cloud`
- `localhost:5678`
- Your company domain with "n8n" or "workflow"

### Option 3: Ask Your Team

If n8n was set up by someone else:
- Ask your DevOps team
- Check your company's internal documentation
- Look for shared credentials in your password manager

---

## 📝 Quick Checklist

- [ ] Found my n8n URL
- [ ] Verified it opens in browser
- [ ] Removed any trailing slashes
- [ ] Removed any paths (like `/webhook/` or `/workflow/`)
- [ ] Updated `.env.local`
- [ ] Restarted dev server

---

## 🎉 Next Steps

Once you have your n8n URL:

1. Update `.env.local` with the URL
2. Make sure your workflow is **Active**
3. Restart your dev server: `pnpm dev`
4. Test the integration!

See `QUICK_REFERENCE.md` for the next steps.

---

**Need more help?** Check `N8N_SETUP_GUIDE.md` for detailed setup instructions.

