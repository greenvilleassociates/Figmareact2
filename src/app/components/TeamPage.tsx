import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Save, X, Mail, Phone, Briefcase, UserPlus } from 'lucide-react';
import { Link } from 'react-router';
import { getStorageItem, setStorageItem, isGuestMode } from '../utils/storageHelper';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'developer' | 'project-manager' | 'stakeholder';
  type?: string; // For stakeholders: marketing, finance, hr, etc.
  projectid?: string;
  userid?: string;
}

interface TeamData {
  developers: TeamMember[];
  projectManagers: TeamMember[];
  stakeholders: TeamMember[];
}

const API_BASE_URL = 'https://api242.onrender.com';
const MAX_PROJECT_MANAGERS = 3;
const MAX_STAKEHOLDERS = 10;

export function TeamPage() {
  const [teamData, setTeamData] = useState<TeamData>({
    developers: [],
    projectManagers: [],
    stakeholders: []
  });
  const [projectId, setProjectId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<'developer' | 'project-manager' | 'stakeholder'>('developer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadTeamData(config.projectid);
    }
  }, []);

  const loadTeamData = async (projectid: string) => {
    setIsLoading(true);
    setError(null);

    // If guest mode, load from storage only
    if (isGuestMode()) {
      const saved = getStorageItem(`${projectid}_team`);
      if (saved) {
        setTeamData(JSON.parse(saved));
      }
      setIsLoading(false);
      return;
    }

    // For logged-in users, try to fetch from API first
    try {
      const response = await fetch(`${API_BASE_URL}/usergroups?projectid=${projectid}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to TeamData structure
        // API returns array of usergroup records with role field
        const transformedData: TeamData = {
          developers: [],
          projectManagers: [],
          stakeholders: []
        };

        if (Array.isArray(data)) {
          data.forEach((member: any) => {
            const teamMember: TeamMember = {
              id: member.id || member.userid || Date.now().toString(),
              name: member.name || member.username || '',
              email: member.email || '',
              phone: member.phone || '',
              role: member.role || 'developer',
              type: member.type,
              projectid: member.projectid,
              userid: member.userid
            };

            if (member.role === 'developer') {
              transformedData.developers.push(teamMember);
            } else if (member.role === 'project-manager') {
              transformedData.projectManagers.push(teamMember);
            } else if (member.role === 'stakeholder') {
              transformedData.stakeholders.push(teamMember);
            }
          });
        }

        setTeamData(transformedData);
        // Cache in localStorage
        setStorageItem(`${projectid}_team`, JSON.stringify(transformedData));
      } else {
        // If API fails, fall back to localStorage
        console.warn('Failed to fetch from API, using localStorage');
        const saved = getStorageItem(`${projectid}_team`);
        if (saved) {
          setTeamData(JSON.parse(saved));
        }
      }
    } catch (err) {
      console.error('Error fetching team data:', err);
      // Fall back to localStorage on error
      const saved = getStorageItem(`${projectid}_team`);
      if (saved) {
        setTeamData(JSON.parse(saved));
      }
      setError('Failed to load team data from server. Showing cached data.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTeamData = (data: TeamData) => {
    if (!projectId) return;
    
    setStorageItem(`${projectId}_team`, JSON.stringify(data));
    setTeamData(data);
  };

  const handleAddMember = async () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: selectedRole,
      type: selectedRole === 'stakeholder' ? formData.type : undefined,
      projectid: projectId
    };

    // Check limits
    if (selectedRole === 'project-manager' && teamData.projectManagers.length >= MAX_PROJECT_MANAGERS) {
      alert(`Maximum of ${MAX_PROJECT_MANAGERS} project managers allowed.`);
      return;
    }
    
    if (selectedRole === 'stakeholder' && teamData.stakeholders.length >= MAX_STAKEHOLDERS) {
      alert(`Maximum of ${MAX_STAKEHOLDERS} stakeholders allowed.`);
      return;
    }

    if (isGuestMode()) {
      // Guest mode: add locally only
      const updatedData = { ...teamData };
      
      if (selectedRole === 'developer') {
        updatedData.developers = [...updatedData.developers, newMember];
      } else if (selectedRole === 'project-manager') {
        updatedData.projectManagers = [...updatedData.projectManagers, newMember];
      } else if (selectedRole === 'stakeholder') {
        updatedData.stakeholders = [...updatedData.stakeholders, newMember];
      }

      saveTeamData(updatedData);
      resetForm();
      return;
    }

    // Logged-in users: POST to API
    try {
      const response = await fetch(`${API_BASE_URL}/usergroups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectid: projectId,
          userid: newMember.id, // Can be updated with actual user ID if needed
          name: newMember.name,
          username: newMember.name, // Can be different if needed
          email: newMember.email,
          phone: newMember.phone,
          role: newMember.role,
          type: newMember.type
        })
      });

      if (response.ok) {
        const createdMember = await response.json();
        
        const updatedData = { ...teamData };
        const memberToAdd = {
          ...newMember,
          id: createdMember.id || createdMember.userid || newMember.id
        };

        if (selectedRole === 'developer') {
          updatedData.developers = [...updatedData.developers, memberToAdd];
        } else if (selectedRole === 'project-manager') {
          updatedData.projectManagers = [...updatedData.projectManagers, memberToAdd];
        } else if (selectedRole === 'stakeholder') {
          updatedData.stakeholders = [...updatedData.stakeholders, memberToAdd];
        }

        saveTeamData(updatedData);
        resetForm();
      } else {
        throw new Error('Failed to add team member');
      }
    } catch (err) {
      console.error('Error adding team member:', err);
      setError('Failed to add team member. Please try again.');
      
      // Still add locally as fallback
      const updatedData = { ...teamData };
      
      if (selectedRole === 'developer') {
        updatedData.developers = [...updatedData.developers, newMember];
      } else if (selectedRole === 'project-manager') {
        updatedData.projectManagers = [...updatedData.projectManagers, newMember];
      } else if (selectedRole === 'stakeholder') {
        updatedData.stakeholders = [...updatedData.stakeholders, newMember];
      }

      saveTeamData(updatedData);
      resetForm();
    }
  };

  const handleUpdateMember = async (member: TeamMember) => {
    if (isGuestMode()) {
      // Guest mode: update locally only
      const updatedData = { ...teamData };
      
      if (member.role === 'developer') {
        updatedData.developers = updatedData.developers.map(m =>
          m.id === member.id ? member : m
        );
      } else if (member.role === 'project-manager') {
        updatedData.projectManagers = updatedData.projectManagers.map(m =>
          m.id === member.id ? member : m
        );
      } else if (member.role === 'stakeholder') {
        updatedData.stakeholders = updatedData.stakeholders.map(m =>
          m.id === member.id ? member : m
        );
      }

      saveTeamData(updatedData);
      return;
    }

    // Logged-in users: PUT to API
    try {
      const response = await fetch(`${API_BASE_URL}/usergroups/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectid: projectId,
          userid: member.userid || member.id,
          name: member.name,
          username: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role,
          type: member.type
        })
      });

      if (response.ok) {
        const updatedData = { ...teamData };
        
        if (member.role === 'developer') {
          updatedData.developers = updatedData.developers.map(m =>
            m.id === member.id ? member : m
          );
        } else if (member.role === 'project-manager') {
          updatedData.projectManagers = updatedData.projectManagers.map(m =>
            m.id === member.id ? member : m
          );
        } else if (member.role === 'stakeholder') {
          updatedData.stakeholders = updatedData.stakeholders.map(m =>
            m.id === member.id ? member : m
          );
        }

        saveTeamData(updatedData);
      } else {
        throw new Error('Failed to update team member');
      }
    } catch (err) {
      console.error('Error updating team member:', err);
      setError('Failed to update team member. Please try again.');
      
      // Still update locally as fallback
      const updatedData = { ...teamData };
      
      if (member.role === 'developer') {
        updatedData.developers = updatedData.developers.map(m =>
          m.id === member.id ? member : m
        );
      } else if (member.role === 'project-manager') {
        updatedData.projectManagers = updatedData.projectManagers.map(m =>
          m.id === member.id ? member : m
        );
      } else if (member.role === 'stakeholder') {
        updatedData.stakeholders = updatedData.stakeholders.map(m =>
          m.id === member.id ? member : m
        );
      }

      saveTeamData(updatedData);
    }
  };

  const handleDeleteMember = async (id: string, role: 'developer' | 'project-manager' | 'stakeholder') => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    if (isGuestMode()) {
      // Guest mode: delete locally only
      const updatedData = { ...teamData };
      
      if (role === 'developer') {
        updatedData.developers = updatedData.developers.filter(m => m.id !== id);
      } else if (role === 'project-manager') {
        updatedData.projectManagers = updatedData.projectManagers.filter(m => m.id !== id);
      } else if (role === 'stakeholder') {
        updatedData.stakeholders = updatedData.stakeholders.filter(m => m.id !== id);
      }

      saveTeamData(updatedData);
      return;
    }

    // Logged-in users: DELETE from API
    try {
      const response = await fetch(`${API_BASE_URL}/usergroups/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedData = { ...teamData };
        
        if (role === 'developer') {
          updatedData.developers = updatedData.developers.filter(m => m.id !== id);
        } else if (role === 'project-manager') {
          updatedData.projectManagers = updatedData.projectManagers.filter(m => m.id !== id);
        } else if (role === 'stakeholder') {
          updatedData.stakeholders = updatedData.stakeholders.filter(m => m.id !== id);
        }

        saveTeamData(updatedData);
      } else {
        throw new Error('Failed to delete team member');
      }
    } catch (err) {
      console.error('Error deleting team member:', err);
      setError('Failed to delete team member. Please try again.');
      
      // Still delete locally as fallback
      const updatedData = { ...teamData };
      
      if (role === 'developer') {
        updatedData.developers = updatedData.developers.filter(m => m.id !== id);
      } else if (role === 'project-manager') {
        updatedData.projectManagers = updatedData.projectManagers.filter(m => m.id !== id);
      } else if (role === 'stakeholder') {
        updatedData.stakeholders = updatedData.stakeholders.filter(m => m.id !== id);
      }

      saveTeamData(updatedData);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      type: member.type || ''
    });
    setSelectedRole(member.role);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', type: '' });
    setEditingMember(null);
    setShowAddModal(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'developer': return 'Developer';
      case 'project-manager': return 'Project Manager';
      case 'stakeholder': return 'Stakeholder';
      default: return role;
    }
  };

  const canAddMore = (role: 'developer' | 'project-manager' | 'stakeholder') => {
    if (role === 'project-manager') {
      return teamData.projectManagers.length < MAX_PROJECT_MANAGERS;
    }
    if (role === 'stakeholder') {
      return teamData.stakeholders.length < MAX_STAKEHOLDERS;
    }
    return true; // No limit for developers
  };

  const totalMembers = teamData.developers.length + teamData.projectManagers.length + teamData.stakeholders.length;

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Team</h1>
              <p className="text-gray-500">Manage your project team members and stakeholders</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/settings"
                className="px-6 py-3 border-2 border-[#4CBB17] text-[#4CBB17] rounded-lg hover:bg-[#4CBB17] hover:text-white transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-5 h-5" />
                Edit in Settings
              </Link>
              <button
                onClick={() => {
                  setSelectedRole('developer');
                  setShowAddModal(true);
                }}
                className="px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add Team Member
              </button>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Members</p>
                  <p className="text-2xl font-bold text-gray-800">{totalMembers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Developers</p>
                  <p className="text-2xl font-bold text-gray-800">{teamData.developers.length}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                  D
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Project Managers</p>
                  <p className="text-2xl font-bold text-gray-800">{teamData.projectManagers.length}/{MAX_PROJECT_MANAGERS}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                  PM
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stakeholders</p>
                  <p className="text-2xl font-bold text-gray-800">{teamData.stakeholders.length}/{MAX_STAKEHOLDERS}</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                  S
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developers Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b bg-green-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  Developers ({teamData.developers.length})
                </h2>
                <button
                  onClick={() => {
                    setSelectedRole('developer');
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Developer
                </button>
              </div>
            </div>
            
            {teamData.developers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No developers added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamData.developers.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {member.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, 'developer')}
                            className="text-red-600 hover:bg-red-50 p-2 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Project Managers Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b bg-purple-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    PM
                  </div>
                  Project Managers ({teamData.projectManagers.length}/{MAX_PROJECT_MANAGERS})
                </h2>
                <button
                  onClick={() => {
                    setSelectedRole('project-manager');
                    setShowAddModal(true);
                  }}
                  disabled={!canAddMore('project-manager')}
                  className={`px-4 py-2 rounded transition-colors flex items-center gap-2 text-sm ${
                    canAddMore('project-manager')
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Add PM
                </button>
              </div>
            </div>
            
            {teamData.projectManagers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No project managers added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamData.projectManagers.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {member.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, 'project-manager')}
                            className="text-red-600 hover:bg-red-50 p-2 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Stakeholders Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b bg-orange-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  Stakeholders ({teamData.stakeholders.length}/{MAX_STAKEHOLDERS})
                </h2>
                <button
                  onClick={() => {
                    setSelectedRole('stakeholder');
                    setShowAddModal(true);
                  }}
                  disabled={!canAddMore('stakeholder')}
                  className={`px-4 py-2 rounded transition-colors flex items-center gap-2 text-sm ${
                    canAddMore('stakeholder')
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Add Stakeholder
                </button>
              </div>
            </div>
            
            {teamData.stakeholders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No stakeholders added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamData.stakeholders.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                            {member.type || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {member.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, 'stakeholder')}
                            className="text-red-600 hover:bg-red-50 p-2 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingMember ? 'Edit Team Member' : `Add ${getRoleLabel(selectedRole)}`}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingMember) {
                handleUpdateMember(editingMember);
              } else {
                handleAddMember();
              }
            }} className="p-6">
              <div className="space-y-4">
                {!editingMember && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                      required
                    >
                      <option value="developer">Developer</option>
                      <option value="project-manager" disabled={!canAddMore('project-manager')}>
                        Project Manager {!canAddMore('project-manager') && '(Max reached)'}
                      </option>
                      <option value="stakeholder" disabled={!canAddMore('stakeholder')}>
                        Stakeholder {!canAddMore('stakeholder') && '(Max reached)'}
                      </option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                </div>

                {(selectedRole === 'stakeholder' || editingMember?.role === 'stakeholder') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g., Marketing, Finance, HR, Operations"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Specify the stakeholder's department or area (Marketing, Finance, HR, etc.)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@example.com"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#4CBB17] text-white rounded hover:bg-[#3DA013] transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingMember ? 'Update' : 'Add'} Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}