import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Save, X, Flag, Clock } from 'lucide-react';
import { Link } from 'react-router';

interface Milestone {
  id: string;
  date: string;
  description: string;
  type: string;
}

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

export function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    type: 'Sprint'
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const savedProjectConfig = localStorage.getItem('project_config');
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadMilestones(config.projectid);
    }
  }, []);

  const loadMilestones = (projectid: string) => {
    const saved = localStorage.getItem(`${projectid}_milestones`);
    if (saved) {
      setMilestones(JSON.parse(saved));
    }
  };

  const saveMilestones = (milestonesData: Milestone[]) => {
    if (projectId) {
      localStorage.setItem(`${projectId}_milestones`, JSON.stringify(milestonesData));
      setMilestones(milestonesData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMilestone) {
      // Update existing milestone
      const updatedMilestones = milestones.map(m => 
        m.id === editingMilestone.id 
          ? { ...m, ...formData }
          : m
      );
      saveMilestones(updatedMilestones);
      setEditingMilestone(null);
    } else {
      // Add new milestone
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        ...formData
      };
      saveMilestones([...milestones, newMilestone]);
    }

    resetForm();
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      date: milestone.date,
      description: milestone.description,
      type: milestone.type
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      const updatedMilestones = milestones.filter(m => m.id !== id);
      saveMilestones(updatedMilestones);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      description: '',
      type: 'Sprint'
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
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Get upcoming milestones count
  const upcomingCount = milestones.filter(m => getDaysUntil(m.date) >= 0).length;

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
                      const days = getDaysUntil(m.date);
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
                      const days = getDaysUntil(m.date);
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
                const days = getDaysUntil(milestone.date);
                const isPast = days < 0;
                
                return (
                  <div key={milestone.id} className={`p-6 hover:bg-gray-50 transition-colors ${isPast ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getTypeIcon(milestone.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold">{formatDate(milestone.date)}</h3>
                              {getStatusBadge(milestone.date)}
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
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
