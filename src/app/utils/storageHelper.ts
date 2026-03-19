/**
 * Storage Helper Utilities
 * Handles reading/writing data from the correct storage location
 * - Guest users: sessionStorage (read-only, from /public/defaultproject.json)
 * - Regular users: localStorage (read-write)
 */

/**
 * Check if current user is in guest mode
 */
export const isGuestMode = (): boolean => {
  const guestMode = localStorage.getItem('isGuestMode');
  return guestMode ? JSON.parse(guestMode) : false;
};

/**
 * Get data from appropriate storage (sessionStorage for guests, localStorage for users)
 */
export const getStorageItem = (key: string): string | null => {
  if (isGuestMode()) {
    return sessionStorage.getItem(key);
  }
  return localStorage.getItem(key);
};

/**
 * Set data to appropriate storage (only localStorage for regular users, guests are read-only)
 */
export const setStorageItem = (key: string, value: string): void => {
  if (isGuestMode()) {
    console.warn('Guest mode is read-only. Changes will not be saved.');
    return;
  }
  localStorage.setItem(key, value);
};

/**
 * Remove data from appropriate storage (only localStorage for regular users)
 */
export const removeStorageItem = (key: string): void => {
  if (isGuestMode()) {
    console.warn('Guest mode is read-only. Cannot remove data.');
    return;
  }
  localStorage.removeItem(key);
};

/**
 * Get assignment data (checks both sessionStorage and localStorage)
 */
export const getAssignment = (projectId: string, index: number): any | null => {
  const key = `assignment_${projectId}_${index}`;
  const data = getStorageItem(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Get project phase data (checks both sessionStorage and localStorage)
 */
export const getProjectPhase = (projectId: string, index: number): any | null => {
  const key = `project_phase_${projectId}_${index}`;
  const data = getStorageItem(key);
  return data ? JSON.parse(data) : null;
};
