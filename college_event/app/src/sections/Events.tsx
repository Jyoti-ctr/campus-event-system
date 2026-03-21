import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Users } from 'lucide-react';
import type { Event } from '@/types';
import { apiService } from '@/services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('campus_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const categoryParam = searchParams.get('category');
  const statusParam = searchParams.get('status') || 'upcoming';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchEvents(categoryParam, statusParam);
  }, [categoryParam, statusParam]);

  const fetchEvents = async (category: string | null, status: string) => {
    setLoading(true);
    try {
      const response: any = await apiService.getEvents({ 
        status: status, 
        limit: 50,
        category: category || undefined
      });
      
      const extractEvents = (res: any): Event[] => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (res.events && Array.isArray(res.events)) return res.events;
        if (res.data?.events && Array.isArray(res.data.events)) return res.data.events;
        if (res.data && Array.isArray(res.data)) return res.data;
        return [];
      };

      let fetchedEvents = extractEvents(response);

      // Deduplicate events by ID
      fetchedEvents = Array.from(new Map(fetchedEvents.map(e => [e.id, e])).values());

      // Fallback frontend filtering just in case the backend API ignores the query parameters
      if (category) {
        fetchedEvents = fetchedEvents.filter(e => e.category === category || e.category.toLowerCase() === category.toLowerCase());
      }
      if (status) {
        fetchedEvents = fetchedEvents.filter(e => e.status === status);
      }

      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Music': 'bg-purple-100 text-purple-700',
      'Career': 'bg-blue-100 text-blue-700',
      'Arts': 'bg-pink-100 text-pink-700',
      'Technology': 'bg-cyan-100 text-cyan-700',
      'Sports': 'bg-green-100 text-green-700',
      'Culture': 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const handleApproveEvent = async (id: number) => {
    try {
      const response = await apiService.updateEvent(id, { status: 'upcoming' });
      if (response.success) {
        toast.success('Event approved successfully!');
        setSelectedEvent(null);
        fetchEvents(categoryParam, statusParam);
      } else {
        toast.error('Failed to approve event');
      }
    } catch (error) {
      toast.error('An error occurred while approving.');
    }
  };

  const handleRegister = async (eventId: number) => {
    if (!user) {
      toast.error('Please sign in to register for events.');
      navigate('/login');
      return;
    }
    
    try {
      const response = await apiService.createRegistration(eventId, user.id || 1, '');
      if (response.success !== false) {
        toast.success('Successfully registered for the event!');
        setEvents(events.map(e => e.id === eventId ? { ...e, current_attendees: (e.current_attendees || 0) + 1 } : e));
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent({ ...selectedEvent, current_attendees: (selectedEvent.current_attendees || 0) + 1 });
        }
      } else {
        toast.error(response.error || 'Failed to register. You might already be registered.');
      }
    } catch (error) {
      toast.error('An error occurred during registration.');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="events"
      className="py-20 lg:py-28 px-6 sm:px-8 lg:px-16 xl:px-24 bg-white"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 
              className={`section-title transition-all duration-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {statusParam === 'pending' ? 'Pending Events' : categoryParam ? `${categoryParam} Events` : 'Upcoming Events'}
            </h2>
            <p 
              className={`section-subtitle mb-0 transition-all duration-600 delay-100 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              {statusParam === 'pending' ? 'Review and approve submitted events' : "Discover what's happening on campus"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {(categoryParam || statusParam === 'pending') && (
               <button 
                onClick={() => setSearchParams({})}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
               >
                 Clear Filters
               </button>
            )}
            <button 
              onClick={() => {
                 document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`inline-flex items-center text-[#ff8a01] font-semibold hover:text-[#e67d00] transition-all duration-600 delay-200 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              Browse Categories
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-gray-500 mb-4">No events found matching your criteria.</div>
          <button 
            onClick={() => setSearchParams({})}
            className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
          >
            View All Upcoming Events
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{ 
                transitionDelay: `${100 + index * 100}ms`,
                transform: isVisible ? `translateY(${index % 3 === 0 ? '40px' : index % 3 === 2 ? '20px' : '0'})` : undefined
              }}
              onClick={() => setSelectedEvent(event)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image_url || `https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop`}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>

                {/* Date Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-gray-500 uppercase">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-xl font-bold text-[#ff8a01]">
                    {new Date(event.date).getDate()}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#ff8a01] transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2 text-[#ff8a01]" />
                    {formatTime(event.start_time)}
                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-[#ff8a01]" />
                    {event.location}
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {event.current_attendees}
                    {event.max_attendees && ` / ${event.max_attendees}`} registered
                  </div>
                  <button className="text-[#ff8a01] font-semibold text-sm hover:underline">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <div className="relative h-64 -mx-6 -mt-6 mb-6">
                <img
                  src={selectedEvent.image_url || `https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop`}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </span>
              </div>
              
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedEvent.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-gray-600">{selectedEvent.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-5 h-5 mr-3 text-[#ff8a01]" />
                    <div>
                      <div className="font-semibold">Date</div>
                      <div className="text-gray-500">{formatDate(selectedEvent.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-5 h-5 mr-3 text-[#ff8a01]" />
                    <div>
                      <div className="font-semibold">Time</div>
                      <div className="text-gray-500">
                        {formatTime(selectedEvent.start_time)}
                        {selectedEvent.end_time && ` - ${formatTime(selectedEvent.end_time)}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-5 h-5 mr-3 text-[#ff8a01]" />
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-gray-500">{selectedEvent.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-5 h-5 mr-3 text-[#ff8a01]" />
                    <div>
                      <div className="font-semibold">Attendees</div>
                      <div className="text-gray-500">
                        {selectedEvent.current_attendees}
                        {selectedEvent.max_attendees && ` / ${selectedEvent.max_attendees}`} registered
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Highlights</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {selectedEvent.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-4">
                    Organized by: <span className="font-semibold">{selectedEvent.organizer}</span>
                  </div>
                  <div className="flex gap-4">
                    {selectedEvent.status === 'pending' ? (
                      <button onClick={() => handleApproveEvent(selectedEvent.id)} className="btn-primary flex-1 bg-green-600 hover:bg-green-700 border-none">
                        Approve Event
                      </button>
                    ) : (
                      <button onClick={() => handleRegister(selectedEvent.id)} className="btn-primary flex-1">
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
