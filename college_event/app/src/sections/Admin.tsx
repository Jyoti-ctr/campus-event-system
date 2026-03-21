import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import type { Event } from '@/types';
import { toast } from 'sonner';
import { CheckCircle, Trash2, Clock, MapPin, Users, X } from 'lucide-react';

export default function Admin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [attendeesModalOpen, setAttendeesModalOpen] = useState(false);
  const [currentAttendees, setCurrentAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  useEffect(() => {
    // Check for authorization
    const userData = localStorage.getItem('campus_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      navigate('/'); // Redirect non-admins to home page
      return;
    }
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch both pending and upcoming events for the dashboard
      const pendingRes: any = await apiService.getEvents({ status: 'pending', limit: 50 });
      const upcomingRes: any = await apiService.getEvents({ status: 'upcoming', limit: 50 });
      
      const extractEvents = (res: any): Event[] => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (res.events && Array.isArray(res.events)) return res.events;
        if (res.data?.events && Array.isArray(res.data.events)) return res.data.events;
        if (res.data && Array.isArray(res.data)) return res.data;
        return [];
      };

      const allEvents = [...extractEvents(pendingRes), ...extractEvents(upcomingRes)];
      
      // Deduplicate in case backend ignores the status filter
      const uniqueEvents = Array.from(new Map(allEvents.map(e => [e.id, e])).values());
      
      setEvents(uniqueEvents);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await apiService.updateEvent(id, { status: 'upcoming' });
      if (res.success) {
        toast.success('Event approved successfully!');
        fetchEvents();
      } else {
        toast.error('Failed to approve event.');
      }
    } catch (err) {
      toast.error('Error approving event');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event permanently?')) return;
    try {
      const res = await apiService.deleteEvent(id);
      if (res.success) {
        toast.success('Event deleted successfully!');
        fetchEvents();
      } else {
        toast.error('Failed to delete event.');
      }
    } catch (err) {
      toast.error('Error deleting event');
    }
  };

  const handleViewAttendees = async (eventId: number) => {
    setAttendeesModalOpen(true);
    setLoadingAttendees(true);
    setCurrentAttendees([]);
    try {
      const res: any = await apiService.getRegistrations({ event_id: eventId });
      
      const extractData = (res: any): any[] => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (res.registrations && Array.isArray(res.registrations)) return res.registrations;
        if (res.data?.registrations && Array.isArray(res.data.registrations)) return res.data.registrations;
        if (res.data && Array.isArray(res.data)) return res.data;
        return [];
      };

      setCurrentAttendees(extractData(res));
    } catch (err) {
      toast.error('Failed to fetch attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6 sm:px-8 lg:px-16 xl:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage all submitted and active campus events.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No events found in the database.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                    <th className="py-4 px-6 font-semibold">Event Name</th>
                    <th className="py-4 px-6 font-semibold">Date & Time</th>
                    <th className="py-4 px-6 font-semibold">Location</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{event.title}</div>
                        <div className="text-gray-500 text-xs">{event.category} • Org: {event.organizer}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(event.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{event.start_time}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</div>
                      </td>
                      <td className="py-4 px-6">
                        {event.status === 'pending' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          {event.status === 'upcoming' && (
                            <button onClick={() => handleViewAttendees(event.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Attendees">
                              <Users className="w-5 h-5" />
                            </button>
                          )}
                          {event.status === 'pending' && (
                            <button onClick={() => handleApprove(event.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Event">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Attendees Modal */}
        {attendeesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Event Attendees</h3>
                <button onClick={() => setAttendeesModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {loadingAttendees ? (
                  <div className="text-center text-gray-500 py-8">Loading attendees...</div>
                ) : currentAttendees.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No attendees registered yet.</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {currentAttendees.map((attendee, idx) => (
                      <li key={idx} className="py-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{attendee.user?.name || attendee.name || `User #${attendee.user_id || 'Unknown'}`}</div>
                          <div className="text-sm text-gray-500">{attendee.user?.email || attendee.email || 'No email provided'}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {attendee.registration_date ? new Date(attendee.registration_date).toLocaleDateString() : ''}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}