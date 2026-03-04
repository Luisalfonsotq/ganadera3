<!-- pages/supervision/actividades.vue -->
<template>
  <div class="max-w-7xl mx-auto space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center">
          <Icon name="i-heroicons-map" class="w-7 h-7 mr-2 text-emerald-600" />
          Actividades y Ubicación del Ganado
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Visualiza dónde están los animales y el estado de las tareas activas
        </p>
      </div>
      <!-- Selector de finca -->
      <select
        v-model="fincaSeleccionada"
        @change="onFincaChange"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      >
        <option value="" disabled>Selecciona una finca</option>
        <option v-for="f in fincas" :key="f.id" :value="f.id">{{ f.nombre }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600" />
    </div>

    <template v-else>
      <!-- KPIs rápidos -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center space-x-3">
          <div class="p-2.5 bg-emerald-50 rounded-lg">
            <Icon name="i-heroicons-shield-check" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ totalAnimales }}</p>
            <p class="text-xs text-gray-500">Total Animales</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center space-x-3">
          <div class="p-2.5 bg-blue-50 rounded-lg">
            <Icon name="i-heroicons-map-pin" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ potreros.length }}</p>
            <p class="text-xs text-gray-500">Potreros</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center space-x-3">
          <div class="p-2.5 bg-amber-50 rounded-lg">
            <Icon name="i-heroicons-clock" class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ tareasActivas }}</p>
            <p class="text-xs text-gray-500">Tareas Activas</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center space-x-3">
          <div class="p-2.5 bg-red-50 rounded-lg">
            <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ animalesSinPotrero }}</p>
            <p class="text-xs text-gray-500">Sin Ubicar</p>
          </div>
        </div>
      </div>

      <!-- Cuadrícula de Potreros -->
      <div>
        <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <Icon name="i-heroicons-squares-2x2" class="w-5 h-5 mr-2 text-emerald-600" />
          Distribución por Potrero
        </h2>

        <div v-if="potreros.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Icon name="i-heroicons-map" class="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p class="text-gray-500 text-sm">No hay potreros registrados para esta finca</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="potrero in potrerosConAnimales"
            :key="potrero.id"
            class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <!-- Header del potrero -->
            <div class="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 rounded-full" :class="potrero.animales.length > 0 ? 'bg-emerald-500' : 'bg-gray-300'" />
                  <h3 class="font-semibold text-gray-800 text-sm">{{ potrero.nombre }}</h3>
                </div>
                <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {{ potrero.animales.length }} animales
                </span>
              </div>
              <p v-if="potrero.tamano_ha" class="text-xs text-gray-500 mt-1">
                📐 {{ potrero.tamano_ha }} ha
              </p>
            </div>

            <!-- Lista de animales en este potrero -->
            <div class="p-4">
              <div v-if="potrero.animales.length > 0" class="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                <div
                  v-for="animal in potrero.animales.slice(0, 8)"
                  :key="animal.id"
                  class="flex items-center justify-between text-xs"
                >
                  <NuxtLink
                    :to="`/animales/${animal.id}`"
                    class="flex items-center space-x-1.5 text-gray-700 hover:text-emerald-600 transition font-medium"
                  >
                    <span>🐄</span>
                    <span>{{ animal.nombre || `Animal #${animal.id}` }}</span>
                  </NuxtLink>
                  <span :class="getSaludClass(animal.estado_salud)" class="px-1.5 py-0.5 rounded text-xs">
                    {{ animal.estado_salud || 'OK' }}
                  </span>
                </div>
                <p v-if="potrero.animales.length > 8" class="text-xs text-gray-400 text-center pt-1">
                  + {{ potrero.animales.length - 8 }} más
                </p>
              </div>
              <div v-else class="text-center py-4">
                <p class="text-xs text-gray-400">Sin animales actualmente</p>
              </div>

              <!-- Tareas activas en este potrero -->
              <div v-if="tareasPorPotrero(potrero.id).length > 0" class="mt-3 pt-3 border-t border-gray-100">
                <p class="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                  <Icon name="i-heroicons-clipboard-document-list" class="w-3.5 h-3.5 mr-1" />
                  Tareas activas ({{ tareasPorPotrero(potrero.id).length }})
                </p>
                <div v-for="tarea in tareasPorPotrero(potrero.id).slice(0, 3)" :key="tarea.id"
                  class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-600 truncate max-w-36">{{ tarea.titulo }}</span>
                  <span :class="getEstadoBadge(tarea.estado)" class="px-1.5 py-0.5 rounded text-xs shrink-0 ml-1">
                    {{ tarea.estado === 'en_curso' ? 'En curso' : 'Pend.' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Animales sin potrero asignado -->
      <div v-if="animalesSinPotrero > 0">
        <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 mr-2 text-amber-500" />
          Animales sin Potrero Asignado
          <span class="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-sm rounded-full font-bold">
            {{ animalesSinPotrero }}
          </span>
        </h2>
        <div class="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <div
              v-for="animal in animalesSinPotrero_lista.slice(0, 12)"
              :key="animal.id"
              class="flex items-center space-x-2 p-2 bg-amber-50 rounded-lg text-xs"
            >
              <span>🐄</span>
              <div class="min-w-0">
                <p class="font-medium text-gray-700 truncate">{{ animal.nombre || `#${animal.id}` }}</p>
                <p class="text-gray-500">{{ animal.raza || 'Sin raza' }}</p>
              </div>
            </div>
          </div>
          <p v-if="animalesSinPotrero > 12" class="text-xs text-gray-400 text-center mt-3">
            + {{ animalesSinPotrero - 12 }} animales más sin ubicar
          </p>
          <div class="mt-4 pt-3 border-t border-amber-100">
            <NuxtLink
              to="/animales"
              class="text-sm text-amber-700 hover:text-amber-900 font-medium flex items-center"
            >
              <Icon name="i-heroicons-arrow-right-circle" class="w-4 h-4 mr-1" />
              Ir al listado de animales para asignar potreros
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Resumen de Recursos -->
      <div>
        <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <Icon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2 text-blue-600" />
          Resumen de Uso de Recursos
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <!-- Uso de potreros -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Icon name="i-heroicons-map-pin" class="w-4 h-4 mr-1 text-emerald-600" />
              Ocupación de Potreros
            </h3>
            <div class="space-y-2.5">
              <div v-for="p in potrerosConAnimales.slice(0, 5)" :key="p.id">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-600 truncate max-w-28">{{ p.nombre }}</span>
                  <span class="text-gray-500 font-medium">{{ p.animales.length }}</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full bg-emerald-500"
                    :style="{ width: `${Math.min((p.animales.length / Math.max(totalAnimales, 1)) * 100, 100)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Estado de salud del hato -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Icon name="i-heroicons-heart" class="w-4 h-4 mr-1 text-red-500" />
              Estado de Salud
            </h3>
            <div class="space-y-2">
              <div
                v-for="estado in estadosSalud"
                :key="estado.label"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-2">
                  <div :class="`w-2.5 h-2.5 rounded-full ${estado.color}`" />
                  <span class="text-xs text-gray-600">{{ estado.label }}</span>
                </div>
                <span class="text-sm font-bold text-gray-800">{{ estado.count }}</span>
              </div>
            </div>
          </div>

          <!-- Tareas del día -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Icon name="i-heroicons-clipboard-document-check" class="w-4 h-4 mr-1 text-blue-600" />
              Tareas de Hoy
            </h3>
            <div v-if="tareasDeHoy.length > 0" class="space-y-2">
              <div v-for="t in tareasDeHoy.slice(0, 5)" :key="t.id" class="flex items-start space-x-2">
                <div :class="`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${t.estado === 'completada' ? 'bg-green-500' : t.estado === 'en_curso' ? 'bg-blue-500' : 'bg-yellow-500'}`" />
                <div class="min-w-0">
                  <p class="text-xs font-medium text-gray-700 truncate">{{ t.titulo }}</p>
                  <p v-if="t.asignado_a" class="text-xs text-gray-400">{{ t.asignado_a.nombre }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <p class="text-xs text-gray-400">No hay tareas programadas para hoy</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTarea } from '@/composables/useTarea'

definePageMeta({ layout: 'profile-layout' })

const { user } = useAuth()
const { tareas, getTareasPorFinca } = useTarea()
const { public: { apiBaseUrl } } = useRuntimeConfig()
const token = useCookie('access_token')

// ─── Estado ───────────────────────────────────────────────────────────────────
const fincas = ref([])
const fincaSeleccionada = ref('')
const potreros = ref([])
const animales = ref([])
const loading = ref(false)

// ─── Auth helper ──────────────────────────────────────────────────────────────
const authFetch = (url) => $fetch(url, {
  credentials: 'include',
  headers: { Authorization: `Bearer ${token.value}` },
})

// ─── Computed ─────────────────────────────────────────────────────────────────
const totalAnimales = computed(() => animales.value.length)

const animalesSinPotrero_lista = computed(() =>
  animales.value.filter(a => !a.potrero_id && !a.potrero)
)
const animalesSinPotrero = computed(() => animalesSinPotrero_lista.value.length)

const tareasActivas = computed(() =>
  tareas.value.filter(t => t.estado === 'pendiente' || t.estado === 'en_curso').length
)

const potrerosConAnimales = computed(() =>
  potreros.value.map(p => ({
    ...p,
    animales: animales.value.filter(a => a.potrero_id === p.id),
  }))
)

const tareasDeHoy = computed(() => {
  const hoy = new Date().toISOString().split('T')[0]
  return tareas.value.filter(t => t.fecha_limite?.startsWith(hoy))
})

const estadosSalud = computed(() => {
  const counts = { Sano: 0, Enfermo: 0, 'En Tratamiento': 0, Muerto: 0 }
  animales.value.forEach(a => {
    const e = a.estado_salud || 'Sano'
    if (counts[e] !== undefined) counts[e]++
    else counts['Sano']++
  })
  return [
    { label: 'Sano', color: 'bg-green-500', count: counts['Sano'] },
    { label: 'Enfermo', color: 'bg-red-500', count: counts['Enfermo'] },
    { label: 'En Tratamiento', color: 'bg-amber-500', count: counts['En Tratamiento'] },
    { label: 'Muerto', color: 'bg-gray-400', count: counts['Muerto'] },
  ]
})

const tareasPorPotrero = (potreroId) =>
  tareas.value.filter(t =>
    t.potrero_id === potreroId &&
    (t.estado === 'pendiente' || t.estado === 'en_curso')
  )

// ─── Helpers de UI ────────────────────────────────────────────────────────────
const getSaludClass = (estado) => {
  const map = {
    Sano: 'bg-green-100 text-green-700',
    Enfermo: 'bg-red-100 text-red-700',
    'En Tratamiento': 'bg-amber-100 text-amber-700',
    Muerto: 'bg-gray-100 text-gray-600',
  }
  return map[estado] || 'bg-gray-100 text-gray-600'
}

const getEstadoBadge = (estado) => {
  return estado === 'en_curso' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
}

// ─── Carga de datos ───────────────────────────────────────────────────────────
const onFincaChange = async () => {
  if (!fincaSeleccionada.value) return
  loading.value = true
  try {
    await Promise.all([
      (async () => {
        potreros.value = await authFetch(`${apiBaseUrl}/potreros?finca_id=${fincaSeleccionada.value}`)
      })(),
      (async () => {
        animales.value = await authFetch(`${apiBaseUrl}/animales?finca_id=${fincaSeleccionada.value}`)
      })(),
      getTareasPorFinca(fincaSeleccionada.value),
    ])
  } catch (e) {
    console.error('Error cargando datos de la finca:', e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    if (user.value?.rol === 'Administrador') {
      fincas.value = await authFetch(`${apiBaseUrl}/fincas?propietario_id=${user.value.id}`)
    } else {
      fincas.value = await authFetch(`${apiBaseUrl}/fincas/by-user/${user.value.id}`)
    }

    if (fincas.value.length > 0) {
      fincaSeleccionada.value = fincas.value[0].id
      await onFincaChange()
    }
  } catch (e) {
    console.error('Error cargando fincas:', e)
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 20px; }
</style>
