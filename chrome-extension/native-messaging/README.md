# Railway Native Messaging Setup Guide

## Overview
This setup enables the Chrome Debug Extension to access Railway CLI logs and status directly through native messaging.

## Prerequisites
1. **Railway CLI installed globally**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Node.js** (for the native messaging host script)

3. **Railway CLI authenticated**:
   ```bash
   railway login
   ```

## Installation Steps

### Step 1: Install the Native Messaging Host

#### On macOS/Linux:
1. **Make the script executable**:
   ```bash
   chmod +x chrome-extension/native-messaging/railway-logs.js
   ```

2. **Install the host manifest**:
   ```bash
   # Create native messaging directory
   mkdir -p ~/.config/google-chrome/NativeMessagingHosts
   
   # Copy and update the manifest
   cp chrome-extension/native-messaging/railway-host.json ~/.config/google-chrome/NativeMessagingHosts/com.thinkbedo.railway.host.json
   ```

3. **Update the manifest path**:
   Edit `~/.config/google-chrome/NativeMessagingHosts/com.thinkbedo.railway.host.json`:
   ```json
   {
     "name": "com.thinkbedo.railway.host",
     "description": "Railway CLI native messaging host for Chrome Debug Extension",
     "path": "/full/path/to/client-projects-dashboard/chrome-extension/native-messaging/railway-logs.js",
     "type": "stdio",
     "allowed_origins": [
       "chrome-extension://your-extension-id-here/"
     ]
   }
   ```

#### On Windows:
1. **Create the registry entry**:
   ```cmd
   reg add "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\NativeMessagingHosts\\com.thinkbedo.railway.host" /ve /t REG_SZ /d "C:\\path\\to\\chrome-extension\\native-messaging\\railway-host.json"
   ```

2. **Update the manifest**:
   Edit the `railway-host.json` file with the full Windows path to `railway-logs.js`

### Step 2: Get Your Extension ID

1. **Load the extension in Chrome**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

2. **Copy the Extension ID**:
   - Find your extension in the list
   - Copy the ID (looks like: `abcdefghijklmnopqrstuvwxyzabcdef`)

### Step 3: Update the Host Manifest

1. **Edit the manifest file**:
   ```bash
   # On macOS/Linux
   nano ~/.config/google-chrome/NativeMessagingHosts/com.thinkbedo.railway.host.json
   
   # Replace "your-extension-id-here" with your actual extension ID
   ```

2. **Update the allowed_origins**:
   ```json
   {
     "allowed_origins": [
       "chrome-extension://YOUR_ACTUAL_EXTENSION_ID/"
     ]
   }
   ```

## Testing the Setup

### Test Railway CLI Access
```bash
# Test Railway CLI directly
railway --version
railway projects

# Test with a specific project
railway logs --project your-project-name
```

### Test Extension Integration
1. **Open the Chrome Debug Extension popup**
2. **Look for Railway connection status** (should show "Railway CLI connected" if working)
3. **Test on a Railway app** (any `*.up.railway.app` URL)
4. **Check the debug output** for Railway logs and status

## Troubleshooting

### Common Issues

#### 1. "Railway CLI not found"
- **Solution**: Install Railway CLI globally: `npm install -g @railway/cli`
- **Verify**: Run `railway --version` in terminal

#### 2. "Native messaging host not found"
- **Solution**: Check manifest path and permissions
- **Verify**: Ensure the manifest file exists in the correct location
- **Check**: File permissions on the script (should be executable)

#### 3. "Permission denied"
- **Solution**: Make the script executable: `chmod +x railway-logs.js`
- **Windows**: Ensure Node.js is in your PATH

#### 4. "Extension ID mismatch"
- **Solution**: Update the extension ID in the manifest
- **Verify**: Copy the exact ID from `chrome://extensions/`

### Debug Steps

1. **Check Chrome's native messaging logs**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "background page" for your extension
   - Check the console for native messaging errors

2. **Test the native messaging host manually**:
   ```bash
   echo '{"action":"detectProject","url":"https://test.up.railway.app"}' | node railway-logs.js
   ```

3. **Verify Railway CLI authentication**:
   ```bash
   railway projects
   # Should list your Railway projects
   ```

## File Locations

### Native Messaging Host Manifest:
- **macOS/Linux**: `~/.config/google-chrome/NativeMessagingHosts/com.thinkbedo.railway.host.json`
- **Windows**: Registry entry pointing to the manifest file

### Script Location:
- **All platforms**: `chrome-extension/native-messaging/railway-logs.js`

## Security Notes

- The native messaging host only responds to your specific Chrome extension ID
- Railway CLI credentials are used (same as your terminal access)
- No sensitive data is stored in the extension
- All communication is local (no external servers)

## Advanced Configuration

### Custom Railway Project Detection
You can modify the `detectProject` function in `railway-logs.js` to add custom URL patterns for your Railway deployments.

### Additional Railway Commands
The native messaging host can be extended to support additional Railway CLI commands by adding new actions to the `handleMessage` function.

## Support

If you encounter issues:
1. Check the Chrome extension console for errors
2. Verify Railway CLI works independently
3. Ensure the manifest file paths are correct
4. Test with a fresh extension reload

The extension will work without native messaging (using URL detection), but Railway logs and status require this setup for full functionality.
