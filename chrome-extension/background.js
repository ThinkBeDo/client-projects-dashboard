/**
 * Enhanced Background Service Worker - Chrome Debug Extension Phase 2
 * Integrates Claude formatting and basic-memory auto-save
 */

// Import Claude integration modules
importScripts('claude-formatter.js', 'memory-integration.js');

class DebugCapture {
    constructor() {
        this.formatter = new ClaudeFormatter();
        this.memory = new MemoryIntegration();
        this.isCapturing = false;
        this.captureOptions = {
            includeMemorySave: true,
            includeInsights: true,
            includeRailwayLogs: true,
            claudeMode: true
        };
    }

    /**
     * Enhanced main capture function with Claude integration
     */
    async captureDebugContext(tabId, options = {}) {
        if (this.isCapturing) {
            throw new Error('Capture already in progress');
        }

        this.isCapturing = true;
        
        try {
            // Merge options with defaults
            const captureOptions = { ...this.captureOptions, ...options };
            
            // Get tab information
            const tab = await chrome.tabs.get(tabId);
            
            // Update progress
            this.updateProgress('Analyzing page context...', 10);
            
            // Capture all debug data
            const debugData = await this.gatherAllDebugData(tab, captureOptions);
            
            // Generate Claude-optimized format
            this.updateProgress('Formatting for Claude analysis...', 60);
            const claudeReport = this.formatter.formatForClaude(debugData);
            
            // Get debugging insights
            let insights = null;
            if (captureOptions.includeInsights) {
                this.updateProgress('Analyzing error patterns...', 70);
                insights = await this.memory.getDebuggingInsights(debugData);
            }
            
            // Auto-save to memory if enabled
            let memoryResult = null;
            if (captureOptions.includeMemorySave) {
                this.updateProgress('Saving to memory...', 80);
                memoryResult = await this.memory.saveToMemory(debugData);
            }
            
            this.updateProgress('Finalizing capture...', 90);
            
            // Prepare final response
            const result = {
                success: true,
                timestamp: new Date().toISOString(),
                tabInfo: {
                    id: tab.id,
                    url: tab.url,
                    title: tab.title
                },
                debugData,
                claudeReport,
                insights,
                memoryResult,
                downloadLinks: await this.generateDownloadLinks(debugData, claudeReport)
            };
            
            this.updateProgress('Complete!', 100);
            
            // Send success notification
            await this.showNotification('success', 'Debug capture completed successfully!');
            
            return result;
            
        } catch (error) {
            console.error('Capture failed:', error);
            await this.showNotification('error', `Capture failed: ${error.message}`);
            throw error;
        } finally {
            this.isCapturing = false;
        }
    }

    /**
     * Enhanced data gathering with better error context
     */
    async gatherAllDebugData(tab, options) {
        const data = {
            url: tab.url,
            title: tab.title,
            timestamp: new Date().toISOString(),
            errors: [],
            consoleLogs: [],
            networkData: [],
            pageContext: {},
            railwayData: null
        };

        // Parallel data gathering for better performance
        const tasks = [
            this.captureScreenshot(tab.id),
            this.captureConsoleLogs(tab.id),
            this.captureNetworkData(tab.id),
            this.capturePageContext(tab.id),
            this.capturePageErrors(tab.id)
        ];

        // Add Railway logs if it's a Railway deployment
        if (options.includeRailwayLogs && tab.url.includes('.up.railway.app')) {
            tasks.push(this.captureRailwayLogs(tab.url));
        }

        const results = await Promise.allSettled(tasks);

        // Process results
        data.screenshot = results[0].status === 'fulfilled' ? results[0].value : null;
        data.consoleLogs = results[1].status === 'fulfilled' ? results[1].value : [];
        data.networkData = results[2].status === 'fulfilled' ? results[2].value : [];
        data.pageContext = results[3].status === 'fulfilled' ? results[3].value : {};
        data.errors = results[4].status === 'fulfilled' ? results[4].value : [];
        
        if (results[5]) {
            data.railwayData = results[5].status === 'fulfilled' ? results[5].value : null;
        }

        return data;
    }

    /**
     * Enhanced console log capture with better categorization
     */
    async captureConsoleLogs(tabId) {
        try {
            // Attach debugger to get console access
            await chrome.debugger.attach({ tabId }, '1.3');
            
            // Enable Runtime domain for console access
            await chrome.debugger.sendCommand({ tabId }, 'Runtime.enable');
            
            // Get console messages
            const logs = [];
            const startTime = Date.now() - (5 * 60 * 1000); // Last 5 minutes

            // Set up console event listener
            const consoleListener = (source, method, params) => {
                if (method === 'Runtime.consoleAPICalled') {
                    const entry = {
                        level: params.type,
                        message: params.args.map(arg => arg.value || arg.description || '').join(' '),
                        timestamp: params.timestamp,
                        source: params.stackTrace?.callFrames?.[0]?.url || 'console-api'
                    };
                    
                    if (params.timestamp >= startTime) {
                        logs.push(entry);
                    }
                }
            };

            chrome.debugger.onEvent.addListener(consoleListener);

            // Wait a moment to collect any immediate logs
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clean up
            chrome.debugger.onEvent.removeListener(consoleListener);
            await chrome.debugger.detach({ tabId });

            return logs.sort((a, b) => b.timestamp - a.timestamp);

        } catch (error) {
            console.error('Failed to capture console logs:', error);
            // Fallback: Try to get logs via content script
            try {
                const result = await chrome.tabs.sendMessage(tabId, { 
                    action: 'getConsoleLogs' 
                });
                return result.logs || [];
            } catch (fallbackError) {
                return [];
            }
        }
    }

    /**
     * Enhanced network data capture with HAR export
     */
    async captureNetworkData(tabId) {
        try {
            // Attach debugger
            await chrome.debugger.attach({ tabId }, '1.3');
            
            // Enable Network domain
            await chrome.debugger.sendCommand({ tabId }, 'Network.enable');
            
            // Get network events from the last few minutes
            const networkRequests = [];
            const startTime = Date.now() - (5 * 60 * 1000);

            // Listen for network events briefly
            const networkListener = (source, method, params) => {
                if (method === 'Network.responseReceived') {
                    const request = {
                        url: params.response.url,
                        status: params.response.status,
                        statusText: params.response.statusText,
                        method: params.response.requestHeaders?.method || 'GET',
                        timestamp: params.timestamp,
                        mimeType: params.response.mimeType,
                        fromCache: params.response.fromDiskCache || params.response.fromServiceWorker
                    };
                    
                    if (params.timestamp >= startTime) {
                        networkRequests.push(request);
                    }
                }
            };

            chrome.debugger.onEvent.addListener(networkListener);
            
            // Wait to collect network data
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Clean up
            chrome.debugger.onEvent.removeListener(networkListener);
            await chrome.debugger.detach({ tabId });

            return networkRequests.sort((a, b) => b.timestamp - a.timestamp);

        } catch (error) {
            console.error('Failed to capture network data:', error);
            return [];
        }
    }

    /**
     * Enhanced page context with performance metrics
     */
    async capturePageContext(tabId) {
        try {
            const context = await chrome.tabs.sendMessage(tabId, { 
                action: 'getPageContext' 
            });
            
            // Add Chrome-specific context
            const tab = await chrome.tabs.get(tabId);
            context.tabInfo = {
                id: tab.id,
                url: tab.url,
                title: tab.title,
                favIconUrl: tab.favIconUrl,
                status: tab.status
            };

            return context;

        } catch (error) {
            console.error('Failed to capture page context:', error);
            return {};
        }
    }

    /**
     * Enhanced error capture with stack traces
     */
    async capturePageErrors(tabId) {
        try {
            // Get errors from content script
            const result = await chrome.tabs.sendMessage(tabId, { 
                action: 'getPageErrors' 
            });
            
            return result.errors || [];

        } catch (error) {
            console.error('Failed to capture page errors:', error);
            return [];
        }
    }

    /**
     * Railway-specific log capture
     */
    async captureRailwayLogs(url) {
        try {
            // Extract Railway app info from URL
            const match = url.match(/https:\/\/([^.]+)\.up\.railway\.app/);
            if (!match) return null;

            const serviceName = match[1];
            
            // This would integrate with Railway CLI or API
            // For now, return basic info detected from URL
            return {
                serviceName,
                status: 'unknown',
                detectedAt: new Date().toISOString(),
                logs: [
                    `Railway service detected: ${serviceName}`,
                    'Railway logs require CLI integration for full access'
                ]
            };

        } catch (error) {
            console.error('Failed to capture Railway logs:', error);
            return null;
        }
    }

    /**
     * Enhanced screenshot with element highlighting
     */
    async captureScreenshot(tabId) {
        try {
            const dataUrl = await chrome.tabs.captureVisibleTab(null, {
                format: 'png',
                quality: 90
            });
            
            return {
                dataUrl,
                timestamp: new Date().toISOString(),
                format: 'png'
            };
            
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            return null;
        }
    }

    /**
     * Generate download links for captured data
     */
    async generateDownloadLinks(debugData, claudeReport) {
        try {
            const links = {};
            
            // Claude-formatted markdown report
            const reportBlob = new Blob([claudeReport], { type: 'text/markdown' });
            links.claudeReport = URL.createObjectURL(reportBlob);
            
            // Raw debug data JSON
            const dataBlob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
            links.rawData = URL.createObjectURL(dataBlob);
            
            // Screenshot (if available)
            if (debugData.screenshot) {
                links.screenshot = debugData.screenshot.dataUrl;
            }
            
            return links;
            
        } catch (error) {
            console.error('Failed to generate download links:', error);
            return {};
        }
    }

    /**
     * Progress updates for UI
     */
    updateProgress(message, percentage) {
        chrome.runtime.sendMessage({
            action: 'updateProgress',
            message,
            percentage
        }).catch(() => {
            // Ignore if popup is closed
        });
    }

    /**
     * Show notifications
     */
    async showNotification(type, message) {
        await chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Debug Extension',
            message: message
        });
    }

    /**
     * Get user preferences
     */
    async getOptions() {
        const result = await chrome.storage.sync.get({
            includeMemorySave: true,
            includeInsights: true,
            includeRailwayLogs: true,
            claudeMode: true
        });
        
        return result;
    }

    /**
     * Save user preferences
     */
    async saveOptions(options) {
        await chrome.storage.sync.set(options);
        this.captureOptions = { ...this.captureOptions, ...options };
    }
}

// Initialize debug capture instance
const debugCapture = new DebugCapture();

// Enhanced message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'captureDebug') {
        const tabId = message.tabId || sender.tab?.id;
        
        if (!tabId) {
            sendResponse({ error: 'No tab ID available' });
            return;
        }

        // Handle async capture
        debugCapture.captureDebugContext(tabId, message.options)
            .then(result => {
                sendResponse({ success: true, data: result });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });
            
        return true; // Keep message channel open for async response
    }
    
    if (message.action === 'getOptions') {
        debugCapture.getOptions()
            .then(options => sendResponse({ options }))
            .catch(error => sendResponse({ error: error.message }));
        return true;
    }
    
    if (message.action === 'saveOptions') {
        debugCapture.saveOptions(message.options)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ error: error.message }));
        return true;
    }

    if (message.action === 'markResolved') {
        debugCapture.memory.markResolved(message.sessionId, message.notes)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

// Extension installation/update handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Debug Extension installed - Claude integration ready!');
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Debug Extension Ready',
            message: 'Chrome Debug Extension with Claude integration is now active!'
        });
    }
});

// Context menu for quick capture
chrome.contextMenus.create({
    id: 'capture-debug',
    title: 'Capture Debug Context',
    contexts: ['page']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'capture-debug') {
        debugCapture.captureDebugContext(tab.id);
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DebugCapture, debugCapture };
}