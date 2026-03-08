import { Link } from 'react-router';
import { User, Heart, Briefcase, GraduationCap, FileText, Building2, UserPlus, LogIn, Shield, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroImage from 'figma:asset/c21f9f8e28cf8c09e6dbf7b8f2c775b59f88ce80.png';

interface Project {
  id: string;
  name: string;
  projectid?: string;
  logoUrl?: string;
}

export function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedLoginStatus && JSON.parse(savedLoginStatus)) {
      setIsLoggedIn(true);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    }

    // Load current project
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      const project = JSON.parse(savedProject);
      setCurrentProject(project);
      
      // Load logo - prioritize project's logoUrl, then localStorage
      const projectid = project.projectid || project.id;
      const projectLogo = project.logoUrl;
      const savedLogo = localStorage.getItem(`${projectid}_logourl`);
      
      if (projectLogo) {
        setLogoUrl(projectLogo);
      } else if (savedLogo) {
        setLogoUrl(savedLogo);
      } else {
        setLogoUrl(heroImage);
      }
    } else {
      setLogoUrl(heroImage);
    }

    // Listen for login status changes
    const handleLoginChange = () => {
      const savedLoginStatus = localStorage.getItem('isLoggedIn');
      const savedUser = localStorage.getItem('currentUser');
      
      if (savedLoginStatus && JSON.parse(savedLoginStatus)) {
        setIsLoggedIn(true);
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };

    window.addEventListener('loginStatusChanged', handleLoginChange);
    return () => window.removeEventListener('loginStatusChanged', handleLoginChange);
  }, []);

  const personalPages = [
    { 
      name: 'About Me', 
      icon: User, 
      path: '/personal-pages/about',
      description: 'Learn more about who I am',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    { 
      name: 'Interests', 
      icon: Heart, 
      path: '/personal-pages/interests',
      description: 'My hobbies and passions',
      color: 'bg-red-50 text-red-600 hover:bg-red-100'
    },
    { 
      name: 'Portfolio', 
      icon: Briefcase, 
      path: '/personal-pages/portfolio',
      description: 'View my work and projects',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
    },
    { 
      name: 'Campus Life', 
      icon: GraduationCap, 
      path: '/personal-pages/usclife',
      description: 'My university experience',
      color: 'bg-green-50 text-green-600 hover:bg-green-100'
    },
    { 
      name: 'Vitae', 
      icon: FileText, 
      path: '/personal-pages/vitae',
      description: 'Professional resume and CV',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    },
    { 
      name: 'Greenville', 
      icon: Building2, 
      path: '/personal-pages/greenville',
      description: 'Corporate page information',
      color: 'bg-teal-50 text-teal-600 hover:bg-teal-100'
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto">
      {/* Hero Image */}
      <div className="w-full mb-12 text-center">
        <img 
          src={heroImage} 
          alt="Fusion Project Manager" 
          className="h-[350px]"
        />
      </div>

      {/* MyLinks Quick Access - Always visible */}
      <div className="bg-gradient-to-br from-[#4CBB17]/10 to-white rounded-xl border-2 border-[#4CBB17]/20 p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">MyLinks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {personalPages.map((page, index) => {
            const Icon = page.icon;
            return (
              <Link
                key={index}
                to={page.path}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-full ${page.color} flex items-center justify-center mb-3 transition-all shadow-sm group-hover:shadow-md`}>
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">
                  {page.name}
                </h3>
                <p className="text-xs text-gray-500">{page.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-br from-[#4CBB17]/10 to-white rounded-xl border-2 border-[#4CBB17]/20 p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/assignments" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Assignments</h3>
            <p className="text-gray-600">View CSCE242 course assignments</p>
          </Link>
          <Link to="/projects" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <p className="text-gray-600">Track project phases and progress</p>
          </Link>
          <Link to="/render-react-info" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Render Hosting</h3>
            <p className="text-gray-600">React project hosting details</p>
          </Link>
          <Link to="/github-pages" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">GitHub Pages</h3>
            <p className="text-gray-600">GitHub deployment information</p>
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/my-projects" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">My Projects</h3>
                <p className="text-gray-600">View and manage all your projects</p>
              </Link>
              <Link to="/team" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Team</h3>
                <p className="text-gray-600">Manage your project team</p>
              </Link>
              <Link to="/milestones" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Milestones</h3>
                <p className="text-gray-600">Track project milestones</p>
              </Link>
              <Link to="/reports" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Reports</h3>
                <p className="text-gray-600">View project reports</p>
              </Link>
              <Link to="/releases" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Releases</h3>
                <p className="text-gray-600">Manage project releases</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Visitor Links - Show if not logged in */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-br from-[#4CBB17]/10 to-white rounded-xl border-2 border-[#4CBB17]/20 p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-[#4CBB17]" />
            Visitor Links
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Register for Project Access */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-[#4CBB17] transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Request Project Access</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Register to request permissions to view a specific project. Once approved by the project owner, you'll have read-only access to view project details.
              </p>
              <Link
                to="/visitor-register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                Register for Access
              </Link>
            </div>

            {/* Fusion Project Manager Login */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-[#4CBB17] transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#4CBB17] rounded-lg flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Project Manager Login</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Log in to access full project management features including editing, team management, milestones, and all administrative controls.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Login to Fusion PM
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">About Access Levels</h4>
                <p className="text-sm text-blue-800">
                  <strong>Visitor Access:</strong> View-only permissions for specific projects after approval. 
                  <strong className="ml-2">Manager Access:</strong> Full project management capabilities including editing, team management, and administrative features.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}