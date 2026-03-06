import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import cg2ReactImage from 'figma:asset/1adaebb429dea844c383a809ddc9933815950938.png';
import myLinkImage from 'figma:asset/d3c977461892fe88a85a7a56577a399e87336077.png';
import webmasterImage from 'figma:asset/a9f549a53dec630eac0ee12616909b57e2eeafb6.png';

interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

interface PortfolioData {
  name: string;
  subtitle: string;
  position: string;
  address1: string;
  address2: string;
  description: string;
  items: PortfolioItem[];
}

const defaultPortfolioData: PortfolioData = {
  name: 'John S. Stritzinger',
  subtitle: 'Global Tech Executive',
  position: 'Graduate Assistant - University of South Carolina',
  address1: '1800 Washington Street',
  address2: 'Columbia, South Carolina 29201',
  description: 'This portfolio highlights my work across web development, research, and enterprise systems. It includes links to my professional sites, academic assignments, and ongoing research interests. Each section reflects my commitment to technology leadership, innovation, and continuous learning.',
  items: [
    {
      id: '1',
      title: 'CG2 React Tools',
      imageUrl: cg2ReactImage,
      description: 'Motocross park booking platform'
    },
    {
      id: '2',
      title: 'Webmaster Links',
      imageUrl: webmasterImage,
      description: 'GBK Castries web platform'
    },
    {
      id: '3',
      title: 'MyLinkV3',
      imageUrl: myLinkImage,
      description: 'Motocross camping and outdoor recreation platform'
    }
  ]
};

export function PortfolioPage() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PortfolioData>(defaultPortfolioData);

  // Load data from localStorage on mount
  useEffect(() => {
    const projectData = localStorage.getItem('currentProject');
    if (projectData) {
      const project = JSON.parse(projectData);
      const projectid = project.projectid || project.id;
      const savedData = localStorage.getItem(`${projectid}_portfolio`);
      
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
      localStorage.setItem(`${projectid}_portfolio`, JSON.stringify(editData));
      setData(editData);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  // Add new portfolio item
  const addItem = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: 'New Project',
      imageUrl: '',
      description: 'Project description'
    };
    setEditData({
      ...editData,
      items: [...editData.items, newItem]
    });
  };

  // Remove portfolio item
  const removeItem = (id: string) => {
    setEditData({
      ...editData,
      items: editData.items.filter(i => i.id !== id)
    });
  };

  // Update portfolio item
  const updateItem = (id: string, field: keyof PortfolioItem, value: string) => {
    setEditData({
      ...editData,
      items: editData.items.map(i => 
        i.id === id ? { ...i, [field]: value } : i
      )
    });
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Portfolio</h2>
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
            <h3 className="text-2xl font-semibold mb-4">Portfolio</h3>
            {!isEditing ? (
              <p className="text-gray-700 leading-relaxed">
                {data.description}
              </p>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="space-y-8">
            {isEditing && (
              <button
                onClick={addItem}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CBB17] hover:bg-[#4CBB17]/5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#4CBB17]"
              >
                <Plus className="w-5 h-5" />
                Add Portfolio Item
              </button>
            )}

            {(isEditing ? editData : data).items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                {!isEditing ? (
                  <>
                    <h4 className="text-xl font-semibold mb-4">{item.title}</h4>
                    <div className="flex justify-center">
                      <img 
                        src={item.imageUrl} 
                        alt={item.description}
                        className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={item.imageUrl}
                            onChange={(e) => updateItem(item.id, 'imageUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                            placeholder="Enter image URL"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-6 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.imageUrl && (
                      <div className="flex justify-center pt-4">
                        <img 
                          src={item.imageUrl} 
                          alt={item.description}
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
