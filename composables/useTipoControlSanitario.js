// composables/useTipoControlSanitario.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useTipoControlSanitario = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/tipos-control-sanitario`
  const token = useCookie('access_token')
  const tiposControlSanitario = ref([])
  const tipoControlSanitario = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // GET: obtener todos los tipos de control sanitario
  const getAllTiposControlSanitario = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de tipos de control sanitario.'
      console.error('Error fetching tipos control sanitario:', fetchError.value)
    } else {
      tiposControlSanitario.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener tipo de control sanitario por id
  const getTipoControlSanitarioById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener el tipo de control sanitario.'
      console.error('Error fetching tipo control sanitario:', fetchError.value)
    } else {
      tipoControlSanitario.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // POST: crear nuevo tipo de control sanitario
  const createTipoControlSanitario = async (tipoControlSanitarioData) => {
    loading.value = true
    error.value = null
    const { data: newTipoControlSanitario, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tipoControlSanitarioData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear el tipo de control sanitario.'
      console.error('Error creating tipo control sanitario:', fetchError.value)
      loading.value = false
      const errorObj = new Error(fetchError.value.data?.message || fetchError.value.message || 'Error desconocido')
      errorObj.statusCode = fetchError.value.statusCode
      errorObj.data = fetchError.value.data
      throw errorObj
    } else {
      if (newTipoControlSanitario.value) {
        tiposControlSanitario.value.push(newTipoControlSanitario.value)
      }
      loading.value = false
      return newTipoControlSanitario.value
    }
  }

  // PATCH: actualizar tipo de control sanitario
  const updateTipoControlSanitario = async (id, data) => {
    loading.value = true
    error.value = null
    const { data: updated, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (fetchError.value) {
      error.value = 'Error al actualizar el tipo de control sanitario.'
      console.error('Error updating tipo control sanitario:', fetchError.value)
    } else {
      if (tipoControlSanitario.value && tipoControlSanitario.value.id === id && updated.value) {
        tipoControlSanitario.value = updated.value
      }

      const index = tiposControlSanitario.value.findIndex(t => t.id === id)
      if (index !== -1 && updated.value) {
        tiposControlSanitario.value[index] = updated.value
      }
    }
    loading.value = false
    return { data: updated.value, error: fetchError.value }
  }

  // DELETE: eliminar tipo de control sanitario
  const deleteTipoControlSanitario = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (fetchError.value) {
      error.value = 'Error al eliminar el tipo de control sanitario.'
      console.error('Error deleting tipo control sanitario:', fetchError.value)
    } else {
      tiposControlSanitario.value = tiposControlSanitario.value.filter(t => t.id !== id)
      if (tipoControlSanitario.value && tipoControlSanitario.value.id === id) {
        tipoControlSanitario.value = null
      }
    }
    loading.value = false
    return { error: fetchError }
  }

  return {
    tiposControlSanitario,
    tipoControlSanitario,
    loading,
    error,
    getAllTiposControlSanitario,
    getTipoControlSanitarioById,
    createTipoControlSanitario,
    updateTipoControlSanitario,
    deleteTipoControlSanitario,
  }
}