/**
 * Task Sync Utility
 * Handles dual-storage for project tasks: localStorage (primary) and API (sync)
 */

const API_BASE_URL = 'https://api242.onrender.com';

export interface TaskData {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  // For project phases
  phase?: string;
  status?: string;
}

export interface ProjectTaskAPI {
  _id?: string; // MongoDB assigned ID
  name: string;
  description: string;
  url: string;
  projectId: string;
  customerId: string;
}

/**
 * Convert local TaskData to API format
 */
function toAPIFormat(
  projectid: string,
  taskId: string,
  data: TaskData,
  taskType: 'assignment' | 'project_phase'
): ProjectTaskAPI {
  const customerId = localStorage.getItem('project_config') 
    ? JSON.parse(localStorage.getItem('project_config')!).companyid || '00000000'
    : '00000000';

  return {
    name: data.title,
    description: data.description || data.subtitle || `${taskType === 'assignment' ? 'Assignment' : 'Phase'} ${data.id}`,
    url: data.imageUrl,
    projectId: projectid,
    customerId: customerId
  };
}

/**
 * Save assignment to both localStorage and API
 * @param projectid - 8-digit project ID
 * @param assignmentId - Assignment number (1-20)
 * @param data - Assignment data object
 */
export async function saveAssignment(
  projectid: string,
  assignmentId: number,
  data: TaskData
): Promise<void> {
  // Step 1: Write to localStorage (primary storage)
  const localKey = `assignment_${projectid}_${assignmentId}`;
  localStorage.setItem(localKey, JSON.stringify(data));
  console.log(`✓ Saved to localStorage: ${localKey}`);

  // Step 2: Sync to API at /scopes
  try {
    const taskData: ProjectTaskAPI = toAPIFormat(
      projectid,
      `a${assignmentId}`,
      data,
      'assignment'
    );

    const response = await fetch(`${API_BASE_URL}/scopes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`API sync failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✓ Synced to API /scopes: ${localKey}`, result);
  } catch (error) {
    console.error(`✗ API sync failed for ${localKey}:`, error);
    // Don't throw - localStorage save already succeeded
  }
}

/**
 * Save project phase to both localStorage and API
 * @param projectid - 8-digit project ID
 * @param phaseId - Phase number (1-10)
 * @param data - Phase data object
 */
export async function saveProjectPhase(
  projectid: string,
  phaseId: number,
  data: TaskData
): Promise<void> {
  // Step 1: Write to localStorage (primary storage)
  const localKey = `project_phase_${projectid}_${phaseId}`;
  localStorage.setItem(localKey, JSON.stringify(data));
  console.log(`✓ Saved to localStorage: ${localKey}`);

  // Step 2: Sync to API at /projecttasks
  try {
    const taskData: ProjectTaskAPI = toAPIFormat(
      projectid,
      `p${phaseId}`,
      data,
      'project_phase'
    );

    const response = await fetch(`${API_BASE_URL}/projecttasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`API sync failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✓ Synced to API /projecttasks: ${localKey}`, result);
  } catch (error) {
    console.error(`✗ API sync failed for ${localKey}:`, error);
    // Don't throw - localStorage save already succeeded
  }
}

/**
 * Fetch assignments from API (with localStorage fallback)
 * @param projectid - 8-digit project ID
 */
export async function fetchAssignments(projectid: string): Promise<TaskData[]> {
  try {
    // GET all scopes from API (no query params - API returns all records)
    const response = await fetch(`${API_BASE_URL}/scopes`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assignments: ${response.status}`);
    }
    
    const allTasks: ProjectTaskAPI[] = await response.json();
    
    // Filter client-side by projectId
    const filteredTasks = allTasks.filter(t => t.projectId === projectid);
    
    return filteredTasks.map((t, index) => ({
      id: index + 1,
      title: t.name,
      subtitle: t.description,
      description: t.description,
      imageUrl: t.url
    }));
  } catch (error) {
    console.error('API fetch failed, using localStorage:', error);
    
    // Fallback to localStorage
    const assignments: TaskData[] = [];
    for (let i = 1; i <= 20; i++) {
      const saved = localStorage.getItem(`assignment_${projectid}_${i}`);
      if (saved) {
        assignments.push(JSON.parse(saved));
      }
    }
    return assignments;
  }
}

/**
 * Fetch project phases from API (with localStorage fallback)
 * @param projectid - 8-digit project ID
 */
export async function fetchProjectPhases(projectid: string): Promise<TaskData[]> {
  try {
    // GET all project tasks from API (no query params - API returns all records)
    const response = await fetch(`${API_BASE_URL}/projecttasks`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch project phases: ${response.status}`);
    }
    
    const allTasks: ProjectTaskAPI[] = await response.json();
    
    // Filter client-side by projectId
    const filteredTasks = allTasks.filter(t => t.projectId === projectid);
    
    return filteredTasks.map((t, index) => ({
      id: index + 1,
      title: t.name,
      subtitle: t.description,
      description: t.description,
      imageUrl: t.url
    }));
  } catch (error) {
    console.error('API fetch failed, using localStorage:', error);
    
    // Fallback to localStorage
    const phases: TaskData[] = [];
    for (let i = 1; i <= 10; i++) {
      const saved = localStorage.getItem(`project_phase_${projectid}_${i}`);
      if (saved) {
        phases.push(JSON.parse(saved));
      }
    }
    return phases;
  }
}

/**
 * Initialize default assignments for a new project
 * @param projectid - 8-digit project ID
 */
export async function initializeDefaultAssignments(projectid: string): Promise<void> {
  for (let i = 1; i <= 20; i++) {
    const defaultAssignment: TaskData = {
      id: i,
      title: `Assignment ${i}`,
      subtitle: `Description for Assignment ${i}`,
      description: `Description for Assignment ${i}`,
      imageUrl: `https://via.placeholder.com/400x300?text=Assignment+${i}`
    };
    
    await saveAssignment(projectid, i, defaultAssignment);
  }
  console.log(`✓ Initialized 20 default assignments for project ${projectid}`);
}

/**
 * Initialize default project phases for a new project
 * @param projectid - 8-digit project ID
 */
export async function initializeDefaultProjectPhases(projectid: string): Promise<void> {
  for (let i = 1; i <= 10; i++) {
    const defaultPhase: TaskData = {
      id: i,
      title: `Phase ${i}`,
      subtitle: `Description for Phase ${i}`,
      description: `Description for Phase ${i}`,
      imageUrl: `https://via.placeholder.com/400x300?text=Phase+${i}`,
      phase: `Phase ${i}`,
      status: 'Not Started'
    };
    
    await saveProjectPhase(projectid, i, defaultPhase);
  }
  console.log(`✓ Initialized 10 default project phases for project ${projectid}`);
}