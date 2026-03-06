import { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, ExternalLink, Save, X, Link as LinkIcon } from 'lucide-react';

interface Release {
  id: string;
  version: string;
  name: string;
  url: string;
  provider: string;
  releaseDate: string;
  notes: string;
  createdBy: string;
}

const defaultProviders = [
  'GitHub',
  'Azure Blob Storage',
  'AWS S3',
  'Google Cloud Storage',
  'Cloudflare R2',
  'DigitalOcean Spaces'
];

export function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [customProviders, setCustomProviders] = useState<string[]>([]);
  const [showCustomProviderInput, setShowCustomProviderInput] = useState(false);
  const [newCustomProvider, setNewCustomProvider] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    version: '',
    name: '',
    url: '',
    provider: 'GitHub',
    releaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadReleases(config.projectid);
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const loadReleases = (projectid: string) => {
    const saved = localStorage.getItem(`${projectid}_releases`);
    if (saved) {
      setReleases(JSON.parse(saved));
    }

    const savedCustomProviders = localStorage.getItem(`${projectid}_custom_providers`);
    if (savedCustomProviders) {
      setCustomProviders(JSON.parse(savedCustomProviders));
    }
  };

  const saveReleases = (releasesData: Release[]) => {
    if (projectId) {
      localStorage.setItem(`${projectId}_releases`, JSON.stringify(releasesData));
      setReleases(releasesData);
    }
  };

  const saveCustomProviders = (providers: string[]) => {
    if (projectId) {
      localStorage.setItem(`${projectId}_custom_providers`, JSON.stringify(providers));
      setCustomProviders(providers);
    }
  };

  const handleAddCustomProvider = () => {
    if (newCustomProvider.trim()) {
      const updated = [...customProviders, newCustomProvider.trim()];
      saveCustomProviders(updated);
      setFormData({ ...formData, provider: newCustomProvider.trim() });
      setNewCustomProvider('');
      setShowCustomProviderInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRelease) {
      // Update existing release
      const updatedReleases = releases.map(r => 
        r.id === editingRelease.id 
          ? { ...r, ...formData }
          : r
      );
      saveReleases(updatedReleases);
      setEditingRelease(null);
    } else {
      // Add new release
      const newRelease: Release = {
        id: Date.now().toString(),
        ...formData,
        createdBy: currentUser?.username || 'Unknown'
      };
      saveReleases([...releases, newRelease]);
    }

    // Reset form
    setFormData({
      version: '',
      name: '',
      url: '',
      provider: 'GitHub',
      releaseDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddModal(false);
  };

  const handleEdit = (release: Release) => {
    setEditingRelease(release);
    setFormData({
      version: release.version,
      name: release.name,
      url: release.url,
      provider: release.provider,
      releaseDate: release.releaseDate,
      notes: release.notes
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this release?')) {
      const updatedReleases = releases.filter(r => r.id !== id);
      saveReleases(updatedReleases);
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingRelease(null);
    setFormData({
      version: '',
      name: '',
      url: '',
      provider: 'GitHub',
      releaseDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProviderIcon = (provider: string) => {
    if (provider.toLowerCase().includes('github')) return '🐙';
    if (provider.toLowerCase().includes('azure')) return '☁️';
    if (provider.toLowerCase().includes('aws')) return '📦';
    if (provider.toLowerCase().includes('google')) return '🔵';
    if (provider.toLowerCase().includes('cloudflare')) return '🧡';
    if (provider.toLowerCase().includes('digitalocean')) return '🌊';
    return '📁';
  };

  const allProviders = [...defaultProviders, ...customProviders];

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Releases</h1>
              <p className="text-gray-500">Manage release versions and download links</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Release
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">Release Management</h4>
              <p className="text-sm text-blue-800">
                Add release versions with links to GitHub releases, Azure blob storage, AWS S3, or any custom storage provider. 
                Each release can include version numbers, release notes, and direct download URLs.
              </p>
            </div>
          </div>
        </div>

        {/* Releases List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All Releases ({releases.length})</h2>
          </div>

          {releases.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No releases yet</p>
              <p className="text-sm">Add your first release to get started</p>
            </div>
          ) : (
            <div className="divide-y">
              {releases.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).map((release) => (
                <div key={release.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getProviderIcon(release.provider)}</span>
                        <div>
                          <h3 className="text-xl font-bold">{release.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-[#4CBB17] text-white rounded font-mono text-xs">
                              v{release.version}
                            </span>
                            <span>{release.provider}</span>
                            <span>{formatDate(release.releaseDate)}</span>
                            <span className="text-gray-400">by {release.createdBy}</span>
                          </div>
                        </div>
                      </div>
                      
                      {release.notes && (
                        <p className="text-gray-700 mt-2 mb-3 ml-11">{release.notes}</p>
                      )}
                      
                      <div className="flex items-center gap-2 ml-11">
                        <a
                          href={release.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          <LinkIcon className="w-4 h-4" />
                          View Release
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(release)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(release.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {editingRelease ? 'Edit Release' : 'Add New Release'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Version */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Version <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g., 1.0.0"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Release Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Initial Release"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Storage Provider <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.provider}
                      onChange={(e) => {
                        if (e.target.value === '__add_custom__') {
                          setShowCustomProviderInput(true);
                        } else {
                          setFormData({ ...formData, provider: e.target.value });
                        }
                      }}
                      className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                      required
                    >
                      {allProviders.map(provider => (
                        <option key={provider} value={provider}>
                          {provider}
                        </option>
                      ))}
                      <option value="__add_custom__">+ Add Custom Provider</option>
                    </select>
                  </div>
                  
                  {/* Custom Provider Input */}
                  {showCustomProviderInput && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={newCustomProvider}
                        onChange={(e) => setNewCustomProvider(e.target.value)}
                        placeholder="Enter provider name..."
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomProvider}
                        className="px-4 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomProviderInput(false);
                          setNewCustomProvider('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Release URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://github.com/username/repo/releases/tag/v1.0.0"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Full URL to the release (GitHub, Azure blob, AWS S3, etc.)
                  </p>
                </div>

                {/* Release Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Release Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Release Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="What's new in this release..."
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17] min-h-[100px]"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingRelease ? 'Update Release' : 'Add Release'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
