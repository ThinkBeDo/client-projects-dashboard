#!/usr/bin/env node

/**
 * Railway CLI Native Messaging Host for Chrome Debug Extension
 * Communicates with Chrome extension via stdio to provide Railway logs and status
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class RailwayNativeHost {
  constructor() {
    this.setupStdio();
    this.listen();
  }

  setupStdio() {
    // Native messaging uses binary communication
    process.stdin.setEncoding('utf8');
    process.stdout.setDefaultEncoding('utf8');
  }

  listen() {
    let buffer = '';
    
    process.stdin.on('data', (chunk) => {
      buffer += chunk;
      
      // Native messaging protocol: 4-byte length + JSON message
      while (buffer.length >= 4) {
        const length = buffer.charCodeAt(0) | 
                      (buffer.charCodeAt(1) << 8) |
                      (buffer.charCodeAt(2) << 16) |
                      (buffer.charCodeAt(3) << 24);
        
        if (buffer.length < 4 + length) break;
        
        const message = buffer.substring(4, 4 + length);
        buffer = buffer.substring(4 + length);
        
        try {
          const request = JSON.parse(message);
          this.handleMessage(request);
        } catch (error) {
          this.sendError('Invalid JSON message', error.message);
        }
      }
    });

    process.stdin.on('end', () => {
      process.exit(0);
    });
  }

  async handleMessage(request) {
    try {
      switch (request.action) {
        case 'getLogs':
          await this.getRailwayLogs(request.projectId, request.serviceId);
          break;
          
        case 'getProjectStatus':
          await this.getProjectStatus(request.projectId);
          break;
          
        case 'detectProject':
          await this.detectProjectFromUrl(request.url);
          break;
          
        case 'getDeployments':
          await this.getRecentDeployments(request.projectId);
          break;
          
        default:
          this.sendError('Unknown action', request.action);
      }
    } catch (error) {
      this.sendError('Action failed', error.message);
    }
  }

  async getRailwayLogs(projectId, serviceId) {
    try {
      // Check if Railway CLI is available
      const railwayAvailable = await this.checkRailwayCLI();
      if (!railwayAvailable) {
        return this.sendResponse({
          success: false,
          error: 'Railway CLI not found. Please install: npm install -g @railway/cli'
        });
      }

      const args = ['logs'];
      if (projectId) args.push('--project', projectId);
      if (serviceId) args.push('--service', serviceId);
      args.push('--lines', '50'); // Get last 50 log lines

      const logs = await this.executeRailwayCommand(args);
      
      this.sendResponse({
        success: true,
        action: 'getLogs',
        data: {
          logs: logs,
          projectId: projectId,
          serviceId: serviceId,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      this.sendResponse({
        success: false,
        error: `Failed to get Railway logs: ${error.message}`
      });
    }
  }

  async getProjectStatus(projectId) {
    try {
      const railwayAvailable = await this.checkRailwayCLI();
      if (!railwayAvailable) {
        return this.sendResponse({
          success: false,
          error: 'Railway CLI not found'
        });
      }

      const args = ['status'];
      if (projectId) args.push('--project', projectId);

      const status = await this.executeRailwayCommand(args);
      
      this.sendResponse({
        success: true,
        action: 'getProjectStatus',
        data: {
          status: status,
          projectId: projectId,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      this.sendResponse({
        success: false,
        error: `Failed to get project status: ${error.message}`
      });
    }
  }

  async detectProjectFromUrl(url) {
    try {
      // Extract Railway project info from URL patterns
      const railwayPatterns = [
        /https?:\/\/([^.]+)\.up\.railway\.app/,
        /https?:\/\/railway\.app\/project\/([^\/]+)/,
        /railway\.app.*project[\/=]([^\/&]+)/
      ];

      let projectInfo = null;
      
      for (const pattern of railwayPatterns) {
        const match = url.match(pattern);
        if (match) {
          projectInfo = {
            detected: true,
            subdomain: match[1],
            url: url,
            type: 'railway_app'
          };
          break;
        }
      }

      if (!projectInfo) {
        projectInfo = {
          detected: false,
          url: url,
          type: 'unknown'
        };
      }

      this.sendResponse({
        success: true,
        action: 'detectProject',
        data: projectInfo
      });
      
    } catch (error) {
      this.sendResponse({
        success: false,
        error: `Failed to detect project: ${error.message}`
      });
    }
  }

  async getRecentDeployments(projectId) {
    try {
      const railwayAvailable = await this.checkRailwayCLI();
      if (!railwayAvailable) {
        return this.sendResponse({
          success: false,
          error: 'Railway CLI not found'
        });
      }

      const args = ['deployment', 'list'];
      if (projectId) args.push('--project', projectId);
      args.push('--limit', '5');

      const deployments = await this.executeRailwayCommand(args);
      
      this.sendResponse({
        success: true,
        action: 'getDeployments',
        data: {
          deployments: deployments,
          projectId: projectId,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      this.sendResponse({
        success: false,
        error: `Failed to get deployments: ${error.message}`
      });
    }
  }

  async checkRailwayCLI() {
    return new Promise((resolve) => {
      const railway = spawn('railway', ['--version'], { stdio: 'pipe' });
      
      railway.on('close', (code) => {
        resolve(code === 0);
      });
      
      railway.on('error', () => {
        resolve(false);
      });
    });
  }

  async executeRailwayCommand(args) {
    return new Promise((resolve, reject) => {
      const railway = spawn('railway', args, { 
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: process.platform === 'win32'
      });
      
      let stdout = '';
      let stderr = '';
      
      railway.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      railway.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      railway.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Railway CLI failed: ${stderr || stdout}`));
        }
      });
      
      railway.on('error', (error) => {
        reject(new Error(`Failed to execute Railway CLI: ${error.message}`));
      });
    });
  }

  sendResponse(response) {
    this.sendMessage(response);
  }

  sendError(message, details) {
    this.sendMessage({
      success: false,
      error: message,
      details: details
    });
  }

  sendMessage(message) {
    const json = JSON.stringify(message);
    const length = Buffer.byteLength(json, 'utf8');
    
    // Write 4-byte length header followed by JSON message
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeUInt32LE(length, 0);
    
    process.stdout.write(buffer);
    process.stdout.write(json, 'utf8');
  }
}

// Start the native messaging host
new RailwayNativeHost();
