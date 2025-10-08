// composables/useProveedor.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useProveedor = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/proveedores`
  const token = useCookie('access_token')
  const proveedores = ref([])
  const proveedor = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Get: obtener proveedores
  const getAllProveedores = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de proveedores.'
      console.error('Error fetching proveedores:', fetchError.value)
    } else {
      proveedores.value = Array.isArray(data.value) ? data.value : []
      console.log('Fetched proveedores:', proveedores.value)
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GetById: obtener proveedor por id
  const getProveedorById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener el proveedor.'
      console.error('Error fetching proveedor:', fetchError.value)
    } else {
      proveedor.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // POST: Crear un nuevo proveedor
  const createProveedor = async (proveedorData) => {
    loading.value = true
    error.value = null
    const { data: newProveedor, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proveedorData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear el proveedor.'
      console.error('Error creating proveedor:', fetchError.value)
      loading.value = false
      return null
    } else {
      if (newProveedor.value) {
        proveedores.value.push(newProveedor.value)
      }
      loading.value = false
      return newProveedor.value
    }
  }

  // PATCH: Actualiza proveedor
  const updateProveedor = async (id, data) => {
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
      error.value = 'Error al actualizar el proveedor.'
      console.error('Error updating proveedor:', fetchError.value)
    } else {
      if (proveedor.value && proveedor.value.id === id && updated.value) {
        proveedor.value = updated.value
      }

      const index = proveedores.value.findIndex(p => p.id === id)
      if (index !== -1 && updated.value) {
        proveedores.value[index] = updated.value
      }
    }
    loading.value = false
    return { data: updated.value, error: fetchError.value }
  }

  // DELETE: Eliminar proveedor
  const deleteProveedor = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (fetchError.value) {
      error.value = 'Error al eliminar el proveedor.'
      console.error('Error deleting proveedor:', fetchError.value)
    } else {
      proveedores.value = proveedores.value.filter(p => p.id !== id)
      if (proveedor.value && proveedor.value.id === id) {
        proveedor.value = null
      }
    }
    loading.value = false
    return { error: fetchError }
  }

  return {
    proveedores,
    proveedor,
    loading,
    error,
    getAllProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deleteProveedor,
  }
}