#!/bin/bash

# Restart Development Server Script
# This ensures a clean restart with fresh environment variables

echo "🔄 Restarting Development Server..."
echo ""

# Step 1: Kill any running Next.js dev servers
echo "1️⃣  Stopping any running dev servers..."
pkill -f "next dev" 2>/dev/null
pkill -f "pnpm dev" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null

# Wait for processes to stop
sleep 2

# Check if any are still running
if pgrep -f "next dev" > /dev/null; then
    echo "⚠️  Some processes are still running. Forcing kill..."
    pkill -9 -f "next dev"
    sleep 1
fi

echo "✅ All dev servers stopped"
echo ""

# Step 2: Clear Next.js cache
echo "2️⃣  Clearing Next.js cache..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ Cache cleared"
else
    echo "ℹ️  No cache to clear"
fi
echo ""

# Step 3: Verify environment variables
echo "3️⃣  Checking environment variables..."
if grep -q "N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=ad5ddf87-5a47-4598-a19e-82aa4c536649" .env.local; then
    echo "✅ YouTube webhook ID is configured correctly"
else
    echo "⚠️  Warning: YouTube webhook ID might not be configured"
    echo "   Expected: N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=ad5ddf87-5a47-4598-a19e-82aa4c536649"
fi

if grep -q "N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud" .env.local; then
    echo "✅ n8n base URL is configured correctly"
else
    echo "⚠️  Warning: n8n base URL might not be configured"
    echo "   Expected: N8N_WEBHOOK_URL=https://twmal.app.n8n.cloud"
fi
echo ""

# Step 4: Start the dev server
echo "4️⃣  Starting dev server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Starting pnpm dev..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

pnpm dev

