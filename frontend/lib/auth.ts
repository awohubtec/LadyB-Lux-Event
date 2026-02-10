export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'CUSTOMER' | 'VENDOR';
}

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setAuthData = (user: AuthUser, token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
};

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};
