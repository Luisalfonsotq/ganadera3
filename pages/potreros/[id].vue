<!-- pages/potreros/[id].vue
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles de Potrero</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="potrero" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ potrero.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <p class="mt-1 text-gray-900">{{ potrero.nombre }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Finca</label>
          <p class="mt-1 text-gray-900">{{ potrero.finca?.nombre || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tamaño (ha)</label>
          <p class="mt-1 text-gray-900">{{ potrero.tamano_ha || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Pasto</label>
          <p class="mt-1 text-gray-900">{{ potrero.tipo_pasto || 'N/A' }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/potreros/editar/${potrero.id}`" class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/potreros" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
      <div v-if="potrero.animales && potrero.animales.length" class="mt-8 pt-4 border-t border-gray-200">
        <h3 class="text-xl font-semibold mb-4">Animales en este Potrero ({{ potrero.animales.length }})</h3>
        <ul class="list-disc pl-5">
          <li v-for="animal in potrero.animales" :key="animal.id" class="text-gray-700">
            ID: {{ animal.id }} - Nombre/Identificador: {{ animal.identificador || animal.nombre }}
          </li>
        </ul>
      </div>
      <p v-else class="mt-8 text-gray-500">Este potrero no tiene animales asignados.</p>
    </div>
    <div v-else class="text-gray-500">Potrero no encontrado.</div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})
// import { ref, onMounted } from 'vue'
// import { usePotrero } from '~/composables/usePotrero'
// import { useAuth } from '~/composables/useAuth'
// import { useRoute, useRouter } from 'vue-router'

const { getPotreroById, deletePotrero } = usePotrero()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const potrero = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getPotreroById(id)
  loading.value = false
  if (data.value) {
    potrero.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar potrero: ' + error.value.message
  } else {
    errorMsg.value = 'Potrero no encontrado'
  }
})

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este potrero?')) {
    const { error } = await deletePotrero(potrero.value.id)
    if (!error.value) {
      router.push('/potreros')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script> -->

<!-- pages/potreros/[id].vue -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-5xl">
    <!-- Header -->
    <div class="mb-8">
      <!-- <NuxtLink to="/potreros" class="inline-flex items-center text-green-600 hover:text-green-700 mb-4 font-medium">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
        Volver a Potreros
      </NuxtLink> -->
      <h1 class="text-3xl font-bold text-gray-800">Detalles de Potrero</h1>
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
          to="/potreros" 
          class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
          <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" /> 
          Volver a Potreros
        </NuxtLink>
      </div>
    </div>

    <!-- Potrero Details -->
    <div v-else-if="potrero" class="space-y-6">
      <!-- Main Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <!-- Header with gradient -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
          <h2 class="text-2xl font-bold text-white">{{ potrero.nombre }}</h2>
          <p class="text-green-100 text-sm mt-1">ID: #{{ potrero.id }}</p>
        </div>

        <!-- Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Finca -->
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div class="flex items-start">
                <div class="bg-blue-100 rounded-lg p-2 mr-3">
                  <Icon name="i-heroicons-home-modern" class="w-6 h-6 text-blue-600" />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Finca</label>
                  <p class="text-gray-900">{{ potrero.finca?.nombre || 'No asignada' }}</p>
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
                    {{ potrero.tamano_ha || 'N/A' }} 
                    <span class="text-base font-normal text-gray-600">hectáreas</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Tipo de Pasto -->
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div class="flex items-start">
                <div class="bg-purple-100 rounded-lg p-2 mr-3">
                  <Icon name="i-heroicons-sparkles" class="w-6 h-6 text-purple-600" />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Tipo de Pasto</label>
                  <p class="text-gray-900">{{ potrero.tipo_pasto || 'No especificado' }}</p>
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
                  <p v-if="potrero.latitud && potrero.longitud" class="text-gray-900 text-sm">
                    {{ parseFloat(potrero.latitud).toFixed(6) }}, {{ parseFloat(potrero.longitud).toFixed(6) }}
                  </p>
                  <p v-else class="text-gray-500 text-sm">No disponibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Animales Section -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4">
          <h3 class="text-lg font-bold text-white flex items-center">
            <Icon name="i-heroicons-user-group" class="w-5 h-5 mr-2" />
            Animales en este Potrero ({{ potrero.animales?.length || 0 }})
          </h3>
        </div>
        
        <div class="p-8">
          <div v-if="potrero.animales && potrero.animales.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="animal in potrero.animales" 
              :key="animal.id"
              class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center">
                <div class="bg-blue-100 rounded-full p-2 mr-3">
                  <Icon name="i-heroicons-identification" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700">ID: {{ animal.id }}</p>
                  <p class="text-gray-900">{{ animal.identificador || animal.nombre }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <Icon name="i-heroicons-inbox" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">Este potrero no tiene animales asignados</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <!-- <div class="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Acciones</h3>
        <div class="flex flex-wrap gap-3">
          <NuxtLink 
            v-if="user.value?.rol === 'Administrador'" 
            :to="`/potreros/editar/${potrero.id}`" 
            class="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
            <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> 
            Editar Información
          </NuxtLink>
          
          <button 
            v-if="user.value?.rol === 'Administrador'" 
            @click="handleDelete" 
            class="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
            <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> 
            Eliminar Potrero
          </button> -->
          
          <!-- <NuxtLink 
            to="/potreros" 
            class="inline-flex items-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg transition-all duration-200 font-medium">
            <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> 
            Volver al Listado
          </NuxtLink> -->
        <!-- </div> -->
      <!-- </div> -->
    </div>

    <!-- Not Found State -->
    <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
      <div class="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Icon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Potrero no encontrado</h3>
      <p class="text-gray-600 mb-6">El potrero que buscas no existe o fue eliminado</p>
      <NuxtLink 
        to="/potreros" 
        class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> 
        Volver a Potreros
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})

const { getPotreroById, deletePotrero } = usePotrero()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const potrero = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const id = route.params.id
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Tiempo de espera agotado')), 10000)
    )
    
    const fetchPromise = getPotreroById(id)
    
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise])
    
    loading.value = false
    
    if (data?.value) {
      potrero.value = data.value
    } else if (error?.value) {
      errorMsg.value = 'Error al cargar potrero: ' + error.value.message
    } else {
      errorMsg.value = 'Potrero no encontrado'
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = err.message || 'Error al cargar el potrero'
  }
})

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este potrero? Esta acción no se puede deshacer.')) {
    try {
      const { error } = await deletePotrero(potrero.value.id)
      if (!error.value) {
        router.push('/potreros')
      } else {
        alert('Error al eliminar: ' + error.value.message)
      }
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }
}
</script>