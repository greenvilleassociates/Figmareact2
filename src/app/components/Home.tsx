import { Link } from 'react-router';
import { User, Heart, Briefcase, GraduationCap, FileText, Building2 } from 'lucide-react';
import './styles/themes.css';

export function Home() {
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
      name: 'USC Life', 
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
    <div className="flex-1 bg-gray-50 p-12 overflow-auto leftnav">
      <h1 className="text-4xl font-bold mb-4">Welcome to FusionProjectManager</h1>
      <p className="text-lg text-gray-600 mb-12">
        Explore your personal pages and navigate through different sections using the sidebar.
      </p>

      {/* Personal Pages Quick Access */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Personal Pages</h2>
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

      {/* Other Sections */}
      <div>
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
        </div>
      </div>
    </div>
  );
}