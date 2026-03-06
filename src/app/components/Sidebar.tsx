import { Home, Search, FileText, Github, BookOpen, FolderKanban, Files, Settings, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import cockyLogo from 'figma:asset/126053ab73e890e8d5b052524672a0e1d0c2fa4d.png';
import renderLogo from 'figma:asset/8e37ed4b08f466c006fba4657b07905dffc752dd.png';

interface Project {
  id: string;
  name: string;
  userid?: string;
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
  username?: string;
}

export function Sidebar() {
  const location = useLocation();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Fetch projects from API for the logged-in user
  const fetchUserProjects = async (userid: string) => {
    try {
      const response = await fetch(`https://api242.onrender.com/userprojects?userid=${userid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const userProjects = await response.json();
      
      // Map to our Project interface - already filtered by userid from API
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
      
      setUserProjects(mappedProjects);
      
      // Also store in localStorage for Settings page access
      localStorage.setItem('userProjects', JSON.stringify(mappedProjects));
    } catch (error) {
      console.error('Error fetching user projects:', error);
      // Fallback to localStorage if API fails
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        setUserProjects(JSON.parse(savedProjects));
      }
    }
  };
  
  // Load current project and login status from localStorage
  useEffect(() => {
    const savedProject = localStorage.getItem('currentProject');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedProject) {
      setCurrentProject(JSON.parse(savedProject));
    }
    if (savedLoginStatus) {
      setIsLoggedIn(JSON.parse(savedLoginStatus));
    }
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      
      // Fetch projects if logged in
      if (savedLoginStatus && JSON.parse(savedLoginStatus) && user.uid) {
        fetchUserProjects(user.uid.toString());
      }
    }
  }, []);

  // Listen for storage changes to update login status
  useEffect(() => {
    const handleStorageChange = () => {
      const savedLoginStatus = localStorage.getItem('isLoggedIn');
      const savedProject = localStorage.getItem('currentProject');
      const savedUser = localStorage.getItem('currentUser');
      
      if (savedLoginStatus) {
        const loggedIn = JSON.parse(savedLoginStatus);
        setIsLoggedIn(loggedIn);
        
        // Fetch projects when user logs in
        if (loggedIn && savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          if (user.uid) {
            fetchUserProjects(user.uid.toString());
          }
        } else {
          setUserProjects([]);
          setCurrentUser(null);
        }
      }
      
      if (savedProject) {
        setCurrentProject(JSON.parse(savedProject));
      } else {
        setCurrentProject(null);
      }
    };

    // Listen for storage events from other windows
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-window updates
    window.addEventListener('loginStatusChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChanged', handleStorageChange);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentProject(null);
    setUserProjects([]);
    setCurrentUser(null);
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    localStorage.removeItem('currentProject');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProjects');
    window.dispatchEvent(new Event('loginStatusChanged'));
  };
  
  // Handle project selection
  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    localStorage.setItem('currentProject', JSON.stringify(project));
    setIsProjectDropdownOpen(false);
    window.dispatchEvent(new Event('loginStatusChanged'));
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const isRenderPage = location.pathname === '/render-react-info';

  return (
    <div className="h-screen bg-[#4CBB17] text-white flex flex-col" style={{ fontSize: '11pt', width: '248px' }}>
      {/* Logo */}
      <div className="p-6 flex justify-center">
        <div className="bg-white rounded flex items-center justify-center w-[150px] h-[150px]">
          <img 
            src={isRenderPage ? renderLogo : cockyLogo}
            alt={isRenderPage ? "Render Logo" : "University of South Carolina Cocky"}
            className="w-[150px] h-[150px] object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-auto">
        {/* Discover Section */}
        <div className="mb-6">
          <h2 className="text-sm mb-2 px-3">Discover</h2>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <a 
                href="#" 
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10"
              >
                <Search className="w-5 h-5" />
                <span>Browse</span>
              </a>
            </li>
            <li>
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </li>
          </ul>
        </div>

        {/* Library Section */}
        <div>
          <h2 className="text-sm mb-2 px-3">Library</h2>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/personal-pages" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/personal-pages') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>MyLinks</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/assignments" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/assignments') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Assignments</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/projects" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/projects') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <FolderKanban className="w-5 h-5" />
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/documents" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/documents') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <Files className="w-5 h-5" />
                <span>Documents</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/render-react-info" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/render-react-info') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Hosting Information</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/github-pages" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/github-pages') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <Github className="w-5 h-5" />
                <span>Github Pages</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/settings') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6">
        <p className="text-sm font-semibold mb-3">Fusion Project Manager</p>
        
        {/* Project Selector Dropdown */}
        {isLoggedIn && userProjects.length > 0 && (
          <div className="relative mb-2">
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs opacity-75">Active Project:</p>
                <p className="text-sm font-medium truncate">
                  {currentProject ? currentProject.name : 'Select a project...'}
                </p>
              </div>
              <ChevronDown 
                className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${
                  isProjectDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {/* Dropdown Menu */}
            {isProjectDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded shadow-lg max-h-64 overflow-y-auto z-50">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                    Your Projects ({userProjects.length})
                  </div>
                  {userProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors ${
                        currentProject?.id === project.id ? 'bg-[#4CBB17]/10' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800">{project.name}</p>
                      {project.projectid && (
                        <p className="text-xs text-gray-500">ID: {project.projectid}</p>
                      )}
                      {currentProject?.id === project.id && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#4CBB17] text-white text-xs rounded">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* User Info */}
        {isLoggedIn && currentUser && (
          <div className="text-xs opacity-75 mt-2">
            <p>Logged in as:</p>
            <p className="font-medium">{currentUser.username}</p>
          </div>
        )}
        
        {/* No projects message */}
        {isLoggedIn && userProjects.length === 0 && (
          <div className="text-xs opacity-75 mt-2 p-2 bg-white/10 rounded">
            <p>No projects found.</p>
            <p className="mt-1">Create one in Settings!</p>
          </div>
        )}
      </div>
    </div>
  );
}