import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface Picture {
  id: string;
  url: string;
  caption: string;
}

interface PictureWallData {
  name: string;
  subtitle: string;
  position: string;
  address1: string;
  address2: string;
  description: string;
  pictures: Picture[];
}

const defaultPictureWallData: PictureWallData = {
  name: 'John S. Stritzinger',
  subtitle: 'Global Tech Executive',
  position: 'Graduate Assistant - University of South Carolina',
  address1: '1800 Washington Street',
  address2: 'Columbia, South Carolina 29201',
  description: 'A visual collection of moments, memories, and milestones from my personal and professional journey.',
  pictures: []
};

export function PictureWallPage() {
  const [data, setData] = useState<PictureWallData>(defaultPictureWallData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PictureWallData>(defaultPictureWallData);
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
        const savedData = localStorage.getItem(`${projectid}_picturewall`);

        if (savedData) {
          const parsed = JSON.parse(savedData);
          setData(parsed);
          setEditData(parsed);
        } else {
          // Load default data from JSON file
          try {
            const response = await fetch('/data/picturewall.json');
            if (response.ok) {
              const jsonData = await response.json();
              setData(jsonData);
              setEditData(jsonData);
            }
          } catch (error) {
            console.log('No default picturewall.json found, using hardcoded defaults');
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
      localStorage.setItem(`${projectid}_picturewall`, JSON.stringify(editData));
      setData(editData);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  // Add new picture
  const addPicture = () => {
    if (editData.pictures.length >= 20) {
      alert('Maximum 20 pictures allowed');
      return;
    }
    const newPicture: Picture = {
      id: Date.now().toString(),
      url: '',
      caption: ''
    };
    setEditData({
      ...editData,
      pictures: [...editData.pictures, newPicture]
    });
  };

  // Remove picture
  const removePicture = (id: string) => {
    setEditData({
      ...editData,
      pictures: editData.pictures.filter(p => p.id !== id)
    });
  };

  // Update picture
  const updatePicture = (id: string, field: keyof Picture, value: string) => {
    setEditData({
      ...editData,
      pictures: editData.pictures.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Picture Wall</h1>
          <p className="text-gray-600">Visual Gallery</p>
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
            <h2 className="text-3xl font-bold mb-6">Picture Wall</h2>
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
            <h3 className="text-2xl font-semibold mb-4">About Picture Wall</h3>
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

          {isEditing && (
            <div className="mb-6">
              <button
                onClick={addPicture}
                disabled={editData.pictures.length >= 20}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CBB17] hover:bg-[#4CBB17]/5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#4CBB17] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Add Picture ({editData.pictures.length}/20)
              </button>
            </div>
          )}

          {/* Picture Grid */}
          {!isEditing ? (
            <div className="flex flex-wrap gap-4">
              {data.pictures.map((picture) => (
                <div key={picture.id} className="flex-shrink-0">
                  <img
                    src={picture.url}
                    alt={picture.caption || 'Picture'}
                    className="w-64 h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  />
                  {picture.caption && (
                    <p className="text-sm text-gray-600 mt-2 text-center">{picture.caption}</p>
                  )}
                </div>
              ))}
              {data.pictures.length === 0 && (
                <div className="w-full text-center py-12 text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                  <p>No pictures yet. Add some in edit mode!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {editData.pictures.map((picture) => (
                <div key={picture.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          type="url"
                          value={picture.url}
                          onChange={(e) => updatePicture(picture.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
                        <input
                          type="text"
                          value={picture.caption}
                          onChange={(e) => updatePicture(picture.id, 'caption', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          placeholder="Add a caption..."
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {picture.url && (
                        <img
                          src={picture.url}
                          alt={picture.caption || 'Preview'}
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      )}
                      <button
                        onClick={() => removePicture(picture.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
