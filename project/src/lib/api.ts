const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'authority' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  photos: string[];
  location: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  category: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  createdBy: User | string;
  assignedTo?: User;
  comments: Array<{
    by: User | string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  resolutionPhotos?: string[];
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async register(name: string, email: string, password: string, role?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async createComplaint(formData: FormData): Promise<{ complaint: Complaint }> {
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Failed to create complaint');
    }

    return response.json();
  }

  async getMyComplaints(): Promise<{ complaints: Complaint[] }> {
    return this.request<{ complaints: Complaint[] }>('/complaints/mine');
  }

  async getComplaintById(id: string): Promise<{ complaint: Complaint }> {
    return this.request<{ complaint: Complaint }>(`/complaints/${id}`);
  }

  async getPublicComplaints(params?: {
    status?: string;
    category?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
    page?: number;
    limit?: number;
  }): Promise<{ complaints: Complaint[] }> {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    return this.request<{ complaints: Complaint[] }>(`/complaints/public?${queryString}`);
  }

  async listComplaints(params?: {
    status?: string;
    category?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{ complaints: Complaint[] }> {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    return this.request<{ complaints: Complaint[] }>(`/admin/complaints?${queryString}`);
  }

  async updateComplaintStatus(
    id: string,
    status: string,
    resolutionNotes?: string,
    resolutionPhotos?: string[]
  ): Promise<{ complaint: Complaint }> {
    return this.request<{ complaint: Complaint }>(`/admin/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNotes, resolutionPhotos }),
    });
  }

  async assignComplaint(id: string, assignedTo: string): Promise<{ complaint: Complaint }> {
    return this.request<{ complaint: Complaint }>(`/admin/complaints/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo }),
    });
  }

  async addComment(id: string, message: string): Promise<{ complaint: Complaint }> {
    return this.request<{ complaint: Complaint }>(`/admin/complaints/${id}/comment`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async chatbotQuery(q: string): Promise<{ reply: string; complaint?: Complaint }> {
    return this.request<{ reply: string; complaint?: Complaint }>('/chatbot/query', {
      method: 'POST',
      body: JSON.stringify({ q }),
    });
  }
}

export const api = new ApiClient();
