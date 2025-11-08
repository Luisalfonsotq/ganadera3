<!-- pages/fincas/index.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Mis Fincas</h1>
          <p class="text-gray-600">Administra y monitorea tus propiedades ganaderas</p>
        </div>
        <NuxtLink 
          v-if="user.value?.rol === 'Administrador'" 
          to="/fincas/crear" 
          class="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
          <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" /> 
          Nueva Finca
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-700 text-sm font-medium mb-1">Total Fincas</p>
            <p class="text-3xl font-bold text-green-800">{{ fincas.length }}</p>
          </div>
          <div class="bg-green-200 rounded-full p-3">
            <Icon name="i-heroicons-home-modern" class="w-8 h-8 text-green-700" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-700 text-sm font-medium mb-1">Hectáreas Totales</p>
            <p class="text-3xl font-bold text-blue-800">{{ totalHectareas.toFixed(1) }}</p>
          </div>
          <div class="bg-blue-200 rounded-full p-3">
            <Icon name="i-heroicons-map" class="w-8 h-8 text-blue-700" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-amber-700 text-sm font-medium mb-1">Promedio por Finca</p>
            <p class="text-3xl font-bold text-amber-800">{{ promedioHectareas.toFixed(1) }} ha</p>
          </div>
          <div class="bg-amber-200 rounded-full p-3">
            <Icon name="i-heroicons-chart-bar" class="w-8 h-8 text-amber-700" />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mb-4"></div>
      <p class="text-gray-600 font-medium">Cargando fincas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500 mr-3" />
        <div>
          <h3 class="text-red-800 font-semibold">Error al cargar</h3>
          <p class="text-red-700 text-sm mt-1">{{ errorMsg }}</p>
        </div>
      </div>
    </div>

    <!-- Fincas Grid -->
    <div v-else-if="fincas.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="finca in fincas" 
        :key="finca.id" 
        class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group">
        
        <!-- Header Image/Icon -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 h-32 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <Icon name="i-heroicons-home-modern" class="w-16 h-16 text-white opacity-80" />
        </div>

        <!-- Content -->
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-1">{{ finca.nombre }}</h3>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-start text-sm text-gray-600">
              <Icon name="i-heroicons-map-pin" class="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
              <span class="line-clamp-2">{{ finca.ubicacion || 'Sin ubicación' }}</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
              <Icon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2 text-blue-600" />
              <span class="font-semibold">{{ finca.tamano_ha || 'N/A' }} hectáreas</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
              <Icon name="i-heroicons-user" class="w-5 h-5 mr-2 text-purple-600" />
              <span>{{ finca.propietario?.nombre || 'Sin propietario' }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-4 border-t border-gray-100">
            <NuxtLink 
              :to="`/fincas/${finca.id}`" 
              class="flex-1 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
              <Icon name="i-heroicons-eye" class="w-4 h-4 mr-1" />
              Ver
            </NuxtLink>
            
            <NuxtLink 
              :to="`/fincas/editar/${finca.id}`" 
              class="flex-1 flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
              <Icon name="i-heroicons-pencil" class="w-4 h-4 mr-1" />
              Editar
            </NuxtLink>
            
            <button 
              @click="handleDelete(finca.id)" 
              class="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200">
              <Icon name="i-heroicons-trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl shadow-md p-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Icon name="i-heroicons-home-modern" class="w-12 h-12 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">No hay fincas registradas</h3>
        <p class="text-gray-600 mb-6">Comienza agregando tu primera finca para gestionar tu operación ganadera</p>
        <NuxtLink 
          v-if="user.value?.rol === 'Administrador'" 
          to="/fincas/crear" 
          class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
          <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" /> 
          Crear Primera Finca
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})

const { user } = useAuth()
const { getAllFincas, deleteFinca } = useFinca()
const fincas = ref([])
const loading = ref(false)
const errorMsg = ref('')

const totalHectareas = computed(() => {
  return fincas.value.reduce((sum, finca) => sum + (parseFloat(finca.tamano_ha) || 0), 0)
})

const promedioHectareas = computed(() => {
  return fincas.length > 0 ? totalHectareas.value / fincas.value.length : 0
})

const loadFincas = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  
  loading.value = true
  errorMsg.value = ''
  
  const { data, error } = await getAllFincas(userId, user.value.rol)
  loading.value = false
  
  if (data.value) {
    fincas.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar fincas: ' + error.value.message
  }
}

watch(user, loadFincas, { immediate: true })

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta finca? Esta acción no se puede deshacer.')) {
    const { error } = await deleteFinca(id)
    if (!error.value) {
      fincas.value = fincas.value.filter(f => f.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>