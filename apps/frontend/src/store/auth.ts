import { create } from 'zustand';
import { authApi } from '../api/auth';
import { setAuthToken } from '../api/client';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'employer';
  resumeLink?: string;
}

interface AuthState {
  user: User | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string,
    role: 'user' | 'employer',
    resumeLink?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  register: async (name, email, password, role, resumeLink) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await authApi.register({ name, email, password, role, resumeLink });
      setAuthToken(data.token);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await authApi.login({ email, password });
      setAuthToken(data.token);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    setAuthToken(null);
    set({ user: null, isAuthenticated: false });
  },
}));

// Initialize store from existing token (persist session across refresh)
const init = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    // ensure axios attaches the token
    setAuthToken(token);

    const { data } = await authApi.getMe();
    useAuthStore.setState({ user: data.user, isAuthenticated: true });
  } catch (error) {
    // token invalid or request failed; clear token
    setAuthToken(null);
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
};

// Fire and forget initialization
void init();
