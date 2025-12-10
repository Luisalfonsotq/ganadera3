<!-- components/dashboards/DashboardVeterinario.vue -->
<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- Header del Perfil Veterinario -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <img
              :src="userAvatar"
              alt="Avatar"
              class="w-20 h-20 rounded-full border-4 border-white"
              @error="handleAvatarError"
            />
            <span class="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></span>
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold">{{ currentUser?.nombre || 'Veterinario' }}</h1>
            <p class="text-green-100">Gestión de Salud Animal</p>
            <span class="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              🩺 {{ currentUser?.rol }}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
            <span class="hidden md:inline">Exportar</span>
          </button>
          <button class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Icon name="heroicons:calendar-days" class="w-4 h-4" />
            <span class="hidden md:inline">Calendario</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Cargando información veterinaria...</p>
    </div>

    <div v-else>
      <!-- Métricas Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Card 1: Controles del Mes -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Controles del Mes</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ estadisticas?.total_controles || 0 }}</p>
              <p class="text-xs text-gray-500 mt-1">+{{ estadisticas?.controles_hoy || 0 }} hoy</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <Icon name="heroicons:clipboard-document-check" class="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div v-if="estadisticas?.costo_total" class="mt-3 pt-3 border-t border-gray-100">
            <p class="text-xs text-gray-600">Costo total: 
              <span class="font-bold text-blue-600">${{ formatNumber(estadisticas.costo_total) }}</span>
            </p>
          </div>
        </div>

        <!-- Card 2: Animales Bajo Tratamiento -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Bajo Tratamiento</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ animalesBajoTratamiento }}</p>
              <p class="text-xs text-gray-500 mt-1">Requieren seguimiento</p>
            </div>
            <div class="bg-orange-100 rounded-full p-3">
              <Icon name="heroicons:heart" class="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Card 3: Vacunaciones Pendientes -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Vacunaciones Pendientes</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ totalVacunacionesPendientes }}</p>
              <p class="text-xs text-red-500 mt-1">{{ vacunacionesUrgentes }} urgentes</p>
            </div>
            <div class="bg-purple-100 rounded-full p-3">
              <Icon name="heroicons:beaker" class="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Card 4: Emergencias Activas -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Emergencias</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ emergenciasActivas }}</p>
              <p class="text-xs text-gray-500 mt-1">Atención inmediata</p>
            </div>
            <div class="bg-red-100 rounded-full p-3">
              <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs de Navegación -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b border-gray-200">
          <div class="flex space-x-1 p-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="vistaActiva = tab.id"
              :class="[
                'px-6 py-3 rounded-lg font-medium transition',
                vistaActiva === tab.id
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Filtros y Búsqueda -->
        <div class="p-4 bg-gray-50 border-b">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                v-model="busqueda"
                placeholder="Buscar por animal, tipo de control..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              v-model="filtroEstado"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="todos">Todos los estados</option>
              <option value="sano">Sanos</option>
              <option value="en_tratamiento">En tratamiento</option>
              <option value="diagnosticado_enfermo">Enfermos</option>
            </select>
            <button class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <Icon name="heroicons:funnel" class="w-4 h-4" />
              Filtros Avanzados
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido por Vista -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna Principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Controles Sanitarios Recientes -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <Icon name="heroicons:clipboard-document-list" class="w-6 h-6 mr-2 text-green-600" />
                Controles Recientes
              </h2>
              <NuxtLink to="/controles-sanitarios" class="text-green-600 hover:text-green-700 text-sm font-medium">
                Ver todos →
              </NuxtLink>
            </div>

            <div v-if="controlesRecientes.length === 0" class="text-center py-8 text-gray-500">
              No hay controles registrados recientemente
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="control in controlesFiltrados"
                :key="control.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition duration-200 cursor-pointer"
                @click="navegarAControl(control.id)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="font-semibold text-gray-800">{{ control.animal?.identificador_unico || 'N/A' }}</span>
                      <span :class="getEstadoBadge(control.animal?.estado_salud)">
                        {{ formatEstado(control.animal?.estado_salud) }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {{ control.tipo_control?.nombre || 'N/A' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-2">{{ control.medicamento || 'Sin medicamento' }}</p>
                    <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>📅 {{ formatDate(control.fecha) }}</span>
                      <span v-if="control.veterinario">👨‍⚕️ {{ control.veterinario.nombre }}</span>
                      <span v-if="control.costo" class="text-green-600 font-medium">${{ formatNumber(control.costo) }}</span>
                    </div>
                  </div>
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <NuxtLink 
              to="/controles-sanitarios/crear"
              class="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition font-medium flex items-center justify-center gap-2"
            >
              <Icon name="heroicons:plus" class="w-5 h-5" />
              Registrar Nuevo Control
            </NuxtLink>
          </div>

          <!-- Alertas Sanitarias -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="heroicons:bell-alert" class="w-6 h-6 mr-2 text-red-600" />
              Alertas Prioritarias
            </h2>

            <div v-if="alertasSanitarias.length === 0" class="text-center py-8 text-gray-500">
              ✅ No hay alertas activas
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="alerta in alertasSanitarias"
                :key="alerta.id"
                :class="[
                  'border-l-4 p-4 rounded cursor-pointer hover:shadow-md transition',
                  getPrioridadClasses(alerta.prioridad)
                ]"
                @click="navegarAAnimal(alerta.animal.id)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-semibold text-gray-800">{{ alerta.animal?.identificador_unico }}</span>
                      <span :class="getPrioridadBadge(alerta.prioridad)">
                        {{ alerta.prioridad.toUpperCase() }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-700">{{ alerta.descripcion }}</p>
                    <p class="text-xs text-gray-500 mt-2">
                      Estado: {{ formatEstado(alerta.animal?.estado_salud) }}
                    </p>
                  </div>
                  <button 
                    @click.stop="atenderAlerta(alerta)"
                    class="ml-4 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
                  >
                    Atender
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de Controles por Tipo -->
          <div v-if="estadisticas?.por_tipo?.length" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="heroicons:chart-bar" class="w-6 h-6 mr-2 text-blue-600" />
              Controles por Tipo
            </h2>
            <div class="space-y-3">
              <div v-for="tipo in estadisticas.por_tipo" :key="tipo.nombre" class="flex items-center">
                <span class="w-32 text-sm text-gray-700">{{ tipo.nombre }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                  <div 
                    class="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    :style="`width: ${(tipo.cantidad / estadisticas.total_controles) * 100}%`"
                  >
                    <span class="text-xs text-white font-bold">{{ tipo.cantidad }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Lateral -->
        <div class="space-y-6">
          <!-- Próximas Vacunaciones -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="heroicons:calendar-days" class="w-5 h-5 mr-2 text-purple-600" />
              Próximas Vacunaciones
            </h3>

            <div v-if="proximasVacunaciones.length === 0" class="text-center py-4 text-gray-500 text-sm">
              No hay vacunaciones programadas
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="vacuna in proximasVacunaciones"
                :key="vacuna.tipo"
                :class="[
                  'border rounded-lg p-3',
                  vacuna.urgente ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-200'
                ]"
              >
                <span v-if="vacuna.urgente" class="inline-block mb-2 px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded">
                  URGENTE
                </span>
                <p class="font-semibold text-sm text-gray-800">{{ vacuna.tipo }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ vacuna.cantidad_animales }} animales</p>
              </div>
            </div>

            <button class="w-full mt-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium text-sm">
              Programar Vacunación
            </button>
          </div>

          <!-- Estadísticas del Mes -->
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <h3 class="text-lg font-semibold mb-4">Estadísticas del Mes</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center pb-2 border-b border-white/20">
                <span class="text-sm">Controles realizados</span>
                <span class="text-2xl font-bold">{{ estadisticas?.total_controles || 0 }}</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-white/20">
                <span class="text-sm">Animales atendidos</span>
                <span class="text-2xl font-bold">{{ estadisticas?.animales_atendidos || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">Tasa de recuperación</span>
                <span class="text-2xl font-bold">{{ tasaRecuperacion }}%</span>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
            <div class="space-y-2">
              <NuxtLink 
                to="/controles-sanitarios/crear"
                class="flex items-center justify-between w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg transition duration-200 text-green-700 font-medium"
              >
                <span class="flex items-center gap-2">
                  <Icon name="heroicons:plus-circle" class="w-5 h-5" />
                  Nuevo Control
                </span>
                <Icon name="heroicons:arrow-right" class="w-5 h-5" />
              </NuxtLink>

              <NuxtLink 
                to="/animales"
                class="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 text-blue-700 font-medium"
              >
                <span class="flex items-center gap-2">
                  <Icon name="heroicons:shield-check" class="w-5 h-5" />
                  Ver Animales
                </span>
                <Icon name="heroicons:arrow-right" class="w-5 h-5" />
              </NuxtLink>

              <NuxtLink 
                to="/tipos-control-sanitario"
                class="flex items-center justify-center w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200 text-gray-700 font-medium"
              >
                <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 mr-2" />
                Tipos de Control
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { user } = useAuth()
const { getAllControles, getEstadisticasVeterinario, getProximasVacunaciones } = useControlSanitario()
const { getAnimalesOfFinca, getAlertasSanitarias } = useAnimal()
const { getAllFincas } = useFinca()
const router = useRouter()

// Estados
const currentUser = ref(null)
const loading = ref(true)
const controles = ref([])
const animales = ref([])
const estadisticas = ref(null)
const proximasVacunaciones = ref([])
const vistaActiva = ref('resumen')
const busqueda = ref('')
const filtroEstado = ref('todos')

const tabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'controles', label: 'Controles' },
  { id: 'alertas', label: 'Alertas' },
  { id: 'historial', label: 'Historial' }
]

// Computeds
const userAvatar = computed(() => {
  return user.value?.avatar || `https://ui-avatars.com/api/?name=${user.value?.nombre || 'V'}`
})

const animalesBajoTratamiento = computed(() => {
  return animales.value.filter(a => a.estado_salud === 'en_tratamiento').length
})

const emergenciasActivas = computed(() => {
  return animales.value.filter(a => a.estado_salud === 'diagnosticado_enfermo').length
})

const totalVacunacionesPendientes = computed(() => {
  return proximasVacunaciones.value.reduce((sum, v) => sum + v.cantidad_animales, 0)
})

const vacunacionesUrgentes = computed(() => {
  return proximasVacunaciones.value.filter(v => v.urgente).reduce((sum, v) => sum + v.cantidad_animales, 0)
})

const controlesRecientes = computed(() => {
  return controles.value
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 10)
})

const controlesFiltrados = computed(() => {
  let filtered = controlesRecientes.value

  if (busqueda.value) {
    const busq = busqueda.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.animal?.identificador_unico?.toLowerCase().includes(busq) ||
      c.tipo_control?.nombre?.toLowerCase().includes(busq) ||
      c.medicamento?.toLowerCase().includes(busq)
    )
  }

  if (filtroEstado.value !== 'todos') {
    filtered = filtered.filter(c => c.animal?.estado_salud === filtroEstado.value)
  }

  return filtered.slice(0, 5)
})

const alertasSanitarias = computed(() => {
  const animalesConProblemas = animales.value
    .filter(a => a.estado_salud === 'diagnosticado_enfermo' || a.estado_salud === 'en_tratamiento')
    .slice(0, 5)

  return animalesConProblemas.map(a => ({
    id: a.id,
    animal: a,
    descripcion: a.estado_salud === 'diagnosticado_enfermo' 
      ? 'Animal enfermo - Requiere atención urgente'
      : 'Animal en tratamiento - Seguimiento requerido',
    prioridad: a.estado_salud === 'diagnosticado_enfermo' ? 'alta' : 'media'
  }))
})

const tasaRecuperacion = computed(() => {
  if (!estadisticas.value?.animales_atendidos) return 0
  const recuperados = animales.value.filter(a => a.estado_salud === 'sano').length
  return Math.round((recuperados / estadisticas.value.animales_atendidos) * 100)
})

// Métodos
const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=V'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  const hoy = new Date()
  const ayer = new Date(hoy)
  ayer.setDate(ayer.getDate() - 1)

  if (d.toDateString() === hoy.toDateString()) return 'Hoy'
  if (d.toDateString() === ayer.toDateString()) return 'Ayer'
  
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('es-ES').format(num)
}

const formatEstado = (estado) => {
  const estados = {
    'sano': 'Sano',
    'diagnosticado_enfermo': 'Enfermo',
    'en_tratamiento': 'En Tratamiento'
  }
  return estados[estado] || estado
}

const getEstadoBadge = (estado) => {
  const clases = {
    'sano': 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium',
    'diagnosticado_enfermo': 'px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium',
    'en_tratamiento': 'px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium'
  }
  return clases[estado] || 'px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium'
}

const getPrioridadClasses = (prioridad) => {
  const clases = {
    'alta': 'border-red-500 bg-red-50',
    'media': 'border-yellow-500 bg-yellow-50',
    'baja': 'border-blue-500 bg-blue-50'
  }
  return clases[prioridad] || 'border-gray-500 bg-gray-50'
}

const getPrioridadBadge = (prioridad) => {
  const clases = {
    'alta': 'px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-bold',
    'media': 'px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-bold',
    'baja': 'px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-bold'
  }
  return clases[prioridad] || 'px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-bold'
}

const navegarAControl = (id) => {
  router.push(`/controles-sanitarios/${id}`)
}

const navegarAAnimal = (id) => {
  router.push(`/animales/${id}`)
}

const atenderAlerta = (alerta) => {
  router.push(`/controles-sanitarios/crear?animal_id=${alerta.animal.id}`)
}

// Lifecycle
onMounted(async () => {
  try {
    currentUser.value = user.value
    
    // Cargar estadísticas del veterinario
    if (user.value?.id) {
      const { data: statsData } = await getEstadisticasVeterinario(user.value.id)
      if (statsData.value) {
        estadisticas.value = statsData.value
      }
    }

    // Cargar controles sanitarios
    const { data: controlesData } = await getAllControles()
    if (controlesData.value) {
      controles.value = controlesData.value
    }

    // Cargar próximas vacunaciones
    const { data: vacunasData } = await getProximasVacunaciones(30)
    if (vacunasData.value) {
      proximasVacunaciones.value = vacunasData.value
    }

    // Cargar animales de todas las fincas del usuario
    if (user.value?.id) {
      const { data: fincasData } = await getAllFincas(user.value.id, user.value.rol)
      
      if (fincasData.value) {
        const allAnimales = []
        for (const finca of fincasData.value) {
          const { data: animalesData } = await getAnimalesOfFinca(finca.id)
          if (animalesData.value) {
            allAnimales.push(...animalesData.value)
          }
        }
        animales.value = allAnimales
      }
    }
  } catch (error) {
    console.error('Error al cargar datos del veterinario:', error)
  } finally {
    loading.value = false
  }
})
</script>
  