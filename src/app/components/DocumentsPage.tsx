import { FileText, Download, ExternalLink } from 'lucide-react';

export function DocumentsPage() {
  const documents = [
    {
      category: 'Project Documentation',
      items: [
        {
          name: 'README.md',
          description: 'Project overview and setup instructions',
          url: 'https://github.com/jssg33/usc242/blob/main/README.md',
          type: 'Markdown'
        },
        {
          name: 'Project Charter',
          description: 'Initial project scope and objectives',
          url: 'https://github.com/jssg33/usc242/tree/main/docs',
          type: 'Document'
        },
        {
          name: 'Requirements Document',
          description: 'Comprehensive requirements specification',
          url: 'https://github.com/jssg33/usc242/tree/main/docs',
          type: 'Document'
        }
      ]
    },
    {
      category: 'Technical Documentation',
      items: [
        {
          name: 'Architecture Design',
          description: 'System architecture and design decisions',
          url: 'https://github.com/jssg33/usc242/tree/main/docs',
          type: 'Document'
        },
        {
          name: 'API Documentation',
          description: 'RESTful API endpoints and specifications',
          url: 'https://github.com/jssg33/usc242/tree/main/docs',
          type: 'Document'
        },
        {
          name: 'Database Schema',
          description: 'Database design and ER diagrams',
          url: 'https://github.com/jssg33/usc242/tree/main/docs',
          type: 'Document'
        }
      ]
    },
    {
      category: 'Source Code',
      items: [
        {
          name: 'GitHub Repository',
          description: 'Complete source code repository',
          url: 'https://github.com/jssg33/usc242',
          type: 'Repository'
        },
        {
          name: 'Source Code Browser',
          description: 'Browse all project files',
          url: 'https://github.com/jssg33/usc242/tree/main',
          type: 'Repository'
        },
        {
          name: 'Commit History',
          description: 'View development history',
          url: 'https://github.com/jssg33/usc242/commits/main',
          type: 'Repository'
        }
      ]
    },
    {
      category: 'Testing & Quality',
      items: [
        {
          name: 'Test Plans',
          description: 'Integration and UAT test documentation',
          url: 'https://github.com/jssg33/usc242/tree/main/docs',
          type: 'Document'
        },
        {
          name: 'Test Results',
          description: 'Testing reports and bug tracking',
          url: 'https://github.com/jssg33/usc242/tree/main/docs',
          type: 'Document'
        }
      ]
    },
    {
      category: 'Deployment',
      items: [
        {
          name: 'Deployment Guide',
          description: 'Production deployment procedures',
          url: 'https://github.com/jssg33/usc242/tree/main/docs',
          type: 'Document'
        },
        {
          name: 'Live Site',
          description: 'View the deployed application',
          url: 'https://jssg33.github.io/usc242',
          type: 'Website'
        }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Markdown':
        return 'bg-blue-100 text-blue-700';
      case 'Document':
        return 'bg-green-100 text-green-700';
      case 'Repository':
        return 'bg-purple-100 text-purple-700';
      case 'Website':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Project Documents</h1>
        <p className="text-gray-500 mb-2">Access all project documentation and resources</p>
        <a 
          href="https://github.com/jssg33/usc242" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          View GitHub Repository
        </a>
      </div>

      <div className="space-y-8">
        {documents.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-[#4CBB17]">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((doc, docIndex) => (
                <a
                  key={docIndex}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-[#4CBB17] transition-all group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="w-5 h-5 text-[#4CBB17]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#4CBB17]">
                        {doc.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(doc.type)}`}>
                      {doc.type}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="mt-8 bg-gradient-to-r from-[#4CBB17] to-[#5CD91F] text-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://github.com/jssg33/usc242"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
          >
            <FileText className="w-6 h-6" />
            <div>
              <div className="font-semibold">Repository Root</div>
              <div className="text-sm opacity-90">Main repository</div>
            </div>
          </a>
          <a
            href="https://github.com/jssg33/usc242/tree/main/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
          >
            <Download className="w-6 h-6" />
            <div>
              <div className="font-semibold">Documentation</div>
              <div className="text-sm opacity-90">All docs folder</div>
            </div>
          </a>
          <a
            href="https://jssg33.github.io/usc242"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
          >
            <ExternalLink className="w-6 h-6" />
            <div>
              <div className="font-semibold">Live Site</div>
              <div className="text-sm opacity-90">Production app</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}