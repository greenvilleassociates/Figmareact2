import { Outlet } from 'react-router';
import { Sidebar } from '@/app/components/Sidebar';
import './styles/themes.css';

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  );
}
