// composables/useTipoEventoAnimal.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useTipoEventoAnimal = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/tipos-evento-animal`
  const token = useCookie('access_token')
  const tiposEvento = ref([])
  const tipoEvento = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // GET: obtener todos los tipos de evento
  const getAllTiposEvento = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de tipos de evento.'
      console.error('Error fetching tipos evento:', fetchError.value)
    } else {
      tiposEvento.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener tipo de evento por id
  const getTipoEventoById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener el tipo de evento.'
      console.error('Error fetching tipo evento:', fetchError.value)
    } else {
      tipoEvento.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // POST: crear nuevo tipo de evento
  const createTipoEvento = async (tipoEventoData) => {
    loading.value = true
    error.value = null
    const { data: newTipoEvento, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tipoEventoData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear el tipo de evento.'
      console.error('Error creating tipo evento:', fetchError.value)
      loading.value = false
      const errorObj = new Error(fetchError.value.data?.message || fetchError.value.message || 'Error desconocido')
      errorObj.statusCode = fetchError.value.statusCode
      errorObj.data = fetchError.value.data
      throw errorObj
    } else {
      if (newTipoEvento.value) {
        tiposEvento.value.push(newTipoEvento.value)
      }
      loading.value = false
      return newTipoEvento.value
    }
  }

  // PATCH: actualizar tipo de evento
  const updateTipoEvento = async (id, data) => {
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
      error.value = 'Error al actualizar el tipo de evento.'
      console.error('Error updating tipo evento:', fetchError.value)
    } else {
      if (tipoEvento.value && tipoEvento.value.id === id && updated.value) {
        tipoEvento.value = updated.value
      }

      const index = tiposEvento.value.findIndex(t => t.id === id)
      if (index !== -1 && updated.value) {
        tiposEvento.value[index] = updated.value
      }
    }
    loading.value = false
    return { data: updated.value, error: fetchError.value }
  }

  // DELETE: eliminar tipo de evento
  const deleteTipoEvento = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (fetchError.value) {
      error.value = 'Error al eliminar el tipo de evento.'
      console.error('Error deleting tipo evento:', fetchError.value)
    } else {
      tiposEvento.value = tiposEvento.value.filter(t => t.id !== id)
      if (tipoEvento.value && tipoEvento.value.id === id) {
        tipoEvento.value = null
      }
    }
    loading.value = false
    return { error: fetchError }
  }

  return {
    tiposEvento,
    tipoEvento,
    loading,
    error,
    getAllTiposEvento,
    getTipoEventoById,
    createTipoEvento,
    updateTipoEvento,
    deleteTipoEvento,
  }
}