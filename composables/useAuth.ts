
// composables/useAuth.ts
import { navigateTo } from '#app';
import { useState, useRuntimeConfig } from '#imports';

interface UserCredentials {
  nombre?: string;
  email: string;
  password?: string;
  rol?: string;
}

interface AuthUser {
  nombre: string;
  email: string;
  rol: string;
}

interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

interface LoginResponse {
  user: AuthUser;
}

interface ProfileResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export const useAuth = () => {
  const runtimeConfig = useRuntimeConfig();
  const user = useState<ProfileResponse | null>('user');

  const fetchWithCredentials = async <T>(url: string, options: any = {}): Promise<T> => {
    return $fetch<T>(url, {
      ...options,
      credentials: 'include',
    });
  };

  const register = async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await fetchWithCredentials<AuthResponse>(`${runtimeConfig.public.apiBaseUrl}/auth/register`, {
      method: 'POST',
      body: credentials,
    });

    if (!response) {
      throw new Error('Error en el servidor');
    }
    // id se obtendrá después de profile
    user.value = null; // Temporal hasta profile
    return response;
  };

  const login = async (credentials: UserCredentials): Promise<AuthUser> => {
    const response = await fetchWithCredentials<LoginResponse>(`${runtimeConfig.public.apiBaseUrl}/auth/login`, {
      method: 'POST',
      body: credentials,
    });

    if (!response || !response.user) {
      throw new Error('Error en el servidor o usuario no retornado');
    }
    // Obtener el perfil después del login para incluir id
    const profile = await fetchWithCredentials<ProfileResponse>(`${runtimeConfig.public.apiBaseUrl}/auth/profile`);
    user.value = profile;
    return response.user;
  };

  const logout = async () => {
    try {
      await fetchWithCredentials(`${runtimeConfig.public.apiBaseUrl}/auth/logout`, {
        method: 'POST',
      });
      user.value = null;
      await navigateTo('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      user.value = null;
      await navigateTo('/login');
    }
  };

  return {
    user,
    register,
    login,
    logout
  };
};