import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, BookOpen } from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  type: 'book' | 'article';
  authors: string;
  year: string;
  publisher: string;
  url: string;
  description: string;
}

interface PublicationsData {
  name: string;
  subtitle: string;
  position: string;
  address1: string;
  address2: string;
  description: string;
  publications: Publication[];
}

const defaultPublicationsData: PublicationsData = {
  name: 'John S. Stritzinger',
  subtitle: 'Global Tech Executive',
  position: 'Graduate Assistant - University of South Carolina',
  address1: '1800 Washington Street',
  address2: 'Columbia, South Carolina 29201',
  description: 'This section highlights my published works, including books and research articles. Each publication reflects my commitment to advancing knowledge in technology, enterprise systems, and software development.',
  publications: [
    {
      id: '1',
      title: 'Enterprise Systems Architecture',
      type: 'book',
      authors: 'John S. Stritzinger',
      year: '2024',
      publisher: 'Tech Publishing',
      url: '',
      description: 'A comprehensive guide to modern enterprise system design'
    },
    {
      id: '2',
      title: 'Cloud Migration Strategies',
      type: 'article',
      authors: 'John S. Stritzinger, et al.',
      year: '2023',
      publisher: 'Journal of Software Engineering',
      url: '',
      description: 'Research on effective cloud migration methodologies'
    }
  ]
};

export function PublicationsPage() {
  const [data, setData] = useState<PublicationsData>(defaultPublicationsData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PublicationsData>(defaultPublicationsData);
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
        const savedData = localStorage.getItem(`${projectid}_publications`);

        if (savedData) {
          const parsed = JSON.parse(savedData);
          setData(parsed);
          setEditData(parsed);
        } else {
          // Load default data from JSON file
          try {
            const response = await fetch('/data/publications.json');
            if (response.ok) {
              const jsonData = await response.json();
              setData(jsonData);
              setEditData(jsonData);
            }
          } catch (error) {
            console.log('No default publications.json found, using hardcoded defaults');
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
      localStorage.setItem(`${projectid}_publications`, JSON.stringify(editData));
      setData(editData);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  // Add new publication
  const addPublication = () => {
    const newPublication: Publication = {
      id: Date.now().toString(),
      title: 'New Publication',
      type: 'article',
      authors: '',
      year: new Date().getFullYear().toString(),
      publisher: '',
      url: '',
      description: ''
    };
    setEditData({
      ...editData,
      publications: [...editData.publications, newPublication]
    });
  };

  // Remove publication
  const removePublication = (id: string) => {
    setEditData({
      ...editData,
      publications: editData.publications.filter(p => p.id !== id)
    });
  };

  // Update publication
  const updatePublication = (id: string, field: keyof Publication, value: string) => {
    setEditData({
      ...editData,
      publications: editData.publications.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Publications</h1>
          <p className="text-gray-600">Books & Articles</p>
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
            <h2 className="text-3xl font-bold mb-6">Publications</h2>
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
            <h3 className="text-2xl font-semibold mb-4">About Publications</h3>
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
                onClick={addPublication}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CBB17] hover:bg-[#4CBB17]/5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#4CBB17]"
              >
                <Plus className="w-5 h-5" />
                Add Publication
              </button>
            )}

            {(isEditing ? editData : data).publications.map((pub) => (
              <div key={pub.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                {!isEditing ? (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                        pub.type === 'book' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        <BookOpen className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-semibold">{pub.title}</h4>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          pub.type === 'book' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {pub.type === 'book' ? 'Book' : 'Article'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1"><strong>Authors:</strong> {pub.authors}</p>
                      <p className="text-gray-600 mb-1"><strong>Year:</strong> {pub.year}</p>
                      <p className="text-gray-600 mb-1"><strong>Publisher:</strong> {pub.publisher}</p>
                      {pub.description && (
                        <p className="text-gray-700 mt-3">{pub.description}</p>
                      )}
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Publication →
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={pub.title}
                            onChange={(e) => updatePublication(pub.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={pub.type}
                            onChange={(e) => updatePublication(pub.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          >
                            <option value="book">Book</option>
                            <option value="article">Article</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
                          <input
                            type="text"
                            value={pub.authors}
                            onChange={(e) => updatePublication(pub.id, 'authors', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <input
                            type="text"
                            value={pub.year}
                            onChange={(e) => updatePublication(pub.id, 'year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                          <input
                            type="text"
                            value={pub.publisher}
                            onChange={(e) => updatePublication(pub.id, 'publisher', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                          <input
                            type="url"
                            value={pub.url}
                            onChange={(e) => updatePublication(pub.id, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={pub.description}
                            onChange={(e) => updatePublication(pub.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removePublication(pub.id)}
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
