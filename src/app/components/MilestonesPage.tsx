import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Save, X, Flag, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { getStorageItem, setStorageItem, isGuestMode } from '../utils/storageHelper';

interface Milestone {
  id: string | number;
  projectId?: string | number;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  assignedTo?: string | number;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  type: string; // For UI categorization (Sprint, Release, etc.)
}

const API_BASE_URL = 'https://api242.onrender.com';

const MILESTONE_TYPES = [
  'Sprint',
  'Internal Review',
  'Customer Presentation',
  'Stakeholder Meeting',
  'Release',
  'Deadline',
  'Planning Session',
  'Demo',
  'Other'
];

const MILESTONE_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'gray' },
  { value: 'in-progress', label: 'In Progress', color: 'blue' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'delayed', label: 'Delayed', color: 'red' }
];

export function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    type: 'Sprint',
    status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'delayed',
    completed: false,
    assignedTo: ''
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadMilestones(config.projectid);
    }
  }, []);

  const loadMilestones = async (projectid: string) => {
    setIsLoading(true);
    setError(null);

    // If guest mode, load from storage only
    if (isGuestMode()) {
      const saved = getStorageItem(`${projectid}_milestones`);
      if (saved) {
        setMilestones(JSON.parse(saved));
      }
      setIsLoading(false);
      return;
    }

    // For logged-in users, try to fetch from API first
    try {
      const response = await fetch(`${API_BASE_URL}/projectmilestones?projectid=${projectid}`);
      
      if (response.ok) {
        const data = await response.json();
        // API returns array of milestones
        if (Array.isArray(data)) {
          setMilestones(data);
          // Cache in localStorage
          setStorageItem(`${projectid}_milestones`, JSON.stringify(data));
        }
      } else {
        // If API fails, fall back to localStorage
        console.warn('Failed to fetch from API, using localStorage');
        const saved = getStorageItem(`${projectid}_milestones`);
        if (saved) {
          setMilestones(JSON.parse(saved));
        }
      }
    } catch (err) {
      console.error('Error fetching milestones:', err);
      // Fall back to localStorage on error
      const saved = getStorageItem(`${projectid}_milestones`);
      if (saved) {
        setMilestones(JSON.parse(saved));
      }
      setError('Failed to load milestones from server. Showing cached data.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMilestones = async (milestonesData: Milestone[]) => {
    if (!projectId) return;

    // Save to localStorage immediately
    setStorageItem(`${projectId}_milestones`, JSON.stringify(milestonesData));
    setMilestones(milestonesData);

    // If not guest mode, sync to API
    if (!isGuestMode()) {
      // Note: We might need to sync individual milestones to the API
      // This depends on the API structure - bulk update or individual operations
      console.log('Milestones updated locally. API sync may be needed.');
    }
  };

  const handleAddMilestone = async (milestone: Omit<Milestone, 'id'>) => {
    if (isGuestMode()) {
      // Guest mode: add locally only
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        ...milestone
      };
      saveMilestones([...milestones, newMilestone]);
      return;
    }

    // Logged-in users: POST to API
    try {
      const response = await fetch(`${API_BASE_URL}/projectmilestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectid: projectId,
          date: milestone.dueDate,
          description: milestone.description,
          type: milestone.type,
          status: milestone.status,
          completed: milestone.completed,
          assignedTo: milestone.assignedTo
        })
      });

      if (response.ok) {
        const newMilestone = await response.json();
        saveMilestones([...milestones, newMilestone]);
      } else {
        throw new Error('Failed to add milestone');
      }
    } catch (err) {
      console.error('Error adding milestone:', err);
      setError('Failed to add milestone. Please try again.');
      // Still add locally as fallback
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        ...milestone
      };
      saveMilestones([...milestones, newMilestone]);
    }
  };

  const handleUpdateMilestone = async (id: string, updates: Partial<Milestone>) => {
    if (isGuestMode()) {
      // Guest mode: update locally only
      const updatedMilestones = milestones.map(m =>
        m.id === id ? { ...m, ...updates } : m
      );
      saveMilestones(updatedMilestones);
      return;
    }

    // Logged-in users: PUT to API
    try {
      const response = await fetch(`${API_BASE_URL}/projectmilestones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectid: projectId,
          ...updates
        })
      });

      if (response.ok) {
        const updatedMilestones = milestones.map(m =>
          m.id === id ? { ...m, ...updates } : m
        );
        saveMilestones(updatedMilestones);
      } else {
        throw new Error('Failed to update milestone');
      }
    } catch (err) {
      console.error('Error updating milestone:', err);
      setError('Failed to update milestone. Please try again.');
      // Still update locally as fallback
      const updatedMilestones = milestones.map(m =>
        m.id === id ? { ...m, ...updates } : m
      );
      saveMilestones(updatedMilestones);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (isGuestMode()) {
      // Guest mode: delete locally only
      saveMilestones(milestones.filter(m => m.id !== id));
      return;
    }

    // Logged-in users: DELETE from API
    try {
      const response = await fetch(`${API_BASE_URL}/projectmilestones/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        saveMilestones(milestones.filter(m => m.id !== id));
      } else {
        throw new Error('Failed to delete milestone');
      }
    } catch (err) {
      console.error('Error deleting milestone:', err);
      setError('Failed to delete milestone. Please try again.');
      // Still delete locally as fallback
      saveMilestones(milestones.filter(m => m.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMilestone) {
      // Update existing milestone
      handleUpdateMilestone(editingMilestone.id, formData);
      setEditingMilestone(null);
    } else {
      // Add new milestone
      handleAddMilestone(formData);
    }

    resetForm();
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate,
      type: milestone.type,
      status: milestone.status,
      completed: milestone.completed,
      assignedTo: milestone.assignedTo
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      handleDeleteMilestone(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      type: 'Sprint',
      status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'delayed',
      completed: false,
      assignedTo: ''
    });
    setEditingMilestone(null);
    setShowAddModal(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const milestoneDate = new Date(dateString);
    milestoneDate.setHours(0, 0, 0, 0);
    const diffTime = milestoneDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (dateString: string) => {
    const days = getDaysUntil(dateString);
    
    if (days < 0) {
      return <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">Past</span>;
    } else if (days === 0) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Today</span>;
    } else if (days <= 7) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">This Week</span>;
    } else if (days <= 30) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">This Month</span>;
    } else {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Upcoming</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Sprint': return '🏃';
      case 'Internal Review': return '🔍';
      case 'Customer Presentation': return '👥';
      case 'Stakeholder Meeting': return '🤝';
      case 'Release': return '🚀';
      case 'Deadline': return '⏰';
      case 'Planning Session': return '📋';
      case 'Demo': return '💻';
      default: return '📌';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sprint': return 'bg-purple-100 text-purple-800';
      case 'Internal Review': return 'bg-blue-100 text-blue-800';
      case 'Customer Presentation': return 'bg-green-100 text-green-800';
      case 'Stakeholder Meeting': return 'bg-orange-100 text-orange-800';
      case 'Release': return 'bg-red-100 text-red-800';
      case 'Deadline': return 'bg-pink-100 text-pink-800';
      case 'Planning Session': return 'bg-indigo-100 text-indigo-800';
      case 'Demo': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort milestones
  const filteredMilestones = milestones
    .filter(m => filterType === 'all' || m.type === filterType)
    .filter(m => filterStatus === 'all' || m.status === filterStatus)
    .sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Get upcoming milestones count
  const upcomingCount = milestones.filter(m => getDaysUntil(m.dueDate) >= 0).length;

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Milestones</h1>
              <p className="text-gray-500">Track important dates and project milestones</p>
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
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Milestone
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Milestones</p>
                  <p className="text-2xl font-bold text-gray-800">{milestones.length}</p>
                </div>
                <Flag className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-800">{upcomingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {milestones.filter(m => {
                      const days = getDaysUntil(m.dueDate);
                      return days >= 0 && days <= 7;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {milestones.filter(m => {
                      const days = getDaysUntil(m.dueDate);
                      return days >= 0 && days <= 30;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
              >
                <option value="all">All Types</option>
                {MILESTONE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
              >
                <option value="all">All Statuses</option>
                {MILESTONE_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Sort by Date:</label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
              </button>
            </div>
          </div>
        </div>

        {/* Milestones List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All Milestones ({filteredMilestones.length})</h2>
          </div>

          {filteredMilestones.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                {filterType === 'all' ? 'No milestones yet' : `No ${filterType} milestones`}
              </p>
              <p className="text-sm">Add your first milestone to get started</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredMilestones.map((milestone) => {
                const days = getDaysUntil(milestone.dueDate);
                const isPast = days < 0;
                
                return (
                  <div key={milestone.id} className={`p-6 hover:bg-gray-50 transition-colors ${isPast ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getTypeIcon(milestone.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold">{formatDate(milestone.dueDate)}</h3>
                              {getStatusBadge(milestone.dueDate)}
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(milestone.type)}`}>
                                {milestone.type}
                              </span>
                            </div>
                            <p className="text-gray-700">{milestone.description}</p>
                            {!isPast && days > 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                {days === 1 ? 'Tomorrow' : `In ${days} days`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(milestone)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(milestone.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
                    required
                  >
                    {MILESTONE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this milestone..."
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4CBB17] min-h-[100px]"
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
                  {editingMilestone ? 'Update' : 'Add'} Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}