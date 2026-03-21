import { useEffect, useRef, useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Calendar, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Browse Events', href: '#events' },
    { label: 'Submit Event', href: '#submit-event' },
    { label: 'Categories', href: '#categories' },
    { label: 'My Account', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#1a1a1a] text-white overflow-hidden"
    >
      {/* Top gradient line */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8a01] via-[#314c53] to-[#ff8a01] transition-transform duration-800 ${
          isVisible ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{ 
          backgroundSize: '200% 100%',
          animation: isVisible ? 'gradient-shift 3s linear infinite' : 'none'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div 
            className={`transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ff8a01] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                CampusEvents
              </span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting students through unforgettable experiences. Discover, 
              participate, and create amazing memories on campus.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#ff8a01] hover:-translate-y-1 transition-all duration-300 ${
                      isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                    style={{ transitionDelay: `${400 + index * 80}ms` }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div 
            className={`transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li 
                  key={link.label}
                  className={`transition-all duration-300 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${400 + index * 60}ms` }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#ff8a01] hover:translate-x-1 inline-flex items-center transition-all duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div 
            className={`transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <a 
                href="mailto:events@university.edu"
                className={`flex items-center gap-3 text-gray-400 hover:text-[#ff8a01] transition-all duration-300 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <Mail className="w-5 h-5 text-[#ff8a01]" />
                <span>events@university.edu</span>
              </a>
              <div 
                className={`flex items-center gap-3 text-gray-400 transition-all duration-300 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: '560ms' }}
              >
                <Phone className="w-5 h-5 text-[#ff8a01]" />
                <span>(555) 123-4567</span>
              </div>
              <div 
                className={`flex items-center gap-3 text-gray-400 transition-all duration-300 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: '620ms' }}
              >
                <MapPin className="w-5 h-5 text-[#ff8a01]" />
                <span>Student Center, Room 205</span>
              </div>
            </div>

            {/* Newsletter */}
            <div 
              className={`mt-8 transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              <h4 className="text-sm font-semibold mb-3">Subscribe to our newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:border-[#ff8a01] focus:outline-none text-sm placeholder:text-gray-500"
                />
                <button className="px-4 py-2 bg-[#ff8a01] rounded-lg hover:bg-[#e67d00] transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className={`mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <p className="text-gray-500 text-sm">
            © 2024 CampusEvents. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-[#ff8a01] text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-[#ff8a01] text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#ff8a01] rounded-full shadow-lg flex items-center justify-center hover:bg-[#e67d00] hover:-translate-y-1 transition-all duration-300 z-50"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </button>
    </footer>
  );
}
