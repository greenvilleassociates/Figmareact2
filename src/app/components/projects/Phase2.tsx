import { Link } from 'react-router';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import projectImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';
import { useState, useEffect } from 'react';

interface PhaseDetailData {
  title: string;
  subtitle: string;
  overview: string;
  deliverables: string[];
  accomplishments: string[];
  status: string;
}

const defaultData: PhaseDetailData = {
  title: 'Phase II',
  subtitle: 'Requirements Gathering',
  overview: 'Phase II involves comprehensive requirements gathering and analysis. This phase ensures that all stakeholder needs are documented and understood. Functional and non-functional requirements are identified, prioritized, and validated with the project team and stakeholders.',
  deliverables: [
    'Requirements Specification Document',
    'User Stories and Use Cases',
    'Functional Requirements Matrix',
    'Non-Functional Requirements List',
    'Requirements Traceability Matrix'
  ],
  accomplishments: [
    'Conducted stakeholder interviews and workshops',
    'Documented 50+ functional requirements',
    'Created user personas and journey maps',
    'Defined acceptance criteria for each requirement',
    'Established requirements baseline for design phase'
  ],
  status: 'Completed'
};

export function Phase2() {
  const [data, setData] = useState<PhaseDetailData>(defaultData);
  const [editMode, setEditMode] = useState(false);
  const [editingData, setEditingData] = useState<PhaseDetailData | null>(null);
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadPhaseData(config.projectid);
    }
  }, []);

  const loadPhaseData = (projectid: string) => {
    const saved = localStorage.getItem(`${projectid}p2.json`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.detailData) {
        setData(parsed.detailData);
      }
    }
  };

  const savePhaseData = (dataToSave: PhaseDetailData) => {
    if (projectId) {
      const existingSaved = localStorage.getItem(`${projectId}p2.json`);
      let existingData = existingSaved ? JSON.parse(existingSaved) : {};
      existingData.detailData = dataToSave;
      localStorage.setItem(`${projectId}p2.json`, JSON.stringify(existingData));
      setData(dataToSave);
    }
  };

  const handleStartEdit = () => {
    setEditMode(true);
    setEditingData({ ...data });
  };

  const handleSaveEdit = () => {
    if (editingData) {
      savePhaseData(editingData);
      setEditMode(false);
      setEditingData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingData(null);
  };

  const handleAddDeliverable = () => {
    if (editingData) {
      setEditingData({
        ...editingData,
        deliverables: [...editingData.deliverables, 'New deliverable']
      });
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        deliverables: editingData.deliverables.filter((_, i) => i !== index)
      });
    }
  };

  const handleAddAccomplishment = () => {
    if (editingData) {
      setEditingData({
        ...editingData,
        accomplishments: [...editingData.accomplishments, 'New accomplishment']
      });
    }
  };

  const handleRemoveAccomplishment = (index: number) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        accomplishments: editingData.accomplishments.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
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
            <strong>Editing Mode:</strong> Update phase details, deliverables, and accomplishments.
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
              src={projectImage} 
              alt="Phase 2"
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
                  placeholder="Phase overview..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {data.overview}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Key Deliverables</h3>
              {editMode && editingData ? (
                <div className="space-y-2">
                  {editingData.deliverables.map((del, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={del}
                        onChange={(e) => {
                          const newDeliverables = [...editingData.deliverables];
                          newDeliverables[index] = e.target.value;
                          setEditingData({ ...editingData, deliverables: newDeliverables });
                        }}
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                      />
                      <button
                        onClick={() => handleRemoveDeliverable(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddDeliverable}
                    className="px-4 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] text-sm"
                  >
                    + Add Deliverable
                  </button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {data.deliverables.map((del, index) => (
                    <li key={index}>{del}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Accomplishments</h3>
              {editMode && editingData ? (
                <div className="space-y-2">
                  {editingData.accomplishments.map((acc, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={acc}
                        onChange={(e) => {
                          const newAccomplishments = [...editingData.accomplishments];
                          newAccomplishments[index] = e.target.value;
                          setEditingData({ ...editingData, accomplishments: newAccomplishments });
                        }}
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                      />
                      <button
                        onClick={() => handleRemoveAccomplishment(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddAccomplishment}
                    className="px-4 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] text-sm"
                  >
                    + Add Accomplishment
                  </button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {data.accomplishments.map((acc, index) => (
                    <li key={index}>{acc}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Status</h3>
              {editMode && editingData ? (
                <select
                  value={editingData.status}
                  onChange={(e) => setEditingData({ ...editingData, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                  <option value="On Hold">On Hold</option>
                </select>
              ) : (
                <p className={`text-gray-700 font-bold ${
                  data.status === 'Completed' ? 'text-green-700' :
                  data.status === 'In Progress' ? 'text-blue-700' :
                  data.status === 'Planned' ? 'text-gray-700' :
                  'text-yellow-700'
                }`}>
                  {data.status}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
