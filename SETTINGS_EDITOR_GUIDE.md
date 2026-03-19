# Settings Page - Visual Editor Guide

## Overview
The Settings page now features comprehensive visual editing capabilities with clickable image-based interfaces for managing all content across the Fusion Project Manager application.

## Features

### 1. **Visual MyLinks Editor** 
**Location:** Settings > Manage MyLinks

- **Grid View**: Colorful icon-based grid showing all custom links
- **Click to Edit**: Click any icon to open the editor
- **Live Preview**: See changes in real-time
- **Fields**:
  - Link Name
  - URL
  - Icon (Emoji support: 🔗 📱 💼 🎨 ⚡ 🌟)
  - Background Color (Color picker + hex input)
- **Actions**: Save, Cancel, Delete

**How it Works:**
1. Click on any circular icon in the grid
2. Edit form appears with live preview
3. Changes save automatically when you click "Save"
4. Links appear in the MyLinks page immediately

---

### 2. **Visual Assignment Editor**
**Location:** Settings > Visual Assignment Editor

- **Image Grid**: 20 assignments displayed as clickable thumbnails
- **Hover Effects**: Edit icon appears on hover
- **Selected Highlight**: Green border and ring effect
- **Fields**:
  - Title
  - Subtitle
  - Description
  - Image URL (with live preview)
- **Export**: Individual JSON export for each assignment

**How it Works:**
1. Click on any assignment image in the grid
2. Assignment editor opens below with current data
3. Edit any field - changes save automatically to localStorage
4. Image preview updates in real-time
5. Export as `{projectid}a{#}.json` format

**Image Sources:**
- Direct URLs (https://example.com/image.jpg)
- Imgur (https://i.imgur.com/...)
- ImgBB (https://i.ibb.co/...)
- Any public image host

---

### 3. **Visual Project Phase Editor**
**Location:** Settings > Visual Project Phase Editor

- **Phase Grid**: 10 project phases with status badges
- **Status Indicators**: 
  - ✅ Green: Completed
  - 🚧 Yellow: In Progress
  - ⏳ Gray: Pending
- **Fields**:
  - Phase Name (Phase I, Phase II, etc.)
  - Title
  - Status (dropdown)
  - Image URL (with live preview)
- **Export**: Individual JSON export for each phase

**How it Works:**
1. Click on any phase image in the grid
2. Phase editor opens below with current data
3. Edit fields including status dropdown
4. Changes save automatically to localStorage
5. Export as `{projectid}p{#}.json` format

---

## Data Storage

### localStorage Keys:
- `customLinks` - Array of custom link objects
- `assignmentImages` - Legacy image URLs
- `projectImages` - Legacy image URLs
- `project_config` - Project configuration with IDs
- `assignment_{projectid}_{1-20}` - Individual assignment data
- `project_phase_{projectid}_{1-10}` - Individual phase data

### JSON Export Format:

**Assignment JSON** (`{projectid}a1.json`):
```json
{
  "id": 1,
  "title": "Assignment 1",
  "subtitle": "Subtitle for Assignment 1",
  "description": "Description for Assignment 1",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Project Phase JSON** (`{projectid}p1.json`):
```json
{
  "id": 1,
  "phase": "Phase I",
  "title": "Phase 1 Title",
  "status": "Completed",
  "imageUrl": "https://example.com/image.jpg"
}
```

---

## Visual Improvements

### Clickable Image Grids
- **Hover Effect**: Edit icon overlay with semi-transparent black background
- **Selection**: Green border (Kelly Green #4CBB17) with ring effect
- **Status Badges**: Color-coded status indicators on project phases
- **Gradient Overlays**: Title text over dark gradient for readability

### Editor Panels
- **Highlighted Border**: 2px Kelly Green border when editing
- **Gradient Background**: Subtle green-to-white gradient
- **Live Preview**: Real-time image preview with "Live Preview" badge
- **Responsive Grid**: Auto-adjusts for mobile/tablet/desktop

### Color Scheme
- **Primary**: Kelly Green (#4CBB17)
- **Hover**: Darker Green (#3DA013)
- **Status Colors**:
  - Completed: Green (#10B981)
  - In Progress: Yellow (#EAB308)
  - Pending: Gray (#9CA3AF)

---

## Workflow Example

### Adding Custom Link:
1. Navigate to Settings > Manage MyLinks
2. Fill in "Add New Link" form
3. Choose emoji icon (🔗 📱 💼 etc.)
4. Pick color with color picker
5. Click "Add Link"
6. New icon appears in grid
7. Click icon to edit anytime

### Editing Assignment:
1. Navigate to Settings > Visual Assignment Editor
2. Click any assignment image in grid
3. Editor opens below with current data
4. Update title, subtitle, description
5. Paste new image URL
6. See live preview
7. Click "Export JSON" to download
8. Changes automatically save to localStorage
9. AssignmentsPage reads updated data

### Editing Project Phase:
1. Navigate to Settings > Visual Project Phase Editor
2. Click any phase image in grid
3. Editor opens with phase data
4. Update phase name, title
5. Change status (Completed/In Progress/Pending)
6. Update image URL
7. See live preview
8. Click "Export JSON" to download
9. ProjectsPage reads updated data

---

## Image URL Tips

### Recommended Image Hosts:
1. **Imgur** (imgur.com)
   - Free, no account needed
   - Direct image links
   - Example: https://i.imgur.com/abc123.jpg

2. **ImgBB** (imgbb.com)
   - Free hosting
   - Direct links available
   - Example: https://i.ibb.co/xyz789/image.jpg

3. **GitHub** (github.com)
   - Use repository raw URLs
   - Example: https://raw.githubusercontent.com/user/repo/main/image.jpg

4. **Unsplash** (unsplash.com)
   - High-quality free images
   - Direct links available

### Image URL Format:
- Must be direct link to image file
- Supported formats: JPG, PNG, GIF, WebP
- Example: `https://example.com/image.jpg`
- NOT: `https://example.com/page-with-image`

---

## Quick Actions

### Assignment Quick Export:
- Buttons for a1 through a10
- Click to instantly download JSON
- Located below editor panel

### Project Phase Quick Export:
- Buttons for p1 through p10
- Click to instantly download JSON
- Located below editor panel

---

## Multi-Tenant Notes

### Current Instance:
- Settings are per-browser (localStorage)
- JSON files export with projectid prefix
- Each tenant can have different configurations

### Project Configuration:
- 8-digit random projectid
- Unique customerid, userid, accountid, subaccountid
- Regenerate anytime with "Regenerate IDs" button
- Export as `project.json`

---

## Best Practices

1. **Image URLs**: Use reliable image hosts (Imgur, ImgBB)
2. **Image Size**: Optimal size 400x400px to 800x800px
3. **Backup**: Export JSONs regularly for backup
4. **Testing**: Test image URLs before saving
5. **Naming**: Use descriptive titles and subtitles
6. **Status**: Keep project phase statuses updated
7. **Colors**: Use contrasting colors for link icons

---

## Troubleshooting

### Image Not Loading:
- Check if URL is direct image link
- Verify image host allows hotlinking
- Try re-uploading to different host
- Check browser console for CORS errors

### Changes Not Saving:
- Check browser localStorage limits
- Clear old data if needed
- Refresh page to verify changes
- Export JSON as backup

### Visual Issues:
- Clear browser cache
- Check responsive design breakpoints
- Verify Kelly Green color scheme
- Test on different screen sizes

---

## Future Enhancements

Potential additions:
- Drag-and-drop image upload
- Bulk edit multiple items
- Import JSON files
- Copy/paste between assignments
- Image URL validation
- Preview before save
- Undo/redo functionality
- Search and filter
- Sort and reorder
