import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Edit2, Save, X, Image as ImageIcon } from 'lucide-react';

interface AssignmentImage {
  id: number;
  imageUrl: string;
}

interface AssignmentData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export function AssignmentsPage() {
  const [customImages, setCustomImages] = useState<AssignmentImage[]>([]);
  const [assignmentData, setAssignmentData] = useState<AssignmentData[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AssignmentData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentData | null>(null);

  // Load custom images and assignment data from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('assignmentImages');
    const savedProjectConfig = localStorage.getItem('project_config');
    
    if (savedImages) {
      setCustomImages(JSON.parse(savedImages));
    }
    
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadAssignmentData(config.projectid);
    }
  }, []);

  const loadAssignmentData = (projectid: string) => {
    const assignments: AssignmentData[] = [];
    // Load first 10 assignments
    for (let i = 1; i <= 10; i++) {
      const saved = localStorage.getItem(`assignment_${projectid}_${i}`);
      if (saved) {
        assignments.push(JSON.parse(saved));
      } else {
        // Fallback to default data if no JSON found
        assignments.push({
          id: i,
          title: `Assignment ${i}`,
          subtitle: `Subtitle ${i}`,
          description: `Description ${i}`,
          imageUrl: assignmentImage
        });
      }
    }
    setAssignmentData(assignments);
  };

  const getImageForAssignment = (id: number) => {
    // Check if there's assignment data with image URL
    const assignment = assignmentData.find(a => a.id === id);
    if (assignment && assignment.imageUrl) {
      return assignment.imageUrl;
    }
    
    // Fallback to custom images
    const customImage = customImages.find(img => img.id === id);
    if (customImage?.imageUrl) {
      return customImage.imageUrl;
    }
    
    // Final fallback to default image
    return assignmentImage;
  };

  // Use assignment data if available, otherwise use default
  const assignments = assignmentData.length > 0 ? assignmentData.map(a => ({
    ...a,
    path: `/assignments/${a.id}`
  })) : [
    {
      id: 1,
      title: 'Assignment 1',
      subtitle: 'Basic HTML Structure',
      description: 'Introduction to HTML fundamentals and page structure',
      imageUrl: getImageForAssignment(1),
      path: '/assignments/1'
    },
    {
      id: 2,
      title: 'Assignment 2',
      subtitle: 'CSS Styling Basics',
      description: 'Learning CSS selectors, properties, and layout',
      imageUrl: getImageForAssignment(2),
      path: '/assignments/2'
    },
    {
      id: 3,
      title: 'Assignment 3',
      subtitle: 'Flexbox Layout',
      description: 'Mastering flexbox for responsive layouts',
      imageUrl: getImageForAssignment(3),
      path: '/assignments/3'
    },
    {
      id: 4,
      title: 'Assignment 4',
      subtitle: 'JavaScript Fundamentals',
      description: 'Introduction to JavaScript programming',
      imageUrl: getImageForAssignment(4),
      path: '/assignments/4'
    },
    {
      id: 5,
      title: 'Assignment 5',
      subtitle: 'DOM Manipulation',
      description: 'Working with the Document Object Model',
      imageUrl: getImageForAssignment(5),
      path: '/assignments/5'
    },
    {
      id: 6,
      title: 'Assignment 6',
      subtitle: 'Event Handling',
      description: 'Interactive web pages with JavaScript events',
      imageUrl: getImageForAssignment(6),
      path: '/assignments/6'
    },
    {
      id: 7,
      title: 'Assignment 7',
      subtitle: 'Form Validation',
      description: 'Client-side form validation techniques',
      imageUrl: getImageForAssignment(7),
      path: '/assignments/7'
    },
    {
      id: 8,
      title: 'Assignment 8',
      subtitle: 'API Integration',
      description: 'Fetching and displaying data from external APIs',
      imageUrl: getImageForAssignment(8),
      path: '/assignments/8'
    },
    {
      id: 9,
      title: 'Assignment 9',
      subtitle: 'Local Storage',
      description: 'Persistent data storage in the browser',
      imageUrl: getImageForAssignment(9),
      path: '/assignments/9'
    },
    {
      id: 10,
      title: 'Assignment 10',
      subtitle: 'Final Project',
      description: 'Comprehensive web application project',
      imageUrl: getImageForAssignment(10),
      path: '/assignments/10'
    },
  ];

  // Update assignment data
  const handleUpdateAssignment = (id: number, field: keyof AssignmentData, value: string) => {
    if (!projectId) return;
    
    const assignment = assignmentData.find(a => a.id === id);
    if (assignment) {
      const updated = { ...assignment, [field]: value };
      const updatedData = assignmentData.map(a => a.id === id ? updated : a);
      setAssignmentData(updatedData);
      localStorage.setItem(`assignment_${projectId}_${id}`, JSON.stringify(updated));
    }
  };

  // Start editing an assignment
  const handleStartEdit = (assignment: AssignmentData, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    setEditingAssignment(assignment.id);
    setEditForm({ ...assignment });
  };

  // Save inline edits
  const handleSaveInlineEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editForm && projectId) {
      const updatedData = assignmentData.map(a => 
        a.id === editForm.id ? editForm : a
      );
      setAssignmentData(updatedData);
      localStorage.setItem(`assignment_${projectId}_${editForm.id}`, JSON.stringify(editForm));
      setEditingAssignment(null);
      setEditForm(null);
    }
  };

  // Cancel editing
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingAssignment(null);
    setEditForm(null);
  };

  // Open detail modal for full editing
  const handleOpenDetailModal = (assignment: AssignmentData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAssignment({ ...assignment });
    setShowDetailModal(true);
  };

  // Save detailed changes
  const handleSaveDetailedChanges = () => {
    if (selectedAssignment && projectId) {
      const updatedData = assignmentData.map(a => 
        a.id === selectedAssignment.id ? selectedAssignment : a
      );
      setAssignmentData(updatedData);
      localStorage.setItem(`assignment_${projectId}_${selectedAssignment.id}`, JSON.stringify(selectedAssignment));
      setShowDetailModal(false);
      setSelectedAssignment(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Assignments</h1>
            <p className="text-gray-500">CSCE242</p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              editMode 
                ? 'bg-[#4CBB17] text-white hover:bg-[#3DA013]' 
                : 'bg-white border-2 border-[#4CBB17] text-[#4CBB17] hover:bg-[#4CBB17]/10'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            {editMode ? 'Done Editing' : 'Edit Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assignments.map((assignment) => {
            const isEditing = editingAssignment === assignment.id;
            const displayData = isEditing && editForm ? editForm : assignment;
            
            return (
              <div 
                key={assignment.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow relative group"
              >
                {/* Edit Icon Button - Shows in edit mode */}
                {editMode && !isEditing && (
                  <button
                    onClick={(e) => handleOpenDetailModal(assignment, e)}
                    className="absolute top-2 right-2 z-10 p-2 bg-[#4CBB17] text-white rounded-full hover:bg-[#3DA013] transition-colors shadow-lg"
                    title="Edit Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}

                {/* Card Content */}
                {!isEditing ? (
                  <Link to={assignment.path} className="block">
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden flex items-center justify-center relative">
                      <img
                        src={displayData.imageUrl}
                        alt={displayData.title}
                        className="w-[150px] h-[150px] object-cover rounded"
                      />
                      {editMode && (
                        <button
                          onClick={(e) => handleStartEdit(assignment, e)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <div className="text-white text-center">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Click to edit</p>
                          </div>
                        </button>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{displayData.title}</h3>
                      <p className="text-sm text-gray-600">{displayData.subtitle}</p>
                      <p className="text-xs text-gray-500 mt-2">{displayData.description}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="p-4">
                    {/* Quick Edit Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Image URL</label>
                        <input
                          type="text"
                          value={editForm?.imageUrl || ''}
                          onChange={(e) => setEditForm(editForm ? { ...editForm, imageUrl: e.target.value } : null)}
                          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                          placeholder="Image URL"
                        />
                      </div>
                      <div className="aspect-video bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                        <img
                          src={editForm?.imageUrl || assignmentImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = assignmentImage;
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Short Description</label>
                        <textarea
                          value={editForm?.description || ''}
                          onChange={(e) => setEditForm(editForm ? { ...editForm, description: e.target.value } : null)}
                          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                          rows={2}
                          placeholder="Short description"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveInlineEdit}
                          className="flex-1 px-3 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center justify-center gap-1 text-sm"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors flex items-center justify-center gap-1 text-sm"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Edit Modal */}
      {showDetailModal && selectedAssignment && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Assignment {selectedAssignment.id}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={selectedAssignment.title}
                  onChange={(e) => setSelectedAssignment({ ...selectedAssignment, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="Assignment Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={selectedAssignment.subtitle}
                  onChange={(e) => setSelectedAssignment({ ...selectedAssignment, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="Assignment Subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={selectedAssignment.description}
                  onChange={(e) => setSelectedAssignment({ ...selectedAssignment, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  rows={4}
                  placeholder="Detailed description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="text"
                  value={selectedAssignment.imageUrl}
                  onChange={(e) => setSelectedAssignment({ ...selectedAssignment, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="https://example.com/image.jpg"
                />
                <div className="mt-3 aspect-video bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedAssignment.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = assignmentImage;
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3">
              <button
                onClick={handleSaveDetailedChanges}
                className="flex-1 px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}