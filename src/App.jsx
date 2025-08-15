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
          title: 'HubSpot CTA Automation',
          status: 'completed',
          priority: 'Medium',
          description: 'Automated HubSpot CTA implementation',
          lastUpdate: '2025-08-15'
        }
      ]
    }
  };

  // Toggle task completion
  const toggleTask = (projectId, taskId) => {
    console.log(`Toggling task ${taskId} for project ${projectId}`);
    setTasks(prev => ({
      ...prev,
      [`${projectId}-${taskId}`]: !prev[`${projectId}-${taskId}`]
    }));
  };

  // Toggle project expansion
  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Add project update
  const addUpdate = () => {
    if (!selectedProject || !updateText) return;
    
    console.log('Adding update:', {
      project: selectedProject.title,
      update: updateText,
      timestamp: new Date().toISOString()
    });
    
    setUpdateText('');
    setShowUpdateModal(false);
  };

  // Get filtered projects
  const getFilteredProjects = () => {
    let allProjects = [];
    
    Object.entries(clients).forEach(([clientName, client]) => {
      client.projects.forEach(project => {
        allProjects.push({
          ...project,
          clientName,
          clientType: client.type,
          contact: client.contact,
          urgency: client.urgency
        });
      });
    });

    // Apply search filter
    if (searchTerm) {
      allProjects = allProjects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      allProjects = allProjects.filter(project => {
        if (filter === 'active') return ['in-progress', 'urgent', 'planning'].includes(project.status);
        if (filter === 'completed') return project.status === 'completed';
        if (filter === 'urgent') return project.status === 'urgent' || project.urgency === 'high';
        return true;
      });
    }

    return allProjects;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'planning': return 'text-yellow-600 bg-yellow-100';
      case 'research': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Projects Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and track all client projects across your portfolio</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects, clients, or descriptions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'urgent', 'completed'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getFilteredProjects().map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Client Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{project.clientName}</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${getUrgencyColor(project.urgency)}`}>
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-xs font-medium">{project.urgency}</span>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                
                {/* Status and Priority */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    <StatusIcon status={project.status} />
                    <span className="ml-1">{project.status.replace('-', ' ')}</span>
                  </span>
                  <span className="text-xs text-gray-500">Priority: {project.priority}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>

                {/* Contact Info */}
                {project.contact && (
                  <div className="flex items-center space-x-1 mb-3">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{project.contact}</span>
                  </div>
                )}

                {/* Last Update */}
                <div className="flex items-center space-x-1 mb-4">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Updated: {project.lastUpdate}</span>
                </div>

                {/* Claude Project Link */}
                {project.hasClaudeProject && (
                  <div className="flex items-center space-x-1 mb-4 p-2 bg-blue-50 rounded-md">
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Claude Project: {project.claudeProjectName}</span>
                  </div>
                )}

                {/* Tasks */}
                {project.tasks && project.tasks.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      {expandedProjects[project.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span>Tasks ({project.tasks.length})</span>
                    </button>
                    
                    {expandedProjects[project.id] && (
                      <div className="mt-2 space-y-2">
                        {project.tasks.map((task) => (
                          <div key={task.id} className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleTask(project.id, task.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {task.completed || tasks[`${project.id}-${task.id}`] ? (
                                <CheckSquare className="w-4 h-4 text-green-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                            <span className={`text-sm ${
                              task.completed || tasks[`${project.id}-${task.id}`]
                                ? 'line-through text-gray-500'
                                : 'text-gray-700'
                            }`}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setShowUpdateModal(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getFilteredProjects().length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Update - {selectedProject?.title}
              </h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Enter your project update..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={addUpdate}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Add Update
                </button>
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setUpdateText('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProjectsDashboard;