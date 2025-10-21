// composables/useUsuario.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useUsuario = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/usuarios`
  const token = useCookie('access_token')
  const usuarios = ref([])
  const veterinarios = ref([])
  const loading = ref(false)
  const error = ref(null)

  // GET: obtener todos los usuarios
  const getAllUsuarios = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de usuarios.'
      console.error('Error fetching usuarios:', fetchError.value)
    } else {
      usuarios.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener solo veterinarios
  const getVeterinarios = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de veterinarios.'
      console.error('Error fetching veterinarios:', fetchError.value)
    } else {
      const allUsers = Array.isArray(data.value) ? data.value : []
      veterinarios.value = allUsers.filter(u => u.rol === 'Veterinario')
    }
    loading.value = false
    return { data: ref(veterinarios.value), error: fetchError }
  }

  return {
    usuarios,
    veterinarios,
    loading,
    error,
    getAllUsuarios,
    getVeterinarios,
  }
}