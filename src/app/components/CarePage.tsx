import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Send, Ticket, Phone, Mail, User } from 'lucide-react';

interface SupportTicket {
  ticketid: string;
  emplid: number;
  descr: string;
  severity: number;
  userid: number;
  email: string;
  fullname: string;
  bestcontactnumber: string;
  replied: string;
  repliedmanagerid: string;
  repliedmanagerphone: string;
  repliedmanageremail: string;
  ticketdate: string;
  responsedate: string;
  ticketstatus: string;
}

export function CarePage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    emplid: '',
    descr: '',
    severity: 2,
    bestcontactnumber: ''
  });

  // Load user info
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch user's tickets
  const fetchTickets = async () => {
    if (!currentUser?.uid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://api242.onrender.com/userhelp?userid=${currentUser.uid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await response.json();
      // Sort by ticket date, newest first
      const sortedTickets = data.sort((a: SupportTicket, b: SupportTicket) => 
        new Date(b.ticketdate).getTime() - new Date(a.ticketdate).getTime()
      );
      setTickets(sortedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentUser]);

  // Submit new ticket
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to submit a support ticket');
      return;
    }

    if (!formData.descr.trim()) {
      alert('Please describe your issue');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate ticket ID
      const timestamp = Date.now();
      const ticketId = `TCK-${timestamp.toString().slice(-6)}`;
      
      const ticketData = {
        ticketid: ticketId,
        emplid: parseInt(formData.emplid) || 0,
        descr: formData.descr,
        severity: formData.severity,
        userid: currentUser.uid,
        email: currentUser.email,
        fullname: currentUser.username,
        bestcontactnumber: formData.bestcontactnumber,
        replied: 'No',
        repliedmanagerid: '',
        repliedmanagerphone: '',
        repliedmanageremail: '',
        ticketdate: new Date().toISOString(),
        responsedate: '',
        ticketstatus: 'Open'
      };

      console.log('Submitting ticket:', ticketData);

      const response = await fetch('https://api242.onrender.com/userhelp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.text();
      console.log('Response body:', responseData);

      if (!response.ok) {
        throw new Error(`Failed to submit ticket: ${response.status} - ${responseData}`);
      }

      // Reset form
      setFormData({
        emplid: '',
        descr: '',
        severity: 2,
        bestcontactnumber: ''
      });

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Refresh tickets after a short delay to allow server to process
      setTimeout(() => {
        fetchTickets();
      }, 500);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert(`Failed to submit ticket. Please try again.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get severity color
  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1: return 'text-red-600 bg-red-50';
      case 2: return 'text-orange-600 bg-orange-50';
      case 3: return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get severity label
  const getSeverityLabel = (severity: number) => {
    switch (severity) {
      case 1: return 'Critical';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      default: return 'Unknown';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'closed': return 'text-green-600 bg-green-50';
      case 'in progress': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-600">Please log in to access the Care Center</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Care Center</h1>
          <p className="text-gray-600">Submit support tickets and track your cases</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Ticket submitted successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit New Ticket */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Submit New Ticket</h2>
                  <p className="text-sm text-gray-600">Get help with your issue</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.emplid}
                    onChange={(e) => setFormData({ ...formData, emplid: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12345"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Description *
                  </label>
                  <textarea
                    value={formData.descr}
                    onChange={(e) => setFormData({ ...formData, descr: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity *
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Critical - System down/blocking work</option>
                    <option value={2}>High - Major functionality affected</option>
                    <option value={3}>Medium - Minor functionality issue</option>
                    <option value={4}>Low - Enhancement request</option>
                  </select>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Best Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.bestcontactnumber}
                    onChange={(e) => setFormData({ ...formData, bestcontactnumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="555-123-4567"
                  />
                </div>

                {/* User Info Display */}
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="text-gray-600">
                    <strong>Submitting as:</strong> {currentUser.username} ({currentUser.email})
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Ticket
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* My Cases */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">My Cases</h2>
                  <p className="text-sm text-gray-600">{tickets.length} total tickets</p>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Loading tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No support tickets yet</p>
                  <p className="text-sm text-gray-500">Submit your first ticket to get help</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.ticketid}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Ticket Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-semibold text-gray-700">
                              {ticket.ticketid}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.ticketstatus)}`}>
                              {ticket.ticketstatus}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatDate(ticket.ticketdate)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(ticket.severity)}`}>
                          {getSeverityLabel(ticket.severity)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {ticket.descr}
                      </p>

                      {/* Response Info */}
                      {ticket.replied === 'Yes' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 text-green-800 font-medium text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Response Received
                          </div>
                          {ticket.repliedmanageremail && (
                            <div className="flex items-center gap-2 text-xs text-green-700">
                              <Mail className="w-3 h-3" />
                              {ticket.repliedmanageremail}
                            </div>
                          )}
                          {ticket.repliedmanagerphone && (
                            <div className="flex items-center gap-2 text-xs text-green-700">
                              <Phone className="w-3 h-3" />
                              {ticket.repliedmanagerphone}
                            </div>
                          )}
                          {ticket.responsedate && (
                            <p className="text-xs text-green-600">
                              {formatDate(ticket.responsedate)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Contact Info */}
                      {ticket.bestcontactnumber && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="w-3 h-3" />
                          {ticket.bestcontactnumber}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}