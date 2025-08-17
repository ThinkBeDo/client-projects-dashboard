#!/bin/bash

# Railway Native Messaging Host Setup Script
# Sets up native messaging for Chrome Debug Extension with Railway CLI integration

echo "🚂 Setting up Railway Native Messaging Host..."

# Get current directory (should be run from chrome-extension/native-messaging/)
CURRENT_DIR="$(pwd)"
REPO_ROOT="$(dirname "$(dirname "$CURRENT_DIR")")"
SCRIPT_PATH="$CURRENT_DIR/railway-logs.js"

echo "📁 Detected paths:"
echo "   Script path: $SCRIPT_PATH"
echo "   Repo root: $REPO_ROOT"

# Check if Railway CLI is installed
echo "🔍 Checking Railway CLI..."
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    if ! command -v railway &> /dev/null; then
        echo "❌ Failed to install Railway CLI. Please install manually:"
        echo "   npm install -g @railway/cli"
        exit 1
    fi
fi

echo "✅ Railway CLI found: $(railway --version)"

# Check if Railway is authenticated
echo "🔐 Checking Railway authentication..."
if ! railway projects &> /dev/null; then
    echo "❌ Railway not authenticated. Please run:"
    echo "   railway login"
    exit 1
fi

echo "✅ Railway authentication verified"

# Create native messaging directory
echo "📁 Creating native messaging directory..."
NATIVE_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
mkdir -p "$NATIVE_DIR"

# Make script executable
echo "🔧 Making script executable..."
chmod +x "$SCRIPT_PATH"

# Create host manifest with correct paths
echo "📝 Creating host manifest..."
cat > "$NATIVE_DIR/com.thinkbedo.railway.host.json" << EOF
{
  "name": "com.thinkbedo.railway.host",
  "description": "Railway CLI native messaging host for Chrome Debug Extension",
  "path": "$SCRIPT_PATH",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://kjmhilobhbgabjhhhoehllolonjjffoo/"
  ]
}
EOF

echo "✅ Host manifest created at: $NATIVE_DIR/com.thinkbedo.railway.host.json"

# Test native messaging host
echo "🧪 Testing native messaging host..."
TEST_MESSAGE='{"action":"detectProject","url":"https://test.up.railway.app"}'
if echo "$TEST_MESSAGE" | node "$SCRIPT_PATH" | grep -q "success"; then
    echo "✅ Native messaging host test successful"
else
    echo "⚠️  Native messaging host test failed (this may be normal - Chrome handles messaging differently)"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Reload your Chrome extension at chrome://extensions/"
echo "2. Test the extension on a Railway app (*.up.railway.app)"
echo "3. Check for Railway logs in the debug output"
echo ""
echo "📁 Files created:"
echo "   - $NATIVE_DIR/com.thinkbedo.railway.host.json"
echo "   - Made $SCRIPT_PATH executable"
echo ""
echo "🔧 If issues occur:"
echo "   - Check Railway CLI: railway --version"
echo "   - Check authentication: railway projects"
echo "   - Check Chrome extension console for native messaging errors"
