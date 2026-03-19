/**
 * Guest Configuration Utilities
 * Manages the guest project configuration from /public/defaultproject.json
 * 
 * The configuration file lives in the repository and is deployed to GitHub Pages.
 * Guest data is always loaded fresh from this file and is read-only.
 */

const GUEST_PROJECT_ID = '88888888';

/**
 * Load guest configuration from /public/defaultproject.json
 * This file is deployed with the site to github.io
 */
export const loadGuestConfiguration = async (): Promise<boolean> => {
  try {
    const projectResponse = await fetch('/defaultproject.json');
    const defaultProjectData = await projectResponse.json();
    
    // Load default guest project
    const guestProject = {
      id: defaultProjectData.projectid,
      projectid: defaultProjectData.projectid,
      name: defaultProjectData.name,
      description: defaultProjectData.description,
      customerId: defaultProjectData.customerId,
      status: defaultProjectData.status,
      logoUrl: defaultProjectData.logoUrl
    };
    
    // Set as current project (only the pointer is in localStorage)
    localStorage.setItem('currentProject', JSON.stringify(guestProject));
    
    // Store guest data in sessionStorage (temporary, read-only)
    // This allows the app to work but data is cleared when browser closes
    const assignments = defaultProjectData.metadata.defaultAssignments;
    assignments.forEach((assignment: any, index: number) => {
      const key = `assignment_${defaultProjectData.projectid}_${index + 1}`;
      sessionStorage.setItem(key, JSON.stringify(assignment));
    });
    
    // Initialize default project phases for guest project
    const phases = defaultProjectData.metadata.defaultProjectPhases;
    phases.forEach((phase: any, index: number) => {
      const key = `project_phase_${defaultProjectData.projectid}_${index + 1}`;
      sessionStorage.setItem(key, JSON.stringify(phase));
    });
    
    console.log('Guest configuration loaded from /public/defaultproject.json');
    return true;
  } catch (err) {
    console.error('Error loading guest configuration:', err);
    return false;
  }
};

/**
 * Clear all guest session data
 */
export const clearGuestConfiguration = (): void => {
  // Clear guest data from sessionStorage
  for (let i = 1; i <= 20; i++) {
    sessionStorage.removeItem(`assignment_${GUEST_PROJECT_ID}_${i}`);
  }
  
  for (let i = 1; i <= 10; i++) {
    sessionStorage.removeItem(`project_phase_${GUEST_PROJECT_ID}_${i}`);
  }
  
  // Clear current project if it's the guest project
  const currentProj = localStorage.getItem('currentProject');
  if (currentProj) {
    try {
      const proj = JSON.parse(currentProj);
      if (proj.projectid === GUEST_PROJECT_ID) {
        localStorage.removeItem('currentProject');
      }
    } catch (err) {
      console.error('Error parsing current project:', err);
    }
  }
  
  console.log('Guest session data cleared');
};

/**
 * Reset guest configuration (clear and reload from file)
 */
export const resetGuestConfiguration = async (): Promise<boolean> => {
  clearGuestConfiguration();
  return await loadGuestConfiguration();
};

export const GUEST_PROJECT_CONFIG = {
  projectId: GUEST_PROJECT_ID,
  customerId: '99999999',
  name: 'Guest Demo Project',
  configFile: '/public/defaultproject.json'
};
