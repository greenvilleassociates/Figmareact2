import { Link } from 'react-router';
import { User, Heart, Briefcase, GraduationCap, FileText, Building2 } from 'lucide-react';

export function PersonalPagesContent() {
  const personalPages = [
    { 
      name: '@AboutMe', 
      type: 'Author Page', 
      icon: User,
      path: '/personal-pages/about',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    { 
      name: '@Interests', 
      type: 'Author Page', 
      icon: Heart,
      path: '/personal-pages/interests',
      color: 'bg-red-50 text-red-600 hover:bg-red-100'
    },
    { 
      name: '@Portfolio', 
      type: 'Author Page', 
      icon: Briefcase,
      path: '/personal-pages/portfolio',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
    },
    { 
      name: '@USC Life', 
      type: 'Author Page...', 
      icon: GraduationCap,
      path: '/personal-pages/usclife',
      color: 'bg-green-50 text-green-600 hover:bg-green-100'
    },
    { 
      name: '@Vitae', 
      type: 'Author Page', 
      icon: FileText,
      path: '/personal-pages/vitae',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    },
    { 
      name: '@Greenville', 
      type: 'Corporate Page', 
      icon: Building2,
      path: '/personal-pages/greenville',
      color: 'bg-teal-50 text-teal-600 hover:bg-teal-100'
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div>
        <h1 className="text-3xl font-bold mb-1">Personal Pages</h1>
        <p className="text-gray-500 mb-6">Subheading</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {personalPages.map((page, index) => {
            const Icon = page.icon;
            return (
              <Link key={index} to={page.path} className="text-center cursor-pointer group">
                <div className={`aspect-square rounded-lg shadow hover:shadow-lg transition-all overflow-hidden mb-3 ${page.color} flex items-center justify-center`}>
                  <Icon className="w-16 h-16" />
                </div>
                <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">{page.name}</h4>
                <p className="text-xs text-gray-600">{page.type}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}