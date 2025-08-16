/**
 * Memory Integration - Auto-save debug captures to basic-memory
 * Handles project detection and memory organization
 */

class MemoryIntegration {
    constructor() {
        this.formatter = new ClaudeFormatter();
        this.apiEndpoint = 'https://basic-memory-api.example.com'; // Configure this
    }

    /**
     * Auto-save debug capture to basic-memory
     */
    async saveToMemory(debugData) {
        try {
            const formattedData = this.formatter.formatForClaude(debugData);
            const projectInfo = this.formatter.detectProject(debugData.url);
            const errorSummary = this.formatter.summarizeErrors(debugData.errors, debugData.consoleLogs);

            // Generate memory-friendly metadata
            const memoryTitle = this.formatter.generateMemoryTitle(
                debugData.title, 
                projectInfo, 
                errorSummary
            );
            const tags = this.formatter.generateProjectTags(debugData.url, projectInfo);
            const folder = this.generateFolder(projectInfo);

            // Save to memory
            const memoryResponse = await this.writeToMemory({
                title: memoryTitle,
                content: formattedData,
                folder: folder,
                tags: tags,
                projectInfo,
                errorSummary
            });

            return {
                success: true,
                memoryId: memoryResponse.id,
                permalink: memoryResponse.permalink,
                folder,
                tags
            };

        } catch (error) {
            console.error('Failed to save to memory:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate appropriate folder structure for basic-memory
     */
    generateFolder(projectInfo) {
        const baseFolder = 'debug-sessions';
        
        // Create project-specific subfolders
        if (projectInfo.platform === 'railway') {
            return `${baseFolder}/railway/${projectInfo.identifier}`;
        } else if (projectInfo.platform === 'localhost') {
            return `${baseFolder}/local-dev/port-${projectInfo.port}`;
        } else if (projectInfo.platform === 'github') {
            return `${baseFolder}/github/${projectInfo.identifier}`;
        } else if (projectInfo.platform === 'vercel' || projectInfo.platform === 'netlify') {
            return `${baseFolder}/${projectInfo.platform}/${projectInfo.identifier}`;
        } else {
            return `${baseFolder}/other/${projectInfo.identifier || 'unknown'}`;
        }
    }

    /**
     * Write data to basic-memory (placeholder - implement with actual API)
     */
    async writeToMemory(data) {
        // This would integrate with the actual basic-memory API
        // For now, we'll store in local storage as a fallback
        
        const memoryEntry = {
            id: `debug-${Date.now()}`,
            permalink: `debug-sessions/${data.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            timestamp: new Date().toISOString(),
            ...data
        };

        // Store in Chrome storage
        await chrome.storage.local.set({
            [`memory-${memoryEntry.id}`]: memoryEntry
        });

        return memoryEntry;
    }

    /**
     * Get debugging insights by analyzing error patterns
     */
    async getDebuggingInsights(debugData) {
        try {
            // Get historical data from storage
            const history = await this.getHistoricalData(debugData.url);
            
            // Analyze patterns
            const insights = this.analyzeErrorPatterns(debugData, history);
            
            return insights;
            
        } catch (error) {
            console.error('Failed to get insights:', error);
            return null;
        }
    }

    /**
     * Get historical debug data for pattern analysis
     */
    async getHistoricalData(url) {
        try {
            const result = await chrome.storage.local.get();
            const memoryEntries = Object.entries(result)
                .filter(([key]) => key.startsWith('memory-'))
                .map(([_, entry]) => entry)
                .filter(entry => entry.projectInfo?.identifier)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 20); // Last 20 sessions

            return memoryEntries;
            
        } catch (error) {
            console.error('Failed to get historical data:', error);
            return [];
        }
    }

    /**
     * Analyze error patterns and provide insights
     */
    analyzeErrorPatterns(currentData, historicalData) {
        const insights = {
            recurringIssues: [],
            newIssues: [],
            recommendations: [],
            trends: {}
        };

        try {
            const currentErrors = currentData.errors || [];
            const currentProject = this.formatter.detectProject(currentData.url);
            
            // Find same-project historical data
            const projectHistory = historicalData.filter(entry => 
                entry.projectInfo?.identifier === currentProject.identifier
            );

            if (projectHistory.length > 0) {
                // Check for recurring errors
                currentErrors.forEach(error => {
                    const errorMessage = error.message || error.text || '';
                    const isRecurring = projectHistory.some(session => 
                        (session.errorSummary?.topErrors || []).some(historicalError => 
                            this.compareErrors(error, historicalError)
                        )
                    );

                    if (isRecurring) {
                        insights.recurringIssues.push({
                            error: errorMessage,
                            frequency: 'Multiple times',
                            recommendation: this.getErrorRecommendation(error)
                        });
                    } else {
                        insights.newIssues.push({
                            error: errorMessage,
                            type: 'New in this session'
                        });
                    }
                });

                // Generate recommendations
                insights.recommendations = this.generateRecommendations(
                    currentData, 
                    projectHistory, 
                    currentProject
                );
            }

            return insights;
            
        } catch (error) {
            console.error('Failed to analyze patterns:', error);
            return insights;
        }
    }

    /**
     * Compare two errors to see if they're similar
     */
    compareErrors(error1, error2) {
        const msg1 = (error1.message || error1.text || '').toLowerCase();
        const msg2 = (error2.message || error2.text || '').toLowerCase();
        
        // Simple similarity check - could be enhanced
        return msg1.includes(msg2.substring(0, 20)) || msg2.includes(msg1.substring(0, 20));
    }

    /**
     * Get error-specific recommendation
     */
    getErrorRecommendation(error) {
        const message = (error.message || error.text || '').toLowerCase();
        
        if (message.includes('cors')) {
            return 'Check CORS configuration on your server. Consider adding proper headers or using a proxy.';
        } else if (message.includes('failed to fetch')) {
            return 'Network connectivity issue. Check if the API endpoint is accessible and properly configured.';
        } else if (message.includes('undefined')) {
            return 'Variable initialization issue. Check for undefined variables or missing property checks.';
        } else if (message.includes('permission')) {
            return 'Browser permission issue. Check if required permissions are granted.';
        } else {
            return 'Review the error stack trace and check related documentation.';
        }
    }

    /**
     * Generate project-specific recommendations
     */
    generateRecommendations(currentData, history, projectInfo) {
        const recommendations = [];
        
        // Railway-specific recommendations
        if (projectInfo.platform === 'railway') {
            recommendations.push('💡 Railway: Check deployment logs in Railway dashboard');
            recommendations.push('🔧 Railway: Verify environment variables are properly set');
        }
        
        // Error-based recommendations
        const errorCount = (currentData.errors || []).length;
        if (errorCount > 3) {
            recommendations.push('⚠️ Multiple errors detected - consider prioritizing the most critical ones');
        }
        
        // Console log recommendations
        const consoleErrors = (currentData.consoleLogs || [])
            .filter(log => log.level === 'error').length;
        if (consoleErrors > 5) {
            recommendations.push('📝 Many console errors - consider cleaning up error logs for better debugging');
        }
        
        return recommendations;
    }

    /**
     * Mark a debug session as resolved with notes
     */
    async markResolved(sessionId, resolutionNotes) {
        try {
            const key = `memory-${sessionId}`;
            const result = await chrome.storage.local.get(key);
            const session = result[key];
            
            if (session) {
                session.resolved = true;
                session.resolutionNotes = resolutionNotes;
                session.resolvedAt = new Date().toISOString();
                
                await chrome.storage.local.set({ [key]: session });
                
                return { success: true, message: 'Session marked as resolved' };
            } else {
                return { success: false, error: 'Session not found' };
            }
            
        } catch (error) {
            console.error('Failed to mark session as resolved:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get recent debug sessions for history panel
     */
    async getRecentSessions(limit = 10) {
        try {
            const result = await chrome.storage.local.get();
            const sessions = Object.entries(result)
                .filter(([key]) => key.startsWith('memory-'))
                .map(([_, session]) => session)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, limit);

            return sessions;
            
        } catch (error) {
            console.error('Failed to get recent sessions:', error);
            return [];
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryIntegration;
} else {
    window.MemoryIntegration = MemoryIntegration;
}