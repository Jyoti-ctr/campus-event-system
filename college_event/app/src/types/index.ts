export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string | null;
  location: string;
  category: string;
  image_url: string | null;
  organizer: string;
  contact_email: string;
  max_attendees: number | null;
  current_attendees: number;
  highlights: string[];
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  event_count: number;
}

export interface User {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  major: string | null;
  year: string | null;
  created_at: string;
}

export interface Registration {
  id: number;
  event_id: number;
  user_id: number;
  registration_date: string;
  status: string;
  notes: string | null;
  event?: Event;
  user?: User;
}

export interface Stats {
  total_events: number;
  upcoming_events: number;
  events_this_semester: number;
  total_users: number;
  total_registrations: number;
  total_categories: number;
  student_organizations: number;
  campus_venues: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
