import { useEffect, useRef, useState } from 'react';
import { Calendar, Users, Building2, MapPin } from 'lucide-react';
import { apiService } from '@/services/api';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
}

function AnimatedCounter({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    total_events: 150,
    total_users: 5000,
    student_organizations: 50,
    campus_venues: 25
  });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiService.getStats();
      if (response.success && response.data?.stats) {
        setStats(prev => ({
          ...prev,
          total_events: response.data?.stats?.total_events || prev.total_events,
          total_users: response.data?.stats?.total_users || prev.total_users,
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statItems: StatItem[] = [
    { icon: Calendar, value: stats.total_events, suffix: '+', label: 'Events This Semester' },
    { icon: Users, value: stats.total_users, suffix: '+', label: 'Student Attendees' },
    { icon: Building2, value: stats.student_organizations, suffix: '+', label: 'Student Organizations' },
    { icon: MapPin, value: stats.campus_venues, suffix: '+', label: 'Campus Venues' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#314c53] via-[#3d5a61] to-[#314c53]" />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,138,1,0.1), transparent)',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 8s linear infinite'
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff8a01]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ff8a01]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {statItems.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <div
                key={index}
                className={`text-center transition-all duration-600 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl mb-4 backdrop-blur-sm">
                  <IconComponent className="w-7 h-7 text-[#ff8a01]" />
                </div>

                {/* Number */}
                <div 
                  className="text-4xl lg:text-5xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #ff8a01, #ffb347)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(255, 138, 1, 0.3)'
                  }}
                >
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    isVisible={isVisible} 
                  />
                </div>

                {/* Label */}
                <div className="text-white/80 text-sm lg:text-base font-medium">
                  {stat.label}
                </div>

                {/* Divider (not on last item) */}
                {index < statItems.length - 1 && (
                  <div 
                    className={`hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/20 transition-all duration-600 ${
                      isVisible ? 'scale-y-100' : 'scale-y-0'
                    }`}
                    style={{ 
                      transitionDelay: `${400 + index * 100}ms`,
                      transformOrigin: 'top'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
