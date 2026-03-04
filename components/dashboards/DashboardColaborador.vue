<!-- components/dashboards/DashboardColaborador.vue -->
<template>
  <div class="max-w-3xl mx-auto space-y-6">

    <!-- Header del Perfil Colaborador -->
    <div class="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
      <div class="flex items-center space-x-5">
        <div class="relative shrink-0">
          <img
            :src="userAvatar"
            alt="Avatar"
            class="w-16 h-16 rounded-full border-4 border-white/50 shadow-md"
            @error="handleAvatarError"
          />
          <span class="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-indigo-200 text-sm">Bienvenido,</p>
          <h1 class="text-2xl font-bold truncate">{{ user?.nombre || 'Colaborador' }}</h1>
          <span class="inline-block mt-1.5 px-3 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
            🧑‍🌾 Operario de Campo
          </span>
        </div>
        <div class="text-right shrink-0">
          <p class="text-3xl font-black">{{ tareasActivas }}</p>
          <p class="text-indigo-200 text-xs">tarea{{ tareasActivas !== 1 ? 's' : '' }} activa{{ tareasActivas !== 1 ? 's' : '' }}</p>
        </div>
      </div>

      <!-- Barra de progreso del día -->
      <div class="mt-5" v-if="totalTareas > 0">
        <div class="flex justify-between text-xs text-indigo-200 mb-1.5">
          <span>Progreso de hoy</span>
          <span>{{ tareasCompletadas }}/{{ totalTareas }} completadas ({{ porcentaje }}%)</span>
        </div>
        <div class="w-full bg-indigo-400/40 rounded-full h-2">
          <div
            class="h-2 rounded-full bg-white transition-all duration-700"
            :style="{ width: `${porcentaje}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Cargando -->
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-3" />
      <p class="text-gray-500 text-sm">Cargando tus tareas...</p>
    </div>

    <template v-else>
      <!-- Métricas de resumen -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-xl border border-yellow-200 shadow-sm p-4 text-center">
          <p class="text-3xl font-black text-yellow-600">{{ tareasPendientes }}</p>
          <p class="text-xs text-gray-500 mt-1 font-medium">Pendientes</p>
        </div>
        <div class="bg-white rounded-xl border border-blue-200 shadow-sm p-4 text-center">
          <p class="text-3xl font-black text-blue-600">{{ tareasEnCurso }}</p>
          <p class="text-xs text-gray-500 mt-1 font-medium">En Curso</p>
        </div>
        <div class="bg-white rounded-xl border border-red-200 shadow-sm p-4 text-center">
          <p class="text-3xl font-black text-red-600">{{ tareasVencidas }}</p>
          <p class="text-xs text-gray-500 mt-1 font-medium">Vencidas</p>
        </div>
      </div>

      <!-- Tareas urgentes o vencidas (si hay) -->
      <div v-if="tareasUrgentes.length > 0" class="bg-red-50 border border-red-200 rounded-2xl p-4">
        <h3 class="text-sm font-bold text-red-700 mb-3 flex items-center">
          <Icon name="i-heroicons-exclamation-circle" class="w-4 h-4 mr-2" />
          Requieren atención inmediata
        </h3>
        <div class="space-y-2">
          <div
            v-for="t in tareasUrgentes"
            :key="t.id"
            class="bg-white border border-red-200 rounded-xl p-3 flex items-center justify-between"
          >
            <div class="min-w-0 flex-1 mr-3">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ t.titulo }}</p>
              <p class="text-xs text-red-600 mt-0.5">
                {{ t.estado === 'vencida' ? '🚨 Vencida' : '🔴 Urgente' }}
                <span v-if="t.fecha_limite"> — {{ formatDate(t.fecha_limite) }}</span>
              </p>
            </div>
            <NuxtLink
              to="/mis-tareas"
              class="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
            >
              Atender
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Próximas tareas (primeras 5 pendientes/en curso) -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 class="text-base font-bold text-gray-900 flex items-center">
            <Icon name="i-heroicons-clipboard-document-list" class="w-5 h-5 mr-2 text-indigo-600" />
            Mis Tareas Activas
          </h2>
          <NuxtLink
            to="/mis-tareas"
            class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            Ver todas <Icon name="i-heroicons-arrow-right" class="w-3.5 h-3.5 ml-1" />
          </NuxtLink>
        </div>

        <!-- Sin tareas -->
        <div v-if="tareasActivas === 0" class="text-center py-10 px-4">
          <div class="text-5xl mb-3">🎉</div>
          <p class="font-bold text-gray-800">¡Sin tareas pendientes!</p>
          <p class="text-sm text-gray-400 mt-1">Estás al día. Buen trabajo.</p>
        </div>

        <!-- Lista compacta de tareas -->
        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="t in tareasProximas"
            :key="t.id"
            :class="['px-5 py-4 flex items-center space-x-4 hover:bg-gray-50 transition', getBorderFranja(t)]"
          >
            <!-- Icono de categoría -->
            <div :class="`p-2 rounded-lg shrink-0 ${getCategoriaIconBg(t.categoria)}`">
              <Icon :name="getCategoriaIcon(t.categoria)" :class="`w-4 h-4 ${getCategoriaIconColor(t.categoria)}`" />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ t.titulo }}</p>
              <div class="flex items-center gap-3 mt-0.5">
                <span :class="`text-xs font-medium ${getPrioridadColor(t.prioridad)}`">
                  {{ prioridadLabel(t.prioridad) }}
                </span>
                <span v-if="t.fecha_limite" class="text-xs text-gray-400 flex items-center">
                  <Icon name="i-heroicons-calendar" class="w-3 h-3 mr-0.5" />
                  {{ formatDate(t.fecha_limite) }}
                </span>
                <span v-if="t.potrero" class="text-xs text-gray-400 flex items-center">
                  <Icon name="i-heroicons-map-pin" class="w-3 h-3 mr-0.5" />
                  {{ t.potrero.nombre }}
                </span>
              </div>
            </div>

            <!-- Estado -->
            <span :class="`shrink-0 text-xs px-2 py-1 rounded-full font-semibold ${getEstadoClass(t.estado)}`">
              {{ estadoLabel(t.estado) }}
            </span>
          </div>
        </div>

        <!-- Botón ir a mis tareas -->
        <div class="px-5 pb-5 pt-3">
          <NuxtLink
            to="/mis-tareas"
            class="flex items-center justify-center w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-indigo-200"
          >
            <Icon name="i-heroicons-clipboard-document-check" class="w-4 h-4 mr-2" />
            Abrir mis tareas
          </NuxtLink>
        </div>
      </div>

      <!-- Acceso rápido a reporte de incidencia -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-3 bg-amber-100 rounded-xl">
              <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p class="font-bold text-gray-900 text-sm">¿Encontraste algún problema?</p>
              <p class="text-xs text-gray-500 mt-0.5">Agua, alimento, un animal enfermo o cualquier novedad</p>
            </div>
          </div>
          <NuxtLink
            to="/reportar/incidencias"
            class="shrink-0 flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition ml-3"
          >
            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4" />
            <span class="hidden sm:inline">Reportar</span>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTarea } from '@/composables/useTarea'

const { user } = useAuth()
const {
  tareas, loading,
  getMisTareas,
  getEstadoClass, getCategoriaIcon,
} = useTarea()

// ─── Avatar ───────────────────────────────────────────────────────────────────
const userAvatar = computed(() =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.nombre || 'C')}&background=6366f1&color=fff`
)
const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=C&background=6366f1&color=fff'
}

// ─── Métricas ─────────────────────────────────────────────────────────────────
const tareasPendientes = computed(() => tareas.value.filter(t => t.estado === 'pendiente').length)
const tareasEnCurso = computed(() => tareas.value.filter(t => t.estado === 'en_curso').length)
const tareasVencidas = computed(() => tareas.value.filter(t => t.estado === 'vencida').length)
const tareasCompletadas = computed(() => tareas.value.filter(t => t.estado === 'completada').length)
const tareasActivas = computed(() => tareasPendientes.value + tareasEnCurso.value + tareasVencidas.value)
const totalTareas = computed(() => tareas.value.length)
const porcentaje = computed(() =>
  totalTareas.value > 0 ? Math.round((tareasCompletadas.value / totalTareas.value) * 100) : 0
)

// ─── Tareas urgentes (vencidas + urgente) ─────────────────────────────────────
const tareasUrgentes = computed(() =>
  tareas.value
    .filter(t => t.estado === 'vencida' || (t.prioridad === 'urgente' && t.estado !== 'completada'))
    .slice(0, 3)
)

// ─── Primeras tareas activas para el panel ────────────────────────────────────
const tareasProximas = computed(() =>
  tareas.value
    .filter(t => t.estado === 'pendiente' || t.estado === 'en_curso')
    .sort((a, b) => {
      const pOrd = { urgente: 0, alta: 1, media: 2, baja: 3 }
      return (pOrd[a.prioridad] ?? 4) - (pOrd[b.prioridad] ?? 4)
    })
    .slice(0, 5)
)

// ─── Helpers UI ───────────────────────────────────────────────────────────────
const formatDate = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : ''
const prioridadLabel = (p) => ({ baja: '🟢', media: '🔵', alta: '🟠', urgente: '🔴 Urgente' })[p] || p
const estadoLabel = (e) => ({ pendiente: 'Pendiente', en_curso: 'En curso', completada: 'Completada', vencida: 'Vencida' })[e] || e

const getBorderFranja = (t) => {
  if (t.estado === 'vencida' || t.prioridad === 'urgente') return 'border-l-4 border-l-red-400'
  if (t.estado === 'en_curso') return 'border-l-4 border-l-blue-400'
  return 'border-l-4 border-l-yellow-300'
}

const getPrioridadColor = (p) => ({
  baja: 'text-gray-400', media: 'text-blue-600', alta: 'text-orange-600', urgente: 'text-red-600 font-bold',
})[p] || 'text-gray-500'

const getCategoriaIconBg = (c) => ({
  alimentacion: 'bg-green-50', limpieza: 'bg-blue-50', movimiento_ganado: 'bg-purple-50',
  mantenimiento: 'bg-orange-50', sanidad: 'bg-red-50', revision: 'bg-indigo-50', otro: 'bg-gray-50',
})[c] || 'bg-gray-50'

const getCategoriaIconColor = (c) => ({
  alimentacion: 'text-green-600', limpieza: 'text-blue-600', movimiento_ganado: 'text-purple-600',
  mantenimiento: 'text-orange-600', sanidad: 'text-red-600', revision: 'text-indigo-600', otro: 'text-gray-500',
})[c] || 'text-gray-500'

// ─── Carga de datos ───────────────────────────────────────────────────────────
onMounted(async () => {
  if (user.value?.id) {
    await getMisTareas(user.value.id)
  }
})
</script>