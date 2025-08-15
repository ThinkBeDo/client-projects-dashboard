import React, { useState } from 'react';
import { Search, Plus, Clock, AlertTriangle, CheckCircle, Circle, User, Building2, Calendar, MessageSquare, ChevronDown, ChevronRight, Square, CheckSquare, ExternalLink } from 'lucide-react';

const ClientProjectsDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('active');
  const [updateText, setUpdateText] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [tasks, setTasks] = useState({});

  // Client data organized by business
  const clients = {
    'Dana Tierney - AIS': {
      type: 'Healthcare/Mammography',
      contact: 'Dana Tierney',
      urgency: 'medium',
      projects: [
        {
          id: 'dana-org-chart',
          title: 'Mammography Organization Chart',
          status: 'in-progress',
          priority: 'Medium',
          description: 'Create organizational chart for mammography services across 6 departments',
          lastUpdate: '2025-08-15',
          hasClaudeProject: false,
          claudeProjectUrl: null,
          tasks: [
            { id: 'dt1', text: 'Create initial Mermaid org chart structure', completed: true },
            { id: 'dt2', text: 'Wait for employee count numbers from Dana', completed: false },
            { id: 'dt3', text: 'Update chart with actual staff numbers', completed: false },
            { id: 'dt4', text: 'Create final deliverable format', completed: false },
            { id: 'dt5', text: 'Deliver completed org chart', completed: false }
          ]
        }
      ]
    },
    'KIG - Levi Kastner': {
      type: 'Insurance Agency',
      contact: 'Levi Kastner',
      urgency: 'high',
      projects: [
        {
          id: 'kig-urgent-garret',
          title: 'Garret Guidry Commercial Producer Offer',
          status: 'urgent',
          deadline: 'End of Week (Aug 15-16)',
          priority: 'CRITICAL',
          description: 'Finalize offer for new commercial producer',
          lastUpdate: '2025-08-13',
          hasClaudeProject: false,
          claudeProjectUrl: null,
          tasks: [
            { id: 't1', text: 'Prepare compensation package', completed: false },
            { id: 't2', text: 'Finalize terms and conditions', completed: false },
            { id: 't3', text: 'Present offer to Garret', completed: false }
          ]
        },
        {
          id: 'kig-ams-tech',
          title: 'KIG HubSpot n8n Integration',
          status: 'in-progress',
          priority: 'High',
          description: 'NowCerts/Hawksoft demos + HubSpot Pro upgrade',
          components: ['AMS Demo Requirements', 'HubSpot Strategy - Waiting on Talia'],
          lastUpdate: '2025-08-14',
          hasClaudeProject: true,
          claudeProjectName: 'KIG HubSpot n8n Integration',
          tasks: [
            { id: 't4', text: 'Schedule NowCerts demo', completed: false },
            { id: 't5', text: 'Schedule Hawksoft demo', completed: false },
            { id: 't6', text: 'Get HubSpot Pro upgrade options from Talia', completed: false },
            { id: 't7', text: 'Plan AMS + HubSpot integration with David', completed: false }
          ]
        },
        {
          id: 'kig-marketing',
          title: 'Marketing Strategy & Operations Overhaul',
          status: 'planning',
          priority: 'Medium-High',
          description: 'Segmented marketing + website behavior tracking',
          lastUpdate: '2025-08-13',
          hasClaudeProject: false,
          claudeProjectUrl: null,
          tasks: [
            { id: 't8', text: 'Design segmented marketing strategies', completed: false },
            { id: 't9', text: 'Implement website behavior tracking', completed: false },
            { id: 't10', text: 'Plan website refresh', completed: false },
            { id: 't11', text: 'Optimize service center workflows', completed: false }
          ]
        },
        {
          id: 'kig-michelle',
          title: 'Michelle Melchior Compensation Package',
          status: 'planning',
          priority: 'Medium',
          description: 'Determine fair compensation vs Charlotte ($126K)',
          lastUpdate: '2025-08-13',
          hasClaudeProject: false,
          claudeProjectUrl: null,
          tasks: [
            { id: 't12', text: 'Research market compensation rates', completed: false },
            { id: 't13', text: 'Set performance-based expectations', completed: false },
            { id: 't14', text: 'Justify higher pay with revenue targets', completed: false },
            { id: 't15', text: 'Present compensation proposal', completed: false }
          ]
        },
        {
          id: 'kig-charlotte',
          title: 'Charlotte Retention Strategy',
          status: 'planning',
          priority: 'Medium',
          description: 'Assess departure risk & incentive package',
          lastUpdate: '2025-08-13',
          hasClaudeProject: false,
          claudeProjectUrl: null,
          tasks: [
            { id: 't16', text: 'Assess if Charlotte is actually planning to leave', completed: false },
            { id: 't17', text: 'Design incentive package to encourage staying', completed: false },
            { id: 't18', text: 'Conduct risk assessment if she departs', completed: false },
            { id: 't19', text: 'Create succession planning considerations', completed: false }
          ]
        }
      ]
    },
    'MTS Physical Therapy': {
      type: 'Healthcare (6 locations)',
      contact: 'Andrea Potier',
      email: 'andrea.potier@mtspts.com',
      phone: '337.201.0910',
      urgency: 'medium',
      projects: [
        {
          id: 'mts-callback',
          title: 'MTS Therapy Callback System',
          status: 'in-progress',
          priority: 'High',
          description: 'Automated patient callback system - Phase 1 Manual CSV Upload ($4,500)',
          components: ['Phase 1: Manual Upload', 'Phase 2: Semi-Automated', 'Phase 3: Full Automation'],
          lastUpdate: '2025-08-08',
          hasClaudeProject: true,
          claudeProjectName: 'MTS Therapy Callback System',
          tasks: [
            { id: 't20', text: 'Complete project analysis & technical planning', completed: true },
            { id: 't21', text: 'Await Andrea approval for Phase 1 prototype', completed: false },
            { id: 't22', text: 'Develop Phase 1: Manual CSV upload system', completed: false },
            { id: 't23', text: 'Deploy Phase 1 at single location pilot', completed: false },
            { id: 't24', text: 'Phase 2: Semi-automated email processing', completed: false },
            { id: 't25', text: 'Phase 3: Full automation with FTP/SFTP', completed: false }
          ]
        }
      ]
    },
    'Drip IV': {
      type: 'Medical/Wellness',
      urgency: 'medium',
      projects: [
        {
          id: 'drip-dashboard',
          title: 'Drip IV Dashboard Enhancement',
          status: 'in-progress',
          priority: 'High',
          description: 'Transform dashboard to intelligent analytics platform',
          lastUpdate: '2025-08-14',
          hasClaudeProject: true,
          claudeProjectName: 'Drip IV Dashboard Enhancement',
          tasks: [
            { id: 't27', text: 'Implement AI-powered SQL query generation', completed: true },
            { id: 't28', text: 'Fix membership data processing logic', completed: false },
            { id: 't29', text: 'Add Excel support for file uploads', completed: false },
            { id: 't30', text: 'Deploy enhanced dashboard', completed: false }
          ]
        },
        {
          id: 'drip-membership',
          title: 'Membership Data Fix',
          status: 'in-progress',
          priority: 'Medium',
          description: 'Fix membership data processing issues',
          lastUpdate: '2025-08-14',
          hasClaudeProject: false,
          claudeProjectUrl: null,
          tasks: [
            { id: 't31', text: 'Identify data disconnect issues', completed: true },
            { id: 't32', text: 'Fix membership totals calculation', completed: false },
            { id: 't33', text: 'Validate fixed data processing', completed: false }
          ]
        }
      ]
    },
    'Benedict Refrigeration': {
      type: 'Industrial Services',
      urgency: 'low',
      projects: [
        {
          id: 'benedict-payroll',
          title: 'Payroll AI Search Project',
          status: 'completed',
          priority: 'Medium',
          description: 'AI-powered payroll time-entry report filtering',
          lastUpdate: '2025-08-11'
        }
      ]
    },
    'Sprint Mechanical': {
      type: 'Industrial Services',
      urgency: 'low',
      projects: [
        {
          id: 'sprint-employee',
          title: 'Employee Numbering System',
          status: 'completed',
          priority: 'Medium',
          description: 'HubSpot integration for employee number assignment',
          lastUpdate: '2025-08-05'
        }
      ]
    },
    'Howard Risk Advisors': {
      type: 'Insurance (Oil & Gas/Marine)',
      urgency: 'low',
      projects: [
        {
          id: 'howard-ai',
          title: 'AI Solutions Opportunity Analysis',
          status: 'research',
          priority: 'Low',
          description: 'Strategic AI implementation analysis',
          lastUpdate: '2025-08-09'
        }
      ]
    },
    'Fremin Insurance': {
      type: 'Insurance',
      urgency: 'low',
      projects: [
        {
          id: 'fremin-merge',
          title: 'Insurance Data Merge Project',
          status: 'completed',
          priority: 'Medium',
          description: 'Excel spreadsheet merge with policy data enhancement',
          lastUpdate: '2025-08-14'
        }
      ]
    },
    'Spero': {
      type: 'Healthcare',
      urgency: 'low',
      projects: [
        {
          id: 'spero-eob',
          title: 'HIPAA EOB Data Extraction',
          status: 'completed',
          priority: 'Medium',
          description: 'HIPAA compliant EOB data extraction system',
          lastUpdate: '2025-08-14'
        }
      ]
    },
    'Kastner Insurance': {
      type: 'Insurance',
      urgency: 'medium',
      projects: [
        {
          id: 'kastner-hubspot',
          title: 'HubSpot CTA Automation