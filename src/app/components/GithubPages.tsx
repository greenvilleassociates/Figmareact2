import { useState, useEffect } from 'react';
import { Github, Globe, ExternalLink, Edit2, Save, X } from 'lucide-react';
import { getStorageItem } from '../utils/storageHelper';

interface GitHubConfig {
  profileUrl: string;
  repositoryUrl: string;
  documentationUrl: string;
}

interface GitHubPageData {
  status: string;
  lastDeployed: string;
  branch: string;
  buildTool: string;
  compiler: string;
}

export function GithubPages() {
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>({
    profileUrl: 'https://github.com/jssg33',
    repositoryUrl: 'https://github.com/jssg33/usc242',
    documentationUrl: 'https://jssg33.github.io/usc242'
  });
  
  const [pageData, setPageData] = useState<GitHubPageData>({
    status: 'Active',
    lastDeployed: 'January 30, 2026',
    branch: 'main',
    buildTool: 'GitHub Actions',
    compiler: 'Vite'
  });

  const [projectId, setProjectId] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editingConfig, setEditingConfig] = useState<GitHubConfig | null>(null);
  const [editingPageData, setEditingPageData] = useState<GitHubPageData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    if (savedLoginStatus) {
      setIsLoggedIn(JSON.parse(savedLoginStatus));
    }
  }, []);

  // Load GitHub config from localStorage
  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadGitHubData(config.projectid);
    }
  }, []);

  const loadGitHubData = (projectid: string) => {
    const saved = localStorage.getItem(`github_pages_${projectid}`);
    if (saved) {
      const data = JSON.parse(saved);
      setGithubConfig(data.config);
      setPageData(data.pageData);
    } else {
      // Try to load from old githubConfig for backwards compatibility
      const savedConfig = localStorage.getItem('githubConfig');
      if (savedConfig) {
        setGithubConfig(JSON.parse(savedConfig));
      }
    }
  };

  const saveGitHubData = (config: GitHubConfig, pageDataToSave: GitHubPageData) => {
    if (projectId) {
      const dataToSave = {
        config,
        pageData: pageDataToSave
      };
      localStorage.setItem(`github_pages_${projectId}`, JSON.stringify(dataToSave));
      setGithubConfig(config);
      setPageData(pageDataToSave);
    }
  };

  const handleStartEdit = () => {
    setEditMode(true);
    setEditingConfig({ ...githubConfig });
    setEditingPageData({ ...pageData });
  };

  const handleSaveEdit = () => {
    if (editingConfig && editingPageData) {
      saveGitHubData(editingConfig, editingPageData);
      setEditMode(false);
      setEditingConfig(null);
      setEditingPageData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingConfig(null);
    setEditingPageData(null);
  };

  const githubLinks = [
    {
      label: 'GitHub Profile',
      url: githubConfig.profileUrl,
      description: 'View all repositories and contributions'
    },
    {
      label: 'USC242 Repository',
      url: githubConfig.repositoryUrl,
      description: 'USC242 project source code'
    },
    {
      label: 'Project Documentation',
      url: githubConfig.documentationUrl,
      description: 'Technical documentation and guides'
    }
  ];

  return (
    <div className="flex-1 bg-white p-12 overflow-auto max-[999px]:text-[9pt]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">GitHub Pages</h1>
          <p className="text-lg text-gray-600 mt-2">
            Access your GitHub repositories and deployed pages.
          </p>
        </div>
        {isLoggedIn && (
          <button
            onClick={editMode ? handleSaveEdit : handleStartEdit}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              editMode 
                ? 'bg-[#4CBB17] text-white hover:bg-[#3DA013]' 
                : 'bg-white border-2 border-[#4CBB17] text-[#4CBB17] hover:bg-[#4CBB17]/10'
            }`}
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit Mode
              </>
            )}
          </button>
        )}
      </div>

      {editMode && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Editing Mode:</strong> Update your GitHub configuration and deployment settings. Click "Save Changes" when done or press Cancel to discard changes.
          </p>
          <button
            onClick={handleCancelEdit}
            className="mt-2 px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      )}

      {/* GitHub Links Section */}
      <div className="space-y-6 mb-12">
        {editMode && editingConfig ? (
          <>
            {/* GitHub Profile */}
            <div className="p-6 border-2 border-[#4CBB17] rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">GitHub Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Profile URL</label>
                  <input
                    type="text"
                    value={editingConfig.profileUrl}
                    onChange={(e) => setEditingConfig({ ...editingConfig, profileUrl: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    placeholder="https://github.com/username"
                  />
                </div>
                <p className="text-sm text-gray-600">View all repositories and contributions</p>
              </div>
            </div>

            {/* Repository */}
            <div className="p-6 border-2 border-[#4CBB17] rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">USC242 Repository</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Repository URL</label>
                  <input
                    type="text"
                    value={editingConfig.repositoryUrl}
                    onChange={(e) => setEditingConfig({ ...editingConfig, repositoryUrl: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    placeholder="https://github.com/username/repository"
                  />
                </div>
                <p className="text-sm text-gray-600">USC242 project source code</p>
              </div>
            </div>

            {/* Documentation */}
            <div className="p-6 border-2 border-[#4CBB17] rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">Project Documentation</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Documentation URL (GitHub Pages)</label>
                  <input
                    type="text"
                    value={editingConfig.documentationUrl}
                    onChange={(e) => setEditingConfig({ ...editingConfig, documentationUrl: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    placeholder="https://username.github.io/repository"
                  />
                </div>
                <p className="text-sm text-gray-600">Technical documentation and guides</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {githubLinks.map((link, index) => (
              <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{link.label}</h3>
                    <p className="text-gray-600 mb-3">{link.description}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-2"
                    >
                      {link.url}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Deployment Information Section */}
      <div className="p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-4">GitHub Pages Deployment</h2>
        
        {editMode && editingPageData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editingPageData.status}
                  onChange={(e) => setEditingPageData({ ...editingPageData, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Building">Building</option>
                  <option value="Error">Error</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Deployed</label>
                <input
                  type="text"
                  value={editingPageData.lastDeployed}
                  onChange={(e) => setEditingPageData({ ...editingPageData, lastDeployed: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="January 30, 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <input
                  type="text"
                  value={editingPageData.branch}
                  onChange={(e) => setEditingPageData({ ...editingPageData, branch: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="main"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Build Tool</label>
                <input
                  type="text"
                  value={editingPageData.buildTool}
                  onChange={(e) => setEditingPageData({ ...editingPageData, buildTool: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="GitHub Actions"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Compiler</label>
                <input
                  type="text"
                  value={editingPageData.compiler}
                  onChange={(e) => setEditingPageData({ ...editingPageData, compiler: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="Vite"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Status:</strong> <span className={`${
                pageData.status === 'Active' ? 'text-green-600' : 
                pageData.status === 'Error' ? 'text-red-600' : 
                pageData.status === 'Building' ? 'text-yellow-600' : 
                'text-gray-600'
              }`}>{pageData.status}</span>
            </p>
            <p>
              <strong>Last Deployed:</strong> {pageData.lastDeployed}
            </p>
            <p>
              <strong>Branch:</strong> {pageData.branch}
            </p>
            <p>
              <strong>Build Tool:</strong> {pageData.buildTool}
            </p>
            <p>
              <strong>Compiler:</strong> {pageData.compiler}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}