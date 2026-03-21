import { useEffect, useRef, useState } from 'react';
import { Send, CheckCircle, AlertCircle, Info, Mail, Phone, MapPin } from 'lucide-react';
import type { Category } from '@/types';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export default function SubmitEvent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    category: '',
    description: '',
    organizer: '',
    contact_email: '',
    max_attendees: ''
  });

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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response: any = await apiService.getCategories();
      let fetchedCategories: Category[] = [];

      // Handle different possible API response structures
      if (Array.isArray(response)) {
        fetchedCategories = response;
      } else if (response.categories) {
        fetchedCategories = response.categories;
      } else if (response.data?.categories) {
        fetchedCategories = response.data.categories;
      } else if (response.data && Array.isArray(response.data)) {
        fetchedCategories = response.data;
      }

      setCategories(fetchedCategories.map((c: Category) => c.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        status: 'pending',
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        highlights: []
      };

      const response = await apiService.createEvent(eventData);
      
      if (response.success) {
        toast.success('Event submitted successfully!', {
          description: 'Your event will be reviewed and published soon.',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        });
        
        // Reset form
        setFormData({
          title: '',
          date: '',
          start_time: '',
          end_time: '',
          location: '',
          category: '',
          description: '',
          organizer: '',
          contact_email: '',
          max_attendees: ''
        });
      } else {
        toast.error('Failed to submit event', {
          description: response.error || 'Please try again.',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />
        });
      }
    } catch (error) {
      toast.error('An error occurred', {
        description: 'Please check your connection and try again.',
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const guidelines = [
    'Events must be campus-related',
    'Submit at least 2 weeks in advance',
    'Include clear event details',
    'Provide contact information'
  ];

  return (
    <section
      ref={sectionRef}
      id="submit-event"
      className="py-20 lg:py-28 px-6 sm:px-8 lg:px-16 xl:px-24 bg-white relative overflow-hidden"
    >
      {/* Decorative shape */}
      <div 
        className={`absolute -left-20 top-1/4 w-64 h-64 bg-[#ff8a01]/10 rounded-full blur-3xl transition-all duration-800 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className={`section-title transition-all duration-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Submit Your Event
          </h2>
          <p 
            className={`section-subtitle max-w-2xl mx-auto mb-0 transition-all duration-600 delay-100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Share your event with the campus community
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form 
              onSubmit={handleSubmit}
              className={`bg-[#f9f9fa] rounded-2xl p-6 lg:p-8 transition-all duration-600 delay-200 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Event Name */}
                <div 
                  className={`transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all"
                    placeholder="Enter event name"
                  />
                </div>

                {/* Event Date */}
                <div 
                  className={`transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '280ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all"
                  />
                </div>

                {/* Start Time */}
                <div 
                  className={`transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '360ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all"
                  />
                </div>

                {/* End Time */}
                <div 
                  className={`transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '440ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all"
                  />
                </div>

                {/* Location */}
                <div 
                  className={`transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '520ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all"
                    placeholder="e.g., Student Center"
                  />
                </div>

                {/* Category */}
                <div 
                  className={`transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Organizer */}
                <div 
                  className={`transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '680ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organizer *
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all"
                    placeholder="e.g., Computer Science Club"
                  />
                </div>

                {/* Contact Email */}
                <div 
                  className={`transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '680ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all"
                    placeholder="your@email.edu"
                  />
                </div>

                {/* Max Attendees */}
                <div 
                  className={`md:col-span-2 transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '760ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Maximum Attendees (optional)
                  </label>
                  <input
                    type="number"
                    name="max_attendees"
                    value={formData.max_attendees}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                {/* Description */}
                <div 
                  className={`md:col-span-2 transition-all duration-400 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff8a01] focus:ring-2 focus:ring-[#ff8a01]/20 outline-none transition-all resize-none"
                    placeholder="Describe your event..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div 
                className={`mt-8 transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Panel */}
          <div 
            className={`transition-all duration-600 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ff8a01]/10 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-[#ff8a01]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Event Guidelines</h3>
              </div>

              <ul className="space-y-4 mb-8">
                {guidelines.map((guideline, index) => (
                  <li 
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-300 ${
                      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${600 + index * 80}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-[#ff8a01] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{guideline}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
                <div className="space-y-3">
                  <a 
                    href="mailto:events@university.edu"
                    className="flex items-center gap-3 text-gray-600 hover:text-[#ff8a01] transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">events@university.edu</span>
                  </a>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span className="text-sm">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">Student Center, Room 205</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
