import { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Eye, Calendar, User } from 'lucide-react';

interface Report {
  id: string;
  filename: string;
  uploadDate: string;
  size: number;
  uploadedBy: string;
  fileUrl?: string;
}

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadReports(config.projectid);
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const loadReports = (projectid: string) => {
    const saved = localStorage.getItem(`${projectid}_reports`);
    if (saved) {
      setReports(JSON.parse(saved));
    }
  };

  const saveReports = (reportsData: Report[]) => {
    if (projectId) {
      localStorage.setItem(`${projectId}_reports`, JSON.stringify(reportsData));
      setReports(reportsData);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const file = files[0];
      
      // Read file as base64 for localStorage (in production, you'd upload to GitHub)
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target?.result as string;
        
        const newReport: Report = {
          id: Date.now().toString(),
          filename: file.name,
          uploadDate: new Date().toISOString(),
          size: file.size,
          uploadedBy: currentUser?.username || 'Unknown',
          fileUrl: fileData // In production, this would be a GitHub URL
        };

        const updatedReports = [...reports, newReport];
        saveReports(updatedReports);
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
    }

    // Reset input
    event.target.value = '';
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      const updatedReports = reports.filter(r => r.id !== id);
      saveReports(updatedReports);
    }
  };

  const handleDownloadReport = (report: Report) => {
    if (report.fileUrl) {
      const link = document.createElement('a');
      link.href = report.fileUrl;
      link.download = report.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Reports</h1>
              <p className="text-gray-500">Upload and manage project reports from /docs/reports</p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-[#4CBB17] transition-colors">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Upload Report</h3>
              <p className="text-gray-600 mb-4">
                Upload reports to /docs/reports directory in your GitHub repository
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.ppt,.pptx"
                  disabled={uploading}
                />
                <span className={`px-6 py-3 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-2 ${
                  uploading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#4CBB17] text-white hover:bg-[#3DA013]'
                }`}>
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Choose File'}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX, TXT, MD, XLSX, XLS, PPT, PPTX
              </p>
            </div>
          </div>
        </div>

        {/* GitHub Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">GitHub Integration</h4>
              <p className="text-sm text-blue-800">
                Reports are stored in the <code className="bg-blue-100 px-1 py-0.5 rounded">/docs/reports</code> directory 
                of your GitHub repository. In production, files will be automatically committed to your repo.
              </p>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Uploaded Reports ({reports.length})</h2>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No reports uploaded yet</p>
              <p className="text-sm">Upload your first report to get started</p>
            </div>
          ) : (
            <div className="divide-y">
              {reports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{report.filename}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(report.uploadDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {report.uploadedBy}
                          </div>
                          <div>
                            Size: {formatFileSize(report.size)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.fileUrl && (
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReport(report.id)}
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

        {/* Storage Info */}
        {reports.length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Reports: {reports.length}</span>
              <span>
                Total Size: {formatFileSize(reports.reduce((sum, r) => sum + r.size, 0))}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
