/**
 * Installation Configuration Loader
 * Reads /public/data/installationdefault.conf at runtime.
 * This file is baked into the deployment, so globalProjectId is stable
 * across all browsers, devices, and sessions for this installation.
 */

export interface InstallationConfig {
  installationId: string;
  tenantId: string;
  globalProjectId: string;
  projectName: string;
  projectType: string;
  privacysetting: 'public' | 'private' | 'hybrid';
  description: string;
  institution: string;
  course: string;
  version: string;
  deployedAt: string;
  apiBase: string;
  account: string;
  subaccount: string;
  companyid: string;
  instanceid: string;
  githubRepoUrl: string;
  githubPagesUrl: string;
  hostingProviderName: string;
  hostingProviderUrl: string;
}

const CACHE_KEY = 'installation_config';

let _memoryCache: InstallationConfig | null = null;

/** Load the installation config (memory cache → localStorage cache → fetch) */
export const loadInstallationConfig = async (): Promise<InstallationConfig | null> => {
  // 1. Memory cache (same session, fastest)
  if (_memoryCache) return _memoryCache;

  // 2. localStorage cache (persists across page loads)
  const stored = localStorage.getItem(CACHE_KEY);
  if (stored) {
    try {
      _memoryCache = JSON.parse(stored) as InstallationConfig;
      return _memoryCache;
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // 3. Fetch from deployment — try multiple paths for dev/prod compatibility
  const paths = [
    `${import.meta.env.BASE_URL}data/installationdefault.conf`,
    '/data/installationdefault.conf',
  ];
  for (const path of paths) {
    try {
      const res = await fetch(path, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.trimStart().startsWith('<')) continue; // HTML 404 page
      const config: InstallationConfig = JSON.parse(text);
      _memoryCache = config;
      localStorage.setItem(CACHE_KEY, JSON.stringify(config));
      console.log('✅ Installation config loaded — globalProjectId:', config.globalProjectId);
      return config;
    } catch {
      continue;
    }
  }
  // Inline fallback — keeps the app functional when the file can't be fetched
  const fallback: InstallationConfig = {
    installationId: 'usc242',
    tenantId: 'jssg33',
    globalProjectId: '24200101',
    projectName: 'USC CSCE 242 - Public Site',
    projectType: 'public',
    privacysetting: 'public',
    description: '',
    institution: 'University of South Carolina',
    course: 'CSCE 242',
    version: '2026.7.18',
    deployedAt: '2026-07-18',
    apiBase: 'https://api242.onrender.com',
    account: 'jssg33',
    subaccount: 'usc242',
    companyid: '',
    instanceid: 'usc242',
    githubRepoUrl: 'https://github.com/greenvilleassociates/Figmareact2',
    githubPagesUrl: 'https://jssg33.github.io/usc242',
    hostingProviderName: 'Render',
    hostingProviderUrl: 'https://render.com',
  };
  _memoryCache = fallback;
  console.info('ℹ️ Using inline fallback installation config (globalProjectId: 24200101)');
  return fallback;
};

/** Synchronous read from cache only — call after loadInstallationConfig has resolved */
export const getInstallationConfig = (): InstallationConfig | null => {
  if (_memoryCache) return _memoryCache;
  const stored = localStorage.getItem(CACHE_KEY);
  if (stored) {
    try {
      _memoryCache = JSON.parse(stored) as InstallationConfig;
      return _memoryCache;
    } catch {
      return null;
    }
  }
  return null;
};

/** Returns the global project ID from cache, or the fallback string if not yet loaded */
export const getGlobalProjectId = (fallback = '24200101'): string => {
  return getInstallationConfig()?.globalProjectId ?? fallback;
};

/** Invalidate caches (call when you want a fresh fetch, e.g. after deploy) */
export const clearInstallationConfigCache = (): void => {
  _memoryCache = null;
  localStorage.removeItem(CACHE_KEY);
};
