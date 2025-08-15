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
          id: 'dana-org-chart