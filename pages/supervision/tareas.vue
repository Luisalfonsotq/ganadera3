<!-- pages/supervision/tareas.vue -->
<template>
  <div class="max-w-7xl mx-auto space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center">
          <Icon name="i-heroicons-clipboard-document-check" class="w-7 h-7 mr-2 text-blue-600" />
          Panel de Tareas
        </h1>
        <p class="text-sm text-gray-500 mt-1">Gestiona, asigna y verifica las tareas del equipo</p>
      </div>
      <div class="flex items-center space-x-3">
        <!-- Selector de finca -->
        <select
          v-model="fincaSeleccionada"
          @change="cargarDatos"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las fincas</option>
          <option v-for="f in fincas" :key="f.id" :value="f.id">{{ f.nombre }}</option>
        </select>
        <NuxtLink
          to="/tareas/crear"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Icon name="i-heroicons-plus" class="w-4 h-4" />
          <span>Nueva Tarea</span>
        </NuxtLink>
      </div>
    </div>

    <!-- KPIs -->
    <div v-if="estadisticas" class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        v-for="kpi in kpis"
        :key="kpi.key"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center space-x-3"
      >
        <div :class="`p-2.5 rounded-lg ${kpi.bg}`">
          <Icon :name="kpi.icon" :class="`w-5 h-5 ${kpi.color}`" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ estadisticas[kpi.key] ?? '—' }}</p>
          <p class="text-xs text-gray-500 leading-tight">{{ kpi.label }}</p>
        </div>
      </div>

      <!-- Progreso general -->
      <div class="col-span-2 lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Progreso general</span>
          <span class="text-sm font-bold text-blue-600">{{ estadisticas.porcentaje_completado }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700"
            :style="{ width: `${estadisticas.porcentaje_completado}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
      <div class="relative flex-1 min-w-48">
        <Icon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar tarea..."
          class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Filtro de estado -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filtro in filtrosEstado"
          :key="filtro.value"
          @click="estadoFiltro = filtro.value"
          :class="[
            'px-3 py-1.5 rounded-full text-xs font-medium border transition',
            estadoFiltro === filtro.value
              ? `${filtro.activeBg} ${filtro.activeText} border-current`
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
          ]"
        >
          {{ filtro.label }}
          <span v-if="filtro.value !== 'todos'" class="ml-1 opacity-60">({{ contarPorEstado(filtro.value) }})</span>
        </button>
      </div>
    </div>

    <!-- Lista de tareas -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
    </div>

    <div v-else-if="tareasFiltradas.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
      <Icon name="i-heroicons-clipboard-document-list" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500 font-medium">No hay tareas con ese criterio</p>
      <NuxtLink to="/tareas/crear" class="text-blue-600 text-sm mt-1 inline-block hover:underline">
        + Crear la primera tarea
      </NuxtLink>
    </div>

    <div v-else class="space-y-3">
      <TransitionGroup name="list">
        <div
          v-for="t in tareasFiltradas"
          :key="t.id"
          class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
        >
          <div :class="`border-l-4 ${getBorderClass(t.estado)} p-5`">
            <div class="flex flex-col sm:flex-row sm:items-start gap-3">
              <!-- Info principal -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center flex-wrap gap-2 mb-1.5">
                  <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getEstadoClass(t.estado)}`">
                    {{ getEstadoLabel(t.estado) }}
                  </span>
                  <span :class="`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPrioridadClass(t.prioridad)}`">
                    {{ prioridadLabel(t.prioridad) }}
                  </span>
                  <span class="inline-flex items-center text-xs text-gray-500">
                    <Icon :name="getCategoriaIcon(t.categoria)" class="w-3.5 h-3.5 mr-1" />
                    {{ categoriaLabel(t.categoria) }}
                  </span>
                </div>

                <h3 class="text-base font-semibold text-gray-900 truncate">{{ t.titulo }}</h3>
                <p v-if="t.descripcion" class="text-sm text-gray-500 mt-0.5 line-clamp-1">{{ t.descripcion }}</p>

                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                  <span v-if="t.asignado_a" class="flex items-center">
                    <Icon name="i-heroicons-user" class="w-3.5 h-3.5 mr-1" />
                    {{ t.asignado_a.nombre }}
                  </span>
                  <span v-else class="text-amber-600 flex items-center">
                    <Icon name="i-heroicons-user-minus" class="w-3.5 h-3.5 mr-1" />
                    Sin asignar
                  </span>
                  <span v-if="t.finca" class="flex items-center">
                    <Icon name="i-heroicons-building-office" class="w-3.5 h-3.5 mr-1" />
                    {{ t.finca.nombre }}
                  </span>
                  <span v-if="t.potrero" class="flex items-center">
                    <Icon name="i-heroicons-map-pin" class="w-3.5 h-3.5 mr-1" />
                    {{ t.potrero.nombre }}
                  </span>
                  <span v-if="t.fecha_limite" :class="['flex items-center', estaVencida(t) ? 'text-red-600 font-semibold' : '']">
                    <Icon name="i-heroicons-calendar" class="w-3.5 h-3.5 mr-1" />
                    Límite: {{ formatDate(t.fecha_limite) }}
                  </span>
                </div>

                <!-- Reporte de problema -->
                <div v-if="t.reporte_descripcion" class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p class="text-xs font-semibold text-amber-700 flex items-center mb-1">
                    <Icon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5 mr-1" />
                    Reporte de problema
                  </p>
                  <p class="text-xs text-amber-800">{{ t.reporte_descripcion }}</p>
                  <a v-if="t.reporte_foto_url" :href="t.reporte_foto_url" target="_blank" class="text-xs text-blue-600 hover:underline mt-1 flex items-center">
                    <Icon name="i-heroicons-photo" class="w-3 h-3 mr-1" />
                    Ver foto adjunta
                  </a>
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex flex-col sm:items-end gap-2 shrink-0">
                <!-- Dropdown de cambio de estado -->
                <div class="relative" v-if="t.estado !== 'completada' && t.estado !== 'cancelada'">
                  <select
                    :value="t.estado"
                    @change="(e) => handleCambioEstado(t.id, e.target.value)"
                    class="pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_curso">En curso</option>
                    <option value="completada">✅ Marcar Completada</option>
                    <option value="vencida">Vencida</option>
                    <option value="cancelada">Cancelar</option>
                  </select>
                </div>

                <div class="flex items-center gap-2">
                  <!-- Marcar completada rápido (si no está completada) -->
                  <button
                    v-if="t.estado !== 'completada' && t.estado !== 'cancelada'"
                    @click="marcarCompletada(t.id)"
                    :disabled="accionLoading === t.id"
                    class="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-60"
                    title="Verificar y marcar completada"
                  >
                    <Icon v-if="accionLoading === t.id" name="i-heroicons-arrow-path" class="w-3.5 h-3.5 animate-spin" />
                    <Icon v-else name="i-heroicons-check" class="w-3.5 h-3.5" />
                    <span>Verificar</span>
                  </button>

                  <span v-else-if="t.estado === 'completada'" class="flex items-center text-xs text-green-700 font-medium">
                    <Icon name="i-heroicons-check-badge" class="w-4 h-4 mr-1" />
                    Verificada
                  </span>

                  <!-- Editar -->
                  <NuxtLink
                    :to="`/tareas/editar/${t.id}`"
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Editar tarea"
                  >
                    <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
                  </NuxtLink>

                  <!-- Eliminar (solo Admin) -->
                  <button
                    v-if="user?.rol === 'Administrador'"
                    @click="confirmarEliminar(t)"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar tarea"
                  >
                    <Icon name="i-heroicons-trash" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <Transition name="fade">
      <div
        v-if="tareaAEliminar"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="tareaAEliminar = null"
      >
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="bg-red-100 p-2.5 rounded-full">
              <Icon name="i-heroicons-trash" class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-lg font-bold text-gray-900">Eliminar tarea</h3>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            ¿Confirmas que deseas eliminar la tarea
            <strong>"{{ tareaAEliminar?.titulo }}"</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div class="flex space-x-3">
            <button @click="tareaAEliminar = null" class="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button @click="ejecutarEliminar" :disabled="loading" class="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-60">
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="slide-up">
      <div
        v-if="toast.show"
        :class="`fixed bottom-6 right-6 z-50 ${toast.color} text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2`"
      >
        <Icon :name="toast.icon" class="w-5 h-5" />
        <span class="text-sm font-medium">{{ toast.msg }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTarea } from '@/composables/useTarea'

definePageMeta({ layout: 'profile-layout' })

const { user } = useAuth()
const {
  tareas, estadisticas, loading,
  getTareasPorFinca, getEstadisticasFinca, cambiarEstado, deleteTarea,
  getEstadoClass, getEstadoBorderClass, getPrioridadClass, getCategoriaIcon, getEstadoLabel,
} = useTarea()

const { public: { apiBaseUrl } } = useRuntimeConfig()
const token = useCookie('access_token')

// ─── Estado ───────────────────────────────────────────────────────────────────
const fincas = ref([])
const fincaSeleccionada = ref('')
const busqueda = ref('')
const estadoFiltro = ref('todos')
const accionLoading = ref(null)
const tareaAEliminar = ref(null)
const toast = ref({ show: false, msg: '', color: 'bg-green-600', icon: 'i-heroicons-check-circle' })

const getBorderClass = (estado) => getEstadoBorderClass(estado)

// ─── KPIs de estadísticas ─────────────────────────────────────────────────────
const kpis = [
  { key: 'total', label: 'Total', icon: 'i-heroicons-clipboard-document-list', bg: 'bg-gray-100', color: 'text-gray-600' },
  { key: 'pendientes', label: 'Pendientes', icon: 'i-heroicons-clock', bg: 'bg-yellow-50', color: 'text-yellow-600' },
  { key: 'en_curso', label: 'En Curso', icon: 'i-heroicons-arrow-path', bg: 'bg-blue-50', color: 'text-blue-600' },
  { key: 'completadas', label: 'Completadas', icon: 'i-heroicons-check-circle', bg: 'bg-green-50', color: 'text-green-600' },
  { key: 'vencidas', label: 'Vencidas', icon: 'i-heroicons-exclamation-circle', bg: 'bg-red-50', color: 'text-red-600' },
]

const filtrosEstado = [
  { value: 'todos', label: 'Todas', activeBg: 'bg-gray-800', activeText: 'text-white' },
  { value: 'pendiente', label: 'Pendientes', activeBg: 'bg-yellow-100', activeText: 'text-yellow-800' },
  { value: 'en_curso', label: 'En Curso', activeBg: 'bg-blue-100', activeText: 'text-blue-800' },
  { value: 'completada', label: 'Completadas', activeBg: 'bg-green-100', activeText: 'text-green-800' },
  { value: 'vencida', label: 'Vencidas', activeBg: 'bg-red-100', activeText: 'text-red-800' },
]

// ─── Computed ─────────────────────────────────────────────────────────────────
const tareasFiltradas = computed(() => {
  return tareas.value.filter(t => {
    const matchEstado = estadoFiltro.value === 'todos' || t.estado === estadoFiltro.value
    const term = busqueda.value.toLowerCase()
    const matchBusqueda = !term ||
      t.titulo.toLowerCase().includes(term) ||
      t.descripcion?.toLowerCase().includes(term) ||
      t.asignado_a?.nombre?.toLowerCase().includes(term)
    return matchEstado && matchBusqueda
  })
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
const contarPorEstado = (estado) => tareas.value.filter(t => t.estado === estado).length
const formatDate = (date) => date ? new Date(date + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : ''
const estaVencida = (t) => t.fecha_limite && new Date(t.fecha_limite) < new Date() && t.estado !== 'completada'
const prioridadLabel = (p) => ({ baja: 'Baja', media: 'Media', alta: 'Alta', urgente: '🔴 Urgente' })[p] || p
const categoriaLabel = (c) => ({ alimentacion: 'Alimentación', limpieza: 'Limpieza', movimiento_ganado: 'Movimiento', mantenimiento: 'Mantenimiento', sanidad: 'Sanidad', revision: 'Revisión', otro: 'Otro' })[c] || c

const showToast = (msg, ok = true) => {
  toast.value = {
    show: true,
    msg,
    color: ok ? 'bg-green-600' : 'bg-red-600',
    icon: ok ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-circle',
  }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ─── Carga de datos ───────────────────────────────────────────────────────────
const cargarDatos = async () => {
  if (!fincaSeleccionada.value && fincas.value.length > 0) {
    fincaSeleccionada.value = fincas.value[0].id
  }
  if (fincaSeleccionada.value) {
    await Promise.all([
      getTareasPorFinca(fincaSeleccionada.value),
      getEstadisticasFinca(fincaSeleccionada.value),
    ])
  }
}

onMounted(async () => {
  try {
    if (user.value?.rol === 'Administrador') {
      fincas.value = await $fetch(`${apiBaseUrl}/fincas?propietario_id=${user.value.id}`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token.value}` },
      })
    } else {
      fincas.value = await $fetch(`${apiBaseUrl}/fincas/by-user/${user.value.id}`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token.value}` },
      })
    }
    if (fincas.value.length > 0) {
      fincaSeleccionada.value = fincas.value[0].id
    }
  } catch (e) {
    console.error('Error cargando fincas:', e)
  }
  await cargarDatos()
})

// ─── Acciones ─────────────────────────────────────────────────────────────────
const marcarCompletada = async (id) => {
  accionLoading.value = id
  try {
    await cambiarEstado(id, 'completada')
    await getEstadisticasFinca(fincaSeleccionada.value)
    showToast('Tarea marcada como completada ✅')
  } catch (e) {
    showToast('Error al actualizar la tarea', false)
  } finally {
    accionLoading.value = null
  }
}

const handleCambioEstado = async (id, nuevoEstado) => {
  accionLoading.value = id
  try {
    await cambiarEstado(id, nuevoEstado)
    await getEstadisticasFinca(fincaSeleccionada.value)
    showToast('Estado actualizado')
  } catch (e) {
    showToast('Error al cambiar estado', false)
  } finally {
    accionLoading.value = null
  }
}

const confirmarEliminar = (tarea) => { tareaAEliminar.value = tarea }

const ejecutarEliminar = async () => {
  if (!tareaAEliminar.value) return
  try {
    await deleteTarea(tareaAEliminar.value.id)
    await getEstadisticasFinca(fincaSeleccionada.value)
    showToast('Tarea eliminada')
  } catch (e) {
    showToast('Error al eliminar', false)
  } finally {
    tareaAEliminar.value = null
  }
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-10px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
</style>
