import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Github, FolderKanban, Image, RefreshCw, Download, Upload } from 'lucide-react';

interface CustomLink {
  id: string;
  name: string;
  url: string;
  color: string;
  icon: string;
}

interface GitHubConfig {
  profileUrl: string;
  repositoryUrl: string;
  documentationUrl: string;
}

interface Project {
  id: string;
  name: string;
  githubConfig: GitHubConfig;
  instanceid?: string;
  githubRepoUrl?: string;
  githubPagesUrl?: string;
  hostingProviderName?: string;
  hostingProviderUrl?: string;
  account?: string;
  subaccount?: string;
  companyid?: string;
}

interface AssignmentImage {
  id: number;
  imageUrl: string;
}

interface ProjectImage {
  id: number;
  imageUrl: string;
}

interface ProjectConfig {
  projectid: string;
  customerid: string;
  userid: string;
  accountid: string;
  subaccountid: string;
}

interface AssignmentData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

interface ProjectPhaseData {
  id: number;
  phase: string;
  title: string;
  status: string;
  imageUrl: string;
}

export function SettingsPage() {
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [newLink, setNewLink] = useState({ name: '', url: '', color: '#4CBB17', icon: '🔗' });
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>({
    profileUrl: 'https://github.com/jssg33',
    repositoryUrl: 'https://github.com/jssg33/usc242',
    documentationUrl: 'https://jssg33.github.io/usc242'
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    instanceid: '',
    githubRepoUrl: '',
    githubPagesUrl: '',
    hostingProviderName: '',
    hostingProviderUrl: '',
    account: '',
    subaccount: '',
    companyid: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [assignmentImages, setAssignmentImages] = useState<AssignmentImage[]>([]);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    projectid: '',
    customerid: '',
    userid: '',
    accountid: '',
    subaccountid: ''
  });
  const [assignmentData, setAssignmentData] = useState<AssignmentData[]>([]);
  const [projectPhaseData, setProjectPhaseData] = useState<ProjectPhaseData[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number>(1);
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(1);

  // Generate random 8-digit number
  const generateRandomId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('customLinks');
    const savedGithubConfig = localStorage.getItem('githubConfig');
    const savedProjects = localStorage.getItem('projects');
    const savedCurrentProject = localStorage.getItem('currentProject');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const savedAssignmentImages = localStorage.getItem('assignmentImages');
    const savedProjectImages = localStorage.getItem('projectImages');
    const savedProjectConfig = localStorage.getItem('project_config');

    if (savedLinks) setCustomLinks(JSON.parse(savedLinks));
    if (savedGithubConfig) setGithubConfig(JSON.parse(savedGithubConfig));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedCurrentProject) setCurrentProject(JSON.parse(savedCurrentProject));
    if (savedLoginStatus) setIsLoggedIn(JSON.parse(savedLoginStatus));
    if (savedAssignmentImages) setAssignmentImages(JSON.parse(savedAssignmentImages));
    if (savedProjectImages) setProjectImages(JSON.parse(savedProjectImages));
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectConfig(config);
      loadAssignmentData(config.projectid);
      loadProjectPhaseData(config.projectid);
    }
  }, []);

  // Listen for login status changes
  useEffect(() => {
    const handleLoginStatusChange = () => {
      const savedLoginStatus = localStorage.getItem('isLoggedIn');
      const savedCurrentProject = localStorage.getItem('currentProject');
      if (savedLoginStatus) {
        setIsLoggedIn(JSON.parse(savedLoginStatus));
      }
      if (savedCurrentProject) {
        setCurrentProject(JSON.parse(savedCurrentProject));
      } else {
        setCurrentProject(null);
      }
    };

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);
    
    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };
  }, []);

  // Save custom links to localStorage
  const saveCustomLinks = (links: CustomLink[]) => {
    setCustomLinks(links);
    localStorage.setItem('customLinks', JSON.stringify(links));
  };

  // Add new link
  const handleAddLink = () => {
    if (newLink.name && newLink.url) {
      const link: CustomLink = {
        id: Date.now().toString(),
        ...newLink
      };
      saveCustomLinks([...customLinks, link]);
      setNewLink({ name: '', url: '', color: '#4CBB17', icon: '🔗' });
    }
  };

  // Delete link
  const handleDeleteLink = (id: string) => {
    saveCustomLinks(customLinks.filter(link => link.id !== id));
  };

  // Save GitHub config
  const handleSaveGithubConfig = () => {
    localStorage.setItem('githubConfig', JSON.stringify(githubConfig));
    if (currentProject) {
      const updatedProject = { ...currentProject, githubConfig };
      setCurrentProject(updatedProject);
      localStorage.setItem('currentProject', JSON.stringify(updatedProject));
      
      // Update project in projects list
      const updatedProjects = projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      );
      setProjects(updatedProjects);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
    alert('GitHub configuration saved!');
  };

  // Add new project
  const handleAddProject = async () => {
    if (!newProjectForm.name) {
      alert('Project name is required!');
      return;
    }

    try {
      // Get current user from localStorage
      const currentUser = localStorage.getItem('currentUser');
      let userid = '';
      
      if (currentUser) {
        const user = JSON.parse(currentUser);
        // Use uid field from localStorage (which comes from API's userid)
        userid = user.uid?.toString() || '';
      }

      // Prepare data for API
      const apiData = {
        userid,
        instanceid: newProjectForm.instanceid,
        projectname: newProjectForm.name,
        projectid: newProjectForm.name, // projectid = name as specified
        githubRepoUrl: newProjectForm.githubRepoUrl,
        githubPagesUrl: newProjectForm.githubPagesUrl,
        hostingProviderName: newProjectForm.hostingProviderName,
        hostingProviderUrl: newProjectForm.hostingProviderUrl,
        account: newProjectForm.account,
        subaccount: newProjectForm.subaccount,
        companyid: newProjectForm.companyid
      };

      // POST to API
      const response = await fetch('https://api242.onrender.com/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to save project to API: ${response.status} - ${errorText}`);
      }

      // If API call successful, save to localStorage
      const project: Project = {
        id: Date.now().toString(),
        name: newProjectForm.name,
        githubConfig: {
          profileUrl: githubConfig.profileUrl,
          repositoryUrl: newProjectForm.githubRepoUrl || githubConfig.repositoryUrl,
          documentationUrl: newProjectForm.githubPagesUrl || githubConfig.documentationUrl
        },
        instanceid: newProjectForm.instanceid,
        githubRepoUrl: newProjectForm.githubRepoUrl,
        githubPagesUrl: newProjectForm.githubPagesUrl,
        hostingProviderName: newProjectForm.hostingProviderName,
        hostingProviderUrl: newProjectForm.hostingProviderUrl,
        account: newProjectForm.account,
        subaccount: newProjectForm.subaccount,
        companyid: newProjectForm.companyid
      };

      const updatedProjects = [...projects, project];
      setProjects(updatedProjects);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
      // Reset form
      setNewProjectForm({
        name: '',
        instanceid: '',
        githubRepoUrl: '',
        githubPagesUrl: '',
        hostingProviderName: '',
        hostingProviderUrl: '',
        account: '',
        subaccount: '',
        companyid: ''
      });

      // Trigger refresh in Sidebar
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      alert('Project created and saved to API successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    }
  };

  // Select project
  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setGithubConfig(project.githubConfig);
    localStorage.setItem('currentProject', JSON.stringify(project));
    localStorage.setItem('githubConfig', JSON.stringify(project.githubConfig));
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    if (currentProject?.id === id) {
      setCurrentProject(null);
      localStorage.removeItem('currentProject');
    }
  };

  // Update assignment image
  const handleUpdateAssignmentImage = (id: number, imageUrl: string) => {
    const existingIndex = assignmentImages.findIndex(img => img.id === id);
    let updatedImages;
    
    if (existingIndex >= 0) {
      updatedImages = [...assignmentImages];
      updatedImages[existingIndex] = { id, imageUrl };
    } else {
      updatedImages = [...assignmentImages, { id, imageUrl }];
    }
    
    setAssignmentImages(updatedImages);
    localStorage.setItem('assignmentImages', JSON.stringify(updatedImages));
  };

  // Update project image
  const handleUpdateProjectImage = (id: number, imageUrl: string) => {
    const existingIndex = projectImages.findIndex(img => img.id === id);
    let updatedImages;
    
    if (existingIndex >= 0) {
      updatedImages = [...projectImages];
      updatedImages[existingIndex] = { id, imageUrl };
    } else {
      updatedImages = [...projectImages, { id, imageUrl }];
    }
    
    setProjectImages(updatedImages);
    localStorage.setItem('projectImages', JSON.stringify(updatedImages));
  };

  // Login/Logout
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentProject(null);
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    localStorage.removeItem('currentProject');
  };

  // Generate new project configuration
  const handleGenerateProjectConfig = async () => {
    try {
      // Get current user from localStorage
      const currentUser = localStorage.getItem('currentUser');
      let loggedInUserId = '';
      
      if (currentUser) {
        const user = JSON.parse(currentUser);
        // Use uid field from localStorage (which comes from API's userid)
        loggedInUserId = user.uid?.toString() || '';
      }

      if (!loggedInUserId) {
        alert('You must be logged in to generate a project configuration.');
        return;
      }

      // Generate random IDs for project configuration
      const generatedProjectId = generateRandomId();
      const generatedCustomerId = generateRandomId();
      const generatedAccountId = generateRandomId();
      const generatedSubAccountId = generateRandomId();

      // Prepare data for API - create project shell with generated IDs (Method A pattern)
      const apiData = {
        userid: loggedInUserId, // Use actual logged-in user's userid
        instanceid: generatedProjectId, // Use generated projectid as instanceid
        projectname: `Project_${generatedProjectId}`, // Default name with the ID
        projectid: generatedProjectId,
        githubRepoUrl: currentProject?.githubRepoUrl || githubConfig.repositoryUrl || '',
        githubPagesUrl: currentProject?.githubPagesUrl || githubConfig.documentationUrl || '',
        hostingProviderName: currentProject?.hostingProviderName || '',
        hostingProviderUrl: currentProject?.hostingProviderUrl || '',
        account: generatedAccountId,
        subaccount: generatedSubAccountId,
        companyid: generatedCustomerId
      };

      // POST to API
      const response = await fetch('https://api242.onrender.com/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to save project configuration to API: ${response.status} - ${errorText}`);
      }

      // If API call successful, save configuration locally for JSON export purposes
      // Note: userid stored here is the actual logged-in user's userid, not generated
      const newConfig: ProjectConfig = {
        projectid: generatedProjectId,
        customerid: generatedCustomerId,
        userid: loggedInUserId, // Store actual user's userid
        accountid: generatedAccountId,
        subaccountid: generatedSubAccountId
      };

      setProjectConfig(newConfig);
      localStorage.setItem('project_config', JSON.stringify(newConfig));
      
      // Initialize default assignment data
      initializeAssignmentData(newConfig.projectid);
      // Initialize default project phase data
      initializeProjectPhaseData(newConfig.projectid);
      
      // Trigger refresh in Sidebar to update projects list
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      alert('Project configuration generated and saved to API successfully!');
    } catch (error) {
      console.error('Error generating project configuration:', error);
      alert('Error saving to API. Please try again or use manual project creation.');
    }
  };

  // Initialize assignment data with defaults
  const initializeAssignmentData = (projectid: string) => {
    const defaultAssignments: AssignmentData[] = [];
    for (let i = 1; i <= 20; i++) {
      const assignment: AssignmentData = {
        id: i,
        title: `Assignment ${i}`,
        subtitle: `Subtitle for Assignment ${i}`,
        description: `Description for Assignment ${i}`,
        imageUrl: `https://via.placeholder.com/400x300?text=Assignment+${i}`
      };
      defaultAssignments.push(assignment);
      localStorage.setItem(`assignment_${projectid}_${i}`, JSON.stringify(assignment));
    }
    setAssignmentData(defaultAssignments);
  };

  // Initialize project phase data with defaults
  const initializeProjectPhaseData = (projectid: string) => {
    const defaultPhases: ProjectPhaseData[] = [];
    const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'In Progress', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'];
    for (let i = 1; i <= 10; i++) {
      const phase: ProjectPhaseData = {
        id: i,
        phase: `Phase ${toRoman(i)}`,
        title: `Phase ${i} Title`,
        status: statuses[i - 1],
        imageUrl: `https://via.placeholder.com/400x300?text=Phase+${i}`
      };
      defaultPhases.push(phase);
      localStorage.setItem(`project_phase_${projectid}_${i}`, JSON.stringify(phase));
    }
    setProjectPhaseData(defaultPhases);
  };

  // Helper function to convert numbers to Roman numerals
  const toRoman = (num: number): string => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[num - 1] || num.toString();
  };

  // Load assignment data
  const loadAssignmentData = (projectid: string) => {
    const assignments: AssignmentData[] = [];
    for (let i = 1; i <= 20; i++) {
      const saved = localStorage.getItem(`assignment_${projectid}_${i}`);
      if (saved) {
        assignments.push(JSON.parse(saved));
      }
    }
    setAssignmentData(assignments);
  };

  // Load project phase data
  const loadProjectPhaseData = (projectid: string) => {
    const phases: ProjectPhaseData[] = [];
    for (let i = 1; i <= 10; i++) {
      const saved = localStorage.getItem(`project_phase_${projectid}_${i}`);
      if (saved) {
        phases.push(JSON.parse(saved));
      }
    }
    setProjectPhaseData(phases);
  };

  // Update assignment data
  const handleUpdateAssignmentData = (id: number, field: keyof AssignmentData, value: string) => {
    const assignment = assignmentData.find(a => a.id === id);
    if (assignment && projectConfig.projectid) {
      const updated = { ...assignment, [field]: value };
      const updatedData = assignmentData.map(a => a.id === id ? updated : a);
      setAssignmentData(updatedData);
      localStorage.setItem(`assignment_${projectConfig.projectid}_${id}`, JSON.stringify(updated));
    }
  };

  // Update project phase data
  const handleUpdateProjectPhaseData = (id: number, field: keyof ProjectPhaseData, value: string) => {
    const phase = projectPhaseData.find(p => p.id === id);
    if (phase && projectConfig.projectid) {
      const updated = { ...phase, [field]: value };
      const updatedData = projectPhaseData.map(p => p.id === id ? updated : p);
      setProjectPhaseData(updatedData);
      localStorage.setItem(`project_phase_${projectConfig.projectid}_${id}`, JSON.stringify(updated));
    }
  };

  // Export project configuration as JSON
  const handleExportProjectConfig = () => {
    const dataStr = JSON.stringify(projectConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project.json';
    link.click();
  };

  // Export assignment JSON
  const handleExportAssignmentJSON = (id: number) => {
    const assignment = assignmentData.find(a => a.id === id);
    if (assignment && projectConfig.projectid) {
      const dataStr = JSON.stringify(assignment, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectConfig.projectid}a${id}.json`;
      link.click();
    }
  };

  // Export project phase JSON
  const handleExportProjectPhaseJSON = (id: number) => {
    const phase = projectPhaseData.find(p => p.id === id);
    if (phase && projectConfig.projectid) {
      const dataStr = JSON.stringify(phase, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectConfig.projectid}p${id}.json`;
      link.click();
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-[#4CBB17]" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>

        {/* Project Manager Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-[#4CBB17]" />
            Project Manager
          </h2>
          
          {/* Current Project */}
          {currentProject && (
            <div className="mb-6 p-4 bg-[#4CBB17]/10 border-l-4 border-[#4CBB17] rounded">
              <p className="text-sm text-gray-600 mb-1">Current Project</p>
              <p className="text-xl font-semibold text-[#4CBB17]">{currentProject.name}</p>
            </div>
          )}

          {/* Add New Project */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-4">Create New Project</h3>
            <p className="text-sm text-gray-600 mb-4">All project data will be saved to the API at https://api242.onrender.com/projects</p>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                    placeholder="USC242"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instance ID</label>
                  <input
                    type="text"
                    value={newProjectForm.instanceid}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, instanceid: e.target.value })}
                    placeholder="inst-001"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={newProjectForm.githubRepoUrl}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, githubRepoUrl: e.target.value })}
                    placeholder="https://github.com/user/repo"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub Pages URL</label>
                  <input
                    type="text"
                    value={newProjectForm.githubPagesUrl}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, githubPagesUrl: e.target.value })}
                    placeholder="https://user.github.io/repo"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Hosting Provider Name</label>
                  <input
                    type="text"
                    value={newProjectForm.hostingProviderName}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, hostingProviderName: e.target.value })}
                    placeholder="Render, Vercel, etc."
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hosting Provider URL</label>
                  <input
                    type="text"
                    value={newProjectForm.hostingProviderUrl}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, hostingProviderUrl: e.target.value })}
                    placeholder="https://render.com/dashboard"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Account</label>
                  <input
                    type="text"
                    value={newProjectForm.account}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, account: e.target.value })}
                    placeholder="account-name"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sub Account</label>
                  <input
                    type="text"
                    value={newProjectForm.subaccount}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, subaccount: e.target.value })}
                    placeholder="sub-account-name"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company ID</label>
                <input
                  type="text"
                  value={newProjectForm.companyid}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, companyid: e.target.value })}
                  placeholder="company-001"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                />
              </div>
              <button
                onClick={handleAddProject}
                className="w-full px-6 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Create Project & Save to API
              </button>
            </div>
          </div>

          {/* Projects List */}
          {projects.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Available Projects</h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 border rounded flex items-center justify-between ${
                      currentProject?.id === project.id ? 'border-[#4CBB17] bg-[#4CBB17]/5' : 'hover:border-gray-400'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.githubConfig.repositoryUrl}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectProject(project)}
                        className={`px-4 py-1 rounded transition-colors ${
                          currentProject?.id === project.id
                            ? 'bg-[#4CBB17] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {currentProject?.id === project.id ? 'Active' : 'Select'}
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* GitHub Configuration */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Github className="w-6 h-6 text-[#4CBB17]" />
            GitHub Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub Profile URL</label>
              <input
                type="text"
                value={githubConfig.profileUrl}
                onChange={(e) => setGithubConfig({ ...githubConfig, profileUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Repository URL</label>
              <input
                type="text"
                value={githubConfig.repositoryUrl}
                onChange={(e) => setGithubConfig({ ...githubConfig, repositoryUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Documentation URL</label>
              <input
                type="text"
                value={githubConfig.documentationUrl}
                onChange={(e) => setGithubConfig({ ...githubConfig, documentationUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                placeholder="https://username.github.io/repo"
              />
            </div>
            <button
              onClick={handleSaveGithubConfig}
              className="w-full px-6 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors"
            >
              Save GitHub Configuration
            </button>
          </div>
        </div>

        {/* Custom Links for MyLinks Page */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-[#4CBB17]" />
            Manage MyLinks
          </h2>
          
          {/* Add New Link Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-3">Add New Link</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  placeholder="Link Name"
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                />
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="URL"
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={newLink.icon}
                    onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                    placeholder="🔗"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Color</label>
                  <input
                    type="color"
                    value={newLink.color}
                    onChange={(e) => setNewLink({ ...newLink, color: e.target.value })}
                    className="w-full h-10 px-2 py-1 border rounded cursor-pointer"
                  />
                </div>
              </div>
              <button
                onClick={handleAddLink}
                className="w-full px-6 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </div>

          {/* Custom Links List */}
          {customLinks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Custom Links ({customLinks.length})</h3>
              <div className="space-y-2">
                {customLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 border rounded flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: link.color }}
                      >
                        {link.icon}
                      </div>
                      <div>
                        <p className="font-semibold">{link.name}</p>
                        <p className="text-sm text-gray-500">{link.url}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assignment Images */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Image className="w-6 h-6 text-[#4CBB17]" />
            Assignment Images
          </h2>
          <p className="text-sm text-gray-600 mb-4">Customize images for each assignment (1-10)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
              const currentImage = assignmentImages.find(img => img.id === id);
              return (
                <div key={id} className="p-4 border rounded">
                  <label className="block text-sm font-medium mb-2">Assignment {id}</label>
                  <input
                    type="text"
                    value={currentImage?.imageUrl || ''}
                    onChange={(e) => handleUpdateAssignmentImage(id, e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17] text-sm"
                  />
                  {currentImage?.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={currentImage.imageUrl} 
                        alt={`Assignment ${id}`}
                        className="w-full h-24 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Images */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Image className="w-6 h-6 text-[#4CBB17]" />
            Project Phase Images
          </h2>
          <p className="text-sm text-gray-600 mb-4">Customize images for each project phase (1-10)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
              const currentImage = projectImages.find(img => img.id === id);
              return (
                <div key={id} className="p-4 border rounded">
                  <label className="block text-sm font-medium mb-2">Phase {id}</label>
                  <input
                    type="text"
                    value={currentImage?.imageUrl || ''}
                    onChange={(e) => handleUpdateProjectImage(id, e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17] text-sm"
                  />
                  {currentImage?.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={currentImage.imageUrl} 
                        alt={`Phase ${id}`}
                        className="w-full h-24 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Configuration JSON */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#4CBB17]" />
            Project Configuration (project.json)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Generate random 8-digit IDs and create a project shell in the API
          </p>
          
          {!projectConfig.projectid ? (
            <div>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>What happens when you generate:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>Creates random 8-digit IDs for project, customer, user, account, and subaccount</li>
                  <li>POSTs a project shell to <code className="bg-blue-100 px-1 rounded">https://api242.onrender.com/projects</code></li>
                  <li>Initializes 20 assignment templates and 10 project phase templates</li>
                  <li>Saves configuration locally for export and JSON generation</li>
                </ul>
              </div>
              <button
                onClick={handleGenerateProjectConfig}
                className="w-full px-6 py-3 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Generate New Project Configuration & Save to API
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project ID</label>
                  <input
                    type="text"
                    value={projectConfig.projectid}
                    readOnly
                    className="w-full px-4 py-2 border rounded bg-gray-50 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Customer ID</label>
                  <input
                    type="text"
                    value={projectConfig.customerid}
                    readOnly
                    className="w-full px-4 py-2 border rounded bg-gray-50 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">User ID</label>
                  <input
                    type="text"
                    value={projectConfig.userid}
                    readOnly
                    className="w-full px-4 py-2 border rounded bg-gray-50 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account ID</label>
                  <input
                    type="text"
                    value={projectConfig.accountid}
                    readOnly
                    className="w-full px-4 py-2 border rounded bg-gray-50 font-mono text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Sub Account ID</label>
                  <input
                    type="text"
                    value={projectConfig.subaccountid}
                    readOnly
                    className="w-full px-4 py-2 border rounded bg-gray-50 font-mono text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportProjectConfig}
                  className="flex-1 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export project.json
                </button>
                <button
                  onClick={handleGenerateProjectConfig}
                  className="flex-1 px-6 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate IDs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Assignment JSON Management */}
        {projectConfig.projectid && assignmentData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Download className="w-6 h-6 text-[#4CBB17]" />
              Assignment JSON Files ({projectConfig.projectid}a1-a20.json)
            </h2>
            <p className="text-sm text-gray-600 mb-4">Manage assignment data (up to 20 assignments)</p>
            
            {/* Assignment Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Assignment to Edit</label>
              <select
                value={selectedAssignmentId}
                onChange={(e) => setSelectedAssignmentId(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
              >
                {assignmentData.map(a => (
                  <option key={a.id} value={a.id}>Assignment {a.id}</option>
                ))}
              </select>
            </div>

            {/* Assignment Editor */}
            {assignmentData.find(a => a.id === selectedAssignmentId) && (
              <div className="space-y-4 mb-4 p-4 border rounded bg-gray-50">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={assignmentData.find(a => a.id === selectedAssignmentId)?.title || ''}
                    onChange={(e) => handleUpdateAssignmentData(selectedAssignmentId, 'title', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={assignmentData.find(a => a.id === selectedAssignmentId)?.subtitle || ''}
                    onChange={(e) => handleUpdateAssignmentData(selectedAssignmentId, 'subtitle', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={assignmentData.find(a => a.id === selectedAssignmentId)?.description || ''}
                    onChange={(e) => handleUpdateAssignmentData(selectedAssignmentId, 'description', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={assignmentData.find(a => a.id === selectedAssignmentId)?.imageUrl || ''}
                    onChange={(e) => handleUpdateAssignmentData(selectedAssignmentId, 'imageUrl', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                  {assignmentData.find(a => a.id === selectedAssignmentId)?.imageUrl && (
                    <img 
                      src={assignmentData.find(a => a.id === selectedAssignmentId)?.imageUrl} 
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                      }}
                    />
                  )}
                </div>
                <button
                  onClick={() => handleExportAssignmentJSON(selectedAssignmentId)}
                  className="w-full px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export {projectConfig.projectid}a{selectedAssignmentId}.json
                </button>
              </div>
            )}

            {/* Quick Export All */}
            <div className="mt-4 p-4 border rounded bg-blue-50">
              <p className="text-sm font-medium mb-2">Quick Actions</p>
              <div className="flex gap-2 flex-wrap">
                {assignmentData.slice(0, 10).map(a => (
                  <button
                    key={a.id}
                    onClick={() => handleExportAssignmentJSON(a.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    a{a.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project Phase JSON Management */}
        {projectConfig.projectid && projectPhaseData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Download className="w-6 h-6 text-[#4CBB17]" />
              Project Phase JSON Files ({projectConfig.projectid}p1-p10.json)
            </h2>
            <p className="text-sm text-gray-600 mb-4">Manage project phase data (10 phases)</p>
            
            {/* Phase Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Phase to Edit</label>
              <select
                value={selectedPhaseId}
                onChange={(e) => setSelectedPhaseId(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
              >
                {projectPhaseData.map(p => (
                  <option key={p.id} value={p.id}>{p.phase}</option>
                ))}
              </select>
            </div>

            {/* Phase Editor */}
            {projectPhaseData.find(p => p.id === selectedPhaseId) && (
              <div className="space-y-4 mb-4 p-4 border rounded bg-gray-50">
                <div>
                  <label className="block text-sm font-medium mb-2">Phase Name</label>
                  <input
                    type="text"
                    value={projectPhaseData.find(p => p.id === selectedPhaseId)?.phase || ''}
                    onChange={(e) => handleUpdateProjectPhaseData(selectedPhaseId, 'phase', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={projectPhaseData.find(p => p.id === selectedPhaseId)?.title || ''}
                    onChange={(e) => handleUpdateProjectPhaseData(selectedPhaseId, 'title', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={projectPhaseData.find(p => p.id === selectedPhaseId)?.status || ''}
                    onChange={(e) => handleUpdateProjectPhaseData(selectedPhaseId, 'status', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={projectPhaseData.find(p => p.id === selectedPhaseId)?.imageUrl || ''}
                    onChange={(e) => handleUpdateProjectPhaseData(selectedPhaseId, 'imageUrl', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  />
                  {projectPhaseData.find(p => p.id === selectedPhaseId)?.imageUrl && (
                    <img 
                      src={projectPhaseData.find(p => p.id === selectedPhaseId)?.imageUrl} 
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                      }}
                    />
                  )}
                </div>
                <button
                  onClick={() => handleExportProjectPhaseJSON(selectedPhaseId)}
                  className="w-full px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export {projectConfig.projectid}p{selectedPhaseId}.json
                </button>
              </div>
            )}

            {/* Quick Export All */}
            <div className="mt-4 p-4 border rounded bg-blue-50">
              <p className="text-sm font-medium mb-2">Quick Actions</p>
              <div className="flex gap-2 flex-wrap">
                {projectPhaseData.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleExportProjectPhaseJSON(p.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    p{p.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}