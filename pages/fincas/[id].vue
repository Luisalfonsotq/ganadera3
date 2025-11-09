<!-- pages/fincas/[id].vue -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/fincas" class="inline-flex items-center text-green-600 hover:text-green-700 mb-4 font-medium">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
        Volver a Fincas
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-800">Detalles de Finca</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-lg p-12 text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
      <p class="text-gray-600 font-medium">Cargando información...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
      <div class="flex items-center">
        <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500 mr-3" />
        <div>
          <h3 class="text-red-800 font-semibold">Error al cargar</h3>
          <p class="text-red-700 text-sm mt-1">{{ errorMsg }}</p>
        </div>
      </div>
      <div class="mt-4">
        <NuxtLink 
          to="/fincas" 
          class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
          <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" /> 
          Volver a Fincas
        </NuxtLink>
      </div>
    </div>

    <!-- Finca Details -->
    <div v-else-if="finca" class="space-y-6">
      <!-- Main Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <!-- Header with gradient -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
          <h2 class="text-2xl font-bold text-white">{{ finca.nombre }}</h2>
          <p class="text-green-100 text-sm mt-1">ID: #{{ finca.id }}</p>
        </div>

        <!-- Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Ubicación -->
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div class="flex items-start">
                <div class="bg-blue-100 rounded-lg p-2 mr-3">
                  <Icon name="i-heroicons-map-pin" class="w-6 h-6 text-blue-600" />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                  <p class="text-gray-900">{{ finca.ubicacion || 'No especificada' }}</p>
                </div>
              </div>
            </div>

            <!-- Tamaño -->
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div class="flex items-start">
                <div class="bg-green-100 rounded-lg p-2 mr-3">
                  <Icon name="i-heroicons-chart-bar" class="w-6 h-6 text-green-600" />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Tamaño</label>
                  <p class="text-gray-900 text-2xl font-bold">
                    {{ finca.tamano_ha || 'N/A' }} 
                    <span class="text-base font-normal text-gray-600">hectáreas</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Propietario -->
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div class="flex items-start">
                <div class="bg-purple-100 rounded-lg p-2 mr-3">
                  <Icon name="i-heroicons-user" class="w-6 h-6 text-purple-600" />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Propietario</label>
                  <p class="text-gray-900">{{ finca.propietario?.nombre || 'No asignado' }}</p>
                </div>
              </div>
            </div>

            <!-- Coordenadas -->
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div class="flex items-start">
                <div class="bg-amber-100 rounded-lg p-2 mr-3">
                  <Icon name="i-heroicons-globe-alt" class="w-6 h-6 text-amber-600" />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Coordenadas GPS</label>
                  <p v-if="finca.latitud && finca.longitud" class="text-gray-900 text-sm">
                    {{ parseFloat(finca.latitud).toFixed(6) }}, {{ parseFloat(finca.longitud).toFixed(6) }}
                  </p>
                  <p v-else class="text-gray-500 text-sm">No disponibles</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Buttons -->
          <div class="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
            <!-- ✅ NUEVO: Botón Invitar -->
            <NuxtLink 
              v-if="user?.rol === 'Administrador'" 
              :to="`/fincas/${finca.id}-invitar`" 
              class="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
              <Icon name="heroicons:user-plus" class="w-5 h-5 mr-2" /> 
              Invitar Colaborador
            </NuxtLink>

            <NuxtLink 
              v-if="user?.rol === 'Administrador'" 
              :to="`/fincas/editar/${finca.id}`" 
              class="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
              <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> 
              Editar Información
            </NuxtLink>
            
            <button 
              v-if="user?.rol === 'Administrador'" 
              @click="handleDelete" 
              class="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
              <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> 
              Eliminar Finca
            </button>
          </div>
        </div>
      </div>

      <!-- Potreros Section -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-white">Potreros de esta Finca</h2>
            <p class="text-blue-100 text-sm mt-1">Total: {{ potreros.length }} potreros</p>
          </div>
          <NuxtLink 
            to="/potreros/crear"
            class="inline-flex items-center bg-white hover:bg-blue-50 text-blue-600 px-4 py-2 rounded-lg shadow-md transition-all duration-200 font-medium">
            <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" /> 
            Nuevo Potrero
          </NuxtLink>
        </div>

        <!-- Loading Potreros -->
        <div v-if="loadingPotreros" class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando potreros...</p>
        </div>

        <!-- Error Loading Potreros -->
        <div v-else-if="errorPotreros" class="p-8">
          <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <p class="text-red-700 text-sm">{{ errorPotreros }}</p>
          </div>
        </div>

        <!-- Empty Potreros -->
        <div v-else-if="potreros.length === 0" class="p-12 text-center">
          <div class="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Icon name="i-heroicons-squares-plus" class="w-10 h-10 text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">No hay potreros asignados</h3>
          <p class="text-gray-600 mb-4">Esta finca aún no tiene potreros registrados</p>
          <NuxtLink 
            to="/potreros/crear"
            class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
            <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" /> 
            Crear Primer Potrero
          </NuxtLink>
        </div>

        <!-- Potreros Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño (ha)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Pasto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="potrero in potreros" :key="potrero.id" class="hover:bg-gray-50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ potrero.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ potrero.nombre }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ potrero.tamano_ha }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ potrero.tipo_pasto || 'Sin especificar' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <NuxtLink 
                    :to="`/potreros/${potrero.id}`" 
                    class="text-blue-600 hover:text-blue-900 transition-colors">
                    <Icon name="i-heroicons-eye" class="w-5 h-5" />
                  </NuxtLink>
                  <NuxtLink 
                    :to="`/potreros/editar/${potrero.id}`" 
                    class="text-yellow-600 hover:text-yellow-900 transition-colors">
                    <Icon name="i-heroicons-pencil" class="w-5 h-5" />
                  </NuxtLink>
                  <button 
                    @click="handleDeletePotrero(potrero.id)" 
                    class="text-red-600 hover:text-red-900 transition-colors">
                    <Icon name="i-heroicons-trash" class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
      <div class="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Icon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Finca no encontrada</h3>
      <p class="text-gray-600 mb-6">La finca que buscas no existe o fue eliminada</p>
      <NuxtLink 
        to="/fincas" 
        class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> 
        Volver a Fincas
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})

const { getFincasById, deleteFinca } = useFinca()
const { getPotrerosOfFinca, deletePotrero } = usePotrero()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()

const finca = ref(null)
const loading = ref(true)
const errorMsg = ref('')

const potreros = ref([])
const loadingPotreros = ref(false)
const errorPotreros = ref('')

onMounted(async () => {
  try {
    const id = route.params.id
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Tiempo de espera agotado')), 10000)
    )
    
    const fetchPromise = getFincasById(id)
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise])
    
    loading.value = false
    
    if (data?.value) {
      finca.value = data.value
      await loadPotreros(id)
    } else if (error?.value) {
      errorMsg.value = 'Error al cargar finca: ' + error.value.message
    } else {
      errorMsg.value = 'Finca no encontrada'
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = err.message || 'Error al cargar la finca'
    console.error('Error loading finca:', err)
  }
})

const loadPotreros = async (fincaId) => {
  loadingPotreros.value = true
  errorPotreros.value = ''
  
  try {
    const { data, error } = await getPotrerosOfFinca(fincaId)
    
    if (error?.value) {
      errorPotreros.value = 'Error al cargar potreros: ' + error.value.message
    } else if (data?.value) {
      potreros.value = Array.isArray(data.value) ? data.value : []
    }
  } catch (err) {
    errorPotreros.value = 'Error al cargar potreros'
    console.error('Error loading potreros:', err)
  } finally {
    loadingPotreros.value = false
  }
}

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar esta finca? Esta acción no se puede deshacer.')) {
    try {
      const { error } = await deleteFinca(finca.value.id)
      if (!error.value) {
        router.push('/fincas')
      } else {
        alert('Error al eliminar: ' + error.value.message)
      }
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }
}

const handleDeletePotrero = async (id) => {
  if (confirm('¿Estás seguro de eliminar este potrero?')) {
    try {
      const { error } = await deletePotrero(id)
      if (!error.value) {
        potreros.value = potreros.value.filter(p => p.id !== id)
      } else {
        alert('Error al eliminar potrero: ' + error.value.message)
      }
    } catch (err) {
      alert('Error al eliminar potrero: ' + err.message)
    }
  }
}
</script>