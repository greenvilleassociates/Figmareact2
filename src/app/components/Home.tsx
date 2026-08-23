import { Link } from 'react-router';
import { User, Heart, Briefcase, GraduationCap, FileText, Building2, UserPlus, LogIn, Shield, Eye, AlertCircle, BookOpen, Award, Image as ImageIcon, Trophy, TrendingUp, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroImage from 'figma:asset/c21f9f8e28cf8c09e6dbf7b8f2c775b59f88ce80.png';
import cockyLogo from '../../imports/cocky.png';

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
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [enabledPages, setEnabledPages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('currentUser');
    const guestMode = localStorage.getItem('isGuestMode');

    if (savedLoginStatus && JSON.parse(savedLoginStatus)) {
      setIsLoggedIn(true);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    }
    if (guestMode && JSON.parse(guestMode)) setIsGuestMode(true);

    const pageDefaults = {
      about: true, interests: true, portfolio: true, usclife: true, vitae: true,
      greenville: true, publications: true, awards: true, certifications: true,
      picturewall: true, trophies: true, matransactions: true, capitoltechnology: true,
      usc: true, upenn: true, umich: true, udel: true, uncw: true,
      utexas: true, odu: true, wm: true
    };

    const savedEnabledPages = localStorage.getItem('enabledPersonalPages');
    if (savedEnabledPages) {
      setEnabledPages({ ...pageDefaults, ...JSON.parse(savedEnabledPages) });
    } else {
      setEnabledPages(pageDefaults);
    }

    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      const project = JSON.parse(savedProject);
      setCurrentProject(project);
      const projectid = project.projectid || project.id;
      const savedLogo = localStorage.getItem(`${projectid}_logourl`);
      setLogoUrl(project.logoUrl || savedLogo || heroImage);
    } else {
      setLogoUrl(heroImage);
    }

    const handleLoginChange = () => {
      const status = localStorage.getItem('isLoggedIn');
      const user = localStorage.getItem('currentUser');
      const guest = localStorage.getItem('isGuestMode');
      if (status && JSON.parse(status)) {
        setIsLoggedIn(true);
        if (user) setCurrentUser(JSON.parse(user));
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setIsGuestMode(!!(guest && JSON.parse(guest)));
    };

    window.addEventListener('loginStatusChanged', handleLoginChange);
    return () => window.removeEventListener('loginStatusChanged', handleLoginChange);
  }, []);

  const personalPages = [
    { key: 'about', name: 'About Me', icon: User, path: '/personal-pages/about', description: 'Learn more about who I am', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { key: 'interests', name: 'Interests', icon: Heart, path: '/personal-pages/interests', description: 'My hobbies and passions', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
    { key: 'portfolio', name: 'Portfolio', icon: Briefcase, path: '/personal-pages/portfolio', description: 'View my work and projects', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
    { key: 'usclife', name: 'Campus Life', icon: GraduationCap, path: '/personal-pages/usclife', description: 'My university experience', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
    { key: 'vitae', name: 'Vitae', icon: FileText, path: '/personal-pages/vitae', description: 'Professional resume and CV', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
    { key: 'publications', name: 'Publications', icon: BookOpen, path: '/personal-pages/publications', description: 'Books and research articles', color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
    { key: 'awards', name: 'Awards', icon: Award, path: '/personal-pages/awards', description: 'Recognition and achievements', color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
    { key: 'certifications', name: 'Certifications', icon: Shield, path: '/personal-pages/certifications', description: 'Professional credentials', color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100' },
    { key: 'picturewall', name: 'Picture Wall', icon: ImageIcon, path: '/personal-pages/picturewall', description: 'Visual gallery', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
    { key: 'trophies', name: 'Trophies', icon: Trophy, path: '/personal-pages/trophies', description: 'Competitive achievements', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
    { key: 'matransactions', name: 'M&A Transactions', icon: TrendingUp, path: '/personal-pages/matransactions', description: 'Mergers & acquisitions', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
  ];

  const corporatePages = [
    { key: 'greenville', name: 'Greenville', icon: Building2, path: '/personal-pages/greenville', description: 'Corporate page information', color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
    { key: 'capitoltechnology', name: 'Capitol Technology', icon: Building2, path: '/personal-pages/capitoltechnology', description: 'Corporate technology page', color: 'bg-slate-50 text-slate-600 hover:bg-slate-100' },
    { key: 'usc', name: 'University of South Carolina', icon: GraduationCap, path: '/personal-pages/usc', description: 'Go Gamecocks!', color: 'bg-red-50 text-red-800 hover:bg-red-100', logoUrl: cockyLogo },
    { key: 'upenn', name: 'University of Pennsylvania', icon: GraduationCap, path: '/personal-pages/upenn', description: 'Quakers · Philadelphia, PA', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
    { key: 'umich', name: 'University of Michigan', icon: GraduationCap, path: '/personal-pages/umich', description: 'Wolverines · Ann Arbor, MI', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
    { key: 'udel', name: 'University of Delaware', icon: GraduationCap, path: '/personal-pages/udel', description: 'Blue Hens · Newark, DE', color: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
    { key: 'uncw', name: 'UNC Wilmington', icon: GraduationCap, path: '/personal-pages/uncw', description: 'Seahawks · Wilmington, NC', color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
    { key: 'utexas', name: 'University of Texas', icon: GraduationCap, path: '/personal-pages/utexas', description: 'Longhorns · Austin, TX', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
    { key: 'odu', name: 'Old Dominion University', icon: GraduationCap, path: '/personal-pages/odu', description: 'Monarchs · Norfolk, VA', color: 'bg-blue-50 text-blue-800 hover:bg-blue-100' },
    { key: 'wm', name: 'William & Mary', icon: GraduationCap, path: '/personal-pages/wm', description: 'Tribe · Williamsburg, VA', color: 'bg-green-50 text-green-800 hover:bg-green-100' },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto">
      <div className="w-full mb-12 text-center">
        <img src={heroImage} alt="Fusion Project Manager" className="h-[350px]" />
      </div>

      {currentProject && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            (currentProject as any).type === 'public'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            <Globe className="w-3.5 h-3.5" />
            {(currentProject as any).type === 'public' ? 'Public Project' : 'Project'}
            {' '}· ID {currentProject.projectid || currentProject.id}
          </span>
          {(currentProject as any).username && (
            <span className="text-xs text-gray-400">{(currentProject as any).username}'s site</span>
          )}
        </div>
      )}

      {isGuestMode && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Guest Mode - Read-Only Access</h3>
              <p className="text-amber-800 mb-3">You are currently viewing this site in guest mode with read-only permissions.</p>
              <div className="flex gap-3">
                <Link to="/login" className="inline-flex items-center gap-2 px-4 py-2 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors text-sm font-semibold">
                  <LogIn className="w-4 h-4" />Login for Full Access
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-amber-300 text-amber-900 rounded-lg hover:bg-amber-50 transition-colors text-sm font-semibold">
                  <UserPlus className="w-4 h-4" />Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MyLinks */}
      <div className="bg-gradient-to-br from-[#4CBB17]/10 to-white rounded-xl border-2 border-[#4CBB17]/20 p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">MyLinks</h2>
          <Link to="/personal-pages" className="text-sm text-[#4CBB17] hover:text-[#3DA013] font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {personalPages.filter(page => enabledPages[page.key] ?? true).map((page, index) => {
            const Icon = page.icon;
            return (
              <Link key={index} to={page.path} className="flex flex-col items-center text-center group">
                <div className={`w-20 h-20 rounded-full ${page.color} flex items-center justify-center mb-3 transition-all shadow-sm group-hover:shadow-md`}>
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">{page.name}</h3>
                <p className="text-xs text-gray-500">{page.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CorporateLinks */}
      <div className="bg-gradient-to-br from-slate-500/10 to-white rounded-xl border-2 border-slate-500/20 p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">CorporateLinks</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {corporatePages.filter(page => enabledPages[page.key] ?? true).map((page, index) => {
            const Icon = page.icon;
            return (
              <Link key={index} to={page.path} className="flex flex-col items-center text-center group">
                <div className={`w-20 h-20 rounded-full ${page.color} flex items-center justify-center mb-3 transition-all shadow-sm group-hover:shadow-md overflow-hidden`}>
                  {(page as any).logoUrl ? (
                    <img src={(page as any).logoUrl} alt={page.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Icon className="w-10 h-10" />
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">{page.name}</h3>
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

      {!isLoggedIn && (
        <div className="bg-gradient-to-br from-[#4CBB17]/10 to-white rounded-xl border-2 border-[#4CBB17]/20 p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-[#4CBB17]" />Visitor Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-[#4CBB17] transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Request Project Access</h3>
              </div>
              <p className="text-gray-600 mb-4">Register to request permissions to view a specific project.</p>
              <Link to="/visitor-register" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <UserPlus className="w-5 h-5" />Register for Access
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-[#4CBB17] transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#4CBB17] rounded-lg flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Project Manager Login</h3>
              </div>
              <p className="text-gray-600 mb-4">Log in to access full project management features.</p>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors">
                <LogIn className="w-5 h-5" />Login to Fusion PM
              </Link>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">About Access Levels</h4>
                <p className="text-sm text-blue-800">
                  <strong>Visitor Access:</strong> View-only permissions for specific projects after approval.
                  <strong className="ml-2">Manager Access:</strong> Full project management capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
