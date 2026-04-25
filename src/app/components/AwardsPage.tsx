import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, Award } from 'lucide-react';

interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  imageUrl: string;
}

interface AwardsData {
  name: string;
  subtitle: string;
  position: string;
  address1: string;
  address2: string;
  description: string;
  awards: AwardItem[];
}

const defaultAwardsData: AwardsData = {
  name: 'John S. Stritzinger',
  subtitle: 'Global Tech Executive',
  position: 'Graduate Assistant - University of South Carolina',
  address1: '1800 Washington Street',
  address2: 'Columbia, South Carolina 29201',
  description: 'This section showcases the professional awards and recognitions I have received throughout my career. Each award represents milestones in technology leadership, innovation, and excellence in software development.',
  awards: [
    {
      id: '1',
      title: 'Innovation Excellence Award',
      organization: 'Tech Industry Association',
      year: '2024',
      description: 'Recognized for groundbreaking work in enterprise system architecture',
      imageUrl: ''
    },
    {
      id: '2',
      title: 'Outstanding Research Award',
      organization: 'University of South Carolina',
      year: '2023',
      description: 'Awarded for excellence in software engineering research',
      imageUrl: ''
    }
  ]
};

export function AwardsPage() {
  const [data, setData] = useState<AwardsData>(defaultAwardsData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AwardsData>(defaultAwardsData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    if (savedLoginStatus) {
      setIsLoggedIn(JSON.parse(savedLoginStatus));
    }
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      const projectData = localStorage.getItem('currentProject');
      if (projectData) {
        const project = JSON.parse(projectData);
        const projectid = project.projectid || project.id;
        const savedData = localStorage.getItem(`${projectid}_awards`);

        if (savedData) {
          const parsed = JSON.parse(savedData);
          setData(parsed);
          setEditData(parsed);
        } else {
          // Load default data from JSON file
          try {
            const response = await fetch('/data/awards.json');
            if (response.ok) {
              const jsonData = await response.json();
              setData(jsonData);
              setEditData(jsonData);
            }
          } catch (error) {
            console.log('No default awards.json found, using hardcoded defaults');
          }
        }
      }
    };
    loadData();
  }, []);

  // Save data to localStorage
  const handleSave = () => {
    const projectData = localStorage.getItem('currentProject');
    if (projectData) {
      const project = JSON.parse(projectData);
      const projectid = project.projectid || project.id;
      localStorage.setItem(`${projectid}_awards`, JSON.stringify(editData));
      setData(editData);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  // Add new award
  const addAward = () => {
    const newAward: AwardItem = {
      id: Date.now().toString(),
      title: 'New Award',
      organization: '',
      year: new Date().getFullYear().toString(),
      description: '',
      imageUrl: ''
    };
    setEditData({
      ...editData,
      awards: [...editData.awards, newAward]
    });
  };

  // Remove award
  const removeAward = (id: string) => {
    setEditData({
      ...editData,
      awards: editData.awards.filter(a => a.id !== id)
    });
  };

  // Update award
  const updateAward = (id: string, field: keyof AwardItem, value: string) => {
    setEditData({
      ...editData,
      awards: editData.awards.map(a =>
        a.id === id ? { ...a, [field]: value } : a
      )
    });
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Awards</h1>
          <p className="text-gray-600">Recognition & Achievements</p>
        </div>
        <div className="flex gap-2">
          {isLoggedIn && (
            <>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Awards</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              {!isEditing ? (
                <div className="space-y-2">
                  <p className="font-semibold text-lg">{data.name}</p>
                  <p className="text-red-700 font-medium">{data.subtitle}</p>
                  <p>{data.position}</p>
                  <p>{data.address1}</p>
                  <p>{data.address2}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={editData.subtitle}
                      onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={editData.position}
                      onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={editData.address1}
                      onChange={(e) => setEditData({ ...editData, address1: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={editData.address2}
                      onChange={(e) => setEditData({ ...editData, address2: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">About Awards</h3>
            {!isEditing ? (
              <p className="text-gray-700 leading-relaxed">
                {data.description}
              </p>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            {isEditing && (
              <button
                onClick={addAward}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CBB17] hover:bg-[#4CBB17]/5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#4CBB17]"
              >
                <Plus className="w-5 h-5" />
                Add Award
              </button>
            )}

            {(isEditing ? editData : data).awards.map((award) => (
              <div key={award.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                {!isEditing ? (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {award.imageUrl ? (
                        <img
                          src={award.imageUrl}
                          alt={award.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                          <Award className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2">{award.title}</h4>
                      <p className="text-gray-600 mb-1"><strong>Organization:</strong> {award.organization}</p>
                      <p className="text-gray-600 mb-1"><strong>Year:</strong> {award.year}</p>
                      {award.description && (
                        <p className="text-gray-700 mt-3">{award.description}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Award Title</label>
                          <input
                            type="text"
                            value={award.title}
                            onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                          <input
                            type="text"
                            value={award.organization}
                            onChange={(e) => updateAward(award.id, 'organization', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <input
                            type="text"
                            value={award.year}
                            onChange={(e) => updateAward(award.id, 'year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={award.description}
                            onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                          <input
                            type="url"
                            value={award.imageUrl}
                            onChange={(e) => updateAward(award.id, 'imageUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeAward(award.id)}
                        className="mt-6 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {award.imageUrl && (
                      <div className="flex justify-center pt-4">
                        <img
                          src={award.imageUrl}
                          alt={award.title}
                          className="w-40 h-40 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
