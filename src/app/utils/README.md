# Task Sync Utility

## Overview
The `taskSync.ts` utility provides dual-storage functionality for project tasks (assignments and project phases). All changes are written to localStorage first (primary storage), then automatically synced to the API at `https://api242.onrender.com`.

## Architecture

### Data Flow
```
User Edit → localStorage (instant) → API Sync (background)
```

### API Endpoints
- **Assignments**: `POST /scopes` - Create new assignment
- **Project Phases**: `POST /projecttasks` - Create new project phase
- **Fetch Assignments**: `GET /scopes` - Returns ALL scopes (client-side filtering by projectId)
- **Fetch Project Phases**: `GET /projecttasks` - Returns ALL project tasks (client-side filtering by projectId)

### API Notes
- APIs are simple GET/POST endpoints with no user authentication or query parameters
- GET endpoints return ALL records from MongoDB
- Client-side filtering by `projectId` is performed after fetching
- MongoDB assigns record IDs as `_id`

### API Format
Both endpoints expect the same format:
```json
{
  "name": "Assignment 1",
  "description": "Description for Assignment 1",
  "url": "https://via.placeholder.com/400x300?text=Assignment+1",
  "projectId": "12345678",
  "customerId": "87654321"
}
```

MongoDB Response includes `_id`:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Assignment 1",
  "description": "Description for Assignment 1",
  "url": "https://via.placeholder.com/400x300?text=Assignment+1",
  "projectId": "12345678",
  "customerId": "87654321"
}
```

### localStorage Format
Local storage uses keys like:
- `assignment_{projectid}_{1-20}` for assignments
- `project_phase_{projectid}_{1-10}` for project phases

Each stores:
```json
{
  "id": 1,
  "title": "Assignment 1",
  "subtitle": "Subtitle for Assignment 1",
  "description": "Description for Assignment 1",
  "imageUrl": "https://via.placeholder.com/400x300?text=Assignment+1"
}
```

## Functions

### `saveAssignment(projectid, assignmentId, data)`
Saves an assignment (1-20) to both localStorage and API.
```typescript
await saveAssignment("12345678", 1, {
  id: 1,
  title: "Assignment 1",
  subtitle: "Subtitle",
  description: "Description",
  imageUrl: "https://example.com/image.png"
});
```

### `saveProjectPhase(projectid, phaseId, data)`
Saves a project phase (1-10) to both localStorage and API.
```typescript
await saveProjectPhase("12345678", 1, {
  id: 1,
  title: "Phase 1",
  phase: "Phase I",
  status: "In Progress",
  imageUrl: "https://example.com/image.png"
});
```

### `initializeDefaultAssignments(projectid)`
Creates 20 default assignments and syncs them to API.
```typescript
const assignments = await initializeDefaultAssignments("12345678");
```

### `initializeDefaultProjectPhases(projectid)`
Creates 10 default project phases and syncs them to API.
```typescript
const phases = await initializeDefaultProjectPhases("12345678");
```

### `fetchAssignments(projectid)`
Fetches assignments from API with localStorage fallback.
```typescript
const assignments = await fetchAssignments("12345678");
```

### `fetchProjectPhases(projectid)`
Fetches project phases from API with localStorage fallback.
```typescript
const phases = await fetchProjectPhases("12345678");
```

## Integration Points

### Components Using Task Sync
1. **AssignmentsPage** - Uses `saveAssignment()` for all edits
2. **ProjectsPage** - Uses `saveProjectPhase()` for all edits
3. **SettingsPage** - Uses `saveAssignment()` and `saveProjectPhase()` for inline edits
4. **MyProjectsPage** - Uses initialization functions when creating new projects

### Error Handling
- If API sync fails, the operation continues (localStorage save already succeeded)
- Errors are logged to console with ✓ (success) or ✗ (failure) indicators
- Fetch functions automatically fall back to localStorage if API is unavailable

## Testing

### Check Console Logs
After editing an assignment or phase, check the browser console:
```
✓ Saved to localStorage: assignment_12345678_1
✓ Synced to API: assignment_12345678_1 {response data}
```

Or if API fails:
```
✓ Saved to localStorage: assignment_12345678_1
✗ API sync failed for assignment_12345678_1: Error: API sync failed: 500
```

### Verify API Calls
Open Network tab and filter for `/projecttasks`:
- POST requests should include the correct JSON format
- Response should be 200/201 for success

## Customization

### Adding Customer ID
The `customerId` is automatically pulled from `project_config.companyid` in localStorage. To customize:
```typescript
const customerId = localStorage.getItem('project_config') 
  ? JSON.parse(localStorage.getItem('project_config')!).companyid || '00000000'
  : '00000000';
```

### Field Mapping
To adjust how local data maps to API format, modify the `toAPIFormat()` function in `taskSync.ts`:
```typescript
function toAPIFormat(projectid, taskId, data, taskType) {
  return {
    name: data.title,           // local.title → api.name
    description: data.description, // local.description → api.description
    url: data.imageUrl,         // local.imageUrl → api.url
    projectId: projectid,       // 8-digit project ID
    customerId: customerId      // company/customer ID
  };
}
```