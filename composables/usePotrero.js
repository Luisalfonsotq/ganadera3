// composables/usePotrero.js
import { ref } from 'vue'

export const usePotrero = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/potreros`

  const potreros = ref([])
  const potrero = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ──────────────── HELPERS ────────────────
  const buildHeaders = () => ({ 'Content-Type': 'application/json' })

  // ──────────────── GET: potreros de una finca ────────────────
  const getPotrerosOfFinca = async (fincaId) => {
    const url = fincaId ? `${baseUrl}/by-finca/${fincaId}` : baseUrl
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(url, { credentials: 'include' })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de potreros.'
      console.error('Error fetching potreros:', fetchError.value)
    } else {
      potreros.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // ──────────────── GET: potreros con detalle (para rotación) ────────────────
  const getPotrerosConDetalle = async (fincaId) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(
      `${baseUrl}/by-finca/${fincaId}/detalle`,
      { credentials: 'include' },
    )
    if (fetchError.value) {
      error.value = 'No se pudo obtener el detalle de potreros.'
      console.error('Error:', fetchError.value)
    } else {
      potreros.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // ──────────────── GET: potrero por id ────────────────
  const getPotreroById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      credentials: 'include',
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener el potrero.'
      console.error('Error fetching potrero:', fetchError.value)
    } else {
      potrero.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // ──────────────── POST: crear potrero ────────────────
  const createPotrero = async (potreroData) => {
    loading.value = true
    error.value = null
    const { data: newPotrero, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify(potreroData),
    })
    if (fetchError.value) {
      error.value = 'Error al crear el potrero.'
      console.error('Error creating potrero:', fetchError.value)
      loading.value = false
      return null
    }
    if (newPotrero.value) potreros.value.push(newPotrero.value)
    loading.value = false
    return newPotrero.value
  }

  // ──────────────── PATCH: actualizar potrero ────────────────
  const updatePotrero = async (id, data) => {
    loading.value = true
    error.value = null
    const { data: updated, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    })
    if (fetchError.value) {
      error.value = 'Error al actualizar el potrero.'
      console.error('Error updating potrero:', fetchError.value)
    } else {
      if (potrero.value?.id === id && updated.value) potrero.value = updated.value
      const index = potreros.value.findIndex((p) => p.id === id)
      if (index !== -1 && updated.value) potreros.value[index] = updated.value
    }
    loading.value = false
    return { data: updated?.value, error: fetchError?.value }
  }

  // ──────────────── PATCH: actualizar estado del pasto ────────────────
  const actualizarEstadoPasto = async (id, estado_pasto) => {
    loading.value = true
    error.value = null
    const { data: updated, error: fetchError } = await useFetch(
      `${baseUrl}/${id}/estado-pasto`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: buildHeaders(),
        body: JSON.stringify({ estado_pasto }),
      },
    )
    loading.value = false
    if (fetchError.value) {
      error.value = fetchError.value?.data?.message || 'Error al actualizar el estado del pasto.'
      return { data: null, error: fetchError.value }
    }
    // Actualizar en la lista local
    const index = potreros.value.findIndex((p) => p.id === id)
    if (index !== -1 && updated.value) potreros.value[index] = updated.value
    return { data: updated.value, error: null }
  }

  // ──────────────── POST: ejecutar rotación ────────────────
  const ejecutarRotacion = async ({ potrero_origen_id, potrero_destino_id, motivo }) => {
    loading.value = true
    error.value = null
    const { data: resultado, error: fetchError } = await useFetch(`${baseUrl}/rotacion`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({ potrero_origen_id, potrero_destino_id, motivo }),
    })
    loading.value = false
    if (fetchError.value) {
      const msg =
        fetchError.value?.data?.message ||
        fetchError.value?.message ||
        'Error al ejecutar la rotación.'
      error.value = msg
      return { data: null, error: msg }
    }
    return { data: resultado.value, error: null }
  }

  // ──────────────── DELETE: eliminar potrero ────────────────
  const deletePotrero = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (fetchError.value) {
      error.value = 'Error al eliminar el potrero.'
      console.error('Error deleting potrero:', fetchError.value)
    } else {
      potreros.value = potreros.value.filter((p) => p.id !== id)
      if (potrero.value?.id === id) potrero.value = null
    }
    loading.value = false
    return { error: fetchError }
  }

  return {
    potreros,
    potrero,
    loading,
    error,
    getPotrerosOfFinca,
    getPotrerosConDetalle,
    getPotreroById,
    createPotrero,
    updatePotrero,
    actualizarEstadoPasto,
    ejecutarRotacion,
    deletePotrero,
  }
}