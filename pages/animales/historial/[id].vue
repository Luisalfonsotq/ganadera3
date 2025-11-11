<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
      <p class="text-gray-600 mt-4">Cargando historial...</p>
    </div>

    <div v-else-if="historial">
      <!-- Header del Animal -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <NuxtLink to="/animales" class="text-gray-400 hover:text-gray-600">
                <Icon name="heroicons:arrow-left" class="w-6 h-6" />
              </NuxtLink>
              <h1 class="text-3xl font-bold text-gray-800">{{ historial.animal.identificador_unico }}</h1>
            </div>
            <p class="text-gray-600 mt-1">Raza: {{ historial.animal.raza || 'N/A' }}</p>
            <div class="flex gap-2 mt-3">
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                {{ historial.animal.sexo }}
              </span>
              <span :class="getEstadoSaludClasses(historial.animal.estado_salud)">
                {{ formatEstado(historial.animal.estado_salud) }}
              </span>
              <span v-if="historial.animal.etapa_vida" class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {{ formatEtapa(historial.animal.etapa_vida) }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Total Controles</p>
            <p class="text-4xl font-bold text-green-600">{{ historial.total_controles }}</p>
            <NuxtLink 
              :to="`/controles-sanitarios/crear?animal_id=${historial.animal.id}`"
              class="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              <Icon name="heroicons:plus" class="w-4 h-4" />
              Nuevo Control
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Estadísticas Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p class="text-sm text-gray-600">Último Control</p>
          <p class="text-lg font-bold text-gray-800">{{ formatDate(historial.ultimo_control?.fecha) }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ historial.ultimo_control?.tipo_control?.nombre || 'N/A' }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p class="text-sm text-gray-600">Tipo Más Frecuente</p>
          <p class="text-lg font-bold text-gray-800">{{ getTipoMasFrecuente() }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ getCantidadTipoMasFrecuente() }} registros</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p class="text-sm text-gray-600">Costo Total</p>
          <p class="text-lg font-bold text-green-600">${{ formatNumber(historial.costo_total) }}</p>
          <p class="text-xs text-gray-500 mt-1">Inversión sanitaria</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <p class="text-sm text-gray-600">Peso Actual</p>
          <p class="text-lg font-bold text-gray-800">{{ historial.animal.peso_kg || 'N/A' }} kg</p>
          <p class="text-xs text-gray-500 mt-1">Última medición</p>
        </div>
      </div>

      <!-- Gráfico de Controles por Tipo -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="heroicons:chart-bar" class="w-6 h-6 text-green-600" />
          Distribución de Controles
        </h2>
        <div v-if="historial.controles_por_tipo?.length" class="space-y-3">
          <div v-for="tipo in historial.controles_por_tipo" :key="tipo.nombre" class="flex items-center">
            <span class="w-40 text-sm text-gray-700 font-medium">{{ tipo.nombre }}</span>
            <div class="flex-1 bg-gray-200 rounded-full h-8 ml-4 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-green-400 to-green-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                :style="`width: ${(tipo.cantidad / historial.total_controles) * 100}%`"
              >
                <span class="text-xs text-white font-bold">{{ tipo.cantidad }}</span>
              </div>
            </div>
            <span class="ml-4 text-sm text-gray-600 w-16 text-right">
              {{ Math.round((tipo.cantidad / historial.total_controles) * 100) }}%
            </span>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          No hay datos suficientes para mostrar estadísticas
        </div>
      </div>

      <!-- Timeline de Controles -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Icon name="heroicons:clock" class="w-6 h-6 text-blue-600" />
            Historial Completo
          </h2>
          <div class="flex gap-2">
            <button 
              @click="ordenInvertido = !ordenInvertido"
              class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Icon :name="ordenInvertido ? 'heroicons:arrow-up' : 'heroicons:arrow-down'" class="w-4 h-4" />
              {{ ordenInvertido ? 'Más antiguos' : 'Más recientes' }}
            </button>
          </div>
        </div>

        <div v-if="historialOrdenado.length === 0" class="text-center py-12 text-gray-500">
          No hay controles registrados para este animal
        </div>

        <div v-else class="relative">
          <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          <div class="space-y-6">
            <div 
              v-for="(control, index) in historialOrdenado" 
              :key="control.id" 
              class="relative pl-16"
            >
              <div 
                :class="[
                  'absolute left-6 w-5 h-5 rounded-full border-4 border-white',
                  index === 0 ? 'bg-green-500' : 'bg-gray-400'
                ]"
              ></div>
              <div 
                class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-500 hover:shadow-md transition cursor-pointer"
                @click="navegarAControl(control.id)"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-bold text-gray-800 text-lg">{{ control.tipo_control.nombre }}</h3>
                    <p class="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Icon name="heroicons:calendar" class="w-4 h-4" />
                      {{ formatDate(control.fecha) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Icon name="heroicons:user" class="w-4 h-4" />
                      {{ control.veterinario?.nombre || 'Sin veterinario' }}
                    </span>
                    <span v-if="control.costo" class="text-sm font-bold text-green-600 mt-1 block">
                      ${{ formatNumber(control.costo) }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 text-sm mt-3 bg-white rounded p-3">
                  <div v-if="control.medicamento" class="flex items-start gap-2">
                    <Icon name="heroicons:beaker" class="w-4 h-4 text-purple-500 mt-0.5" />
                    <div>
                      <span class="text-gray-600 block text-xs">Medicamento:</span>
                      <span class="font-medium text-gray-800">{{ control.medicamento }}</span>
                    </div>
                  </div>
                  <div v-if="control.dosis" class="flex items-start gap-2">
                    <Icon name="heroicons:calculator" class="w-4 h-4 text-blue-500 mt-0.5" />
                    <div>
                      <span class="text-gray-600 block text-xs">Dosis:</span>
                      <span class="font-medium text-gray-800">{{ control.dosis }}</span>
                    </div>
                  </div>
                  <div v-if="control.via_aplicacion" class="flex items-start gap-2">
                    <Icon name="heroicons:arrow-path" class="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <span class="text-gray-600 block text-xs">Vía:</span>
                      <span class="font-medium text-gray-800">{{ control.via_aplicacion }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="control.observaciones" class="mt-3 text-sm text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <p class="font-medium text-blue-900 mb-1 flex items-center gap-2">
                    <Icon name="heroicons:document-text" class="w-4 h-4" />
                    Observaciones:
                  </p>
                  <p>{{ control.observaciones }}</p>
                </div>

                <div class="mt-3 flex justify-end">
                  <span class="text-xs text-gray-500 flex items-center gap-1">
                    <Icon name="heroicons:arrow-right" class="w-3 h-3" />
                    Ver detalles completos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="mt-6 flex gap-3">
        <NuxtLink 
          to="/animales"
          class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          Volver a Animales
        </NuxtLink>
        <NuxtLink 
          :to="`/animales/${historial.animal.id}`"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
        >
          <Icon name="heroicons:eye" class="w-5 h-5" />
          Ver Perfil del Animal
        </NuxtLink>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 text-lg">No se encontró el historial del animal</p>
      <NuxtLink to="/animales" class="mt-4 inline-block text-green-600 hover:text-green-700">
        Volver a la lista de animales
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getHistorialAnimal } = useControlSanitario()
const route = useRoute()
const router = useRouter()

const historial = ref(null)
const loading = ref(true)
const ordenInvertido = ref(false)

const historialOrdenado = computed(() => {
  if (!historial.value?.historial) return []
  const sorted = [...historial.value.historial]
  return ordenInvertido.value ? sorted.reverse() : sorted
})

onMounted(async () => {
  const { data } = await getHistorialAnimal(route.params.id)
  if (data.value) {
    historial.value = data.value
  }
  loading.value = false
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
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

const formatEtapa = (etapa) => {
  const etapas = {
    'ternero': 'Ternero',
    'ternera': 'Ternera',
    'novillo': 'Novillo',
    'novilla': 'Novilla',
    'adulto': 'Adulto',
    'adulta': 'Adulta',
    'adulto_mayor': 'Adulto Mayor'
  }
  return etapas[etapa] || etapa
}

const getEstadoSaludClases = (estado) => {
  const estados = {
    'sano': 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium',
    'diagnosticado_enfermo': 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium',
    'en_tratamiento': 'px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium'
  }
  return estados[estado] || 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'
}

const getTipoMasFrecuente = () => {
  if (!historial.value?.controles_por_tipo?.length) return 'N/A'
  const max = historial.value.controles_por_tipo.reduce((prev, current) => 
    current.cantidad > prev.cantidad ? current : prev
  )
  return max.nombre
}

const getCantidadTipoMasFrecuente = () => {
  if (!historial.value?.controles_por_tipo?.length) return 0
  const max = historial.value.controles_por_tipo.reduce((prev, current) => 
    current.cantidad > prev.cantidad ? current : prev
  )
  return max.cantidad
}

const navegarAControl = (id) => {
  router.push(`/controles-sanitarios/${id}`)
}
</script>