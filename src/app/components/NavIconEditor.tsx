import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Edit3 } from 'lucide-react';

interface NavIconEditorProps {
  isOpen: boolean;
  onClose: () => void;
  iconKey: string;
  iconLabel: string;
  currentIcon: string | null;
  onSave: (iconKey: string, imageUrl: string) => void;
}

export function NavIconEditor({ isOpen, onClose, iconKey, iconLabel, currentIcon, onSave }: NavIconEditorProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setImageUrl(currentIcon || '');
      setSelectedImage(currentIcon);
      loadAvailableImages();
    }
  }, [isOpen, currentIcon]);

  useEffect(() => {
    const project = localStorage.getItem('currentProject');
    if (project) {
      setCurrentProject(JSON.parse(project));
    }
  }, []);

  const loadAvailableImages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const project = localStorage.getItem('currentProject');
      if (!project) {
        setError('No active project selected');
        setIsLoading(false);
        return;
      }

      const projectData = JSON.parse(project);
      const githubRepoUrl = projectData.githubRepoUrl;

      if (!githubRepoUrl) {
        setError('No GitHub repository configured for this project');
        setIsLoading(false);
        return;
      }

      // Extract owner and repo from GitHub URL
      // Format: https://github.com/owner/repo
      const urlParts = githubRepoUrl.replace('https://github.com/', '').split('/');
      const owner = urlParts[0];
      const repo = urlParts[1];

      if (!owner || !repo) {
        setError('Invalid GitHub repository URL');
        setIsLoading(false);
        return;
      }

      // Fetch the images directory from GitHub API
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/images`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch images from GitHub');
      }

      const files = await response.json();

      // Filter for image files and get their raw URLs
      const imageFiles = files
        .filter((file: any) => {
          const ext = file.name.toLowerCase();
          return ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.svg') || ext.endsWith('.gif');
        })
        .map((file: any) => ({
          name: file.name,
          url: `https://raw.githubusercontent.com/${owner}/${repo}/main/images/${file.name}`
        }));

      setAvailableImages(imageFiles);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images from GitHub repository');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageUrl(imageUrl);
    setError(null);
  };

  const handleSave = () => {
    if (!imageUrl.trim()) {
      setError('Please enter an image URL or select an image');
      return;
    }

    onSave(iconKey, imageUrl);
    onClose();
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setSelectedImage(url);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4CBB17] rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Edit Navigation Icon</h2>
              <p className="text-sm text-gray-600">Customize icon for: {iconLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Current Project Info */}
          {currentProject && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Active Project:</strong> {currentProject.projectname || currentProject.name}
                {currentProject.githubRepoUrl && (
                  <span className="ml-2">
                    (<a href={currentProject.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {currentProject.githubRepoUrl}
                    </a>)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Manual URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Image URL
              </div>
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Enter image URL or select from available images below"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a direct URL to an image, or select from the images directory below
            </p>
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-[200px] max-h-[200px] object-contain"
                  onError={() => setError('Failed to load image. Please check the URL.')}
                />
              </div>
            </div>
          )}

          {/* Available Images from GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Available Images from GitHub Repository
                </div>
                <button
                  onClick={loadAvailableImages}
                  className="text-xs text-[#4CBB17] hover:underline"
                >
                  Refresh
                </button>
              </div>
            </label>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#4CBB17] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && error && !availableImages.length && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-900">{error}</p>
                  <p className="text-xs text-yellow-800 mt-1">
                    Make sure you have an active project with a GitHub repository configured.
                  </p>
                </div>
              </div>
            )}

            {!isLoading && availableImages.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {availableImages.map((image: any) => (
                  <button
                    key={image.url}
                    onClick={() => handleImageSelect(image.url)}
                    className={`relative group border-2 rounded-lg p-3 transition-all hover:shadow-lg ${
                      selectedImage === image.url
                        ? 'border-[#4CBB17] bg-[#4CBB17]/5'
                        : 'border-gray-200 hover:border-[#4CBB17]/50'
                    }`}
                  >
                    <div className="aspect-square flex items-center justify-center bg-gray-50 rounded mb-2 overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-600 truncate text-center" title={image.name}>
                      {image.name}
                    </p>
                    {selectedImage === image.url && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#4CBB17] rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!isLoading && !error && availableImages.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No images found in the /images directory</p>
                <p className="text-sm text-gray-500 mt-1">
                  Add images to your GitHub repository's /images folder
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && selectedImage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={() => {
              setImageUrl('');
              setSelectedImage(null);
              onSave(iconKey, ''); // Clear the icon
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!imageUrl.trim()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                imageUrl.trim()
                  ? 'bg-[#4CBB17] text-white hover:bg-[#3DA013]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Icon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
