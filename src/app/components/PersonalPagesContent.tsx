import { Link } from 'react-router';
import { User, Heart, Briefcase, GraduationCap, FileText, Building2, BookOpen, Award, Shield, Image } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CustomLink {
  id: string;
  name: string;
  url: string;
  color: string;
  icon: string;
}

export function PersonalPagesContent() {
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [enabledPages, setEnabledPages] = useState<Record<string, boolean>>({
    about: true,
    interests: true,
    portfolio: true,
    usclife: true,
    vitae: true,
    greenville: true,
    publications: true,
    awards: true,
    certifications: true,
    picturewall: true
  });

  // Load custom links and enabled pages from localStorage
  useEffect(() => {
    const savedLinks = localStorage.getItem('customLinks');
    if (savedLinks) {
      setCustomLinks(JSON.parse(savedLinks));
    }

    // Default: all pages enabled
    const defaults = {
      about: true,
      interests: true,
      portfolio: true,
      usclife: true,
      vitae: true,
      greenville: true,
      publications: true,
      awards: true,
      certifications: true,
      picturewall: true
    };

    const savedEnabledPages = localStorage.getItem('enabledPersonalPages');
    if (savedEnabledPages) {
      // Merge saved settings with defaults to ensure new pages show up
      const saved = JSON.parse(savedEnabledPages);
      const merged = { ...defaults, ...saved };
      console.log('MyLinks: Loaded enabled pages from localStorage and merged with defaults', merged);
      setEnabledPages(merged);
      // Save the merged version back to localStorage to include new defaults
      localStorage.setItem('enabledPersonalPages', JSON.stringify(merged));
    } else {
      console.log('MyLinks: No saved settings, using all defaults', defaults);
      setEnabledPages(defaults);
      localStorage.setItem('enabledPersonalPages', JSON.stringify(defaults));
    }
  }, []);

  const personalPages = [
    {
      key: 'about',
      name: '@AboutMe',
      type: 'Author Page',
      icon: User,
      path: '/personal-pages/about',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      key: 'interests',
      name: '@Interests',
      type: 'Author Page',
      icon: Heart,
      path: '/personal-pages/interests',
      color: 'bg-red-50 text-red-600 hover:bg-red-100'
    },
    {
      key: 'portfolio',
      name: '@Portfolio',
      type: 'Author Page',
      icon: Briefcase,
      path: '/personal-pages/portfolio',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
    },
    {
      key: 'usclife',
      name: '@USC Life',
      type: 'Author Page...',
      icon: GraduationCap,
      path: '/personal-pages/usclife',
      color: 'bg-green-50 text-green-600 hover:bg-green-100'
    },
    {
      key: 'vitae',
      name: '@Vitae',
      type: 'Author Page',
      icon: FileText,
      path: '/personal-pages/vitae',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    },
    {
      key: 'greenville',
      name: '@Greenville',
      type: 'Corporate Page',
      icon: Building2,
      path: '/personal-pages/greenville',
      color: 'bg-teal-50 text-teal-600 hover:bg-teal-100'
    },
    {
      key: 'publications',
      name: '@Publications',
      type: 'Author Page',
      icon: BookOpen,
      path: '/personal-pages/publications',
      color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
    },
    {
      key: 'awards',
      name: '@Awards',
      type: 'Author Page',
      icon: Award,
      path: '/personal-pages/awards',
      color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
    },
    {
      key: 'certifications',
      name: '@Certifications',
      type: 'Author Page',
      icon: Shield,
      path: '/personal-pages/certifications',
      color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
    },
    {
      key: 'picturewall',
      name: '@Picture Wall',
      type: 'Author Page',
      icon: Image,
      path: '/personal-pages/picturewall',
      color: 'bg-pink-50 text-pink-600 hover:bg-pink-100'
    },
  ];

  const visiblePagesCount = personalPages.filter(page => enabledPages[page.key] ?? true).length;
  const totalPagesCount = personalPages.length;

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div>
        <h1 className="text-3xl font-bold mb-1">MyLinks</h1>
        <p className="text-gray-500 mb-6">Personal pages and custom links ({visiblePagesCount} pages + {customLinks.length} custom links)</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {personalPages
            .filter(page => enabledPages[page.key] ?? true)
            .map((page, index) => {
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
          
          {/* Custom Links from Settings */}
          {customLinks.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-center cursor-pointer group">
              <div 
                className="aspect-square rounded-lg shadow hover:shadow-lg transition-all overflow-hidden mb-3 flex items-center justify-center text-4xl"
                style={{ backgroundColor: link.color }}
              >
                {link.icon}
              </div>
              <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">{link.name}</h4>
              <p className="text-xs text-gray-600">Custom Link</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}