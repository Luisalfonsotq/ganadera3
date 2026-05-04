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
  id: number;
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

export const useAuth = () => {
  const runtimeConfig = useRuntimeConfig();
  const user = useState<AuthUser | null>('user', () => null); // ✅ Inicializado en null

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

    // ✅ No establecer user aquí porque el registro ahora crea usuarios PENDING
    // El login posterior establecerá el user
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

    // ✅ Obtener perfil completo después del login
    await profile();
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

  const profile = async () => {
    try {
      const profileData = await fetchWithCredentials<AuthUser>(`${runtimeConfig.public.apiBaseUrl}/auth/profile`);

      // ✅ Validar que el objeto tenga la estructura correcta
      if (profileData && profileData.id && profileData.rol) {
        user.value = profileData;
        console.log('✅ Profile loaded:', profileData);
      } else {
        console.error('❌ Invalid profile structure:', profileData);
        user.value = null;
      }

      return profileData;
    } catch (error) {
      console.error('❌ Error al buscar el perfil:', error);
      user.value = null;
      throw error;
    }
  };

  return {
    user,
    register,
    login,
    logout,
    profile
  };
};