// composables/useReproduccion.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useReproduccion = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/reproducciones`
  const token = useCookie('access_token')
  const reproducciones = ref([])
  const reproduccion = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // GET: obtener todas las reproducciones
  const getAllReproducciones = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de reproducciones.'
      console.error('Error fetching reproducciones:', fetchError.value)
    } else {
      reproducciones.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener reproducción por id
  const getReproduccionById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la reproducción.'
      console.error('Error fetching reproduccion:', fetchError.value)
    } else {
      reproduccion.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener reproducciones por madre
  const getReproduccionesPorMadre = async (madreId) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/por-madre/${madreId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener las reproducciones de la madre.'
      console.error('Error fetching reproducciones por madre:', fetchError.value)
    } else {
      reproducciones.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // POST: crear nueva reproducción
  const createReproduccion = async (reproduccionData) => {
    loading.value = true
    error.value = null
    const { data: newReproduccion, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reproduccionData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear la reproducción.'
      console.error('Error creating reproduccion:', fetchError.value)
      loading.value = false
      const errorObj = new Error(fetchError.value.data?.message || fetchError.value.message || 'Error desconocido')
      errorObj.statusCode = fetchError.value.statusCode
      errorObj.data = fetchError.value.data
      throw errorObj
    } else {
      if (newReproduccion.value) {
        reproducciones.value.push(newReproduccion.value)
      }
      loading.value = false
      return newReproduccion.value
    }
  }

  // PATCH: actualizar reproducción
  const updateReproduccion = async (id, data) => {
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
      error.value = 'Error al actualizar la reproducción.'
      console.error('Error updating reproduccion:', fetchError.value)
    } else {
      if (reproduccion.value && reproduccion.value.id === id && updated.value) {
        reproduccion.value = updated.value
      }

      const index = reproducciones.value.findIndex(r => r.id === id)
      if (index !== -1 && updated.value) {
        reproducciones.value[index] = updated.value
      }
    }
    loading.value = false
    return { data: updated.value, error: fetchError.value }
  }

  // DELETE: eliminar reproducción
  const deleteReproduccion = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (fetchError.value) {
      error.value = 'Error al eliminar la reproducción.'
      console.error('Error deleting reproduccion:', fetchError.value)
    } else {
      reproducciones.value = reproducciones.value.filter(r => r.id !== id)
      if (reproduccion.value && reproduccion.value.id === id) {
        reproduccion.value = null
      }
    }
    loading.value = false
    return { error: fetchError }
  }

  return {
    reproducciones,
    reproduccion,
    loading,
    error,
    getAllReproducciones,
    getReproduccionById,
    getReproduccionesPorMadre,
    createReproduccion,
    updateReproduccion,
    deleteReproduccion,
  }
}