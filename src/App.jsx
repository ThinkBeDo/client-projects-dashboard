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
          id: 'kig-dual-compensation',
          title: 'Dual Compensation Strategy: Charlotte & Michelle',
          status: 'urgent',
          priority: 'High',
          description: 'Offer same compensation package to both Charlotte (first) and Michelle Guidry. $100K base + 2.5% revenue bonus + growth accelerators.',
          lastUpdate: '2025-08-17',
          hasClaudeProject: true,
          claudeProjectName: 'KIG Michelle Guidry Compensation Email Analysis',
          tasks: [
            { id: 't12', text: 'Present offer to Charlotte first (PRIORITY)', completed: false },
            { id: 't13', text: 'Create performance metrics framework with automation KPIs', completed: false },
            { id: 't14', text: 'Present offer to Michelle Guidry after Charlotte decision', completed: false },
            { id: 't15', text: 'Implement automation incentive structure', completed: false }
          ]
        },
        {
          id: 'kig-charlotte',
          title: 'Charlotte Retention Strategy',
          status: 'in-progress',
          priority: 'High',
          description: 'Execute retention plan - offering same package as Michelle',
          lastUpdate: '2025-08-17',
          hasClaudeProject: false,
          claudeProjectUrl: null,
          tasks: [
            { id: 't16', text: 'Prepare Charlotte compensation offer (same as Michelle)', completed: false },
            { id: 't17', text: 'Schedule compensation discussion with Charlotte', completed: false },
            { id: 't18', text: 'Present complete package with growth opportunities', completed: false },
            { id: 't19', text: 'Get Charlotte\'s decision before proceeding with Michelle', completed: false }
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
          description: 'Automated patient callback system for 6 clinic locations',
          lastUpdate: '2025-08-08',
          hasClaudeProject: true,
          claudeProjectName: 'MTS Therapy Callback System',
          tasks: [
            { id: 't20', text: 'Analyze current callback process', completed: true },
            { id: 't21', text: 'Design automated system architecture', completed: false },
            { id: 't22', text: 'Implement across 6 locations', completed: false },
            { id: 't23', text: 'Train staff on new system', completed: false }
          ]
        },
        {
          id: 'mts-phase1',
          title: 'Phase 1 Technical Implementation',
          status: 'planning',
          priority: 'Medium',
          description: 'Technical infrastructure setup',
          lastUpdate: '2025-08-08',
          hasClaudeProject: false,
          claudeProjectUrl: null,
          tasks: [
            { id: 't24', text: 'Setup technical infrastructure', completed: false },
            { id: 't25', text: 'Configure system integrations', completed: false },
            { id: 't26', text: 'Conduct system testing', completed: false }
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
          title: 'HubSpot CTA Automation',
          status: 'completed',
          priority: 'High',
          description: 'Emergency pop-up system with HubSpot integration',
          lastUpdate: '2025-08-11'
        }
      ]
    },
    'Cherie Dugas': {
      type: 'Role Transition Consulting',
      contact: 'Cherie Dugas',
      urgency: 'medium',
      projects: [
        {
          id: 'cherie-transition',
          title: 'Role Transition Analysis',
          status: 'in-progress',
          priority: 'Medium',
          description: 'Strategic role transition and communities analysis',
          lastUpdate: '2025-08-13',
          hasClaudeProject: false,
          claudeProjectName: null,
          tasks: [
            { id: 't34', text: 'Communities of Interest Analysis', completed: true },
            { id: 't35', text: 'Phase 2 Strategic Feedback Analysis', completed: false },
            { id: 't36', text: 'Final role transition recommendations', completed: false }
          ]
        }
      ]
    },
    'Personal Projects': {
      type: 'Individual Client Work',
      urgency: 'low',
      projects: [
        {
          id: 'keisha-sodium',
          title: 'Keisha Holmes - Sodium Conversion Guide',
          status: 'completed',
          priority: 'Low',
          description: 'Sodium conversion clarification guide',
          lastUpdate: '2025-08-04',
          hasClaudeProject: false,
          claudeProjectName: null,
          tasks: [
            { id: 't37', text: 'Research sodium conversion requirements', completed: true },
            { id: 't38', text: 'Create clarification guide', completed: true },
            { id: 't39', text: 'Deliver guide to client', completed: true }
          ]
        }
      ]
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'planning': return <Circle className="w-4 h-4 text-yellow-500" />;
      case 'research': return <Circle className="w-4 h-4 text-purple-500" />;
      default: return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'research': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium-High': return 'bg-yellow-500 text-white';
      case 'Medium': return 'bg-blue-500 text-white';
      case 'Low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const calculateProjectProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.completed || tasks[task.id]).length;
    return (completedTasks / project.tasks.length) * 100;
  };

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleTask = (projectId, taskId, taskText, clientName, projectTitle) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
    
    // Log task completion for Claude to process
    console.log('TASK UPDATE:', {
      projectId,
      taskId,
      taskText,
      completed: !tasks[taskId],
      clientName,
      projectTitle,
      timestamp: new Date().toISOString()
    });
  };

  const handleProjectClick = (clientName, project) => {
    setSelectedProject({ client: clientName, ...project });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      // Create a comprehensive update note for Claude's memory
      const timestamp = new Date().toLocaleString();
      const updateNote = `# Project Update - ${selectedProject.title}

**Client**: ${selectedProject.client}
**Date**: ${timestamp}
**Updated by**: Dashboard Interface

## Update Details:
${updateText}

## Current Project Status:
- **Status**: ${selectedProject.status}
- **Priority**: ${selectedProject.priority}
- **Last Update**: ${selectedProject.lastUpdate}

---
*This update was submitted via the Client Projects Dashboard*`;

      // Log the update for Claude to process
      console.log('PROJECT UPDATE SUBMITTED:', {
        projectId: selectedProject.id,
        title: selectedProject.title,
        client: selectedProject.client,
        update: updateText,
        timestamp: new Date().toISOString()
      });

      // Show success message with instructions
      alert(`✅ Update saved!

Project: ${selectedProject.title}
Update: "${updateText}"

📝 Note: Dashboard will be updated in your next Claude chat when you mention this project or ask to "refresh dashboard"`);
      
      setShowUpdateModal(false);
      setUpdateText('');
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('⚠ Error saving update. Please try again.');
    }
  };

  const filteredClients = Object.entries(clients).filter(([clientName, clientData]) => {
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientData.projects.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'urgent') return matchesSearch && clientData.urgency === 'high';
    if (filter === 'active') return matchesSearch && clientData.projects.some(p => p.status === 'in-progress' || p.status === 'urgent');
    return matchesSearch;
  });

  // Calculate active project metrics (urgent, in-progress, planning, research)
  const activeProjects = Object.values(clients).reduce((acc, client) => 
    acc + client.projects.filter(p => ['urgent', 'in-progress', 'planning', 'research'].includes(p.status)).length, 0);
  
  const urgentProjects = Object.values(clients).reduce((acc, client) => 
    acc + client.projects.filter(p => p.status === 'urgent').length, 0);
  
  const inProgressProjects = Object.values(clients).reduce((acc, client) => 
    acc + client.projects.filter(p => p.status === 'in-progress').length, 0);
  
  // Calculate clients with active projects
  const activeClients = Object.values(clients).filter(client => 
    client.projects.some(p => ['urgent', 'in-progress', 'planning', 'research'].includes(p.status))
  ).length;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Projects Dashboard</h1>
        <p className="text-gray-600">Click any project to update status or add notes</p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{urgentProjects}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressProjects}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">{activeClients}</p>
              </div>
              <User className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients or projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'urgent', 'active'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid gap-6">
        {filteredClients.map(([clientName, clientData]) => (
          <div key={clientName} className="bg-white rounded-lg shadow-md border-2 border-gray-200 overflow-hidden">
            {/* Client Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{clientName}</h3>
                  <p className="text-sm text-blue-100">{clientData.type}</p>
                  {clientData.contact && (
                    <p className="text-sm text-blue-200">Contact: {clientData.contact}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    clientData.urgency === 'high' ? 'bg-red-500 text-white' :
                    clientData.urgency === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {clientData.urgency.toUpperCase()}
                  </div>
                  <p className="text-sm text-blue-200 mt-1">{clientData.projects.length} projects</p>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="divide-y-2 divide-gray-200">
              {clientData.projects.map((project) => (
                <div key={project.id} className="bg-white border-l-4 border-l-blue-500">
                  {/* Project Header */}
                  <div className="p-4 hover:bg-gray-50 transition-colors border-2 border-gray-100 hover:border-gray-200 rounded-r-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(project.status)}
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status.replace('-', ' ')}
                          </span>
                          {project.hasClaudeProject && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 border border-purple-200">
                              Claude Project
                            </span>
                          )}
                          {project.tasks && (
                            <button
                              onClick={() => toggleProjectExpansion(project.id)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              {expandedProjects[project.id] ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        {project.components && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.components.map((component, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                                {component}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.lastUpdate}
                          </div>
                          {project.deadline && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              {project.deadline}
                            </div>
                          )}
                          {project.tasks && (
                            <div className="flex items-center gap-1">
                              <CheckSquare className="w-3 h-3" />
                              {project.tasks.filter(t => tasks[t.id] || t.completed).length}/{project.tasks.length} tasks
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                          <div className="flex gap-1">
                            {project.hasClaudeProject && (
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  alert(`📋 Copy This Project Name:

${project.claudeProjectName}

1. Copy the name above
2. Go to Claude Desktop Projects
3. Paste in search`);
                                }}
                                className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
                                role="button"
                                tabIndex={0}
                              >
                                <ExternalLink className="w-3 h-3" />
                                Claude Project
                              </div>
                            )}
                            <button
                              onClick={() => handleProjectClick(clientName, project)}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              Update
                            </button>
                          </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Tasks */}
                  {project.tasks && expandedProjects[project.id] && (
                    <div className="px-4 pb-4 bg-gray-50 border-t">
                      <div className="pt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Tasks:</h5>
                        <div className="space-y-2">
                          {project.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2">
                              <button
                                onClick={() => toggleTask(project.id, task.id, task.text, clientName, project.title)}
                                className="flex-shrink-0"
                              >
                                {(tasks[task.id] || task.completed) ? (
                                  <CheckSquare className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                )}
                              </button>
                              <span className={`text-sm ${
                                (tasks[task.id] || task.completed) 
                                  ? 'text-gray-500 line-through' 
                                  : 'text-gray-700'
                              }`}>
                                {task.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Update Project</h3>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray