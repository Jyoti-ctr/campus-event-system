import { useEffect, useRef, useState } from 'react';
import { Music, Briefcase, Palette, Code, Trophy, Users, ArrowRight } from 'lucide-react';
import type { Category } from '@/types';
import { apiService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  'Music': Music,
  'Career': Briefcase,
  'Arts': Palette,
  'Technology': Code,
  'Sports': Trophy,
  'Culture': Users,
};

const defaultCategories: Category[] = [
  {
    id: 1,
    name: 'Music',
    description: 'Concerts, performances, and musical events',
    icon: 'Music',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    event_count: 12
  },
  {
    id: 2,
    name: 'Career',
    description: 'Career fairs, networking events, and professional development',
    icon: 'Briefcase',
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
    event_count: 8
  },
  {
    id: 3,
    name: 'Arts',
    description: 'Art exhibitions, theater, and cultural events',
    icon: 'Palette',
    image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop',
    event_count: 15
  },
  {
    id: 4,
    name: 'Technology',
    description: 'Hackathons, tech talks, and innovation events',
    icon: 'Code',
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
    event_count: 5
  },
  {
    id: 5,
    name: 'Sports',
    description: 'Sports events, fitness activities, and tournaments',
    icon: 'Trophy',
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
    event_count: 20
  },
  {
    id: 6,
    name: 'Culture',
    description: 'Cultural festivals, food events, and community gatherings',
    icon: 'Users',
    image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
    event_count: 10
  }
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

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

      // Use default categories if the API returns an empty array
      if (fetchedCategories.length === 0) {
        fetchedCategories = defaultCategories;
      }

      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if the fetch fails entirely
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  // Redirect/Scroll the user down to the Events section upon clicking a category
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
    setTimeout(() => {
      document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="py-20 lg:py-28 px-6 sm:px-8 lg:px-16 xl:px-24 bg-[#f3f3f3]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className={`section-title transition-all duration-600 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            Browse by Category
          </h2>
          <p 
            className={`section-subtitle max-w-2xl mx-auto mb-0 transition-all duration-600 delay-100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            Find events that match your interests and passions
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {categories.map((category, index) => {
              const IconComponent = iconMap[category.icon || ''] || Users;
              
              return (
                <div
                  key={category.id}
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                  }`}
                  style={{ transitionDelay: `${100 + index * 80}ms` }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {/* Image Background */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={category.image_url || `https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop`}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Icon */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#ff8a01] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#ff8a01] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.event_count} events
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#ff8a01]/0 group-hover:bg-[#ff8a01]/5 transition-colors duration-300" />
                </div>
              );
            })}
          </div>
        )}

        {/* Featured Categories Row */}
        <div 
          className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-600 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {[
            {
              title: 'Music & Concerts',
              name: 'Music',
              description: 'Live performances and musical events',
              image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
              count: 12
            },
            {
              title: 'Career & Networking',
              name: 'Career',
              description: 'Professional development opportunities',
              image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
              count: 8
            },
            {
              title: 'Arts & Culture',
              name: 'Arts',
              description: 'Exhibitions, theater, and cultural events',
              image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop',
              count: 15
            }
          ].map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick(item.name)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-white/80 text-sm mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{item.count} events</span>
                  <span className="text-[#ff8a01] text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
