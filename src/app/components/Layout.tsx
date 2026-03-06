import { Outlet } from 'react-router';
import { Sidebar } from '@/app/components/Sidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Hamburger Menu Button - Only visible on mobile/small screens */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#4CBB17] text-white rounded-lg shadow-lg max-[999px]:block min-[1000px]:hidden hover:bg-[#3DA013] transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 max-[999px]:block min-[1000px]:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          max-[999px]:fixed max-[999px]:inset-y-0 max-[999px]:left-0 max-[999px]:z-40
          max-[999px]:transform max-[999px]:transition-transform max-[999px]:duration-300
          ${isSidebarOpen ? 'max-[999px]:translate-x-0' : 'max-[999px]:-translate-x-full'}
          min-[1000px]:relative min-[1000px]:translate-x-0
        `}
      >
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}