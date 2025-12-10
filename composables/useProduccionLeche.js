import { ref } from 'vue'
import { useFetch, useRuntimeConfig } from '#app'

export const useProduccionLeche = () => {
    const { public: { apiBaseUrl } } = useRuntimeConfig()
    const baseUrl = `${apiBaseUrl}/produccion-leche`
    const producciones = ref([])
    const produccion = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const getProducciones = async (filters = {}) => {
        loading.value = true
        error.value = null

        // Construct query string from filters
        const queryParams = new URLSearchParams()
        if (filters.finca_id) queryParams.append('finca_id', filters.finca_id)
        if (filters.animal_id) queryParams.append('animal_id', filters.animal_id)
        if (filters.fecha_inicio) queryParams.append('fecha_inicio', filters.fecha_inicio)
        if (filters.fecha_fin) queryParams.append('fecha_fin', filters.fecha_fin)

        const url = `${baseUrl}?${queryParams.toString()}`

        const { data, error: fetchError } = await useFetch(url, {
            credentials: 'include'
        })

        if (fetchError.value) {
            error.value = 'Error al obtener registros de producción.'
            console.error('Error fetching producciones:', fetchError.value)
        } else {
            producciones.value = data.value || []
        }
        loading.value = false
        return { data, error: fetchError }
    }

    const getProduccionById = async (id) => {
        loading.value = true
        error.value = null
        const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
            credentials: 'include'
        })

        if (fetchError.value) {
            error.value = 'Error al obtener el registro.'
            console.error('Error fetching produccion:', fetchError.value)
        } else {
            produccion.value = data.value
        }
        loading.value = false
        return { data, error: fetchError }
    }

    const createProduccion = async (produccionData) => {
        loading.value = true
        error.value = null
        const { data, error: fetchError } = await useFetch(baseUrl, {
            method: 'POST',
            body: JSON.stringify(produccionData),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (fetchError.value) {
            error.value = 'Error al crear registro de producción.'
            console.error('Error creating produccion:', fetchError.value)
        } else {
            if (data.value) {
                producciones.value.unshift(data.value)
            }
        }
        loading.value = false
        return { data, error: fetchError }
    }

    const updateProduccion = async (id, produccionData) => {
        loading.value = true
        error.value = null
        const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(produccionData),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (fetchError.value) {
            error.value = 'Error al actualizar registro.'
            console.error('Error updating produccion:', fetchError.value)
        } else {
            // Update local state
            const index = producciones.value.findIndex(p => p.id === id)
            if (index !== -1 && data.value) {
                producciones.value[index] = data.value
            }
            if (produccion.value && produccion.value.id === id) {
                produccion.value = data.value
            }
        }
        loading.value = false
        return { data, error: fetchError }
    }

    const deleteProduccion = async (id) => {
        loading.value = true
        error.value = null
        const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (fetchError.value) {
            error.value = 'Error al eliminar registro.'
            console.error('Error deleting produccion:', fetchError.value)
        } else {
            producciones.value = producciones.value.filter(p => p.id !== id)
        }
        loading.value = false
        return { error: fetchError }
    }

    const getResumenDiario = async (fincaId, fecha) => {
        const { data, error: fetchError } = await useFetch(`${baseUrl}/resumen/diario`, {
            params: { finca_id: fincaId, fecha },
            credentials: 'include'
        })
        return { data, error: fetchError }
    }

    return {
        producciones,
        produccion,
        loading,
        error,
        getProducciones,
        getProduccionById,
        createProduccion,
        updateProduccion,
        deleteProduccion,
        getResumenDiario
    }
}
