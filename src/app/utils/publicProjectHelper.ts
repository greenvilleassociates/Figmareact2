/**
 * Public Project Helper
 * Every user account has one "public" project that powers their Home page,
 * MyLinks, and CorporateLinks sections. It is visible to all visitors.
 *
 * The project ID comes from /public/data/installationdefault.conf (globalProjectId),
 * which is baked in at deploy time — stable across all browsers and devices.
 * When the API returns publicprojectid on the user object, that takes precedence.
 *
 * API schema for /api/projects:
 *   userid, instanceid, projectname, githubRepoUrl, githubPagesUrl,
 *   hostingProviderName, hostingProviderUrl, account, subaccount,
 *   companyid, mongoid, logoUrl, privacysetting
 *
 * Storage keys:
 *   currentProject           – always localStorage (metadata pointer)
 *   project_config           – always localStorage (full project config)
 *   public_project_{userid}  – always localStorage (canonical user public project)
 */

import { loadInstallationConfig, getInstallationConfig, getGlobalProjectId } from './installationConfig';

export type PrivacySetting = 'public' | 'private' | 'hybrid';

/** Mirrors the /api/projects response schema */
export interface PublicProject {
  // Internal / local fields
  projectid: string;
  id: string;
  username: string;
  email: string;
  status: 'active';
  created_at: string;
  installationId?: string;

  // API schema fields
  userid: string;         // string in API schema
  instanceid: string;
  projectname: string;
  githubRepoUrl: string;
  githubPagesUrl: string;
  hostingProviderName: string;
  hostingProviderUrl: string;
  account: string;
  subaccount: string;
  companyid: string;
  mongoid: string;
  logoUrl: string;
  privacysetting: PrivacySetting;
}

/** Fallback: generate a random 8-digit ID if config is unreachable */
export const generateProjectId = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

/**
 * Create and persist a public project for a user.
 * Priority for projectid: explicit param > API publicprojectid > installationdefault.conf globalProjectId > random fallback
 */
export const createPublicProject = (params: {
  userid: string | number;
  username: string;
  mongoid: string;
  email?: string;
  logoUrl?: string;
  projectid?: string;
  instanceid?: string;
  companyid?: string;
  account?: string;
  subaccount?: string;
  githubRepoUrl?: string;
  githubPagesUrl?: string;
  hostingProviderName?: string;
  hostingProviderUrl?: string;
}): PublicProject => {
  const config = getInstallationConfig();
  const projectid = params.projectid ?? config?.globalProjectId ?? getGlobalProjectId();

  const publicProject: PublicProject = {
    projectid,
    id: projectid,
    userid: String(params.userid),
    instanceid: params.instanceid ?? config?.instanceid ?? config?.installationId ?? '',
    projectname: config?.projectName ?? `${params.username}'s Public Site`,
    githubRepoUrl: params.githubRepoUrl ?? config?.githubRepoUrl ?? '',
    githubPagesUrl: params.githubPagesUrl ?? config?.githubPagesUrl ?? '',
    hostingProviderName: params.hostingProviderName ?? config?.hostingProviderName ?? '',
    hostingProviderUrl: params.hostingProviderUrl ?? config?.hostingProviderUrl ?? '',
    account: params.account ?? config?.account ?? config?.tenantId ?? '',
    subaccount: params.subaccount ?? config?.subaccount ?? '',
    companyid: params.companyid ?? config?.companyid ?? '',
    mongoid: params.mongoid,
    logoUrl: params.logoUrl ?? '',
    privacysetting: config?.privacysetting ?? 'public',
    username: params.username,
    email: params.email ?? '',
    status: 'active',
    created_at: new Date().toISOString(),
    installationId: config?.installationId,
  };

  persistPublicProject(publicProject);
  return publicProject;
};

/** Write the public project to localStorage in all required slots */
export const persistPublicProject = (project: PublicProject): void => {
  localStorage.setItem(`public_project_${project.userid}`, JSON.stringify(project));
  localStorage.setItem('currentProject', JSON.stringify(project));
  localStorage.setItem('project_config', JSON.stringify(project));
};

/** Retrieve the stored public project for a user, or null if none exists yet */
export const getPublicProject = (userid: string | number): PublicProject | null => {
  const stored = localStorage.getItem(`public_project_${userid}`);
  return stored ? (JSON.parse(stored) as PublicProject) : null;
};

/**
 * Ensure a public project exists for the current logged-in user.
 * Loads installationdefault.conf first so globalProjectId is available.
 * Pass projectid when the API returned publicprojectid — it takes precedence.
 */
export const ensurePublicProject = async (params: {
  userid: string | number;
  username: string;
  mongoid: string;
  email?: string;
  projectid?: string;
}): Promise<PublicProject> => {
  await loadInstallationConfig();

  const existing = getPublicProject(params.userid);
  if (existing) {
    // If API now provides a canonical projectid that differs, adopt it
    if (params.projectid && params.projectid !== existing.projectid) {
      const updated: PublicProject = { ...existing, projectid: params.projectid, id: params.projectid };
      persistPublicProject(updated);
      return updated;
    }
    persistPublicProject(existing);
    return existing;
  }
  return createPublicProject(params);
};

/**
 * Map an API /api/projects response object into our local PublicProject shape.
 * Use this when fetching an existing project from the API.
 */
export const mapApiProjectToPublicProject = (
  apiProject: Record<string, any>,
  projectid: string
): PublicProject => {
  return {
    projectid,
    id: projectid,
    userid: String(apiProject.userid ?? ''),
    instanceid: apiProject.instanceid ?? '',
    projectname: apiProject.projectname ?? '',
    githubRepoUrl: apiProject.githubRepoUrl ?? '',
    githubPagesUrl: apiProject.githubPagesUrl ?? '',
    hostingProviderName: apiProject.hostingProviderName ?? '',
    hostingProviderUrl: apiProject.hostingProviderUrl ?? '',
    account: apiProject.account ?? '',
    subaccount: apiProject.subaccount ?? '',
    companyid: apiProject.companyid ?? '',
    mongoid: apiProject.mongoid ?? '',
    logoUrl: apiProject.logoUrl ?? '',
    privacysetting: (['public', 'private', 'hybrid'].includes(apiProject.privacysetting)
      ? apiProject.privacysetting
      : 'public') as PrivacySetting,
    username: apiProject.username ?? '',
    email: apiProject.email ?? '',
    status: 'active',
    created_at: apiProject.created_at ?? new Date().toISOString(),
    installationId: apiProject.instanceid ?? '',
  };
};

/**
 * Post the public project to the remote API (best-effort, non-blocking).
 * Sends exactly the fields the /api/projects schema expects.
 */
export const syncPublicProjectToApi = async (project: PublicProject): Promise<void> => {
  try {
    await fetch('https://api242.onrender.com/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid: project.userid,
        instanceid: project.instanceid,
        projectname: project.projectname,
        githubRepoUrl: project.githubRepoUrl,
        githubPagesUrl: project.githubPagesUrl,
        hostingProviderName: project.hostingProviderName,
        hostingProviderUrl: project.hostingProviderUrl,
        account: project.account,
        subaccount: project.subaccount,
        companyid: project.companyid,
        mongoid: project.mongoid,
        logoUrl: project.logoUrl,
        privacysetting: project.privacysetting,
      }),
      signal: AbortSignal.timeout(8000)
    });
    console.log('✅ Public project synced to API');
  } catch {
    console.log('ℹ️ Public project sync skipped (API unavailable)');
  }
};
