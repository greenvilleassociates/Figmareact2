// Default data for project phases 1-10
export const phaseDefaultData = {
  1: {
    title: 'Phase I',
    subtitle: 'Project Initialization',
    overview: 'Phase I marks the beginning of the project lifecycle. This phase focuses on establishing project foundations, setting up the development environment, and defining initial project scope and objectives. Key stakeholders are identified and the project charter is created.',
    deliverables: [
      'Project Charter Document',
      'Stakeholder Identification Matrix',
      'Initial Project Scope Statement',
      'Development Environment Setup',
      'Version Control Repository Creation'
    ],
    accomplishments: [
      'GitHub repository established at https://github.com/jssg33/usc242',
      'Project team roles and responsibilities defined',
      'Communication channels established',
      'Initial timeline and milestones created',
      'Development tools and frameworks selected'
    ],
    status: 'Completed'
  },
  2: {
    title: 'Phase II',
    subtitle: 'Requirements Gathering',
    overview: 'Phase II involves comprehensive requirements gathering and analysis. This phase ensures that all stakeholder needs are documented and understood. Functional and non-functional requirements are identified, prioritized, and validated with the project team and stakeholders.',
    deliverables: [
      'Requirements Specification Document',
      'User Stories and Use Cases',
      'Functional Requirements Matrix',
      'Non-Functional Requirements List',
      'Requirements Traceability Matrix'
    ],
    accomplishments: [
      'Conducted stakeholder interviews and workshops',
      'Documented 50+ functional requirements',
      'Created user personas and journey maps',
      'Defined acceptance criteria for each requirement',
      'Established requirements baseline for design phase'
    ],
    status: 'Completed'
  },
  3: {
    title: 'Phase III',
    subtitle: 'Design & Architecture',
    overview: 'Phase III focuses on creating comprehensive design specifications and system architecture. This phase transforms requirements into detailed technical designs including UI/UX mockups, database schemas, API specifications, and system architecture diagrams.',
    deliverables: [
      'System Architecture Document',
      'Database Design and ER Diagrams',
      'UI/UX Wireframes and Mockups',
      'API Specification Document',
      'Technology Stack Documentation'
    ],
    accomplishments: [
      'Created comprehensive architecture diagrams',
      'Designed responsive UI layouts for all pages',
      'Developed database schema with normalization',
      'Selected React, Tailwind CSS, and React Router as core technologies',
      'Defined RESTful API endpoints and data models'
    ],
    status: 'Completed'
  },
  4: {
    title: 'Phase IV',
    subtitle: 'Frontend Development',
    overview: 'Phase IV focuses on building the user interface and client-side functionality. This phase implements the designed UI components, creates interactive features, and ensures responsive design across all devices.',
    deliverables: [
      'React Component Library',
      'Responsive Page Layouts',
      'Client-Side Routing Implementation',
      'Form Validation and User Input Handling',
      'Cross-Browser Compatibility Testing'
    ],
    accomplishments: [
      'Implemented all major UI components with Tailwind CSS',
      'Created responsive navigation with Kelly Green branding',
      'Built assignment and project management interfaces',
      'Integrated React Router for multi-page navigation',
      'Achieved 100% mobile responsiveness'
    ],
    status: 'Completed'
  },
  5: {
    title: 'Phase V',
    subtitle: 'Backend Development',
    overview: 'Phase V involves creating server-side functionality, APIs, and database implementations. This phase establishes the backend infrastructure, implements business logic, and creates secure API endpoints for frontend integration.',
    deliverables: [
      'RESTful API Implementation',
      'Database Schema and Models',
      'Authentication and Authorization System',
      'Server Configuration and Deployment Scripts',
      'API Documentation with Swagger'
    ],
    accomplishments: [
      'Built Node.js/Express backend with REST API',
      'Implemented user authentication endpoints',
      'Created project and assignment data APIs',
      'Set up database with proper indexing',
      'Deployed backend to Render platform'
    ],
    status: 'In Progress'
  },
  6: {
    title: 'Phase VI',
    subtitle: 'Integration Testing',
    overview: 'Phase VI focuses on testing the integration between frontend and backend systems. This phase ensures that all components work together seamlessly and that data flows correctly between the client and server.',
    deliverables: [
      'Integration Test Suite',
      'API Integration Tests',
      'End-to-End Test Scenarios',
      'Performance Testing Results',
      'Bug Reports and Resolution Log'
    ],
    accomplishments: [
      'Validated API endpoints with frontend integration',
      'Tested authentication flow end-to-end',
      'Verified data persistence across sessions',
      'Performed load testing on key endpoints',
      'Fixed integration bugs and edge cases'
    ],
    status: 'Pending'
  },
  7: {
    title: 'Phase VII',
    subtitle: 'User Acceptance Testing',
    overview: 'Phase VII involves stakeholder testing to validate that the application meets all requirements. This phase collects user feedback, identifies usability issues, and ensures the system is ready for production deployment.',
    deliverables: [
      'UAT Test Plan and Cases',
      'User Feedback Documentation',
      'Usability Testing Results',
      'Defect Log and Resolutions',
      'Sign-off Documentation'
    ],
    accomplishments: [
      'Conducted user testing sessions with stakeholders',
      'Collected and analyzed user feedback',
      'Identified and prioritized UI/UX improvements',
      'Fixed critical usability issues',
      'Received stakeholder approval for deployment'
    ],
    status: 'Pending'
  },
  8: {
    title: 'Phase VIII',
    subtitle: 'Deployment Preparation',
    overview: 'Phase VIII prepares the application for production deployment. This phase includes final testing, environment configuration, documentation updates, and deployment planning.',
    deliverables: [
      'Production Environment Configuration',
      'Deployment Checklist',
      'User Documentation and Guides',
      'Backup and Recovery Procedures',
      'Rollback Plan'
    ],
    accomplishments: [
      'Configured production hosting on Render',
      'Set up continuous deployment pipeline',
      'Created comprehensive user documentation',
      'Established monitoring and logging systems',
      'Prepared rollback and recovery procedures'
    ],
    status: 'Pending'
  },
  9: {
    title: 'Phase IX',
    subtitle: 'Production Deployment',
    overview: 'Phase IX executes the production deployment. This phase involves deploying the application to production servers, monitoring the deployment process, and ensuring successful launch with minimal disruption.',
    deliverables: [
      'Production Deployment',
      'Post-Deployment Verification',
      'Performance Monitoring Setup',
      'Production Database Migration',
      'Launch Communication Plan'
    ],
    accomplishments: [
      'Successfully deployed application to production',
      'Verified all features working in production',
      'Configured SSL certificates and security',
      'Migrated production data successfully',
      'Communicated launch to stakeholders'
    ],
    status: 'Pending'
  },
  10: {
    title: 'Phase X',
    subtitle: 'Maintenance & Support',
    overview: 'Phase X focuses on ongoing maintenance, support, and continuous improvement. This phase includes monitoring system performance, addressing user issues, implementing enhancements, and ensuring long-term system stability.',
    deliverables: [
      'Maintenance Schedule',
      'Support Ticket System',
      'Performance Monitoring Reports',
      'Enhancement Backlog',
      'System Health Dashboards'
    ],
    accomplishments: [
      'Established 24/7 monitoring and alerting',
      'Created support ticket workflow',
      'Implemented automated backups',
      'Developed enhancement roadmap',
      'Maintained 99.9% uptime'
    ],
    status: 'Pending'
  }
};
