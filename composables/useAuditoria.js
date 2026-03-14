import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

export const useAuditoria = () => {
  const { user } = useAuth()
  const config = useRuntimeConfig()
  
  const isLoading = ref(true)
  const logs = ref([])
  const total = ref(0)
  const totalPages = ref(1)
  const error = ref(null)

  const fetchLogs = async (fincaId, params = {}) => {
    // Si no hay usuario o finca, detenemos la carga y salimos
    if (!user.value || !fincaId) {
      isLoading.value = false
      error.value = 'No hay finca activa seleccionada'
      return
    }

    try {
      isLoading.value = true
      error.value = null
      
      const query = new URLSearchParams()
      if (params.page) query.append('page', params.page)
      if (params.limit) query.append('limit', params.limit)
      if (params.entidad) query.append('entidad', params.entidad)
      if (params.accion) query.append('accion', params.accion)

      const response = await $fetch(`${config.public.apiBaseUrl}/auditoria/finca/${fincaId}?${query.toString()}`, {
        credentials: 'include'
      })

      logs.value = response.data || []
      total.value = response.total || 0
      totalPages.value = response.totalPages || 1
    } catch (err) {
      console.error('Error cargando auditoría:', err)
      error.value = err.message || 'Error desconocido'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    logs,
    total,
    totalPages,
    error,
    fetchLogs
  }
}
