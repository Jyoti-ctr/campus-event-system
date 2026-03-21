import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // This smart function handles both scrolling AND page navigation
  const handleScrollTo = (id: string) => {
    if (window.location.pathname !== '/') {
      // If the user is on /login, take them home first
      navigate('/');
      // Wait a tiny bit for the home page to load, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // If already on the home page, just scroll immediately
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#f3f3f3] via-white to-[#f9f9fa]"
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute -right-20 top-20 w-[500px] h-[500px] rounded-full bg-[#ff8a01] opacity-10 blur-3xl transition-all duration-1000 ${
            isVisible ? 'scale-100 opacity-10' : 'scale-50 opacity-0'
          }`}
          style={{ animationDelay: '0.2s' }}
        />
        <div 
          className={`absolute -left-40 bottom-20 w-[600px] h-[600px] rounded-full bg-[#314c53] opacity-10 blur-3xl transition-all duration-1000 delay-300 ${
            isVisible ? 'scale-100 opacity-10' : 'scale-50 opacity-0'
          }`}
        />
        <div 
          className={`absolute right-[15%] top-[30%] w-32 h-32 bg-[#ff8a01] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-20 animate-float transition-all duration-1000 delay-500 ${
            isVisible ? 'scale-100 rotate-0 opacity-20' : 'scale-0 -rotate-180 opacity-0'
          }`}
        />
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 min-h-screen items-center px-6 sm:px-8 lg:px-16 xl:px-24 py-20 lg:py-0">
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <div className="overflow-hidden mb-2">
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 tracking-tight transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ transitionDelay: '0.4s', fontFamily: 'Montserrat, sans-serif' }}>
              <span className="block">DISCOVER</span>
            </h1>
          </div>
          <div className="overflow-hidden mb-2">
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#ff8a01] tracking-tight transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ transitionDelay: '0.52s', fontFamily: 'Montserrat, sans-serif' }}>
              <span className="block">CAMPUS</span>
            </h1>
          </div>
          <div className="overflow-hidden mb-6">
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 tracking-tight transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ transitionDelay: '0.64s', fontFamily: 'Montserrat, sans-serif' }}>
              <span className="block">EVENTS</span>
            </h1>
          </div>

          <p className={`text-lg sm:text-xl text-gray-600 max-w-lg mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`} style={{ transitionDelay: '0.8s' }}>
            Connect, learn, and create unforgettable memories with fellow students. 
            Discover the best campus events all in one place.
          </p>

          <div className={`flex flex-wrap gap-4 mb-12 transition-all duration-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.9s' }}>
            <button 
              onClick={() => handleScrollTo('events')}
              className="btn-primary group flex items-center bg-[#ff8a01] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e67c00] transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>Explore Events</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => handleScrollTo('submit-event')}
              className="btn-secondary border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              <span>Submit Event</span>
            </button>
          </div>

          <div className={`flex gap-8 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1s' }}>
            <div>
              <div className="text-3xl font-bold text-[#ff8a01]">150+</div>
              <div className="text-sm text-gray-500">Events This Semester</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#314c53]">5K+</div>
              <div className="text-sm text-gray-500">Student Attendees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-500">Organizations</div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center order-1 lg:order-2">
          <div className={`relative transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100 rotate-0' : 'scale-80 opacity-0 rotate-[15deg]'}`} style={{ transitionDelay: '0.3s' }}>
            <div className="absolute -inset-4 border-2 border-[#ff8a01] rounded-full opacity-30 animate-pulse-slow" />
            <div className="absolute -inset-8 border border-[#314c53] rounded-full opacity-20" />
            
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=800&fit=crop"
                alt="Students enjoying campus event"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all duration-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => handleScrollTo('events')}
        style={{ transitionDelay: '1.2s' }}
      >
        <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
        <ChevronDown className="w-6 h-6 text-[#ff8a01] animate-bounce" />
      </div>
    </section>
  );
}