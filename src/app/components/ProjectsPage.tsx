import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Edit2, Save, X, Image as ImageIcon } from 'lucide-react';

interface ProjectImage {
  id: number;
  imageUrl: string;
}

interface ProjectPhaseData {
  id: number;
  phase: string;
  title: string;
  status: string;
  imageUrl: string;
}

export function ProjectsPage() {
  const [customImages, setCustomImages] = useState<ProjectImage[]>([]);
  const [projectPhaseData, setProjectPhaseData] = useState<ProjectPhaseData[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editingPhase, setEditingPhase] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ProjectPhaseData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhaseData | null>(null);

  // Load custom images and project phase data from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('projectImages');
    const savedProjectConfig = localStorage.getItem('project_config');
    
    if (savedImages) {
      setCustomImages(JSON.parse(savedImages));
    }
    
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadProjectPhaseData(config.projectid);
    }
  }, []);

  const loadProjectPhaseData = (projectid: string) => {
    const phases: ProjectPhaseData[] = [];
    // Load all 10 project phases
    for (let i = 1; i <= 10; i++) {
      const saved = localStorage.getItem(`project_phase_${projectid}_${i}`);
      if (saved) {
        phases.push(JSON.parse(saved));
      } else {
        // Fallback to default data if no JSON found
        phases.push({
          id: i,
          phase: `Phase ${toRoman(i)}`,
          title: `Phase ${i} Title`,
          status: i <= 4 ? 'Completed' : i === 5 ? 'In Progress' : 'Pending',
          imageUrl: assignmentImage
        });
      }
    }
    setProjectPhaseData(phases);
  };

  const toRoman = (num: number): string => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[num - 1] || num.toString();
  };

  const getImageForPhase = (id: number) => {
    // Check if there's project phase data with image URL
    const phase = projectPhaseData.find(p => p.id === id);
    if (phase && phase.imageUrl) {
      return phase.imageUrl;
    }
    
    // Fallback to custom images
    const customImage = customImages.find(img => img.id === id);
    if (customImage?.imageUrl) {
      return customImage.imageUrl;
    }
    
    // Final fallback to default image
    return assignmentImage;
  };

  // Use project phase data if available, otherwise use default
  const phases = projectPhaseData.length > 0 ? projectPhaseData.map(p => ({
    ...p,
    path: `/projects/${p.id}`
  })) : [
    { phase: 'Phase I', title: 'Project Initialization', status: 'Completed', image: getImageForPhase(1), path: '/projects/1' },
    { phase: 'Phase II', title: 'Requirements Gathering', status: 'Completed', image: getImageForPhase(2), path: '/projects/2' },
    { phase: 'Phase III', title: 'Design & Architecture', status: 'Completed', image: getImageForPhase(3), path: '/projects/3' },
    { phase: 'Phase IV', title: 'Frontend Development', status: 'Completed', image: getImageForPhase(4), path: '/projects/4' },
    { phase: 'Phase V', title: 'Backend Development', status: 'In Progress', image: getImageForPhase(5), path: '/projects/5' },
    { phase: 'Phase VI', title: 'Integration Testing', status: 'Pending', image: getImageForPhase(6), path: '/projects/6' },
    { phase: 'Phase VII', title: 'User Acceptance Testing', status: 'Pending', image: getImageForPhase(7), path: '/projects/7' },
    { phase: 'Phase VIII', title: 'Deployment Preparation', status: 'Pending', image: getImageForPhase(8), path: '/projects/8' },
    { phase: 'Phase IX', title: 'Production Deployment', status: 'Pending', image: getImageForPhase(9), path: '/projects/9' },
    { phase: 'Phase X', title: 'Maintenance & Support', status: 'Pending', image: getImageForPhase(10), path: '/projects/10' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Start editing a phase
  const handleStartEdit = (phase: ProjectPhaseData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPhase(phase.id);
    setEditForm({ ...phase });
  };

  // Save inline edits
  const handleSaveInlineEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editForm && projectId) {
      const updatedData = projectPhaseData.map(p => 
        p.id === editForm.id ? editForm : p
      );
      setProjectPhaseData(updatedData);
      localStorage.setItem(`project_phase_${projectId}_${editForm.id}`, JSON.stringify(editForm));
      setEditingPhase(null);
      setEditForm(null);
    }
  };

  // Cancel editing
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPhase(null);
    setEditForm(null);
  };

  // Open detail modal for full editing
  const handleOpenDetailModal = (phase: ProjectPhaseData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPhase({ ...phase });
    setShowDetailModal(true);
  };

  // Save detailed changes
  const handleSaveDetailedChanges = () => {
    if (selectedPhase && projectId) {
      const updatedData = projectPhaseData.map(p => 
        p.id === selectedPhase.id ? selectedPhase : p
      );
      setProjectPhaseData(updatedData);
      localStorage.setItem(`project_phase_${projectId}_${selectedPhase.id}`, JSON.stringify(selectedPhase));
      setShowDetailModal(false);
      setSelectedPhase(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Project Phases</h1>
            <p className="text-gray-500">Development Lifecycle</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {phases.map((phase, index) => {
            const isEditing = editingPhase === phase.id;
            const displayData = isEditing && editForm ? editForm : phase;
            
            return (
              <div 
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow relative group"
              >
                {/* Edit Icon Button - Shows in edit mode */}
                {editMode && !isEditing && (
                  <button
                    onClick={(e) => handleOpenDetailModal(phase, e)}
                    className="absolute top-2 right-2 z-10 p-2 bg-[#4CBB17] text-white rounded-full hover:bg-[#3DA013] transition-colors shadow-lg"
                    title="Edit Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}

                {/* Card Content */}
                {!isEditing ? (
                  <Link to={phase.path} className="block">
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden flex items-center justify-center relative">
                      <img
                        src={displayData.imageUrl || displayData.image}
                        alt={displayData.phase}
                        className="rounded max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                      />
                      {editMode && (
                        <button
                          onClick={(e) => handleStartEdit(phase, e)}
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
                      <h3 className="font-semibold mb-1">{displayData.phase}</h3>
                      <p className="text-sm text-gray-600 mb-2">{displayData.title}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(displayData.status)}`}>
                        {displayData.status}
                      </span>
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
                        <label className="block text-xs font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={editForm?.title || ''}
                          onChange={(e) => setEditForm(editForm ? { ...editForm, title: e.target.value } : null)}
                          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                          placeholder="Phase title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Status</label>
                        <select
                          value={editForm?.status || 'Pending'}
                          onChange={(e) => setEditForm(editForm ? { ...editForm, status: e.target.value } : null)}
                          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                        </select>
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

      {/* Project Summary */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {phases.filter(p => p.status === 'Completed').length}
          </p>
        </div>
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">
            {phases.filter(p => p.status === 'In Progress').length}
          </p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-gray-600">
            {phases.filter(p => p.status === 'Pending').length}
          </p>
        </div>
      </div>

      {/* Detail Edit Modal */}
      {showDetailModal && selectedPhase && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit {selectedPhase.phase}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phase Label</label>
                <input
                  type="text"
                  value={selectedPhase.phase}
                  onChange={(e) => setSelectedPhase({ ...selectedPhase, phase: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="Phase I, Phase II, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={selectedPhase.title}
                  onChange={(e) => setSelectedPhase({ ...selectedPhase, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="Phase Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={selectedPhase.status}
                  onChange={(e) => setSelectedPhase({ ...selectedPhase, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="text"
                  value={selectedPhase.imageUrl}
                  onChange={(e) => setSelectedPhase({ ...selectedPhase, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="https://example.com/image.jpg"
                />
                <div className="mt-3 aspect-video bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedPhase.imageUrl}
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