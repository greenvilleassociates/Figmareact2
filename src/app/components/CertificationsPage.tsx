import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, Shield } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
}

interface CertificationsData {
  name: string;
  subtitle: string;
  position: string;
  address1: string;
  address2: string;
  description: string;
  certifications: Certification[];
}

const defaultCertificationsData: CertificationsData = {
  name: 'John S. Stritzinger',
  subtitle: 'Global Tech Executive',
  position: 'Graduate Assistant - University of South Carolina',
  address1: '1800 Washington Street',
  address2: 'Columbia, South Carolina 29201',
  description: 'This section highlights my professional certifications and credentials. These certifications demonstrate my expertise in various technology domains and commitment to continuous professional development.',
  certifications: [
    {
      id: '1',
      title: 'AWS Certified Solutions Architect',
      organization: 'Amazon Web Services',
      issueDate: '2024',
      expiryDate: '2027',
      credentialId: '',
      credentialUrl: '',
      imageUrl: ''
    },
    {
      id: '2',
      title: 'PMP - Project Management Professional',
      organization: 'Project Management Institute',
      issueDate: '2023',
      expiryDate: '2026',
      credentialId: '',
      credentialUrl: '',
      imageUrl: ''
    }
  ]
};

export function CertificationsPage() {
  const [data, setData] = useState<CertificationsData>(defaultCertificationsData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<CertificationsData>(defaultCertificationsData);
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
        const savedData = localStorage.getItem(`${projectid}_certifications`);

        if (savedData) {
          const parsed = JSON.parse(savedData);
          setData(parsed);
          setEditData(parsed);
        } else {
          // Load default data from JSON file
          try {
            const response = await fetch('/data/certifications.json');
            if (response.ok) {
              const jsonData = await response.json();
              setData(jsonData);
              setEditData(jsonData);
            }
          } catch (error) {
            console.log('No default certifications.json found, using hardcoded defaults');
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
      localStorage.setItem(`${projectid}_certifications`, JSON.stringify(editData));
      setData(editData);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  // Add new certification
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      title: 'New Certification',
      organization: '',
      issueDate: new Date().getFullYear().toString(),
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      imageUrl: ''
    };
    setEditData({
      ...editData,
      certifications: [...editData.certifications, newCert]
    });
  };

  // Remove certification
  const removeCertification = (id: string) => {
    setEditData({
      ...editData,
      certifications: editData.certifications.filter(c => c.id !== id)
    });
  };

  // Update certification
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setEditData({
      ...editData,
      certifications: editData.certifications.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      )
    });
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certifications</h1>
          <p className="text-gray-600">Professional Credentials</p>
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
            <h2 className="text-3xl font-bold mb-6">Certifications</h2>
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
            <h3 className="text-2xl font-semibold mb-4">About Certifications</h3>
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
                onClick={addCertification}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CBB17] hover:bg-[#4CBB17]/5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#4CBB17]"
              >
                <Plus className="w-5 h-5" />
                Add Certification
              </button>
            )}

            {(isEditing ? editData : data).certifications.map((cert) => (
              <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                {!isEditing ? (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {cert.imageUrl ? (
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Shield className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2">{cert.title}</h4>
                      <p className="text-gray-600 mb-1"><strong>Organization:</strong> {cert.organization}</p>
                      <p className="text-gray-600 mb-1"><strong>Issued:</strong> {cert.issueDate}</p>
                      {cert.expiryDate && (
                        <p className="text-gray-600 mb-1"><strong>Expires:</strong> {cert.expiryDate}</p>
                      )}
                      {cert.credentialId && (
                        <p className="text-gray-600 mb-1"><strong>Credential ID:</strong> {cert.credentialId}</p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Credential →
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Certification Title</label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => updateCertification(cert.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                          <input
                            type="text"
                            value={cert.organization}
                            onChange={(e) => updateCertification(cert.id, 'organization', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                            <input
                              type="text"
                              value={cert.issueDate}
                              onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (optional)</label>
                            <input
                              type="text"
                              value={cert.expiryDate}
                              onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID (optional)</label>
                          <input
                            type="text"
                            value={cert.credentialId}
                            onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL (optional)</label>
                          <input
                            type="url"
                            value={cert.credentialUrl}
                            onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Badge/Logo URL (optional)</label>
                          <input
                            type="url"
                            value={cert.imageUrl}
                            onChange={(e) => updateCertification(cert.id, 'imageUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeCertification(cert.id)}
                        className="mt-6 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {cert.imageUrl && (
                      <div className="flex justify-center pt-4">
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
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
