<!-- pages/animales/index.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">Gestión de Animales</h1>
      <NuxtLink to="/animales/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center gap-2">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Crear Animal
      </NuxtLink>
    </div>

    <!-- Tarjetas de Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Total Animales -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Animales</p>
            <p class="text-3xl font-bold text-gray-800">{{ animales.length }}</p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <Icon name="heroicons:cube" class="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Alertas Sanitarias -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 cursor-pointer hover:shadow-lg transition"
        @click="mostrarAlertas = true">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Alertas Sanitarias</p>
            <p class="text-3xl font-bold text-red-600">{{ alertasSanitarias.length }}</p>
          </div>
          <div class="bg-red-100 rounded-full p-3">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <!-- Próximos Partos -->
      <div
        class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-lg transition"
        @click="mostrarPartos = true">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Próximos Partos</p>
            <p class="text-3xl font-bold text-purple-600">{{ proximosPartos.length }}</p>
          </div>
          <div class="bg-purple-100 rounded-full p-3">
            <Icon name="heroicons:heart" class="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div
        class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition"
        @click="mostrarEstadisticas = true">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Ver Estadísticas</p>
            <p class="text-sm font-medium text-green-600 mt-2">Por Etapas de Vida</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <Icon name="heroicons:chart-bar" class="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Animales -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Listado de Animales</h2>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-500">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2" />
        Cargando animales...
      </div>
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
      <div v-else-if="animales.length === 0" class="p-8 text-center text-gray-600">
        <Icon name="heroicons:inbox" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p>Aún no hay animales creados.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificador
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raza</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa de Vida
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Salud
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potrero</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alertas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="animal in animales" :key="animal.id" class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ animal.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{{ animal.identificador_unico
                }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ animal.raza || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                <span :class="animal.sexo === 'macho' ? 'text-blue-600' : 'text-pink-600'">
                  {{ animal.sexo }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span v-if="animal.etapa_vida" :class="getEtapaVidaClass(animal.etapa_vida)">
                  {{ formatEtapaVida(animal.etapa_vida) }}
                </span>
                <span v-else class="text-gray-400">Sin definir</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getEstadoSaludClass(animal.estado_salud)">
                  {{ formatEstadoSalud(animal.estado_salud) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ animal.potrero?.nombre || 'Sin asignar' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex gap-2">
                  <span v-if="animal.requiere_atencion_sanitaria"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    title="Requiere atención sanitaria">
                    <Icon name="heroicons:exclamation-triangle" class="w-4 h-4" />
                  </span>
                  <span v-if="animal.fecha_probable_parto && isProximoParto(animal.fecha_probable_parto)"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    title="Próximo a parir">
                    <Icon name="heroicons:heart" class="w-4 h-4" />
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <NuxtLink :to="`/animales/historial/${animal.id}`" class="text-purple-500 hover:underline"
                    title="Ver historial">
                    <Icon name="heroicons:clock" class="w-5 h-5" />
                  </NuxtLink>
                  <NuxtLink :to="`/animales/${animal.id}`" class="text-blue-600 hover:text-blue-900"
                    title="Ver detalles">
                    <Icon name="heroicons:eye" class="w-5 h-5" />
                  </NuxtLink>
                  <NuxtLink v-if="user?.rol === 'Administrador' || user?.rol === 'Supervisor'" :to="`/animales/editar/${animal.id}`" class="text-yellow-600 hover:text-yellow-900"
                    title="Editar">
                    <Icon name="heroicons:pencil" class="w-5 h-5" />
                  </NuxtLink>
                  <button @click="handleDelete(animal.id)" class="text-red-600 hover:text-red-900" title="Eliminar">
                    <Icon name="heroicons:trash" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Link a Crías -->
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="heroicons:user-group" class="w-6 h-6 text-blue-600" />
          <div>
            <p class="font-semibold text-blue-900">Gestión de Crías</p>
            <p class="text-sm text-blue-700">Ver y administrar las crías registradas</p>
          </div>
        </div>
        <NuxtLink to="/crias"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
          Ver Crías
        </NuxtLink>
      </div>
    </div>

    <!-- Modal Alertas Sanitarias -->
    <div v-if="mostrarAlertas" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div class="bg-red-600 text-white p-4 flex justify-between items-center">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
            Alertas Sanitarias
          </h3>
          <button @click="mostrarAlertas = false" class="text-white hover:text-gray-200">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <p class="text-gray-600 mb-4">Animales que requieren atención sanitaria (más de 90 días sin control)</p>
          <div v-if="alertasSanitarias.length === 0" class="text-center py-8 text-gray-500">
            <Icon name="heroicons:check-circle" class="w-16 h-16 mx-auto mb-2 text-green-500" />
            <p>¡Excelente! No hay alertas sanitarias pendientes.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="animal in alertasSanitarias" :key="animal.id"
              class="border border-red-200 rounded-lg p-4 hover:shadow-md transition">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-semibold text-gray-900">{{ animal.identificador_unico }}</p>
                  <p class="text-sm text-gray-600">{{ animal.raza || 'Sin raza' }} • {{
                    formatEtapaVida(animal.etapa_vida) }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Último control: {{ animal.ultima_fecha_control_sanitario ?
                      formatDate(animal.ultima_fecha_control_sanitario) : 'Nunca' }}
                  </p>
                </div>
                <NuxtLink :to="`/animales/${animal.id}`"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                  Ver
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Próximos Partos -->
    <div v-if="mostrarPartos" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div class="bg-purple-600 text-white p-4 flex justify-between items-center">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <Icon name="heroicons:heart" class="w-6 h-6" />
            Próximos Partos (30 días)
          </h3>
          <button @click="mostrarPartos = false" class="text-white hover:text-gray-200">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <p class="text-gray-600 mb-4">Animales con fecha probable de parto en los próximos 30 días</p>
          <div v-if="proximosPartos.length === 0" class="text-center py-8 text-gray-500">
            <Icon name="heroicons:calendar" class="w-16 h-16 mx-auto mb-2 text-gray-400" />
            <p>No hay partos programados para los próximos 30 días.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="animal in proximosPartos" :key="animal.id"
              class="border border-purple-200 rounded-lg p-4 hover:shadow-md transition">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-semibold text-gray-900">{{ animal.identificador_unico }}</p>
                  <p class="text-sm text-gray-600">{{ animal.raza || 'Sin raza' }}</p>
                  <p class="text-sm font-medium text-purple-600 mt-1">
                    Fecha probable: {{ formatDate(animal.fecha_probable_parto) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ getDiasRestantes(animal.fecha_probable_parto) }}
                  </p>
                </div>
                <NuxtLink :to="`/animales/${animal.id}`"
                  class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">
                  Ver
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Estadísticas -->
    <div v-if="mostrarEstadisticas"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div class="bg-green-600 text-white p-4 flex justify-between items-center">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <Icon name="heroicons:chart-bar" class="w-6 h-6" />
            Estadísticas por Etapas de Vida
          </h3>
          <button @click="mostrarEstadisticas = false" class="text-white hover:text-gray-200">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <Icon name="heroicons:user" class="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p class="text-2xl font-bold text-blue-600">{{ estadisticas.terneros }}</p>
              <p class="text-sm text-gray-600">Terneros</p>
            </div>
            <div class="bg-pink-50 rounded-lg p-4 text-center border border-pink-200">
              <Icon name="heroicons:user" class="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <p class="text-2xl font-bold text-pink-600">{{ estadisticas.terneras }}</p>
              <p class="text-sm text-gray-600">Terneras</p>
            </div>
            <div class="bg-indigo-50 rounded-lg p-4 text-center border border-indigo-200">
              <Icon name="heroicons:user" class="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p class="text-2xl font-bold text-indigo-600">{{ estadisticas.novillos }}</p>
              <p class="text-sm text-gray-600">Novillos</p>
            </div>
            <div class="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
              <Icon name="heroicons:user" class="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p class="text-2xl font-bold text-purple-600">{{ estadisticas.novillas }}</p>
              <p class="text-sm text-gray-600">Novillas</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <Icon name="heroicons:user" class="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p class="text-2xl font-bold text-green-600">{{ estadisticas.adultos }}</p>
              <p class="text-sm text-gray-600">Adultos</p>
            </div>
            <div class="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-200">
              <Icon name="heroicons:user" class="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <p class="text-2xl font-bold text-emerald-600">{{ estadisticas.adultas }}</p>
              <p class="text-sm text-gray-600">Adultas</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <Icon name="heroicons:user" class="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p class="text-2xl font-bold text-gray-600">{{ estadisticas.adultos_mayores }}</p>
              <p class="text-sm text-gray-600">Adultos Mayores</p>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
              <Icon name="heroicons:question-mark-circle" class="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p class="text-2xl font-bold text-yellow-600">{{ estadisticas.sin_etapa }}</p>
              <p class="text-sm text-gray-600">Sin Definir</p>
            </div>
          </div>
          <div class="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p class="text-lg font-semibold text-gray-800 mb-2">Total: {{ estadisticas.total }} animales</p>
            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div class="h-full flex">
                <div v-if="estadisticas.total > 0"
                  :style="`width: ${(estadisticas.terneros / estadisticas.total * 100)}%`" class="bg-blue-500"></div>
                <div v-if="estadisticas.total > 0"
                  :style="`width: ${(estadisticas.terneras / estadisticas.total * 100)}%`" class="bg-pink-500"></div>
                <div v-if="estadisticas.total > 0"
                  :style="`width: ${(estadisticas.novillos / estadisticas.total * 100)}%`" class="bg-indigo-500"></div>
                <div v-if="estadisticas.total > 0"
                  :style="`width: ${(estadisticas.novillas / estadisticas.total * 100)}%`" class="bg-purple-500"></div>
                <div v-if="estadisticas.total > 0"
                  :style="`width: ${(estadisticas.adultos / estadisticas.total * 100)}%`" class="bg-green-500"></div>
                <div v-if="estadisticas.total > 0"
                  :style="`width: ${(estadisticas.adultas / estadisticas.total * 100)}%`" class="bg-emerald-500"></div>
                <div v-if="estadisticas.total > 0"
                  :style="`width: ${(estadisticas.adultos_mayores / estadisticas.total * 100)}%`" class="bg-gray-500">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })
import { onMounted, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useFinca } from '~/composables/useFinca'
import { useAnimal } from '~/composables/useAnimal'

const { user } = useAuth()
const { getAllFincas } = useFinca()
const {
  animales,
  loading,
  error,
  getAnimalesOfFinca,
  deleteAnimal,
  getAlertasSanitarias,
  getProximosPartos,
  getEstadisticasEtapas
} = useAnimal()

const fincas = ref([])
const alertasSanitarias = ref([])
const proximosPartos = ref([])
const estadisticas = ref({
  terneros: 0,
  terneras: 0,
  novillos: 0,
  novillas: 0,
  adultos: 0,
  adultas: 0,
  adultos_mayores: 0,
  sin_etapa: 0,
  total: 0
})
const mostrarAlertas = ref(false)
const mostrarPartos = ref(false)
const mostrarEstadisticas = ref(false)

const loadFincas = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) {
    console.log('No se pudo obtener el id del usuario')
    return
  }

  const { data, error } = await getAllFincas(userId, user.value.rol)

  if (data.value && data.value.length > 0) {
    fincas.value = data.value
    const fincaId = fincas.value[0].id
    await Promise.all([
      getAnimalesOfFinca(fincaId),
      loadAlertas(fincaId),
      loadPartos(fincaId),
      loadEstadisticas(fincaId)
    ])
  }
}

const loadAlertas = async (fincaId) => {
  const { data } = await getAlertasSanitarias(fincaId)
  if (data.value) {
    alertasSanitarias.value = data.value
  }
}

const loadPartos = async (fincaId) => {
  const { data } = await getProximosPartos(30, fincaId)
  if (data.value) {
    proximosPartos.value = data.value
  }
}

const loadEstadisticas = async (fincaId) => {
  const { data } = await getEstadisticasEtapas(fincaId)
  if (data.value) {
    estadisticas.value = data.value
  }
}

watch(user, loadFincas, { immediate: true })
onMounted(loadFincas)

const getEtapaVidaClass = (etapa) => {
  const classes = {
    'ternero': 'px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium',
    'ternera': 'px-2 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-medium',
    'novillo': 'px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium',
    'novilla': 'px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium',
    'adulto': 'px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium',
    'adulta': 'px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium',
    'adulto_mayor': 'px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium'
  }
  return classes[etapa] || 'px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium'
}

const getEstadoSaludClass = (estado) => {
  const classes = {
    'sano': 'px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium',
    'diagnosticado_enfermo': 'px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium',
    'en_tratamiento': 'px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium'
  }
  return classes[estado] || 'px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium'
}

const formatEtapaVida = (etapa) => {
  const nombres = {
    'ternero': 'Ternero',
    'ternera': 'Ternera',
    'novillo': 'Novillo',
    'novilla': 'Novilla',
    'adulto': 'Adulto',
    'adulta': 'Adulta',
    'adulto_mayor': 'Adulto Mayor'
  }
  return nombres[etapa] || 'N/A'
}

const formatEstadoSalud = (estado) => {
  const nombres = {
    'sano': 'Sano',
    'diagnosticado_enfermo': 'Enfermo',
    'en_tratamiento': 'En Tratamiento'
  }
  return nombres[estado] || estado
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const isProximoParto = (fechaParto) => {
  if (!fechaParto) return false
  const fecha = new Date(fechaParto)
  const hoy = new Date()
  const diasDiferencia = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24))
  return diasDiferencia >= 0 && diasDiferencia <= 30
}

const getDiasRestantes = (fechaParto) => {
  if (!fechaParto) return ''
  const fecha = new Date(fechaParto)
  const hoy = new Date()
  const diasDiferencia = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24))

  if (diasDiferencia < 0) return 'Fecha pasada'
  if (diasDiferencia === 0) return '¡Hoy!'
  if (diasDiferencia === 1) return 'Mañana'
  return `Faltan ${diasDiferencia} días`
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este animal?')) {
    const { error } = await deleteAnimal(id)
    if (!error.value) {
      animales.value = animales.value.filter(a => a.id !== id)
      // Recargar estadísticas
      if (fincas.value.length > 0) {
        await Promise.all([
          loadAlertas(fincas.value[0].id),
          loadPartos(fincas.value[0].id),
          loadEstadisticas(fincas.value[0].id)
        ])
      }
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>