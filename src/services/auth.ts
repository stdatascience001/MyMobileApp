import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    
    const response = await api.post<AuthResponse>('/auth/login', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },
  register: async (name: string, email: string, password: string): Promise<User> => {
    const response = await api.post<User>('/auth/register', { name, email, password });
    return response.data;
  }
};
