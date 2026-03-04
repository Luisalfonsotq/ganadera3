// composables/useTarea.js
import { ref } from 'vue'
import { useCookie, useRuntimeConfig } from '#app'

export const useTarea = () => {
    const { public: { apiBaseUrl } } = useRuntimeConfig()
    const baseUrl = `${apiBaseUrl}/tareas`
    const token = useCookie('access_token')

    const tareas = ref([])
    const tarea = ref(null)
    const estadisticas = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Helper para peticiones autenticadas con $fetch
    const authFetch = (url, options = {}) => {
        return $fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${token.value}`,
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            credentials: 'include',
        })
    }

    // ─── LISTAR TODAS (Admin + Supervisor) ───────────────────────────────────────
    const getTareas = async (finca_id = null) => {
        loading.value = true
        error.value = null
        try {
            const url = finca_id ? `${baseUrl}?finca_id=${finca_id}` : baseUrl
            tareas.value = await authFetch(url)
        } catch (e) {
            error.value = 'Error al cargar las tareas.'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    // ─── TAREAS POR FINCA ─────────────────────────────────────────────────────────
    const getTareasPorFinca = async (finca_id) => {
        loading.value = true
        error.value = null
        try {
            tareas.value = await authFetch(`${baseUrl}/por-finca/${finca_id}`)
        } catch (e) {
            error.value = 'Error al cargar las tareas de la finca.'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    // ─── MIS TAREAS (Colaborador) ─────────────────────────────────────────────────
    const getMisTareas = async (colaborador_id) => {
        loading.value = true
        error.value = null
        try {
            tareas.value = await authFetch(`${baseUrl}/mis-tareas/${colaborador_id}`)
        } catch (e) {
            error.value = 'Error al cargar tus tareas.'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    // ─── MIS TAREAS PENDIENTES ────────────────────────────────────────────────────
    const getMisTareasPendientes = async (colaborador_id) => {
        loading.value = true
        error.value = null
        try {
            tareas.value = await authFetch(`${baseUrl}/mis-tareas/${colaborador_id}/pendientes`)
        } catch (e) {
            error.value = 'Error al cargar tus tareas pendientes.'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    // ─── ESTADÍSTICAS ─────────────────────────────────────────────────────────────
    const getEstadisticasFinca = async (finca_id) => {
        loading.value = true
        error.value = null
        try {
            estadisticas.value = await authFetch(`${baseUrl}/estadisticas/finca/${finca_id}`)
        } catch (e) {
            error.value = 'Error al cargar estadísticas.'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    // ─── TAREAS CON REPORTES ──────────────────────────────────────────────────────
    const getTareasConReporte = async (finca_id) => {
        loading.value = true
        error.value = null
        try {
            tareas.value = await authFetch(`${baseUrl}/con-reporte/finca/${finca_id}`)
        } catch (e) {
            error.value = 'Error al cargar reportes.'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    // ─── OBTENER POR ID ───────────────────────────────────────────────────────────
    const getTareaById = async (id) => {
        loading.value = true
        error.value = null
        try {
            tarea.value = await authFetch(`${baseUrl}/${id}`)
        } catch (e) {
            error.value = 'Error al cargar la tarea.'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    // ─── CREAR (Admin + Supervisor) ───────────────────────────────────────────────
    const createTarea = async (data) => {
        loading.value = true
        error.value = null
        try {
            const nueva = await authFetch(baseUrl, { method: 'POST', body: JSON.stringify(data) })
            tareas.value.unshift(nueva)
            return nueva
        } catch (e) {
            const msg = e?.data?.message || e?.message || 'Error al crear la tarea.'
            error.value = msg
            throw new Error(msg)
        } finally {
            loading.value = false
        }
    }

    // ─── ACTUALIZAR (Admin + Supervisor) ─────────────────────────────────────────
    const updateTarea = async (id, data) => {
        loading.value = true
        error.value = null
        try {
            const updated = await authFetch(`${baseUrl}/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
            const idx = tareas.value.findIndex(t => t.id === id)
            if (idx !== -1) tareas.value[idx] = updated
            if (tarea.value?.id === id) tarea.value = updated
            return updated
        } catch (e) {
            error.value = 'Error al actualizar la tarea.'
            throw e
        } finally {
            loading.value = false
        }
    }

    // ─── CAMBIAR ESTADO (Admin + Supervisor) ─────────────────────────────────────
    const cambiarEstado = async (id, estado, notas_supervisor = '') => {
        loading.value = true
        error.value = null
        try {
            const updated = await authFetch(`${baseUrl}/${id}/estado`, {
                method: 'PATCH',
                body: JSON.stringify({ estado, notas_supervisor }),
            })
            const idx = tareas.value.findIndex(t => t.id === id)
            if (idx !== -1) tareas.value[idx] = updated
            return updated
        } catch (e) {
            error.value = 'Error al cambiar estado de la tarea.'
            throw e
        } finally {
            loading.value = false
        }
    }

    // ─── INICIAR (Colaborador) ────────────────────────────────────────────────────
    const iniciarTarea = async (id) => {
        loading.value = true
        error.value = null
        try {
            const updated = await authFetch(`${baseUrl}/${id}/iniciar`, { method: 'PATCH', body: '{}' })
            const idx = tareas.value.findIndex(t => t.id === id)
            if (idx !== -1) tareas.value[idx] = updated
            return updated
        } catch (e) {
            const msg = e?.data?.message || 'Error al iniciar la tarea.'
            error.value = msg
            throw new Error(msg)
        } finally {
            loading.value = false
        }
    }

    // ─── COMPLETAR (Colaborador) ──────────────────────────────────────────────────
    const completarTarea = async (id) => {
        loading.value = true
        error.value = null
        try {
            const updated = await authFetch(`${baseUrl}/${id}/completar`, { method: 'PATCH', body: '{}' })
            const idx = tareas.value.findIndex(t => t.id === id)
            if (idx !== -1) tareas.value[idx] = updated
            return updated
        } catch (e) {
            const msg = e?.data?.message || 'Error al completar la tarea.'
            error.value = msg
            throw new Error(msg)
        } finally {
            loading.value = false
        }
    }

    // ─── REPORTAR PROBLEMA (Colaborador) ─────────────────────────────────────────
    const reportarProblema = async (id, reporte_foto_url, reporte_descripcion) => {
        loading.value = true
        error.value = null
        try {
            const updated = await authFetch(`${baseUrl}/${id}/reportar-problema`, {
                method: 'PATCH',
                body: JSON.stringify({ reporte_foto_url, reporte_descripcion }),
            })
            const idx = tareas.value.findIndex(t => t.id === id)
            if (idx !== -1) tareas.value[idx] = updated
            return updated
        } catch (e) {
            const msg = e?.data?.message || 'Error al reportar problema.'
            error.value = msg
            throw new Error(msg)
        } finally {
            loading.value = false
        }
    }

    // ─── ELIMINAR (Admin) ─────────────────────────────────────────────────────────
    const deleteTarea = async (id) => {
        loading.value = true
        error.value = null
        try {
            await authFetch(`${baseUrl}/${id}`, { method: 'DELETE' })
            tareas.value = tareas.value.filter(t => t.id !== id)
        } catch (e) {
            error.value = 'Error al eliminar la tarea.'
            throw e
        } finally {
            loading.value = false
        }
    }

    // ─── HELPERS DE UI ────────────────────────────────────────────────────────────
    const getEstadoClass = (estado) => {
        const map = {
            pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            en_curso: 'bg-blue-100 text-blue-800 border-blue-200',
            completada: 'bg-green-100 text-green-800 border-green-200',
            vencida: 'bg-red-100 text-red-800 border-red-200',
            cancelada: 'bg-gray-100 text-gray-600 border-gray-200',
        }
        return map[estado] || 'bg-gray-100 text-gray-600'
    }

    const getEstadoBorderClass = (estado) => {
        const map = {
            pendiente: 'border-l-yellow-400',
            en_curso: 'border-l-blue-500',
            completada: 'border-l-green-500',
            vencida: 'border-l-red-500',
            cancelada: 'border-l-gray-400',
        }
        return map[estado] || 'border-l-gray-400'
    }

    const getPrioridadClass = (prioridad) => {
        const map = {
            baja: 'bg-gray-100 text-gray-600',
            media: 'bg-blue-100 text-blue-700',
            alta: 'bg-orange-100 text-orange-700',
            urgente: 'bg-red-100 text-red-700',
        }
        return map[prioridad] || 'bg-gray-100 text-gray-600'
    }

    const getCategoriaIcon = (categoria) => {
        const map = {
            alimentacion: 'i-heroicons-beaker',
            limpieza: 'i-heroicons-sparkles',
            movimiento_ganado: 'i-heroicons-arrow-path',
            mantenimiento: 'i-heroicons-wrench-screwdriver',
            sanidad: 'i-heroicons-heart',
            revision: 'i-heroicons-eye',
            otro: 'i-heroicons-ellipsis-horizontal-circle',
        }
        return map[categoria] || 'i-heroicons-check-circle'
    }

    const getEstadoLabel = (estado) => {
        const map = {
            pendiente: 'Pendiente',
            en_curso: 'En curso',
            completada: 'Completada',
            vencida: 'Vencida',
            cancelada: 'Cancelada',
        }
        return map[estado] || estado
    }

    return {
        tareas, tarea, estadisticas, loading, error,
        getTareas, getTareasPorFinca, getMisTareas, getMisTareasPendientes,
        getEstadisticasFinca, getTareasConReporte, getTareaById,
        createTarea, updateTarea, cambiarEstado,
        iniciarTarea, completarTarea, reportarProblema, deleteTarea,
        getEstadoClass, getEstadoBorderClass, getPrioridadClass, getCategoriaIcon, getEstadoLabel,
    }
}
