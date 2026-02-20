import { Home, Search, FileText, Github, BookOpen, FolderKanban } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import cockyLogo from './assets/someassignment.png';
import renderLogo from './assets/someassignment.png';

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const isRenderPage = location.pathname === '/render-react-info';

  return (
    <div className="w-52 h-screen bg-[#8B3A3A] text-white flex flex-col">
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
                <span>Personal Pages</span>
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
                to="/render-react-info" 
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  isActive('/render-react-info') ? 'bg-white text-black' : 'hover:bg-white/10'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Render Hosting</span>
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
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6">
        <p className="text-sm">USC242</p>
      </div>
    </div>
  );
}
