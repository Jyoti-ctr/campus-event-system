import type { Event, Category, User, Registration, Stats } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Events
  async getEvents(params?: { category?: string; status?: string; search?: string; featured?: boolean; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.fetch<{ events: Event[]; count: number }>(`/events${query}`);
  }

  async getEvent(id: number) {
    return this.fetch<{ event: Event }>(`/events/${id}`);
  }

  async createEvent(eventData: Partial<Event>) {
    return this.fetch<{ event: Event; message: string }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: number, eventData: Partial<Event>) {
    return this.fetch<{ event: Event; message: string }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: number) {
    return this.fetch<{ message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    return this.fetch<{ categories: Category[]; count: number }>('/categories');
  }

  async createCategory(categoryData: Partial<Category>) {
    return this.fetch<{ category: Category; message: string }>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Users
  async getUsers() {
    return this.fetch<{ users: User[]; count: number }>('/users');
  }

  async getUser(id: number) {
    return this.fetch<{ user: User }>(`/users/${id}`);
  }

  async createUser(userData: Partial<User>) {
    return this.fetch<{ user: User; message: string }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Registrations
  async getRegistrations(params?: { event_id?: number; user_id?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.event_id) queryParams.append('event_id', params.event_id.toString());
    if (params?.user_id) queryParams.append('user_id', params.user_id.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.fetch<{ registrations: Registration[]; count: number }>(`/registrations${query}`);
  }

  async createRegistration(eventId: number, userId: number, notes?: string) {
    return this.fetch<{ registration: Registration; message: string }>('/registrations', {
      method: 'POST',
      body: JSON.stringify({ event_id: eventId, user_id: userId, notes }),
    });
  }

  async cancelRegistration(registrationId: number) {
    return this.fetch<{ message: string }>(`/registrations/${registrationId}`, {
      method: 'DELETE',
    });
  }

  // Stats
  async getStats() {
    return this.fetch<{ stats: Stats }>('/stats');
  }

  // Health Check
  async healthCheck() {
    return this.fetch<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
