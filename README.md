# Client Projects Dashboard

Interactive client projects dashboard for tracking project status, tasks, and updates.

## Features

- 📊 **Project Overview**: Visual dashboard with stats and progress tracking
- 🔍 **Search & Filter**: Find projects by client, name, or status
- ✅ **Task Management**: Interactive task lists with completion tracking
- 📝 **Status Updates**: Modal interface for adding project updates
- 🎯 **Priority Management**: Color-coded priority levels and urgency indicators
- 🔗 **Claude Integration**: Direct links to Claude projects

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Railway** deployment ready

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.jsx          # Main dashboard component
├── main.jsx         # React entry point
└── index.css        # Tailwind CSS imports
```

## Client Data Structure

The dashboard displays projects organized by client with the following structure:

- **Client Information**: Name, type, contact details, urgency level
- **Projects**: Title, status, priority, description, tasks, deadlines
- **Tasks**: Individual action items with completion tracking
- **Claude Integration**: Links to related Claude projects

## Current Clients

- **KIG - Levi Kastner** (Insurance Agency) - 5 projects
- **MTS Physical Therapy** (Healthcare) - 1 project 
- **Drip IV** (Medical/Wellness) - 2 projects
- **Benedict Refrigeration** (Industrial) - 1 project
- **Sprint Mechanical** (Industrial) - 1 project
- **Howard Risk Advisors** (Insurance) - 1 project
- **Fremin Insurance** (Insurance) - 1 project
- **Spero** (Healthcare) - 1 project
- **Kastner Insurance** (Insurance) - 1 project
- **Cherie Dugas** (Consulting) - 1 project
- **Personal Projects** - 1 project

## Deployment

This project is configured for Railway deployment with:
- Vite production build
- Host binding for Railway
- Environment variable support

To deploy on Railway:
1. Connect this GitHub repository to Railway
2. Railway will automatically detect and deploy the Vite app
3. The app will be available at your Railway domain

## Updates & Maintenance

To update project data:
1. Modify the `clients` object in `src/App.jsx`
2. Update project statuses, add new projects, or modify existing ones
3. Deploy changes via git push to Railway

## Features Overview

### Dashboard Stats
- Total projects count
- Urgent projects requiring immediate attention
- Active projects currently in progress
- Total number of clients

### Project Management
- **Status Tracking**: urgent, in-progress, planning, research, completed
- **Priority Levels**: CRITICAL, High, Medium-High, Medium, Low
- **Task Management**: Expandable task lists with completion tracking
- **Update System**: Modal interface for adding project notes and status changes

### Search & Filtering
- Search by client name or project title
- Filter by urgency level (all, urgent, active)
- Real-time filtering of project cards

### Claude Integration
- Identify projects with associated Claude projects
- Direct links to Claude project names for easy access
- Integration with Claude's memory system for project updates

## Environment Variables

No environment variables required for basic functionality.

## License

Private project for client management.