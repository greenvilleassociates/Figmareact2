import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import golfImage from 'figma:asset/d8b89db27256015cfae3bbf286057420c99688d5.png';

interface Interest {
  id: string;
  title: string;
  color: string;
}

interface InterestsData {
  name: string;
  position: string;
  address1: string;
  address2: string;
  imageUrl: string;
  interests: Interest[];
}

const defaultInterestsData: InterestsData = {
  name: 'John S. Stritzinger',
  position: 'Graduate Assistant - University of South Carolina',
  address1: '1800 Washington Street',
  address2: 'Columbia, South Carolina 29201',
  imageUrl: golfImage,
  interests: [
    { id: '1', title: 'Youth Soccer', color: 'bg-blue-50' },
    { id: '2', title: 'Golf', color: 'bg-green-50' }
  ]
};

export function InterestsPage() {
  const [data, setData] = useState<InterestsData>(defaultInterestsData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<InterestsData>(defaultInterestsData);

  // Load data from localStorage on mount
  useEffect(() => {
    const projectData = localStorage.getItem('currentProject');
    if (projectData) {
      const project = JSON.parse(projectData);
      const projectid = project.projectid || project.id;
      const savedData = localStorage.getItem(`${projectid}_interests`);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        setEditData(parsed);
      }
    }
  }, []);

  // Save data to localStorage
  const handleSave = () => {
    const projectData = localStorage.getItem('currentProject');
    if (projectData) {
      const project = JSON.parse(projectData);
      const projectid = project.projectid || project.id;
      localStorage.setItem(`${projectid}_interests`, JSON.stringify(editData));
      setData(editData);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  // Add new interest
  const addInterest = () => {
    const newInterest: Interest = {
      id: Date.now().toString(),
      title: 'New Interest',
      color: 'bg-gray-50'
    };
    setEditData({
      ...editData,
      interests: [...editData.interests, newInterest]
    });
  };

  // Remove interest
  const removeInterest = (id: string) => {
    setEditData({
      ...editData,
      interests: editData.interests.filter(i => i.id !== id)
    });
  };

  // Update interest
  const updateInterest = (id: string, field: keyof Interest, value: string) => {
    setEditData({
      ...editData,
      interests: editData.interests.map(i => 
        i.id === id ? { ...i, [field]: value } : i
      )
    });
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interests</h1>
          <p className="text-gray-600">Author Page</p>
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">My Interests</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              {!isEditing ? (
                <div className="space-y-2">
                  <p className="font-semibold text-lg">{data.name}</p>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editData.imageUrl}
                      onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <img 
              src={isEditing ? editData.imageUrl : data.imageUrl} 
              alt="Interest"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            {isEditing && (
              <button
                onClick={addInterest}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CBB17] hover:bg-[#4CBB17]/5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#4CBB17]"
              >
                <Plus className="w-5 h-5" />
                Add Interest
              </button>
            )}
            
            {(isEditing ? editData : data).interests.map((interest) => (
              <div key={interest.id} className={`${interest.color} p-6 rounded-lg relative`}>
                {!isEditing ? (
                  <h3 className="text-2xl font-semibold mb-2">{interest.title}</h3>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={interest.title}
                            onChange={(e) => updateInterest(interest.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                          <select
                            value={interest.color}
                            onChange={(e) => updateInterest(interest.id, 'color', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          >
                            <option value="bg-blue-50">Blue</option>
                            <option value="bg-green-50">Green</option>
                            <option value="bg-red-50">Red</option>
                            <option value="bg-yellow-50">Yellow</option>
                            <option value="bg-purple-50">Purple</option>
                            <option value="bg-pink-50">Pink</option>
                            <option value="bg-gray-50">Gray</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => removeInterest(interest.id)}
                        className="mt-6 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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