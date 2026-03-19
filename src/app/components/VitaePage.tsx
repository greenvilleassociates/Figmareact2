import { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

interface VitaeSection {
  id: string;
  title: string;
  content: string;
}

interface VitaeData {
  name: string;
  subtitle: string;
  location: string;
  email: string;
  sections: VitaeSection[];
}

const defaultVitaeData: VitaeData = {
  name: 'John S. Stritzinger',
  subtitle: 'Global Tech Executive & Graduate Researcher',
  location: 'Columbia, South Carolina 29201',
  email: 'stritzj@email.sc.edu',
  sections: [
    {
      id: '1',
      title: 'Database Administration(DBA) & Principal Data Architecture Assignments',
      content: 'Bank of America/MBNA Treasury Systems, M&T Bank/Wilmington Trust Treasury Systems, Bank of America Consumer Services, Bank of America Global Operations, Centurylink/Level(3) Network Operations, Cincinnati Bell Enterprise Sales Operations, Bank of America Call Center Operations'
    },
    {
      id: '2',
      title: 'University Programs(5)',
      content: 'University of Michigan, University of Delaware, University of South Carolina, University of Pennsylvania - Wharton School'
    },
    {
      id: '3',
      title: 'Network Management Tools(11)',
      content: 'Cisco Works, BMC Patrol, Kratos Networks, IBM Netcool, IBM Maximo, HPE Peregrine, HPE Openview, Ivanti LandeskManager, Microsoft SMS, Alcatel, Paradyne NMS, Greenville GEM'
    },
    {
      id: '4',
      title: 'ERP Tools(9)',
      content: 'Microsoft Dynamics SL, Oracle Financials, Oracle/Peoplesoft HR, IntuitQuickBooks, FusionShell Professional, Siebel Systems, SAP Financials, Solomon III, Peachtree'
    },
    {
      id: '5',
      title: 'Restaurant Systems(7)',
      content: 'Aloha, Micros, POSI, KDS, FiveGuys POS, Panera POS, FusionCommerce'
    },
    {
      id: '6',
      title: 'REST Frameworks(5)',
      content: 'Microsoft Entity Framework on VS2022+, NodeJS-Express, JoomlaAPI, WordpressAPI, MiniOrangePlugin'
    },
    {
      id: '7',
      title: 'Programming Languages(19)',
      content: 'Lisp, Fortran, C, C++, C#, PHP, Webmin/Virtual SL, Python, HTML, Javascript, ReactJS/IonicJS, Visual Basic, Visual C++, Java/JavaFX, Motorola Assembler, ProcomPlus SL, NodeJS, UnixShell Scripting, Haskell'
    },
    {
      id: '8',
      title: 'Visualization Frameworks(6)',
      content: 'Tableau Public/Desktop, SAP Crystal Reports, Microsoft Office Tools, Python Viz Libraries, RStudio/RFrameworks, Infovista Network Management Systems, ChartJS, D3 JS Libraries.'
    },
    {
      id: '9',
      title: 'Database Platforms(9)',
      content: 'MySql/MariaDB, MySql Clusters, MS/Azure SQLServer, Oracle 19i+, Postgres17+, AzCosmosDB/MongoDB, PervasiveSQL, MSAccess, WatcomSQL, ApacheHiveHQX'
    }
  ]
};

export function VitaePage() {
  const [data, setData] = useState<VitaeData>(defaultVitaeData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<VitaeData>(defaultVitaeData);
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
      const savedData = localStorage.getItem(`${projectid}_vitae`);
      
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
      localStorage.setItem(`${projectid}_vitae`, JSON.stringify(editData));
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
    const newSection: VitaeSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: 'Section content here'
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
  const updateSection = (id: string, field: keyof VitaeSection, value: string) => {
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
          <h1 className="text-3xl font-bold">Vitae</h1>
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Selected Vitae</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              {!isEditing ? (
                <div className="space-y-2">
                  <p className="font-semibold text-lg">{data.name}</p>
                  <p className="text-red-700 font-medium">{data.subtitle}</p>
                  <p>{data.location}</p>
                  <p className="mt-4">
                    <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
                      {data.email}
                    </a>
                  </p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
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
                Add Vitae Section
              </button>
            )}

            {(isEditing ? editData : data).sections.map((section) => (
              <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-6">
                {!isEditing ? (
                  <>
                    <h3 className="text-xl font-semibold mb-3 text-red-700">{section.title}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </>
                ) : (
                  <div className="space-y-4">
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
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