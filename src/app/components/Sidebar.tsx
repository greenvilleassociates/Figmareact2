import { Home, Search, FileText, Github, BookOpen, FolderKanban, Files, Settings, LogIn, LogOut, ChevronDown, FileBarChart, Package, Users, Calendar, Edit3, Save, X, HeartHandshake } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import fusionLogo from 'figma:asset/aac5dfb9d0371a7143ad719802888a30e3ea5aed.png';
import { NavIconEditor } from './NavIconEditor';

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
  logoUrl?: string;
}

interface SidebarProps {
  onNavigate?: () => void;
}

interface NavItem {
  key: string;
  label: string;
  path: string;
  defaultIcon: any;
  section: 'discover' | 'library';
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customIcons, setCustomIcons] = useState<Record<string, string>>({});
  const [isIconEditorOpen, setIsIconEditorOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<{ key: string; label: string } | null>(null);
  const [sidebarColor, setSidebarColor] = useState('#006622');
  const [customLogoUrl, setCustomLogoUrl] = useState('');

  // Define all nav items
  const navItems: NavItem[] = [
    { key: 'home', label: 'Home', path: '/', defaultIcon: Home, section: 'discover' },
    { key: 'myprojects', label: 'MyProjects', path: '/my-projects', defaultIcon: FolderKanban, section: 'discover' },
    { key: 'browse', label: 'Browse', path: '#', defaultIcon: Search, section: 'discover' },
    { key: 'care', label: 'Care', path: '/care', defaultIcon: HeartHandshake, section: 'discover' },
    { key: 'mylinks', label: 'MyLinks', path: '/personal-pages', defaultIcon: FileText, section: 'library' },
    { key: 'assignments', label: 'Assignments', path: '/assignments', defaultIcon: BookOpen, section: 'library' },
    { key: 'projects', label: 'Project Details', path: '/projects', defaultIcon: FolderKanban, section: 'library' },
    { key: 'documents', label: 'Documents', path: '/documents', defaultIcon: Files, section: 'library' },
    { key: 'hosting', label: 'Hosting Information', path: '/render-react-info', defaultIcon: FileText, section: 'library' },
    { key: 'github', label: 'Github Pages', path: '/github-pages', defaultIcon: Github, section: 'library' },
    { key: 'reports', label: 'Reports', path: '/reports', defaultIcon: FileBarChart, section: 'library' },
    { key: 'releases', label: 'Releases', path: '/releases', defaultIcon: Package, section: 'library' },
    { key: 'team', label: 'Team', path: '/team', defaultIcon: Users, section: 'library' },
    { key: 'milestones', label: 'Milestones', path: '/milestones', defaultIcon: Calendar, section: 'library' },
    { key: 'settings', label: 'Settings', path: '/settings', defaultIcon: Settings, section: 'library' },
  ];

  // Load custom icons from localStorage
  useEffect(() => {
    if (currentProject) {
      const projectid = currentProject.projectid || currentProject.id;
      const savedIcons = localStorage.getItem(`${projectid}_navicons`);
      if (savedIcons) {
        setCustomIcons(JSON.parse(savedIcons));
      } else {
        setCustomIcons({});
      }
      
      // Load sidebar color
      const savedColor = localStorage.getItem(`${projectid}_sidebarcolor`);
      if (savedColor) {
        setSidebarColor(savedColor);
      } else {
        setSidebarColor('#006622');
      }
      
      // Load custom logo - prioritize project's logoUrl, then localStorage
      const projectLogo = currentProject.logoUrl;
      const savedLogo = localStorage.getItem(`${projectid}_logourl`);
      
      if (projectLogo) {
        setCustomLogoUrl(projectLogo);
      } else if (savedLogo) {
        setCustomLogoUrl(savedLogo);
      } else {
        setCustomLogoUrl('');
      }
    } else {
      setCustomIcons({});
      setSidebarColor('#006622');
      setCustomLogoUrl('');
    }
  }, [currentProject]);

  // Save custom icons to localStorage
  const saveCustomIcon = (iconKey: string, imageUrl: string) => {
    if (!currentProject) return;
    
    const projectid = currentProject.projectid || currentProject.id;
    const updatedIcons = { ...customIcons, [iconKey]: imageUrl };
    
    setCustomIcons(updatedIcons);
    localStorage.setItem(`${projectid}_navicons`, JSON.stringify(updatedIcons));
  };

  // Open icon editor
  const openIconEditor = (key: string, label: string) => {
    setEditingIcon({ key, label });
    setIsIconEditorOpen(true);
  };

  // Close icon editor
  const closeIconEditor = () => {
    setIsIconEditorOpen(false);
    setEditingIcon(null);
  };

  // Render icon (custom or default)
  const renderIcon = (item: NavItem) => {
    const customIconUrl = customIcons[item.key];
    
    if (customIconUrl) {
      return (
        <img 
          src={customIconUrl} 
          alt={item.label}
          className="w-5 h-5 object-contain"
        />
      );
    }
    
    const IconComponent = item.defaultIcon;
    return <IconComponent className="w-5 h-5" />;
  };
  
  // Fetch projects from API for the logged-in user
  const fetchUserProjects = async (userid: string) => {
    try {
      const response = await fetch(`https://api242.onrender.com/api/projects?userid=${userid}`);
      console.log("Projects Response", response);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const userProjects = await response.json();
      console.log("Projects Data", userProjects);
      
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
        companyid: p.companyid,
        logoUrl: p.logoUrl
      }));
      
      setUserProjects(mappedProjects);
      localStorage.setItem('userProjects', JSON.stringify(mappedProjects));
    } catch (error) {
      console.error('Error fetching user projects:', error);
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

    window.addEventListener('storage', handleStorageChange);
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

  // Filter nav items by section
  const discoverItems = navItems.filter(item => item.section === 'discover');
  const libraryItems = navItems.filter(item => item.section === 'library');

  return (
    <>
      <div className="h-screen text-white flex flex-col" style={{ fontSize: '11pt', width: '248px', backgroundColor: sidebarColor }}>
        {/* Logo */}
        <div className="px-3 pt-3 mb-[30px]">
          <div className="bg-white rounded flex items-center justify-center w-full h-[185px]">
            <img 
              src={customLogoUrl || (isRenderPage ? fusionLogo : fusionLogo)}
              alt={customLogoUrl ? "Custom Logo" : (isRenderPage ? "Fusion Logo" : "Fusion Logo")}
              className="w-full h-full object-cover px-2"
              onError={(e) => {
                // Fallback to default logo if custom logo fails to load
                e.currentTarget.src = isRenderPage ? fusionLogo : fusionLogo;
              }}
            />
          </div>
        </div>

        {/* Edit Mode Toggle */}
        {isLoggedIn && currentProject && (
          <div className="px-4 mb-1">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded transition-all text-sm ${
                isEditMode 
                  ? 'bg-white font-semibold' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              style={isEditMode ? { color: sidebarColor } : {}}
            >
              {isEditMode ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Done Editing</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Icons</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-auto">
          {/* Discover Section */}
          <div className="mb-3">
            <h2 className="text-xs mb-1.5 px-3 opacity-75">Discover</h2>
            <ul className="space-y-0.5">
              {discoverItems.map((item) => (
                <li key={item.key} className="relative group">
                  {item.path === '#' ? (
                    <a 
                      href={item.path} 
                      onClick={onNavigate}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded hover:bg-white/10 text-sm ${
                        isEditMode ? 'pr-10' : ''
                      }`}
                    >
                      {renderIcon(item)}
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link 
                      to={item.path} 
                      onClick={onNavigate}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded text-sm ${
                        isActive(item.path) ? 'bg-white text-black' : 'hover:bg-white/10'
                      } ${isEditMode ? 'pr-10' : ''}`}
                    >
                      {renderIcon(item)}
                      <span>{item.label}</span>
                    </Link>
                  )}
                  
                  {/* Edit Button */}
                  {isEditMode && (
                    <button
                      onClick={() => openIconEditor(item.key, item.label)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/20 hover:bg-white/30 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit icon"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </li>
              ))}
              
              {/* Login/Logout */}
              <li>
                {!isLoggedIn ? (
                  <Link
                    to="/login"
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-3 py-1.5 rounded hover:bg-white/10 text-sm"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      onNavigate?.();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-1.5 rounded hover:bg-white/10 text-left text-sm"
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
            <h2 className="text-xs mb-1.5 px-3 opacity-75">Library</h2>
            <ul className="space-y-0.5">
              {libraryItems.map((item) => (
                <li key={item.key} className="relative group">
                  <Link 
                    to={item.path} 
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded text-sm ${
                      isActive(item.path) ? 'bg-white text-black' : 'hover:bg-white/10'
                    } ${isEditMode ? 'pr-10' : ''}`}
                  >
                    {renderIcon(item)}
                    <span>{item.label}</span>
                  </Link>
                  
                  {/* Edit Button */}
                  {isEditMode && (
                    <button
                      onClick={() => openIconEditor(item.key, item.label)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/20 hover:bg-white/30 rounded opacity-opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit icon"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4">
          <div className="text-center mb-3">
            <p className="text-xs font-semibold mb-1">Fusion Project Manager 26.02</p>
            <p className="text-xs opacity-75 italic">Perspectives Altered, Progress Achieved</p>
          </div>
          
          {/* Project Selector Dropdown */}
          {isLoggedIn && userProjects.length > 0 && (
            <div className="relative mb-2">
              <button
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-75">Active Project:</p>
                  <p className="text-xs font-medium truncate">
                    {currentProject ? currentProject.name : 'Select a project...'}
                  </p>
                </div>
                <ChevronDown 
                  className={`w-3.5 h-3.5 ml-2 flex-shrink-0 transition-transform ${
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

      {/* Icon Editor Modal */}
      {editingIcon && (
        <NavIconEditor
          isOpen={isIconEditorOpen}
          onClose={closeIconEditor}
          iconKey={editingIcon.key}
          iconLabel={editingIcon.label}
          currentIcon={customIcons[editingIcon.key] || null}
          onSave={saveCustomIcon}
        />
      )}
    </>
  );
}