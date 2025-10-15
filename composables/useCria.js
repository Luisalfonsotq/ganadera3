// composables/useCria.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useCria = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/crias`
  const token = useCookie('access_token')
  const crias = ref([])
  const cria = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // GET: obtener todas las crías
  const getAllCrias = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de crías.'
      console.error('Error fetching crias:', fetchError.value)
    } else {
      crias.value = Array.isArray(data.value) ? data.value : []
      console.log('Fetched crias:', crias.value)
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener cría por id
  const getCriaById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la cría.'
      console.error('Error fetching cria:', fetchError.value)
    } else {
      cria.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener crías por madre
  const getCriasByMadre = async (madreId) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/por-madre/${madreId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener las crías de la madre.'
      console.error('Error fetching crias by madre:', fetchError.value)
    } else {
      crias.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener crías por padre
  const getCriasByPadre = async (padreId) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/por-padre/${padreId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener las crías del padre.'
      console.error('Error fetching crias by padre:', fetchError.value)
    } else {
      crias.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // POST: crear nueva cría
  const createCria = async (criaData) => {
    loading.value = true
    error.value = null
    const { data: newCria, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(criaData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear la cría.'
      console.error('Error creating cria:', fetchError.value)
      loading.value = false
      const errorObj = new Error(fetchError.value.data?.message || fetchError.value.message || 'Error desconocido')
      errorObj.statusCode = fetchError.value.statusCode
      errorObj.data = fetchError.value.data
      throw errorObj
    } else {
      if (newCria.value) {
        crias.value.push(newCria.value)
      }
      loading.value = false
      return newCria.value
    }
  }

  // PATCH: actualizar cría
  const updateCria = async (id, data) => {
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
      error.value = 'Error al actualizar la cría.'
      console.error('Error updating cria:', fetchError.value)
    } else {
      if (cria.value && cria.value.id === id && updated.value) {
        cria.value = updated.value
      }

      const index = crias.value.findIndex(c => c.id === id)
      if (index !== -1 && updated.value) {
        crias.value[index] = updated.value
      }
    }
    loading.value = false
    return { data: updated.value, error: fetchError.value }
  }

  // DELETE: eliminar cría
  const deleteCria = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (fetchError.value) {
      error.value = 'Error al eliminar la cría.'
      console.error('Error deleting cria:', fetchError.value)
    } else {
      crias.value = crias.value.filter(c => c.id !== id)
      if (cria.value && cria.value.id === id) {
        cria.value = null
      }
    }
    loading.value = false
    return { error: fetchError }
  }

  return {
    crias,
    cria,
    loading,
    error,
    getAllCrias,
    getCriaById,
    getCriasByMadre,
    getCriasByPadre,
    createCria,
    updateCria,
    deleteCria,
  }
}