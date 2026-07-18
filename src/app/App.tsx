import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';
import { loadInstallationConfig } from './utils/installationConfig';

export default function App() {
  useEffect(() => {
    // Pre-load installation config so globalProjectId is cached before any login
    loadInstallationConfig();
  }, []);

  return <RouterProvider router={router} />;
}
