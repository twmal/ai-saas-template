#!/bin/bash

# Test n8n Webhook Connection
# This script tests if your n8n webhook is accessible

echo "🧪 Testing n8n Webhook Connection..."
echo ""

# Your n8n configuration
N8N_URL="https://twmal.app.n8n.cloud"
WEBHOOK_ID="c2838e30-aa6c-4232-b20e-e8366aadab20"
FULL_WEBHOOK_URL="${N8N_URL}/webhook/${WEBHOOK_ID}"

echo "📍 n8n Base URL: $N8N_URL"
echo "🔑 Webhook ID: $WEBHOOK_ID"
echo "🌐 Full Webhook URL: $FULL_WEBHOOK_URL"
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

# Test 2: Check if webhook endpoint responds
echo "Test 2: Testing webhook endpoint..."
echo "   (This may show an error if no file is provided - that's expected)"
RESPONSE=$(curl -s -w "\n%{http_code}" --max-time 10 "$FULL_WEBHOOK_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "   HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "405" ]; then
    echo "✅ Webhook endpoint is responding"
    if [ ! -z "$BODY" ]; then
        echo "   Response: $BODY"
    fi
else
    echo "⚠️  Unexpected response code: $HTTP_CODE"
    echo "   This might mean the workflow is not active or the webhook ID is incorrect"
fi
echo ""

# Test 3: Try to send a test request (will fail without a video file, but tests connectivity)
echo "Test 3: Testing webhook with form data..."
TEST_RESPONSE=$(curl -s -w "\n%{http_code}" --max-time 10 \
    -F "userId=test-user" \
    -F "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    "$FULL_WEBHOOK_URL")
TEST_HTTP_CODE=$(echo "$TEST_RESPONSE" | tail -n 1)
TEST_BODY=$(echo "$TEST_RESPONSE" | head -n -1)

echo "   HTTP Status Code: $TEST_HTTP_CODE"

if [ "$TEST_HTTP_CODE" = "200" ]; then
    echo "✅ Webhook accepts requests!"
    echo "   Response: $TEST_BODY"
elif [ "$TEST_HTTP_CODE" = "400" ]; then
    echo "⚠️  Webhook responded with 400 (expected - no video file provided)"
    echo "   This is actually good - it means the webhook is working!"
    echo "   Response: $TEST_BODY"
else
    echo "⚠️  Unexpected response: $TEST_HTTP_CODE"
    if [ ! -z "$TEST_BODY" ]; then
        echo "   Response: $TEST_BODY"
    fi
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your n8n webhook URL is:"
echo "  $FULL_WEBHOOK_URL"
echo ""
echo "Next steps:"
echo "  1. Make sure your n8n workflow is ACTIVE (toggle is ON)"
echo "  2. Restart your dev server: pnpm dev"
echo "  3. Try uploading a video through the dashboard"
echo ""
echo "If the tests above passed, your configuration is correct! ✅"
echo ""

