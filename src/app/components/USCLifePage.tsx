import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import campusGatesImage from 'figma:asset/8084a8306ae2e8c0d78ac2ac990f1914811e0108.png';
import arenaImage from 'figma:asset/221e4451f2eb1c2628c17d60546e60d99c28da47.png';

interface USCSection {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

interface USCLifeData {
  name: string;
  position: string;
  address1: string;
  address2: string;
  sections: USCSection[];
}

const defaultUSCLifeData: USCLifeData = {
  name: 'John S. Stritzinger',
  position: 'Graduate Assistant - University of South Carolina',
  address1: '1800 Washington Street',
  address2: 'Columbia, South Carolina 29201',
  sections: [
    {
      id: '1',
      title: 'USC Sports',
      imageUrl: arenaImage,
      description: 'Colonial Life Arena during a basketball game'
    },
    {
      id: '2',
      title: 'Campus Views',
      imageUrl: campusGatesImage,
      description: 'University of South Carolina campus entrance gates'
    }
  ]
};

export function USCLifePage() {
  const [data, setData] = useState<USCLifeData>(defaultUSCLifeData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<USCLifeData>(defaultUSCLifeData);
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
    const projectData = localStorage.getItem('currentProject');
    if (projectData) {
      const project = JSON.parse(projectData);
      const projectid = project.projectid || project.id;
      const savedData = localStorage.getItem(`${projectid}_usclife`);
      
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
      localStorage.setItem(`${projectid}_usclife`, JSON.stringify(editData));
      setData(editData);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  // Add new section
  const addSection = () => {
    const newSection: USCSection = {
      id: Date.now().toString(),
      title: 'New Section',
      imageUrl: '',
      description: 'Section description'
    };
    setEditData({
      ...editData,
      sections: [...editData.sections, newSection]
    });
  };

  // Remove section
  const removeSection = (id: string) => {
    setEditData({
      ...editData,
      sections: editData.sections.filter(s => s.id !== id)
    });
  };

  // Update section
  const updateSection = (id: string, field: keyof USCSection, value: string) => {
    setEditData({
      ...editData,
      sections: editData.sections.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    });
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">USC Life</h1>
          <p className="text-gray-600">Author Page</p>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Life at USC</h2>
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
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {isEditing && (
              <button
                onClick={addSection}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CBB17] hover:bg-[#4CBB17]/5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#4CBB17]"
              >
                <Plus className="w-5 h-5" />
                Add Section
              </button>
            )}

            {(isEditing ? editData : data).sections.map((section) => (
              <div key={section.id}>
                {!isEditing ? (
                  <>
                    <h3 className="text-2xl font-semibold mb-4 text-red-700">{section.title}</h3>
                    <div className="flex justify-center">
                      <img 
                        src={section.imageUrl} 
                        alt={section.description}
                        className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={section.description}
                            onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={section.imageUrl}
                            onChange={(e) => updateSection(section.id, 'imageUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                            placeholder="Enter image URL"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeSection(section.id)}
                        className="mt-6 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {section.imageUrl && (
                      <div className="flex justify-center pt-4 mt-4 border-t">
                        <img 
                          src={section.imageUrl} 
                          alt={section.description}
                          className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
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