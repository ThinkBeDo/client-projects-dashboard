/**
 * Claude Formatter - Optimizes debug output for Claude Code analysis
 * Converts raw debug data into Claude-friendly markdown format
 */

class ClaudeFormatter {
    constructor() {
        this.timestamp = new Date().toISOString();
        this.sessionId = this.generateSessionId();
    }

    generateSessionId() {
        return `debug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Main formatting function - converts debug data to Claude-optimized markdown
     */
    formatForClaude(debugData) {
        const {
            url,
            title,
            screenshot,
            consoleLogs,
            networkData,
            pageContext,
            railwayData,
            errors
        } = debugData;

        const projectInfo = this.detectProject(url);
        const errorSummary = this.summarizeErrors(errors, consoleLogs);

        return this.buildMarkdownReport({
            projectInfo,
            url,
            title,
            errorSummary,
            screenshot,
            consoleLogs,
            networkData,
            pageContext,
            railwayData,
            errors
        });
    }

    /**
     * Detect project type and details from URL
     */
    detectProject(url) {
        const patterns = {
            railway: {
                regex: /https:\/\/([^.]+)\.up\.railway\.app/,
                type: 'Railway Deployment'
            },
            localhost: {
                regex: /https?:\/\/localhost:(\d+)/,
                type: 'Local Development'
            },
            github: {
                regex: /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/,
                type: 'GitHub Repository'
            },
            vercel: {
                regex: /https:\/\/([^.]+)\.vercel\.app/,
                type: 'Vercel Deployment'
            },
            netlify: {
                regex: /https:\/\/([^.]+)\.netlify\.app/,
                type: 'Netlify Deployment'
            }
        };

        for (const [platform, config] of Object.entries(patterns)) {
            const match = url.match(config.regex);
            if (match) {
                return {
                    platform,
                    type: config.type,
                    identifier: match[1],
                    port: match[2] || null,
                    fullMatch: match[0]
                };
            }
        }

        // Try to extract domain for unknown projects
        try {
            const urlObj = new URL(url);
            return {
                platform: 'unknown',
                type: 'Web Application',
                identifier: urlObj.hostname,
                domain: urlObj.hostname
            };
        } catch {
            return {
                platform: 'unknown',
                type: 'Unknown',
                identifier: 'unknown'
            };
        }
    }

    /**
     * Analyze and summarize errors for Claude
     */
    summarizeErrors(errors, consoleLogs) {
        const allErrors = [...(errors || [])];
        
        // Extract errors from console logs
        const consoleErrors = (consoleLogs || [])
            .filter(log => log.level === 'error' || log.level === 'warn')
            .map(log => ({
                type: 'console',
                level: log.level,
                message: log.message,
                source: log.source,
                timestamp: log.timestamp
            }));

        allErrors.push(...consoleErrors);

        if (allErrors.length === 0) {
            return {
                hasErrors: false,
                summary: 'No errors detected',
                count: 0
            };
        }

        // Categorize errors
        const categories = {
            javascript: [],
            network: [],
            cors: [],
            security: [],
            performance: [],
            other: []
        };

        allErrors.forEach(error => {
            const message = error.message || error.text || '';
            const lowerMessage = message.toLowerCase();

            if (lowerMessage.includes('cors') || lowerMessage.includes('cross-origin')) {
                categories.cors.push(error);
            } else if (lowerMessage.includes('network') || lowerMessage.includes('failed to fetch')) {
                categories.network.push(error);
            } else if (lowerMessage.includes('content security policy') || lowerMessage.includes('csp')) {
                categories.security.push(error);
            } else if (lowerMessage.includes('performance') || lowerMessage.includes('slow')) {
                categories.performance.push(error);
            } else if (error.type === 'console' || lowerMessage.includes('javascript') || lowerMessage.includes('syntaxerror')) {
                categories.javascript.push(error);
            } else {
                categories.other.push(error);
            }
        });

        return {
            hasErrors: true,
            count: allErrors.length,
            categories,
            summary: this.generateErrorSummary(categories),
            topErrors: allErrors.slice(0, 3) // Top 3 most recent errors
        };
    }

    generateErrorSummary(categories) {
        const summaries = [];

        Object.entries(categories).forEach(([category, errors]) => {
            if (errors.length > 0) {
                summaries.push(`${errors.length} ${category} issue${errors.length !== 1 ? 's' : ''}`);
            }
        });

        return summaries.length > 0 ? summaries.join(', ') : 'No specific error patterns detected';
    }

    /**
     * Build the complete markdown report for Claude
     */
    buildMarkdownReport(data) {
        const sections = [];

        // Header with project info
        sections.push(this.buildHeader(data));

        // Error Summary (if any)
        if (data.errorSummary.hasErrors) {
            sections.push(this.buildErrorSection(data.errorSummary));
        }

        // Page Context
        sections.push(this.buildPageContextSection(data));

        // Console Logs
        if (data.consoleLogs && data.consoleLogs.length > 0) {
            sections.push(this.buildConsoleSection(data.consoleLogs));
        }

        // Network Issues
        if (data.networkData && data.networkData.length > 0) {
            sections.push(this.buildNetworkSection(data.networkData));
        }

        // Railway Data (if available)
        if (data.railwayData) {
            sections.push(this.buildRailwaySection(data.railwayData));
        }

        // Screenshot info
        if (data.screenshot) {
            sections.push(this.buildScreenshotSection());
        }

        // Debug metadata
        sections.push(this.buildMetadataSection(data));

        return sections.join('\n\n');
    }

    buildHeader(data) {
        const { projectInfo, url, title } = data;
        
        return `# 🐛 Debug Session: ${title}

**Project Type**: ${projectInfo.type}
**Platform**: ${projectInfo.platform}
**URL**: ${url}
**Session**: ${this.sessionId}
**Captured**: ${new Date().toLocaleString()}

---`;
    }

    buildErrorSection(errorSummary) {
        const { count, summary, topErrors, categories } = errorSummary;

        let section = `## ⚠️ Error Summary

**Total Issues**: ${count}
**Pattern**: ${summary}

### Top Issues:`;

        topErrors.forEach((error, index) => {
            const message = error.message || error.text || 'Unknown error';
            const source = error.source ? ` (${error.source})` : '';
            section += `\n${index + 1}. **${error.level || 'error'}**: ${message}${source}`;
        });

        // Add category breakdown if multiple categories
        const categoriesWithErrors = Object.entries(categories).filter(([_, errors]) => errors.length > 0);
        if (categoriesWithErrors.length > 1) {
            section += '\n\n### Error Categories:';
            categoriesWithErrors.forEach(([category, errors]) => {
                section += `\n- **${category}**: ${errors.length} issue${errors.length !== 1 ? 's' : ''}`;
            });
        }

        return section;
    }

    buildPageContextSection(data) {
        const { pageContext } = data;
        
        let section = `## 📄 Page Context

**Title**: ${data.title}
**URL**: ${data.url}`;

        if (pageContext) {
            if (pageContext.userAgent) {
                section += `\n**Browser**: ${pageContext.userAgent}`;
            }
            if (pageContext.viewport) {
                section += `\n**Viewport**: ${pageContext.viewport.width}x${pageContext.viewport.height}`;
            }
            if (pageContext.loadTime) {
                section += `\n**Load Time**: ${pageContext.loadTime}ms`;
            }
        }

        return section;
    }

    buildConsoleSection(consoleLogs) {
        let section = `## 📝 Console Logs

### Recent Messages:`;

        // Show last 10 logs, prioritizing errors and warnings
        const sortedLogs = consoleLogs
            .sort((a, b) => {
                const priority = { error: 3, warn: 2, log: 1, info: 0 };
                return (priority[b.level] || 0) - (priority[a.level] || 0);
            })
            .slice(0, 10);

        sortedLogs.forEach(log => {
            const emoji = this.getLogEmoji(log.level);
            const timestamp = new Date(log.timestamp).toLocaleTimeString();
            section += `\n\n**${emoji} ${log.level.toUpperCase()}** (${timestamp}):
\`\`\`
${log.message}
\`\`\``;

            if (log.source && log.source !== 'console-api') {
                section += `\n*Source: ${log.source}*`;
            }
        });

        return section;
    }

    buildNetworkSection(networkData) {
        const failedRequests = networkData.filter(req => req.status >= 400);
        
        if (failedRequests.length === 0) {
            return `## 🌐 Network Status

✅ All network requests successful (${networkData.length} total requests)`;
        }

        let section = `## 🌐 Network Issues

**Failed Requests**: ${failedRequests.length} of ${networkData.length}

### Failed Requests:`;

        failedRequests.slice(0, 5).forEach(req => {
            section += `\n\n**${req.status} ${req.statusText}**
- URL: ${req.url}
- Method: ${req.method}
- Time: ${req.time}ms`;

            if (req.response) {
                section += `\n- Response: ${req.response.substring(0, 100)}${req.response.length > 100 ? '...' : ''}`;
            }
        });

        return section;
    }

    buildRailwaySection(railwayData) {
        let section = `## 🚄 Railway Context

**Service**: ${railwayData.serviceName || 'Unknown'}
**Status**: ${railwayData.status || 'Unknown'}`;

        if (railwayData.deploymentId) {
            section += `\n**Deployment**: ${railwayData.deploymentId}`;
        }

        if (railwayData.logs && railwayData.logs.length > 0) {
            section += '\n\n### Recent Railway Logs:';
            railwayData.logs.slice(0, 5).forEach(log => {
                section += `\n- ${log}`;
            });
        }

        return section;
    }

    buildScreenshotSection() {
        return `## 📸 Visual Context

Screenshot captured and available for analysis.
*Use screenshot to understand visual state during error occurrence.*`;
    }

    buildMetadataSection(data) {
        return `## 🔧 Debug Metadata

**Session ID**: ${this.sessionId}
**Capture Time**: ${this.timestamp}
**User Agent**: ${navigator.userAgent}
**Screen Resolution**: ${screen.width}x${screen.height}

### Data Collected:
- ✅ Page Screenshot
- ✅ Console Logs (${data.consoleLogs?.length || 0} entries)
- ✅ Network Data (${data.networkData?.length || 0} requests)
- ✅ Page Context
${data.railwayData ? '- ✅ Railway Logs' : ''}
${data.errors?.length ? `- ⚠️ Errors (${data.errors.length})` : '- ✅ No Errors Detected'}

---
*Generated by Chrome Debug Extension for Claude Analysis*`;
    }

    getLogEmoji(level) {
        const emojis = {
            error: '🔴',
            warn: '⚠️',
            log: '📋',
            info: 'ℹ️',
            debug: '🔍'
        };
        return emojis[level] || '📝';
    }

    /**
     * Generate project tags for basic-memory organization
     */
    generateProjectTags(url, projectInfo) {
        const tags = ['debug-session'];

        // Add platform-specific tags
        if (projectInfo.platform) {
            tags.push(projectInfo.platform);
        }

        // Add project identifier
        if (projectInfo.identifier) {
            tags.push(projectInfo.identifier);
        }

        // Add date tag
        const dateTag = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        tags.push(`date-${dateTag}`);

        return tags;
    }

    /**
     * Generate memory-friendly title for basic-memory
     */
    generateMemoryTitle(title, projectInfo, errorSummary) {
        const project = projectInfo.identifier || 'unknown-project';
        const status = errorSummary.hasErrors ? 'ERROR' : 'DEBUG';
        const timestamp = new Date().toLocaleTimeString();
        
        return `${status}: ${project} - ${title} (${timestamp})`;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaudeFormatter;
} else {
    window.ClaudeFormatter = ClaudeFormatter;
}