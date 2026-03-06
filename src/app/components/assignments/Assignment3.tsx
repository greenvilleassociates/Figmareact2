import { Link } from 'react-router';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';
import { useState, useEffect } from 'react';

interface AssignmentDetailData {
  title: string;
  subtitle: string;
  overview: string;
  objectives: string[];
  requirements: string[];
  dueDate: string;
}

const defaultData: AssignmentDetailData = {
  title: 'Assignment 3',
  subtitle: 'Flexbox Layout',
  overview: 'Master CSS Flexbox for creating responsive, flexible layouts. Learn to align, distribute, and organize content using modern layout techniques that work across all screen sizes.',
  objectives: [
    'Understand flexbox container and item properties',
    'Create responsive multi-column layouts',
    'Master alignment and justification',
    'Build navigation bars and card layouts'
  ],
  requirements: [
    'Create a responsive navigation bar using flexbox',
    'Build a card-based layout with 3 columns',
    'Implement center-aligned content sections',
    'Make layout responsive for mobile devices',
    'Use flex-grow, flex-shrink, and flex-basis'
  ],
  dueDate: 'March 1, 2026'
};

export function Assignment3() {
  const [data, setData] = useState<AssignmentDetailData>(defaultData);
  const [editMode, setEditMode] = useState(false);
  const [editingData, setEditingData] = useState<AssignmentDetailData | null>(null);
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadAssignmentData(config.projectid);
    }
  }, []);

  const loadAssignmentData = (projectid: string) => {
    const saved = localStorage.getItem(`${projectid}a3.json`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.detailData) {
        setData(parsed.detailData);
      }
    }
  };

  const saveAssignmentData = (dataToSave: AssignmentDetailData) => {
    if (projectId) {
      const existingSaved = localStorage.getItem(`${projectId}a3.json`);
      let existingData = existingSaved ? JSON.parse(existingSaved) : {};
      existingData.detailData = dataToSave;
      localStorage.setItem(`${projectId}a3.json`, JSON.stringify(existingData));
      setData(dataToSave);
    }
  };

  const handleStartEdit = () => {
    setEditMode(true);
    setEditingData({ ...data });
  };

  const handleSaveEdit = () => {
    if (editingData) {
      saveAssignmentData(editingData);
      setEditMode(false);
      setEditingData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingData(null);
  };

  const handleAddObjective = () => {
    if (editingData) {
      setEditingData({
        ...editingData,
        objectives: [...editingData.objectives, 'New objective']
      });
    }
  };

  const handleRemoveObjective = (index: number) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        objectives: editingData.objectives.filter((_, i) => i !== index)
      });
    }
  };

  const handleAddRequirement = () => {
    if (editingData) {
      setEditingData({
        ...editingData,
        requirements: [...editingData.requirements, 'New requirement']
      });
    }
  };

  const handleRemoveRequirement = (index: number) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        requirements: editingData.requirements.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/assignments" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.title}</h1>
            <p className="text-gray-600">{data.subtitle}</p>
          </div>
          <button
            onClick={editMode ? handleSaveEdit : handleStartEdit}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              editMode 
                ? 'bg-[#4CBB17] text-white hover:bg-[#3DA013]' 
                : 'bg-white border-2 border-[#4CBB17] text-[#4CBB17] hover:bg-[#4CBB17]/10'
            }`}
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit
              </>
            )}
          </button>
        </div>
      </div>

      {editMode && (
        <div className="mx-6 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Editing Mode:</strong> Update assignment details, objectives, and requirements.
          </p>
          <button
            onClick={handleCancelEdit}
            className="mt-2 px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      )}

      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={assignmentImage} 
              alt="Assignment 3"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              {editMode && editingData ? (
                <textarea
                  value={editingData.overview}
                  onChange={(e) => setEditingData({ ...editingData, overview: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17] min-h-[100px]"
                  placeholder="Assignment overview..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {data.overview}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Learning Objectives</h3>
              {editMode && editingData ? (
                <div className="space-y-2">
                  {editingData.objectives.map((obj, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => {
                          const newObjectives = [...editingData.objectives];
                          newObjectives[index] = e.target.value;
                          setEditingData({ ...editingData, objectives: newObjectives });
                        }}
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                      />
                      <button
                        onClick={() => handleRemoveObjective(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddObjective}
                    className="px-4 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] text-sm"
                  >
                    + Add Objective
                  </button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {data.objectives.map((obj, index) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              {editMode && editingData ? (
                <div className="space-y-2">
                  {editingData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => {
                          const newRequirements = [...editingData.requirements];
                          newRequirements[index] = e.target.value;
                          setEditingData({ ...editingData, requirements: newRequirements });
                        }}
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                      />
                      <button
                        onClick={() => handleRemoveRequirement(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddRequirement}
                    className="px-4 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] text-sm"
                  >
                    + Add Requirement
                  </button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {data.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Due Date</h3>
              {editMode && editingData ? (
                <input
                  type="text"
                  value={editingData.dueDate}
                  onChange={(e) => setEditingData({ ...editingData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="Due date..."
                />
              ) : (
                <p className="text-gray-700">{data.dueDate}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
