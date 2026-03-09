import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

interface ProjectLink {
  label: string;
  url: string;
  image: string;
  description: string;
}

interface HostingProvider {
  name: string;
  links: ProjectLink[];
}

const PROVIDER_OPTIONS = [
  'None',
  'Render',
  'Google Cloud',
  'CTS',
  'Azure',
  'AWS',
  'Verizon',
  'AT&T',
  'Oracle Cloud',
  'Vercel',
  'Netlify',
  'Heroku',
  'DigitalOcean',
  'Cloudflare'
];

const defaultHostingProviders: HostingProvider[] = [
  {
    name: 'Render',
    links: [
      {
        label: 'API Detail',
        url: 'HTTPS://USC242.ONRENDER.COM',
        image: 'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBUEklMjBiYWNrZW5kJTIwc2VydmVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njk5ODIzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Backend API endpoints and server details'
      },
      {
        label: 'API Swagger Documentation',
        url: 'HTTPS://API242.ONRENDER.COM/SWAGGER',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBUEklMjBkb2N1bWVudGF0aW9uJTIwc3dhZ2dlcnxlbnwxfHx8fDE3Njk5ODIzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Interactive API documentation with Swagger'
      },
      {
        label: 'React App Front Page',
        url: 'HTTPS://REACT242-HO2O.ONRENDER.COM/INDEX.HTML',
        image: 'https://images.unsplash.com/photo-1489436969537-cf0c1dc69cba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjByb290JTIwaG9zdGluZyUyMHNlcnZlcnxlbnwxfHx8fDE3Njk5ODIzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Main React application frontend'
      }
    ]
  },
  {
    name: 'None',
    links: []
  },
  {
    name: 'None',
    links: []
  }
];

export function ProjectDetails() {
  const [hostingProviders, setHostingProviders] = useState<HostingProvider[]>(defaultHostingProviders);
  const [projectId, setProjectId] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editingLink, setEditingLink] = useState<{ providerIndex: number; linkIndex: number } | null>(null);
  const [editForm, setEditForm] = useState<ProjectLink | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<ProjectLink | null>(null);
  const [selectedProviderIndex, setSelectedProviderIndex] = useState<number | null>(null);
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    if (savedLoginStatus) {
      setIsLoggedIn(JSON.parse(savedLoginStatus));
    }
  }, []);

  // Load hosting information from localStorage
  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadHostingData(config.projectid);
    }
  }, []);

  const loadHostingData = (projectid: string) => {
    const saved = localStorage.getItem(`hosting_info_${projectid}`);
    if (saved) {
      const loadedProviders = JSON.parse(saved);
      // Ensure we always have exactly 3 providers
      while (loadedProviders.length < 3) {
        loadedProviders.push({ name: 'None', links: [] });
      }
      setHostingProviders(loadedProviders.slice(0, 3));
    }
  };

  const saveHostingData = (data: HostingProvider[]) => {
    if (projectId) {
      // Always save exactly 3 providers
      const providersToSave = data.slice(0, 3);
      localStorage.setItem(`hosting_info_${projectId}`, JSON.stringify(providersToSave));
      setHostingProviders(providersToSave);
    }
  };

  // Start editing a link
  const handleStartEdit = (providerIndex: number, linkIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLink({ providerIndex, linkIndex });
    setEditForm({ ...hostingProviders[providerIndex].links[linkIndex] });
  };

  // Save inline edits
  const handleSaveInlineEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editForm && editingLink) {
      const updatedProviders = [...hostingProviders];
      updatedProviders[editingLink.providerIndex].links[editingLink.linkIndex] = editForm;
      saveHostingData(updatedProviders);
      setEditingLink(null);
      setEditForm(null);
    }
  };

  // Cancel editing
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLink(null);
    setEditForm(null);
  };

  // Open detail modal for full editing
  const handleOpenDetailModal = (providerIndex: number, linkIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLink({ ...hostingProviders[providerIndex].links[linkIndex] });
    setSelectedProviderIndex(providerIndex);
    setSelectedLinkIndex(linkIndex);
    setShowDetailModal(true);
  };

  // Save detailed changes
  const handleSaveDetailedChanges = () => {
    if (selectedLink && selectedProviderIndex !== null && selectedLinkIndex !== null) {
      const updatedProviders = [...hostingProviders];
      updatedProviders[selectedProviderIndex].links[selectedLinkIndex] = selectedLink;
      saveHostingData(updatedProviders);
      setShowDetailModal(false);
      setSelectedLink(null);
      setSelectedProviderIndex(null);
      setSelectedLinkIndex(null);
    }
  };

  // Add new provider
  const handleAddProvider = () => {
    const newProvider: HostingProvider = {
      name: 'New Provider',
      links: []
    };
    const updatedProviders = [...hostingProviders, newProvider];
    saveHostingData(updatedProviders);
  };

  // Delete provider
  const handleDeleteProvider = (providerIndex: number) => {
    if (confirm('Are you sure you want to delete this provider?')) {
      const updatedProviders = hostingProviders.filter((_, idx) => idx !== providerIndex);
      saveHostingData(updatedProviders);
    }
  };

  // Add new link to provider
  const handleAddLink = (providerIndex: number) => {
    const newLink: ProjectLink = {
      label: 'New Link',
      url: 'https://example.com',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400',
      description: 'Description here'
    };
    const updatedProviders = [...hostingProviders];
    updatedProviders[providerIndex].links.push(newLink);
    saveHostingData(updatedProviders);
  };

  // Delete link
  const handleDeleteLink = (providerIndex: number, linkIndex: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      const updatedProviders = [...hostingProviders];
      updatedProviders[providerIndex].links = updatedProviders[providerIndex].links.filter((_, idx) => idx !== linkIndex);
      saveHostingData(updatedProviders);
    }
  };

  // Edit provider name
  const handleEditProviderName = (providerIndex: number, newName: string) => {
    const updatedProviders = [...hostingProviders];
    updatedProviders[providerIndex].name = newName;
    saveHostingData(updatedProviders);
  };

  return (
    <div className="flex-1 bg-white p-12 overflow-auto max-[999px]:text-[9pt]">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold">HOSTING INFORMATION</h1>
        {isLoggedIn && (
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
        )}
      </div>

      {/* Hosting Providers */}
      {hostingProviders.map((provider, providerIndex) => {
        // Skip rendering if provider is "None" and has no links
        if (provider.name === 'None' && provider.links.length === 0 && !editMode) {
          return null;
        }

        return (
          <div key={providerIndex} className="mb-16 relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-sm font-semibold text-gray-500 min-w-[100px]">
                Provider {providerIndex + 1}
                {providerIndex === 0 && <span className="text-red-500 ml-1">*</span>}
                {providerIndex > 0 && <span className="text-gray-400 ml-1">(optional)</span>}
              </div>
              {editMode ? (
                <select
                  value={provider.name}
                  onChange={(e) => handleEditProviderName(providerIndex, e.target.value)}
                  className="text-2xl font-bold text-[#4CBB17] border-2 border-[#4CBB17] rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#4CBB17] bg-white"
                >
                  {PROVIDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <h2 className="text-2xl font-bold text-[#4CBB17]">{provider.name}</h2>
              )}
            </div>
            
            {/* Provider Links */}
            <div className="mb-8 space-y-4">
              {provider.links.map((link, index) => {
                const isEditing = editingLink?.providerIndex === providerIndex && editingLink?.linkIndex === index;
                const displayData = isEditing && editForm ? editForm : link;

                return (
                  <div key={index} className="flex gap-8 items-center group relative">
                    {isEditing ? (
                      <div className="flex-1 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                        <div>
                          <label className="block text-xs font-medium mb-1">Label</label>
                          <input
                            type="text"
                            value={editForm?.label || ''}
                            onChange={(e) => setEditForm(editForm ? { ...editForm, label: e.target.value } : null)}
                            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                            placeholder="Link Label"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">URL</label>
                          <input
                            type="text"
                            value={editForm?.url || ''}
                            onChange={(e) => setEditForm(editForm ? { ...editForm, url: e.target.value } : null)}
                            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium mb-1">Description</label>
                          <input
                            type="text"
                            value={editForm?.description || ''}
                            onChange={(e) => setEditForm(editForm ? { ...editForm, description: e.target.value } : null)}
                            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                            placeholder="Description"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium mb-1">Image URL</label>
                          <input
                            type="text"
                            value={editForm?.image || ''}
                            onChange={(e) => setEditForm(editForm ? { ...editForm, image: e.target.value } : null)}
                            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                            placeholder="Image URL"
                          />
                        </div>
                        <div className="col-span-2 flex gap-2">
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
                    ) : (
                      <>
                        <div className="w-64 font-semibold">{displayData.label}</div>
                        <a 
                          href={displayData.url.toLowerCase()} 
                          className="text-blue-600 hover:underline flex-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {displayData.url}
                        </a>
                        {editMode && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleOpenDetailModal(providerIndex, index, e)}
                              className="p-1 text-[#4CBB17] hover:bg-[#4CBB17]/10 rounded transition-colors"
                              title="Edit Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLink(providerIndex, index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete Link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
              
              {/* Add Link Button */}
              {editMode && (
                <button
                  onClick={() => handleAddLink(providerIndex)}
                  className="flex items-center gap-2 px-4 py-2 text-[#4CBB17] border-2 border-dashed border-[#4CBB17] rounded hover:bg-[#4CBB17]/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </button>
              )}
            </div>

            {/* Provider Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {provider.links.map((link, index) => (
                <div key={index} className="flex flex-col items-center group relative">
                  <div className="rounded-lg overflow-hidden shadow-lg mb-3 relative">
                    <a 
                      href={link.url.toLowerCase()} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img 
                        src={link.image} 
                        alt={link.label} 
                        className="hover:opacity-90 transition-opacity w-[150px] h-[150px] object-cover"
                      />
                    </a>
                    {editMode && (
                      <button
                        onClick={(e) => handleOpenDetailModal(providerIndex, index, e)}
                        className="absolute top-2 right-2 p-2 bg-[#4CBB17] text-white rounded-full hover:bg-[#3DA013] transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        title="Edit Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{link.label}</h3>
                  <p className="text-sm text-gray-600 text-center">{link.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Add Provider Button */}
      {editMode && (
        <button
          onClick={handleAddProvider}
          className="flex items-center gap-2 px-6 py-3 text-[#4CBB17] border-2 border-dashed border-[#4CBB17] rounded-lg hover:bg-[#4CBB17]/10 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Provider
        </button>
      )}

      {/* Detail Edit Modal */}
      {showDetailModal && selectedLink && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Hosting Link</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Link Label</label>
                <input
                  type="text"
                  value={selectedLink.label}
                  onChange={(e) => setSelectedLink({ ...selectedLink, label: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="API Detail, Production Deployment, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="text"
                  value={selectedLink.url}
                  onChange={(e) => setSelectedLink({ ...selectedLink, url: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={selectedLink.description}
                  onChange={(e) => setSelectedLink({ ...selectedLink, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="Brief description of this link"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="text"
                  value={selectedLink.image}
                  onChange={(e) => setSelectedLink({ ...selectedLink, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                  placeholder="https://example.com/image.jpg"
                />
                <div className="mt-3 flex items-center justify-center bg-gray-100 rounded p-4">
                  <img
                    src={selectedLink.image}
                    alt="Preview"
                    className="w-[150px] h-[150px] object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150';
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