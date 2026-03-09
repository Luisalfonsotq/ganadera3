<!-- pages/historial-animal/index.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon name="heroicons:clipboard-document-list" class="w-6 h-6 text-white" />
          </span>
          Historial Clínico Animal
        </h1>
        <p class="text-gray-500 mt-1 ml-13">Consulta el historial médico y controles sanitarios de cada animal</p>
      </div>
    </div>

    <!-- Estadísticas rápidas del hato -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:cube" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-800">{{ animales.length }}</p>
            <p class="text-xs text-gray-500">Total Animales</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:heart" class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-800">{{ animalesSanos }}</p>
            <p class="text-xs text-gray-500">Sanos</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-red-600">{{ animalesEnfermos }}</p>
            <p class="text-xs text-gray-500">Enfermos/Tratamiento</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:bell-alert" class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-yellow-600">{{ animalesSinControl }}</p>
            <p class="text-xs text-gray-500">Sin Control Reciente</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Buscador y Filtros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por ID, nombre, raza..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <select v-model="filtroEstado"
          class="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white">
          <option value="">Todos los estados</option>
          <option value="sano">Sano</option>
          <option value="diagnosticado_enfermo">Enfermo</option>
          <option value="en_tratamiento">En Tratamiento</option>
        </select>
        <select v-model="filtroEtapa"
          class="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white">
          <option value="">Todas las etapas</option>
          <option value="ternero">Ternero</option>
          <option value="ternera">Ternera</option>
          <option value="novillo">Novillo</option>
          <option value="novilla">Novilla</option>
          <option value="adulto">Adulto</option>
          <option value="adulta">Adulta</option>
          <option value="adulto_mayor">Adulto Mayor</option>
        </select>
      </div>
    </div>

    <!-- Loadind -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-flex flex-col items-center gap-3">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500">Cargando animales...</p>
      </div>
    </div>

    <!-- Lista de Animales -->
    <div v-else-if="animalesFiltrados.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <NuxtLink
        v-for="animal in animalesFiltrados"
        :key="animal.id"
        :to="`/animales/historial/${animal.id}`"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 group block"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0',
              animal.sexo === 'macho' ? 'bg-blue-500' : 'bg-pink-500'
            ]">
              {{ animal.identificador_unico?.charAt(0) || '?' }}
            </div>
            <div>
              <h3 class="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {{ animal.identificador_unico }}
              </h3>
              <p class="text-xs text-gray-500">{{ animal.raza || 'Sin raza' }}</p>
            </div>
          </div>
          <span :class="getEstadoSaludBadge(animal.estado_salud)">
            {{ formatEstadoSalud(animal.estado_salud) }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 mb-3">
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-500">Etapa</p>
            <p class="text-sm font-medium text-gray-700">{{ formatEtapaVida(animal.etapa_vida) || 'Sin definir' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-500">Sexo</p>
            <p class="text-sm font-medium" :class="animal.sexo === 'macho' ? 'text-blue-600' : 'text-pink-600'">
              {{ animal.sexo?.charAt(0).toUpperCase() + animal.sexo?.slice(1) || 'N/A' }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span v-if="animal.requiere_atencion_sanitaria"
              class="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              <Icon name="heroicons:exclamation-circle" class="w-3 h-3" />
              Alerta
            </span>
            <span v-if="animal.potrero" class="text-xs text-gray-400">
              {{ animal.potrero.nombre }}
            </span>
          </div>
          <span class="flex items-center gap-1 text-xs text-blue-600 font-medium group-hover:gap-2 transition-all">
            Ver historial
            <Icon name="heroicons:arrow-right" class="w-3.5 h-3.5" />
          </span>
        </div>
      </NuxtLink>
    </div>

    <!-- Estado vacío -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <Icon name="heroicons:document-magnifying-glass" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 class="text-lg font-semibold text-gray-600 mb-2">
        {{ busqueda || filtroEstado || filtroEtapa ? 'No se encontraron animales' : 'No hay animales registrados' }}
      </h3>
      <p class="text-gray-400 text-sm">
        {{ busqueda || filtroEstado || filtroEtapa
          ? 'Intenta con otros términos de búsqueda o filtros'
          : 'Registra animales para ver su historial clínico aquí' }}
      </p>
      <button v-if="busqueda || filtroEstado || filtroEtapa"
        @click="limpiarFiltros"
        class="mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
        Limpiar filtros
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { user } = useAuth()
const { getAllFincas } = useFinca()
const { animales, loading, getAnimalesOfFinca } = useAnimal()

const busqueda = ref('')
const filtroEstado = ref('')
const filtroEtapa = ref('')

const loadAnimales = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  const { data: fincasData } = await getAllFincas(userId, user.value.rol)
  if (fincasData.value && fincasData.value.length > 0) {
    await getAnimalesOfFinca(fincasData.value[0].id)
  }
}

watch(user, loadAnimales, { immediate: true })

const animalesFiltrados = computed(() => {
  return animales.value.filter(animal => {
    const matchBusqueda = !busqueda.value ||
      animal.identificador_unico?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      animal.raza?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      animal.nombre?.toLowerCase().includes(busqueda.value.toLowerCase())
    const matchEstado = !filtroEstado.value || animal.estado_salud === filtroEstado.value
    const matchEtapa = !filtroEtapa.value || animal.etapa_vida === filtroEtapa.value
    return matchBusqueda && matchEstado && matchEtapa
  })
})

const animalesSanos = computed(() => animales.value.filter(a => a.estado_salud === 'sano').length)
const animalesEnfermos = computed(() => animales.value.filter(a =>
  a.estado_salud === 'diagnosticado_enfermo' || a.estado_salud === 'en_tratamiento'
).length)
const animalesSinControl = computed(() => animales.value.filter(a => a.requiere_atencion_sanitaria).length)

const limpiarFiltros = () => {
  busqueda.value = ''
  filtroEstado.value = ''
  filtroEtapa.value = ''
}

const getEstadoSaludBadge = (estado) => {
  const clases = {
    'sano': 'px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700',
    'diagnosticado_enfermo': 'px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700',
    'en_tratamiento': 'px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700'
  }
  return clases[estado] || 'px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700'
}

const formatEstadoSalud = (estado) => {
  const nombres = { 'sano': 'Sano', 'diagnosticado_enfermo': 'Enfermo', 'en_tratamiento': 'En Tratamiento' }
  return nombres[estado] || estado || 'N/A'
}

const formatEtapaVida = (etapa) => {
  const nombres = {
    'ternero': 'Ternero', 'ternera': 'Ternera', 'novillo': 'Novillo',
    'novilla': 'Novilla', 'adulto': 'Adulto', 'adulta': 'Adulta', 'adulto_mayor': 'Adulto Mayor'
  }
  return nombres[etapa] || etapa
}
</script>
