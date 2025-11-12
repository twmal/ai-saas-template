#!/bin/bash

# Test YouTube Analysis Webhook
# Usage: ./test-youtube-webhook.sh YOUR_WEBHOOK_ID

echo "🎬 Testing YouTube Analysis Webhook..."
echo ""

# Check if webhook ID is provided
if [ -z "$1" ]; then
    echo "❌ Error: Webhook ID not provided"
    echo ""
    echo "Usage: ./test-youtube-webhook.sh YOUR_WEBHOOK_ID"
    echo ""
    echo "Example:"
    echo "  ./test-youtube-webhook.sh a7b8c9d0-1234-5678-90ab-cdef12345678"
    echo ""
    echo "To find your webhook ID:"
    echo "  1. Go to: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh"
    echo "  2. Click on the Webhook or Form Trigger node"
    echo "  3. Copy the webhook ID from the URL field"
    echo ""
    exit 1
fi

# Configuration
N8N_URL="https://twmal.app.n8n.cloud"
WEBHOOK_ID="$1"
FULL_WEBHOOK_URL="${N8N_URL}/webhook/${WEBHOOK_ID}"
TEST_YOUTUBE_URL="https://www.youtube.com/watch?v=dQw4w9WgXcQ"

echo "📍 n8n Base URL: $N8N_URL"
echo "🔑 Webhook ID: $WEBHOOK_ID"
echo "🌐 Full Webhook URL: $FULL_WEBHOOK_URL"
echo "🎥 Test YouTube URL: $TEST_YOUTUBE_URL"
echo ""

# Test 1: Check if n8n instance is accessible
echo "Test 1: Checking if n8n instance is accessible..."
if curl -s --head --max-time 5 "$N8N_URL" | head -n 1 | grep "HTTP" > /dev/null; then
    echo "✅ n8n instance is accessible"
else
    echo "❌ Cannot reach n8n instance"
    echo "   Please check if https://twmal.app.n8n.cloud is accessible in your browser"
    exit 1
fi
echo ""

# Test 2: Test webhook endpoint with YouTube URL
echo "Test 2: Testing webhook with YouTube URL..."
echo "   Sending request to: $FULL_WEBHOOK_URL"
echo "   YouTube URL: $TEST_YOUTUBE_URL"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" --max-time 15 \
    -H "Content-Type: application/json" \
    -d "{\"youtubeUrl\":\"$TEST_YOUTUBE_URL\",\"userId\":\"test-user\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    "$FULL_WEBHOOK_URL")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "   HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Webhook accepted the request!"
    echo "   Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo "🎉 Success! Your YouTube webhook is working correctly!"
    echo ""
    echo "Next steps:"
    echo "  1. Add this webhook ID to your .env.local:"
    echo "     N8N_YOUTUBE_ANALYSIS_WEBHOOK_ID=$WEBHOOK_ID"
    echo ""
    echo "  2. Restart your dev server:"
    echo "     pnpm dev"
    echo ""
    echo "  3. Test through the dashboard:"
    echo "     http://localhost:3000/dashboard/video-analysis"
    echo ""
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Webhook not found (404)"
    echo "   This means either:"
    echo "   - The webhook ID is incorrect"
    echo "   - The workflow doesn't exist"
    echo "   - The workflow doesn't have a webhook/form trigger node"
    echo ""
    echo "Please verify:"
    echo "  1. The webhook ID is correct"
    echo "  2. The workflow exists at: https://twmal.app.n8n.cloud/workflow/a7MJ4DXNSTVuBzKh"
    echo "  3. The workflow has a Webhook or Form Trigger node"
    echo ""
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    echo "❌ Authentication error ($HTTP_CODE)"
    echo "   The webhook requires authentication"
    echo ""
    echo "Please check:"
    echo "  1. Webhook authentication settings in n8n"
    echo "  2. Make sure the webhook is set to accept requests without authentication"
    echo ""
elif [ "$HTTP_CODE" = "500" ]; then
    echo "⚠️  Server error (500)"
    echo "   The webhook received the request but encountered an error"
    echo ""
    echo "Response:"
    echo "$BODY"
    echo ""
    echo "Please check:"
    echo "  1. n8n execution logs for error details"
    echo "  2. Workflow configuration (Gemini API, Notion integration)"
    echo "  3. Make sure the workflow is Active"
    echo ""
else
    echo "⚠️  Unexpected response code: $HTTP_CODE"
    if [ ! -z "$BODY" ]; then
        echo "   Response:"
        echo "$BODY"
    fi
    echo ""
fi

# Test 3: Check if workflow is active
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Checklist"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Make sure:"
echo "  [ ] Workflow is ACTIVE in n8n (toggle is ON)"
echo "  [ ] Workflow has a Webhook or Form Trigger node"
echo "  [ ] Gemini API key is configured in n8n"
echo "  [ ] Notion integration is connected in n8n"
echo "  [ ] Webhook ID is added to .env.local"
echo "  [ ] Dev server is restarted after updating .env.local"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "🎉 Your YouTube webhook is ready to use!"
else
    echo "⚠️  Please fix the issues above and try again"
fi
echo ""

