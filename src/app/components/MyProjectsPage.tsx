import { useState, useEffect } from 'react';
import { FolderKanban, Users, Code, Globe, ExternalLink, Calendar, User, Building2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  userid?: string;
  username?: string;
  instanceid?: string;
  projectid?: string;
  projectname?: string;
  githubRepoUrl?: string;
  githubPagesUrl?: string;
  hostingProviderName?: string;
  hostingProviderUrl?: string;
  account?: string;
  subaccount?: string;
  companyid?: string;
}

export function MyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch projects from API
  const fetchUserProjects = async (userid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api242.onrender.com/userprojects?userid=${userid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const userProjects = await response.json();
      
      // Map to our Project interface
      const mappedProjects = userProjects.map((p: any) => ({
        id: p.id || p.projectid || Date.now().toString(),
        name: p.projectname || p.name || `Project ${p.projectid}`,
        userid: p.userid,
        username: p.username,
        projectid: p.projectid,
        projectname: p.projectname,
        instanceid: p.instanceid,
        githubRepoUrl: p.githubRepoUrl,
        githubPagesUrl: p.githubPagesUrl,
        hostingProviderName: p.hostingProviderName,
        hostingProviderUrl: p.hostingProviderUrl,
        account: p.account,
        subaccount: p.subaccount,
        companyid: p.companyid
      }));
      
      setProjects(mappedProjects);
      
      // Auto-select first project if none selected
      if (mappedProjects.length > 0 && !selectedProject) {
        setSelectedProject(mappedProjects[0]);
      }
      
      // Also store in localStorage for other pages
      localStorage.setItem('userProjects', JSON.stringify(mappedProjects));
    } catch (error) {
      console.error('Error fetching user projects:', error);
      setError('Failed to load projects. Please try again.');
      
      // Fallback to localStorage if API fails
      const savedProjects = localStorage.getItem('userProjects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed);
        if (parsed.length > 0 && !selectedProject) {
          setSelectedProject(parsed[0]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load user and projects on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    
    if (savedUser && savedLoginStatus && JSON.parse(savedLoginStatus)) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      
      if (user.uid) {
        fetchUserProjects(user.uid.toString());
      }
    } else {
      setIsLoading(false);
      setError('Please log in to view your projects');
    }

    // Load active project ID
    const activeProject = localStorage.getItem('currentProject');
    if (activeProject) {
      const parsed = JSON.parse(activeProject);
      setActiveProjectId(parsed.projectid || parsed.id);
    }
  }, []);

  // Handle project selection
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  // Handle setting active project
  const handleSetActiveProject = () => {
    if (selectedProject) {
      localStorage.setItem('currentProject', JSON.stringify(selectedProject));
      setActiveProjectId(selectedProject.projectid || selectedProject.id);
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (currentUser?.uid) {
      fetchUserProjects(currentUser.uid.toString());
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-12 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-[#4CBB17] mx-auto mb-4" />
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && projects.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 p-12 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load Projects</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-semibold">Active Project Updated!</p>
              <p className="text-sm">All detail pages will now use this project's data.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b px-12 py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Projects</h1>
            <p className="text-gray-500">
              {currentUser?.username && `Showing projects for ${currentUser.username}`}
              {projects.length > 0 && ` • ${projects.length} ${projects.length === 1 ? 'project' : 'projects'} found`}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {projects.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center max-w-md">
              <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Projects Yet</h2>
              <p className="text-gray-600 mb-6">
                You don't have any projects yet. Create one in the Settings page to get started.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Top Section - Project Grid */}
            <div className="flex-1 overflow-auto p-12 pb-6">
              <h2 className="text-xl font-bold mb-4">Select a Project</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project) => {
                  const isSelected = selectedProject?.id === project.id;
                  const isActive = (project.projectid || project.id) === activeProjectId;
                  
                  return (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`text-left p-6 rounded-lg border-2 transition-all hover:shadow-lg relative ${
                        isSelected
                          ? 'border-[#4CBB17] bg-[#4CBB17]/5 shadow-md'
                          : 'border-gray-200 bg-white hover:border-[#4CBB17]/50'
                      }`}
                    >
                      {/* Active Project Badge */}
                      {isActive && (
                        <div className="absolute -top-2 -right-2 bg-[#4CBB17] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3 h-3" />
                          ACTIVE
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[#4CBB17]' : isActive ? 'bg-[#4CBB17]/30' : 'bg-gray-100'
                        }`}>
                          <FolderKanban className={`w-6 h-6 ${isSelected ? 'text-white' : isActive ? 'text-[#4CBB17]' : 'text-gray-600'}`} />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-[#4CBB17]" />
                        )}
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 truncate" title={project.name}>
                        {project.name}
                      </h3>
                      
                      {project.projectid && (
                        <p className="text-sm text-gray-500 mb-1">
                          ID: {project.projectid}
                        </p>
                      )}
                      
                      {project.instanceid && (
                        <p className="text-xs text-gray-400 truncate" title={project.instanceid}>
                          Instance: {project.instanceid}
                        </p>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-500">
                        {project.githubRepoUrl && (
                          <div className="flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            <span>GitHub</span>
                          </div>
                        )}
                        {project.hostingProviderName && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>{project.hostingProviderName}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section - Project Details */}
            {selectedProject && (
              <div className="flex-shrink-0 bg-white border-t p-12 pt-6">
                <h2 className="text-xl font-bold mb-6">Project Details</h2>
                
                <div className="bg-gradient-to-br from-[#4CBB17]/10 to-white rounded-xl border-2 border-[#4CBB17]/20 p-8 shadow-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#4CBB17] rounded-lg flex items-center justify-center">
                        <FolderKanban className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{selectedProject.name}</h3>
                        {selectedProject.projectid && (
                          <p className="text-gray-600">Project ID: {selectedProject.projectid}</p>
                        )}
                      </div>
                    </div>
                    
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active Project
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Information */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-5 h-5 text-[#4CBB17]" />
                        <h4 className="font-semibold">Owner Information</h4>
                      </div>
                      {selectedProject.username && (
                        <p className="text-sm mb-1">
                          <span className="text-gray-500">Username:</span>
                          <span className="ml-2 font-medium">{selectedProject.username}</span>
                        </p>
                      )}
                      {selectedProject.userid && (
                        <p className="text-sm">
                          <span className="text-gray-500">User ID:</span>
                          <span className="ml-2 font-medium">{selectedProject.userid}</span>
                        </p>
                      )}
                    </div>

                    {/* Project Information */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FolderKanban className="w-5 h-5 text-[#4CBB17]" />
                        <h4 className="font-semibold">Project Information</h4>
                      </div>
                      {selectedProject.projectname && (
                        <p className="text-sm mb-1">
                          <span className="text-gray-500">Name:</span>
                          <span className="ml-2 font-medium">{selectedProject.projectname}</span>
                        </p>
                      )}
                      {selectedProject.instanceid && (
                        <p className="text-sm break-all">
                          <span className="text-gray-500">Instance:</span>
                          <span className="ml-2 font-medium text-xs">{selectedProject.instanceid}</span>
                        </p>
                      )}
                    </div>

                    {/* Company Information */}
                    {(selectedProject.companyid || selectedProject.account || selectedProject.subaccount) && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="w-5 h-5 text-[#4CBB17]" />
                          <h4 className="font-semibold">Organization</h4>
                        </div>
                        {selectedProject.companyid && (
                          <p className="text-sm mb-1">
                            <span className="text-gray-500">Company ID:</span>
                            <span className="ml-2 font-medium">{selectedProject.companyid}</span>
                          </p>
                        )}
                        {selectedProject.account && (
                          <p className="text-sm mb-1">
                            <span className="text-gray-500">Account:</span>
                            <span className="ml-2 font-medium">{selectedProject.account}</span>
                          </p>
                        )}
                        {selectedProject.subaccount && (
                          <p className="text-sm">
                            <span className="text-gray-500">Subaccount:</span>
                            <span className="ml-2 font-medium">{selectedProject.subaccount}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* GitHub Repository */}
                    {selectedProject.githubRepoUrl && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Code className="w-5 h-5 text-[#4CBB17]" />
                          <h4 className="font-semibold">GitHub Repository</h4>
                        </div>
                        <a
                          href={selectedProject.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 break-all"
                        >
                          <span className="truncate">{selectedProject.githubRepoUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}

                    {/* GitHub Pages */}
                    {selectedProject.githubPagesUrl && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="w-5 h-5 text-[#4CBB17]" />
                          <h4 className="font-semibold">GitHub Pages</h4>
                        </div>
                        <a
                          href={selectedProject.githubPagesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 break-all"
                        >
                          <span className="truncate">{selectedProject.githubPagesUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}

                    {/* Hosting Provider */}
                    {(selectedProject.hostingProviderName || selectedProject.hostingProviderUrl) && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="w-5 h-5 text-[#4CBB17]" />
                          <h4 className="font-semibold">Hosting Provider</h4>
                        </div>
                        {selectedProject.hostingProviderName && (
                          <p className="text-sm mb-1">
                            <span className="text-gray-500">Provider:</span>
                            <span className="ml-2 font-medium">{selectedProject.hostingProviderName}</span>
                          </p>
                        )}
                        {selectedProject.hostingProviderUrl && (
                          <a
                            href={selectedProject.hostingProviderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 break-all"
                          >
                            <span className="truncate">{selectedProject.hostingProviderUrl}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                    <button
                      onClick={handleSetActiveProject}
                      className="px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Set as Active Project
                    </button>
                    
                    {selectedProject.githubRepoUrl && (
                      <a
                        href={selectedProject.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border-2 border-[#4CBB17] text-[#4CBB17] rounded-lg hover:bg-[#4CBB17] hover:text-white transition-colors flex items-center gap-2"
                      >
                        <Code className="w-5 h-5" />
                        View on GitHub
                      </a>
                    )}
                    
                    {selectedProject.githubPagesUrl && (
                      <a
                        href={selectedProject.githubPagesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border-2 border-[#4CBB17] text-[#4CBB17] rounded-lg hover:bg-[#4CBB17] hover:text-white transition-colors flex items-center gap-2"
                      >
                        <Globe className="w-5 h-5" />
                        View Live Site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}