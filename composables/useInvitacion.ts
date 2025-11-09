// composables/useInvitacion.ts
import { ref } from 'vue';
import { useRuntimeConfig } from '#imports';

interface CreateInvitacionDto {
  email: string;
  rol: string;
}

interface Invitacion {
  id: number;
  email: string;
  rol: string;
  token: string;
  estado: string;
  expira_en: string;
  finca: any;
  created_at: string;
}

export const useInvitacion = () => {
  const runtimeConfig = useRuntimeConfig();
  const invitaciones = ref<Invitacion[]>([]);
  const invitacion = ref<Invitacion | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchWithCredentials = async <T>(url: string, options: any = {}): Promise<T> => {
    return $fetch<T>(url, {
      ...options,
      credentials: 'include',
    });
  };

  // Crear invitación
  const createInvitacion = async (fincaId: number, data: CreateInvitacionDto) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await fetchWithCredentials<Invitacion>(
        `${runtimeConfig.public.apiBaseUrl}/invitaciones/finca/${fincaId}`,
        {
          method: 'POST',
          body: data,
        }
      );

      return { data: ref(response), error: ref(null) };
    } catch (err: any) {
      error.value = err.data?.message || 'Error al crear invitación';
      return { data: ref(null), error: ref(error.value) };
    } finally {
      loading.value = false;
    }
  };

  // Listar invitaciones de una finca
  const getInvitacionesByFinca = async (fincaId: number) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await fetchWithCredentials<Invitacion[]>(
        `${runtimeConfig.public.apiBaseUrl}/invitaciones/finca/${fincaId}`
      );

      invitaciones.value = response;
      return { data: ref(response), error: ref(null) };
    } catch (err: any) {
      error.value = err.data?.message || 'Error al cargar invitaciones';
      return { data: ref(null), error: ref(error.value) };
    } finally {
      loading.value = false;
    }
  };

  // Obtener invitación por token
  const getInvitacionByToken = async (token: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await fetchWithCredentials<Invitacion>(
        `${runtimeConfig.public.apiBaseUrl}/invitaciones/token/${token}`
      );

      invitacion.value = response;
      return { data: ref(response), error: ref(null) };
    } catch (err: any) {
      error.value = err.data?.message || 'Error al cargar invitación';
      return { data: ref(null), error: ref(error.value) };
    } finally {
      loading.value = false;
    }
  };

  // Aceptar invitación
  const aceptarInvitacion = async (token: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await fetchWithCredentials<{ mensaje: string, finca: any }>(
        `${runtimeConfig.public.apiBaseUrl}/invitaciones/aceptar/${token}`,
        { method: 'POST' }
      );

      return { data: ref(response), error: ref(null) };
    } catch (err: any) {
      error.value = err.data?.message || 'Error al aceptar invitación';
      return { data: ref(null), error: ref(error.value) };
    } finally {
      loading.value = false;
    }
  };

  // Rechazar invitación
  const rechazarInvitacion = async (token: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await fetchWithCredentials<{ mensaje: string }>(
        `${runtimeConfig.public.apiBaseUrl}/invitaciones/rechazar/${token}`,
        { method: 'POST' }
      );

      return { data: ref(response), error: ref(null) };
    } catch (err: any) {
      error.value = err.data?.message || 'Error al rechazar invitación';
      return { data: ref(null), error: ref(error.value) };
    } finally {
      loading.value = false;
    }
  };

  // Cancelar invitación
  const cancelarInvitacion = async (id: number, fincaId: number) => {
    try {
      loading.value = true;
      error.value = null;
      
      await fetchWithCredentials(
        `${runtimeConfig.public.apiBaseUrl}/invitaciones/${id}/finca/${fincaId}`,
        { method: 'DELETE' }
      );

      return { error: ref(null) };
    } catch (err: any) {
      error.value = err.data?.message || 'Error al cancelar invitación';
      return { error: ref(error.value) };
    } finally {
      loading.value = false;
    }
  };

  return {
    invitaciones,
    invitacion,
    loading,
    error,
    createInvitacion,
    getInvitacionesByFinca,
    getInvitacionByToken,
    aceptarInvitacion,
    rechazarInvitacion,
    cancelarInvitacion,
  };
};