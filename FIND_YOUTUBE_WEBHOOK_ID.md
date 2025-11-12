# 🔍 How to Find Your YouTube Webhook ID

## 📍 Quick Navigation

Your YouTube workflow is at:
```
https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh
```

---

## 🎯 Method 1: From the Workflow Editor (Easiest)

### Step-by-Step Instructions:

1. **Open your YouTube workflow:**
   - Click this link: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh
   - Or go to n8n and find the workflow in your list

2. **Look at the workflow canvas:**
   - You'll see several connected nodes
   - Find the **first node** (usually on the left side)
   - It's typically named:
     - "Webhook"
     - "Form Trigger"
     - "On form submission"
     - "YouTube Trigger"
     - Or something similar

3. **Click on that first node:**
   - The node settings panel will open on the right side

4. **Look for the webhook URL or webhook ID:**
   
   **Option A: You see a full URL**
   ```
   https://twmal.app.n8n.cloud/webhook/a7b8c9d0-1234-5678-90ab-cdef12345678
   ```
   - Copy the part after `/webhook/`
   - That's your webhook ID: `a7b8c9d0-1234-5678-90ab-cdef12345678`

   **Option B: You see just the ID**
   ```
   a7b8c9d0-1234-5678-90ab-cdef12345678
   ```
   - Copy the entire ID

   **Option C: You see a "path" field**
   ```
   Path: youtube-analysis
   ```
   - Look for another field called "Webhook ID" or "ID"
   - Copy that value

5. **The webhook ID format:**
   - It's a UUID (Universally Unique Identifier)
   - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Contains letters (a-f) and numbers (0-9)
   - Has 4 hyphens separating 5 groups
   - Example: `a7b8c9d0-1234-5678-90ab-cdef12345678`

---

## 🎯 Method 2: From the Workflow JSON

### Step-by-Step Instructions:

1. **Open your workflow:**
   - Go to: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh

2. **Export the workflow:**
   - Click the **three dots menu** (⋮) in the top right corner
   - Select **"Download"** or **"Export workflow"**
   - A JSON file will be downloaded

3. **Open the JSON file:**
   - Open it with any text editor (Notepad, VS Code, etc.)

4. **Search for the webhook ID:**
   - Press `Ctrl+F` (or `Cmd+F` on Mac) to open search
   - Search for: `"webhookId"`
   - Or search for: `"path"`

5. **Find the webhook configuration:**
   
   You'll see something like this:
   ```json
   {
     "name": "Webhook",
     "type": "n8n-nodes-base.webhook",
     "parameters": {
       "path": "youtube-analysis",
       "webhookId": "a7b8c9d0-1234-5678-90ab-cdef12345678",
       "responseMode": "responseNode"
     }
   }
   ```
   
   Or like this:
   ```json
   {
     "name": "Form Trigger",
     "type": "@n8n/n8n-nodes-langchain.formTrigger",
     "parameters": {
       "path": "a7b8c9d0-1234-5678-90ab-cdef12345678"
     }
   }
   ```

6. **Copy the webhook ID:**
   - Look for the value of `"webhookId"` or `"path"`
   - Copy the UUID value
   - Example: `a7b8c9d0-1234-5678-90ab-cdef12345678`

---

## 🎯 Method 3: Test and Find

### If you can't find it in the UI:

1. **Activate your workflow:**
   - Go to: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh
   - Toggle the **"Active"** switch to ON

2. **Click on the Webhook/Form Trigger node**

3. **Look for "Test URL" or "Production URL":**
   
   You might see:
   ```
   Test URL: https://twmal.app.n8n.cloud/webhook-test/a7b8c9d0-1234-5678-90ab-cdef12345678
   Production URL: https://twmal.app.n8n.cloud/webhook/a7b8c9d0-1234-5678-90ab-cdef12345678
   ```

4. **Copy the webhook ID:**
   - It's the part after `/webhook/` or `/webhook-test/`
   - Example: `a7b8c9d0-1234-5678-90ab-cdef12345678`

---

## 🎯 Method 4: Check n8n Executions

### If the workflow has been triggered before:

1. **Go to n8n Executions:**
   - Click **"Executions"** in the left sidebar

2. **Find an execution of your YouTube workflow:**
   - Look for executions with your workflow name

3. **Click on an execution to open it**

4. **Look at the webhook node:**
   - Click on the first node (Webhook/Form Trigger)
   - Look at the input data
   - The webhook URL might be shown there

---

## ✅ How to Verify You Have the Right ID

### The webhook ID should:

- ✅ Be 36 characters long (including hyphens)
- ✅ Have exactly 4 hyphens
- ✅ Contain only lowercase letters (a-f) and numbers (0-9)
- ✅ Follow this pattern: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Examples of CORRECT webhook IDs:

```
a7b8c9d0-1234-5678-90ab-cdef12345678
c2838e30-aa6c-4232-b20e-e8366aadab20
f47ac10b-58cc-4372-a567-0e02b2c3d479
```

### Examples of WRONG values:

```
❌ youtube-analysis (this is a path, not a webhook ID)
❌ a7MJ4DXNSTVuBzKh (this is the workflow ID, not webhook ID)
❌ https://twmal.app.n8n.cloud/webhook/... (this is the full URL, not just the ID)
```

---

## 🧪 Test Your Webhook ID

Once you think you have the webhook ID, test it:

```bash
chmod +x test-youtube-webhook.sh
./test-youtube-webhook.sh YOUR_WEBHOOK_ID_HERE
```

Example:
```bash
./test-youtube-webhook.sh a7b8c9d0-1234-5678-90ab-cdef12345678
```

If the test succeeds, you have the correct webhook ID! ✅

---

## 📝 What to Do After Finding the Webhook ID

### Step 1: Update `.env.local`

Open `.env.local` and find this line (around line 90):
```env
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=your-youtube-webhook-id-here
```

Replace it with your actual webhook ID:
```env
N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=a7b8c9d0-1234-5678-90ab-cdef12345678
```

### Step 2: Restart Dev Server

```bash
# Press Ctrl+C to stop
# Then run:
pnpm dev
```

### Step 3: Test the Integration

1. Go to: http://localhost:3000/dashboard/video-analysis
2. Click the **"YouTube URL"** tab
3. Enter a YouTube URL
4. Click **"开始分析"**
5. Check for success message!

---

## 🆘 Still Can't Find It?

### Option 1: Create a New Webhook Node

If you can't find the webhook ID:

1. Open your workflow: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh
2. Add a new **"Webhook"** node or **"Form Trigger"** node
3. n8n will automatically generate a new webhook ID
4. Copy that webhook ID
5. Connect it to your workflow
6. Delete the old webhook node (if any)

### Option 2: Check the Workflow Type

Different node types show the webhook ID differently:

**Webhook Node:**
- Look for: "Webhook ID" field
- Or: "Path" field (might contain the ID)

**Form Trigger Node:**
- Look for: "Path" field
- The path IS the webhook ID

**HTTP Request Node:**
- This is NOT a webhook trigger
- You need a Webhook or Form Trigger node instead

### Option 3: Ask for Help

If you're still stuck:

1. Take a screenshot of your workflow
2. Take a screenshot of the first node's settings
3. Share the workflow JSON (export it)
4. Check if the workflow has a webhook/form trigger node at all

---

## 💡 Common Mistakes

### ❌ Mistake 1: Using the Workflow ID

```
Workflow URL: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh
                                                      ^^^^^^^^^^^^^^^^
                                                      This is the WORKFLOW ID
                                                      NOT the webhook ID!
```

### ❌ Mistake 2: Using the Path

```
Path: youtube-analysis
      ^^^^^^^^^^^^^^^^
      This might be a custom path, not the webhook ID
      Look for the actual webhook ID field
```

### ❌ Mistake 3: Including the Full URL

```
❌ Wrong: https://twmal.app.n8n.cloud/webhook/a7b8c9d0-1234-5678-90ab-cdef12345678
✅ Right: a7b8c9d0-1234-5678-90ab-cdef12345678
```

---

## 🎯 Quick Checklist

- [ ] Opened workflow: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh
- [ ] Found the Webhook or Form Trigger node
- [ ] Clicked on the node to see settings
- [ ] Located the webhook ID (UUID format)
- [ ] Copied the webhook ID (36 characters with 4 hyphens)
- [ ] Verified it's a UUID, not a path or workflow ID
- [ ] Tested with `./test-youtube-webhook.sh YOUR_WEBHOOK_ID`
- [ ] Added to `.env.local`
- [ ] Restarted dev server

---

**Once you find the webhook ID, you're almost done!** 🎉

See `YOUTUBE_INTEGRATION_GUIDE.md` for the next steps.

