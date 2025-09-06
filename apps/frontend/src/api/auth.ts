import { apiClient } from './client';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'employer';
  resumeLink?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'employer';
    resumeLink?: string;
  };
}

export const authApi = {
  register: (data: RegisterData) => apiClient.post<AuthResponse>('/auth/register', data),

  login: (data: LoginData) => apiClient.post<AuthResponse>('/auth/login', data),

  getMe: () =>
    apiClient.get<{
      user: {
        _id: string;
        name: string;
        email: string;
        role: 'user' | 'employer';
        resumeLink?: string;
      };
    }>('/auth/me'),
};
