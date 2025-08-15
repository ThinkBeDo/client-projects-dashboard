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
          title: 'Organizational Chart Generator',
          status: 'active',
          priority: 'medium',
          timeline: '2 weeks',
          description: 'Create automated org chart generation system',
          lastUpdate: '2024-08-15',
          updates: ['Initial requirements gathered', 'PowerPoint automation research completed']
        }
      ]
    },
    'Ronald Fremin - Insurance': {
      type: 'Insurance Brokerage',
      contact: 'Ronald Fremin',
      urgency: 'high',
      projects: [
        {
          id: 'fremin-data-merge',
          title: 'Insurance Data Merge & Analysis',
          status: 'completed',
          priority: 'high',
          timeline: 'Completed',
          description: 'Emergency CSV structure fix and property/renewal data merge',
          lastUpdate: '2024-08-15',
          updates: [
            '✅ Crisis resolved - Fixed corrupted CSV structure',
            '✅ Successfully merged property and renewal data',
            '✅ Delivered professional formatted file with 34-36% renewal matches',
            '✅ Enhanced Master Insurance List delivered to client'
          ]
        }
      ]
    },
    'Spero Health - Medical Billing': {
      type: 'Healthcare Analytics',
      contact: 'Spero Health Team',
      urgency: 'high',
      projects: [
        {
          id: 'spero-eob-parser',
          title: 'HIPAA-Compliant EOB Data Extractor',
          status: 'active',
          priority: 'high',
          timeline: '1 week',
          description: 'Extract patient records from Medicare EOB documents with full HIPAA compliance',
          lastUpdate: '2024-08-14',
          updates: [
            'HIPAA compliance framework implemented',
            'Medicare EOB parser core functionality built',
            'Security and audit logging added'
          ]
        }
      ]
    },
    'Benedict Refrigeration - Payroll': {
      type: 'Manufacturing Automation',
      contact: 'Benedict Team',
      urgency: 'medium',
      projects: [
        {
          id: 'benedict-payroll-automation',
          title: 'Automated Payroll Report Correction',
          status: 'active',
          priority: 'medium',
          timeline: '2 weeks',
          description: 'Process PDF payroll reports and apply business rules automatically',
          lastUpdate: '2024-08-12',
          updates: [
            'PDF processing engine implemented',
            'Business rules logic completed',
            'Testing with sample payroll data'
          ]
        }
      ]
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'on-hold': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredClients = Object.entries(clients).filter(([clientName, clientData]) => {
    const hasMatchingProject = clientData.projects.some(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || project.status === filter;
      return matchesSearch && matchesFilter;
    });
    return hasMatchingProject;
  });

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const addUpdate = (projectId) => {
    setSelectedProject(projectId);
    setShowUpdateModal(true);
  };

  const saveUpdate = () => {
    // In a real app, this would save to backend
    console.log(`Adding update to project ${selectedProject}: ${updateText}`);
    setUpdateText('');
    setShowUpdateModal(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Projects Dashboard</h1>
              <p className="text-gray-600 mt-1">Track progress and manage client deliverables</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, clients, or descriptions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="active">Active Projects</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="all">All Projects</option>
          </select>
        </div>

        {/* Client Projects Grid */}
        <div className="space-y-6">
          {filteredClients.map(([clientName, clientData]) => (
            <div key={clientName} className="bg-white rounded-lg shadow-sm border">
              {/* Client Header */}
              <div className="border-b bg-gray-50 px-6 py-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{clientName}</h2>
                      <p className="text-sm text-gray-600">{clientData.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{clientData.contact}</span>
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="divide-y">
                {clientData.projects.map((project) => (
                  <div key={project.id} className={`p-6 border-l-4 ${getPriorityColor(project.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(project.status)}
                          <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${ 
                            project.priority === 'high' ? 'bg-red-100 text-red-800' :
                            project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {project.priority} priority
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Timeline: {project.timeline}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Last updated: {project.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleProjectExpansion(project.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded"
                        >
                          {expandedProjects[project.id] ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => addUpdate(project.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Add Update</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Project Details */}
                    {expandedProjects[project.id] && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-2">Recent Updates</h4>
                        <div className="space-y-2">
                          {project.updates.map((update, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-gray-700">{update}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects match your current search and filter criteria.</p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Project Update</h3>
            <textarea
              className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Enter update details..."
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProjectsDashboard;