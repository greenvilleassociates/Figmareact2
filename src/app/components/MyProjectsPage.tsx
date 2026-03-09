import { useState, useEffect } from 'react';
import { FolderKanban, Users, Code, Globe, ExternalLink, Calendar, User, Building2, RefreshCw, AlertCircle, CheckCircle2, Plus, X, Edit } from 'lucide-react';

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
  logoUrl?: string;
}

export function MyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [retrievedProjects, setRetrievedProjects] = useState<any[]>([]); // Raw API response
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    projectname: '',
    instanceid: '',
    githubRepoUrl: '',
    githubPagesUrl: '',
    hostingProviderName: '',
    hostingProviderUrl: ''
  });
  const [editProjectData, setEditProjectData] = useState({
    projectname: '',
    instanceid: '',
    githubRepoUrl: '',
    githubPagesUrl: '',
    hostingProviderName: '',
    hostingProviderUrl: ''
  });

  // Generate random 8-digit number
  const generateRandomId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  // Generate MongoDB ObjectId (24-character hexadecimal string)
  const generateObjectId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
    const randomBytes = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');
    return timestamp + randomBytes;
  };

  // Initialize assignment data with defaults
  const initializeAssignmentData = (projectid: string) => {
    const defaultAssignments: any[] = [];
    for (let i = 1; i <= 20; i++) {
      const assignment = {
        id: i,
        title: `Assignment ${i}`,
        subtitle: `Subtitle for Assignment ${i}`,
        description: `Description for Assignment ${i}`,
        imageUrl: `https://via.placeholder.com/400x300?text=Assignment+${i}`
      };
      defaultAssignments.push(assignment);
      localStorage.setItem(`assignment_${projectid}_${i}`, JSON.stringify(assignment));
    }
  };

  // Initialize project phase data with defaults
  const initializeProjectPhaseData = (projectid: string) => {
    const defaultPhases: any[] = [];
    for (let i = 1; i <= 10; i++) {
      const phase = {
        id: i,
        title: `Project Phase ${i}`,
        subtitle: `Subtitle for Phase ${i}`,
        description: `Description for Phase ${i}`,
        imageUrl: `https://via.placeholder.com/400x300?text=Phase+${i}`
      };
      defaultPhases.push(phase);
      localStorage.setItem(`project_${projectid}_${i}`, JSON.stringify(phase));
    }
  };

  // Fetch projects from API
  const fetchUserProjects = async (userid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api242.onrender.com/api/projects?userid=${userid}`);
      console.log("Projects Response", response);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const userProjects = await response.json();
      console.log("Projects Data", userProjects);
      
      // Get current user's uid for filtering - use from currentUser state for consistency
      const currentUserUid = currentUser?.uid?.toString() || localStorage.getItem('uid');
      console.log("Current User UID:", currentUserUid);
      console.log("Current User from state:", currentUser);
      
      // Map to our Project interface and filter by uid
      const mappedProjects = userProjects
        .filter((p: any) => {
          // Filter to only show projects that match the current user's uid
          const projectUid = p.userid?.toString() || p.uid?.toString();
          const matches = projectUid === currentUserUid;
          if (!matches) {
            console.log(`Filtering out project ${p.projectid || p.id} - uid mismatch (project: ${projectUid}, user: ${currentUserUid})`);
          } else {
            console.log(`Including project ${p.projectid || p.id} - uid matches (project: ${projectUid}, user: ${currentUserUid})`);
          }
          return matches;
        })
        .map((p: any) => {
        console.log('Mapping project:', { _id: p._id, projectid: p.projectid, projectname: p.projectname });
        return {
          id: p._id, // ALWAYS use MongoDB's _id (24-char hex string) from API
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
          companyid: p.companyid,
          logoUrl: p.logoUrl
        };
      });
      
      setProjects(mappedProjects);
      setRetrievedProjects(userProjects); // Store raw API response
      
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

  // Handle create new project
  const handleCreateProject = async () => {
    if (!newProjectData.projectname.trim()) {
      alert('Please enter a project name');
      return;
    }

    setIsCreating(true);
    try {
      // Generate random IDs for project configuration
      const generatedProjectId = generateRandomId();
      const generatedCustomerId = generateRandomId();
      const generatedAccountId = generateRandomId();
      const generatedSubAccountId = generateRandomId();

      // Prepare data for API - create project shell with generated IDs
      // MongoDB will auto-generate the _id field, so we don't include it
      const apiData = {
        userid: currentUser.uid.toString(),
        instanceid: newProjectData.instanceid || generatedProjectId,
        projectname: newProjectData.projectname,
        projectid: generatedProjectId,
        githubRepoUrl: newProjectData.githubRepoUrl || '',
        githubPagesUrl: newProjectData.githubPagesUrl || '',
        hostingProviderName: newProjectData.hostingProviderName || '',
        hostingProviderUrl: newProjectData.hostingProviderUrl || '',
        account: generatedAccountId,
        subaccount: generatedSubAccountId,
        companyid: generatedCustomerId,
        username: currentUser.username || '',
        logoUrl: ''
      };

      console.log('Creating project:', apiData);

      // POST to API
      const response = await fetch('https://api242.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      console.log("Create Project Response", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to create project: ${response.status} - ${errorText}`);
      }

      const createdProject = await response.json();
      console.log('Project created:', createdProject);

      // Initialize default assignment data
      initializeAssignmentData(generatedProjectId);
      
      // Initialize default project phase data
      initializeProjectPhaseData(generatedProjectId);
      
      // Initialize hosting_info JSON for generated project
      const defaultHostingInfo = [
        {
          name: 'Render',
          links: [
            {
              label: 'API Detail',
              url: 'HTTPS://USC242.ONRENDER.COM',
              image: 'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBUEklMjBiYWNrZW5kJTIwc2VydmVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njk5ODIzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
              description: 'Backend API endpoints and server details'
            },
            {
              label: 'API Swagger Documentation',
              url: 'HTTPS://API242.ONRENDER.COM/SWAGGER',
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBUEklMjBkb2N1bWVudGF0aW9uJTIwc3dhZ2dlcnxlbnwxfHx8fDE3Njk5ODIzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
              description: 'Interactive API documentation with Swagger'
            },
            {
              label: 'React App Front Page',
              url: 'HTTPS://REACT242-HO2O.ONRENDER.COM/INDEX.HTML',
              image: 'https://images.unsplash.com/photo-1489436969537-cf0c1dc69cba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjByb290JTIwaG9zdGluZyUyMHNlcnZlcnxlbnwxfHx8fDE3Njk5ODIzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
              description: 'Main React application frontend'
            }
          ]
        },
        {
          name: 'None',
          links: []
        },
        {
          name: 'None',
          links: []
        }
      ];
      localStorage.setItem(`hosting_info_${generatedProjectId}`, JSON.stringify(defaultHostingInfo));
      
      // Initialize github_pages JSON for generated project
      const defaultGitHubPages = {
        config: {
          profileUrl: apiData.githubRepoUrl ? `https://github.com/${apiData.githubRepoUrl.split('/').slice(-2, -1)[0]}` : 'https://github.com/jssg33',
          repositoryUrl: apiData.githubRepoUrl || 'https://github.com/jssg33/usc242',
          documentationUrl: apiData.githubPagesUrl || 'https://jssg33.github.io/usc242'
        },
        pageData: {
          status: 'Active',
          lastDeployed: 'January 30, 2026',
          branch: 'main',
          buildTool: 'GitHub Actions',
          compiler: 'Vite'
        }
      };
      localStorage.setItem(`github_pages_${generatedProjectId}`, JSON.stringify(defaultGitHubPages));

      // Reset form and close modal
      setNewProjectData({
        projectname: '',
        instanceid: '',
        githubRepoUrl: '',
        githubPagesUrl: '',
        hostingProviderName: '',
        hostingProviderUrl: ''
      });
      setIsCreateModalOpen(false);

      // Trigger refresh in Sidebar to update projects list
      window.dispatchEvent(new Event('loginStatusChanged'));

      // Refresh projects list
      fetchUserProjects(currentUser.uid.toString());

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = () => {
    if (selectedProject) {
      setEditProjectData({
        projectname: selectedProject.projectname || '',
        instanceid: selectedProject.instanceid || '',
        githubRepoUrl: selectedProject.githubRepoUrl || '',
        githubPagesUrl: selectedProject.githubPagesUrl || '',
        hostingProviderName: selectedProject.hostingProviderName || '',
        hostingProviderUrl: selectedProject.hostingProviderUrl || ''
      });
      setIsEditModalOpen(true);
    }
  };

  // Handle update project
  const handleUpdateProject = async () => {
    if (!selectedProject || !editProjectData.projectname.trim()) {
      alert('Please enter a project name');
      return;
    }

    setIsUpdating(true);
    try {
      // Prepare data for API update - include project's _id in both URL and body
      // NOTE: selectedProject.id is the PROJECT's MongoDB _id, NOT the user's uid
      const apiData = {
        _id: selectedProject.id, // PROJECT's MongoDB _id (required in body for Express)
        projectid: selectedProject.projectid,
        projectname: editProjectData.projectname,
        instanceid: editProjectData.instanceid || '',
        githubRepoUrl: editProjectData.githubRepoUrl || '',
        githubPagesUrl: editProjectData.githubPagesUrl || '',
        hostingProviderName: editProjectData.hostingProviderName || '',
        hostingProviderUrl: editProjectData.hostingProviderUrl || '',
        // Keep existing values - userid is the USER's uid, not the project _id
        userid: selectedProject.userid,
        username: selectedProject.username,
        account: selectedProject.account,
        subaccount: selectedProject.subaccount,
        companyid: selectedProject.companyid,
        logoUrl: selectedProject.logoUrl || ''
      };

      console.log('Updating project with _id:', selectedProject.id);
      console.log('Request body:', apiData);
      console.log('PUT Payload:', JSON.stringify(apiData, null, 2));

      // PUT to API - using PROJECT's _id in both URL path and body
      const response = await fetch(`https://api242.onrender.com/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      console.log("Update Project Response", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to update project: ${response.status} - ${errorText}`);
      }

      const updatedProject = await response.json();
      console.log('Project updated:', updatedProject);

      // Update github_pages localStorage if URLs changed
      if (selectedProject.projectid) {
        const savedGitHubPages = localStorage.getItem(`github_pages_${selectedProject.projectid}`);
        if (savedGitHubPages) {
          const githubPages = JSON.parse(savedGitHubPages);
          githubPages.config = {
            ...githubPages.config,
            profileUrl: apiData.githubRepoUrl ? `https://github.com/${apiData.githubRepoUrl.split('/').slice(-2, -1)[0]}` : githubPages.config.profileUrl,
            repositoryUrl: apiData.githubRepoUrl || githubPages.config.repositoryUrl,
            documentationUrl: apiData.githubPagesUrl || githubPages.config.documentationUrl
          };
          localStorage.setItem(`github_pages_${selectedProject.projectid}`, JSON.stringify(githubPages));
        }
      }

      // Update current project if this is the active project
      const currentProjectStr = localStorage.getItem('currentProject');
      if (currentProjectStr) {
        const currentProject = JSON.parse(currentProjectStr);
        if (currentProject.projectid === selectedProject.projectid) {
          const updatedCurrentProject = {
            ...currentProject,
            projectname: apiData.projectname,
            instanceid: apiData.instanceid,
            githubRepoUrl: apiData.githubRepoUrl,
            githubPagesUrl: apiData.githubPagesUrl,
            hostingProviderName: apiData.hostingProviderName,
            hostingProviderUrl: apiData.hostingProviderUrl
          };
          localStorage.setItem('currentProject', JSON.stringify(updatedCurrentProject));
        }
      }

      // Close modal
      setIsEditModalOpen(false);

      // Trigger refresh in Sidebar to update projects list
      window.dispatchEvent(new Event('loginStatusChanged'));

      // Refresh projects list
      fetchUserProjects(currentUser.uid.toString());

      // Show success message
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setIsUpdating(false);
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
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Project
            </button>
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
              <div className="flex-shrink-0 bg-white border-t p-8 pt-4 max-h-[60vh] overflow-auto">
                <h2 className="text-base font-bold mb-4">Project Details</h2>
                
                <div className="bg-gradient-to-br from-[#4CBB17]/10 to-white rounded-xl border-2 border-[#4CBB17]/20 p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#4CBB17] rounded-lg flex items-center justify-center">
                        <FolderKanban className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-0.5">{selectedProject.name}</h3>
                        {selectedProject.projectid && (
                          <p className="text-xs text-gray-600">Project ID: {selectedProject.projectid}</p>
                        )}
                      </div>
                    </div>
                    
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Active Project
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* User Information */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-[#4CBB17]" />
                        <h4 className="font-semibold text-xs">Owner Information</h4>
                      </div>
                      {selectedProject.username && (
                        <p className="text-xs mb-1">
                          <span className="text-gray-500">Username:</span>
                          <span className="ml-2 font-medium">{selectedProject.username}</span>
                        </p>
                      )}
                      {selectedProject.userid && (
                        <p className="text-xs">
                          <span className="text-gray-500">User ID:</span>
                          <span className="ml-2 font-medium">{selectedProject.userid}</span>
                        </p>
                      )}
                    </div>

                    {/* Project Information */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FolderKanban className="w-4 h-4 text-[#4CBB17]" />
                        <h4 className="font-semibold text-xs">Project Information</h4>
                      </div>
                      {selectedProject.projectname && (
                        <p className="text-xs mb-1">
                          <span className="text-gray-500">Name:</span>
                          <span className="ml-2 font-medium">{selectedProject.projectname}</span>
                        </p>
                      )}
                      {selectedProject.instanceid && (
                        <p className="text-xs break-all">
                          <span className="text-gray-500">Instance:</span>
                          <span className="ml-2 font-medium text-[10px]">{selectedProject.instanceid}</span>
                        </p>
                      )}
                    </div>

                    {/* Company Information */}
                    {(selectedProject.companyid || selectedProject.account || selectedProject.subaccount) && (
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-[#4CBB17]" />
                          <h4 className="font-semibold text-xs">Organization</h4>
                        </div>
                        {selectedProject.companyid && (
                          <p className="text-xs mb-1">
                            <span className="text-gray-500">Company ID:</span>
                            <span className="ml-2 font-medium">{selectedProject.companyid}</span>
                          </p>
                        )}
                        {selectedProject.account && (
                          <p className="text-xs mb-1">
                            <span className="text-gray-500">Account:</span>
                            <span className="ml-2 font-medium">{selectedProject.account}</span>
                          </p>
                        )}
                        {selectedProject.subaccount && (
                          <p className="text-xs">
                            <span className="text-gray-500">Subaccount:</span>
                            <span className="ml-2 font-medium">{selectedProject.subaccount}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* GitHub Repository */}
                    {selectedProject.githubRepoUrl && (
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="w-4 h-4 text-[#4CBB17]" />
                          <h4 className="font-semibold text-xs">GitHub Repository</h4>
                        </div>
                        <a
                          href={selectedProject.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 break-all"
                        >
                          <span className="truncate">{selectedProject.githubRepoUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}

                    {/* GitHub Pages */}
                    {selectedProject.githubPagesUrl && (
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-[#4CBB17]" />
                          <h4 className="font-semibold text-xs">GitHub Pages</h4>
                        </div>
                        <a
                          href={selectedProject.githubPagesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 break-all"
                        >
                          <span className="truncate">{selectedProject.githubPagesUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}

                    {/* Hosting Provider */}
                    {(selectedProject.hostingProviderName || selectedProject.hostingProviderUrl) && (
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-[#4CBB17]" />
                          <h4 className="font-semibold text-xs">Hosting Provider</h4>
                        </div>
                        {selectedProject.hostingProviderName && (
                          <p className="text-xs mb-1">
                            <span className="text-gray-500">Provider:</span>
                            <span className="ml-2 font-medium">{selectedProject.hostingProviderName}</span>
                          </p>
                        )}
                        {selectedProject.hostingProviderUrl && (
                          <a
                            href={selectedProject.hostingProviderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 break-all"
                          >
                            <span className="truncate">{selectedProject.hostingProviderUrl}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={handleSetActiveProject}
                      className="px-4 py-2 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Set as Active Project
                    </button>
                    
                    {selectedProject.githubRepoUrl && (
                      <a
                        href={selectedProject.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border-2 border-[#4CBB17] text-[#4CBB17] rounded-lg hover:bg-[#4CBB17] hover:text-white transition-colors flex items-center gap-2 text-sm"
                      >
                        <Code className="w-4 h-4" />
                        View on GitHub
                      </a>
                    )}
                    
                    {selectedProject.githubPagesUrl && (
                      <a
                        href={selectedProject.githubPagesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border-2 border-[#4CBB17] text-[#4CBB17] rounded-lg hover:bg-[#4CBB17] hover:text-white transition-colors flex items-center gap-2 text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        View Live Site
                      </a>
                    )}
                    
                    <button
                      onClick={handleOpenEditModal}
                      className="px-4 py-2 border-2 border-[#4CBB17] text-[#4CBB17] rounded-lg hover:bg-[#4CBB17] hover:text-white transition-colors flex items-center gap-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Project
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the details for your new project</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectData.projectname}
                  onChange={(e) => setNewProjectData({ ...newProjectData, projectname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              {/* Instance ID */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Instance ID <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={newProjectData.instanceid}
                  onChange={(e) => setNewProjectData({ ...newProjectData, instanceid: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., jssg33/usc242"
                />
              </div>

              {/* GitHub Repository URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  GitHub Repository URL <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="url"
                  value={newProjectData.githubRepoUrl}
                  onChange={(e) => setNewProjectData({ ...newProjectData, githubRepoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* GitHub Pages URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  GitHub Pages URL <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="url"
                  value={newProjectData.githubPagesUrl}
                  onChange={(e) => setNewProjectData({ ...newProjectData, githubPagesUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://username.github.io/repo"
                />
              </div>

              {/* Hosting Provider Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Hosting Provider Name <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={newProjectData.hostingProviderName}
                  onChange={(e) => setNewProjectData({ ...newProjectData, hostingProviderName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Render, Vercel, Netlify"
                />
              </div>

              {/* Hosting Provider URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Hosting Provider URL <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="url"
                  value={newProjectData.hostingProviderUrl}
                  onChange={(e) => setNewProjectData({ ...newProjectData, hostingProviderUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-app.onrender.com"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={isCreating || !newProjectData.projectname.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Project</h2>
                <p className="text-sm text-gray-500 mt-1">Update the details for your project</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editProjectData.projectname}
                  onChange={(e) => setEditProjectData({ ...editProjectData, projectname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              {/* Instance ID */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Instance ID <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={editProjectData.instanceid}
                  onChange={(e) => setEditProjectData({ ...editProjectData, instanceid: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., jssg33/usc242"
                />
              </div>

              {/* GitHub Repository URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  GitHub Repository URL <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="url"
                  value={editProjectData.githubRepoUrl}
                  onChange={(e) => setEditProjectData({ ...editProjectData, githubRepoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* GitHub Pages URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  GitHub Pages URL <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="url"
                  value={editProjectData.githubPagesUrl}
                  onChange={(e) => setEditProjectData({ ...editProjectData, githubPagesUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://username.github.io/repo"
                />
              </div>

              {/* Hosting Provider Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Hosting Provider Name <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={editProjectData.hostingProviderName}
                  onChange={(e) => setEditProjectData({ ...editProjectData, hostingProviderName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Render, Vercel, Netlify"
                />
              </div>

              {/* Hosting Provider URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Hosting Provider URL <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="url"
                  value={editProjectData.hostingProviderUrl}
                  onChange={(e) => setEditProjectData({ ...editProjectData, hostingProviderUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-app.onrender.com"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProject}
                disabled={isUpdating || !editProjectData.projectname.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Update Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}