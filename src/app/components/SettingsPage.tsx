import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Github, FolderKanban, LogIn, LogOut } from 'lucide-react';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('customLinks');
    const savedGithubConfig = localStorage.getItem('githubConfig');
    const savedProjects = localStorage.getItem('projects');
    const savedCurrentProject = localStorage.getItem('currentProject');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');

    if (savedLinks) setCustomLinks(JSON.parse(savedLinks));
    if (savedGithubConfig) setGithubConfig(JSON.parse(savedGithubConfig));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedCurrentProject) setCurrentProject(JSON.parse(savedCurrentProject));
    if (savedLoginStatus) setIsLoggedIn(JSON.parse(savedLoginStatus));
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
  const handleAddProject = () => {
    if (newProjectName) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        githubConfig: { ...githubConfig }
      };
      const updatedProjects = [...projects, project];
      setProjects(updatedProjects);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setNewProjectName('');
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

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-[#4CBB17]" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>

        {/* Login Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <LogIn className="w-6 h-6 text-[#4CBB17]" />
            Authentication
          </h2>
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Logged In
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
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
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Add New Project</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project Name"
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
              />
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
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
        <div className="bg-white rounded-lg shadow p-6">
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
      </div>
    </div>
  );
}
