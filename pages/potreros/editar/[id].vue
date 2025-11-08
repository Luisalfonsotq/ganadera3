<!-- pages/potreros/editar/[id].vue
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Editar Potrero</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="form" class="bg-white p-6 rounded-lg shadow">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="form.nombre" required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tamaño (ha)</label>
          <input v-model.number="form.tamano_ha" type="number" step="0.01" required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Pasto</label>
          <input v-model="form.tipo_pasto"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <button type="submit" :disabled="submitting"
          class="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
          <Icon name="heroicons:check" class="w-5 h-5 mr-2" /> {{ submitting ? 'Guardando...' : 'Guardar' }}
        </button>
        <NuxtLink to="/potreros" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Cancelar
        </NuxtLink>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})
// import { ref, onMounted } from 'vue'
// import { usePotrero } from '~/composables/usePotrero'
// import { useAuth } from '~/composables/useAuth'
// import { useRoute, useRouter } from 'vue-router'

const { getPotreroById, updatePotrero } = usePotrero()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const form = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const submitting = ref(false)

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para editar potreros')
    router.push('/potreros')
    return
  }
  const id = route.params.id
  const { data, error } = await getPotreroById(id)
  loading.value = false
  if (data.value) {
    form.value = { ...data.value }
  } else if (error.value) {
    errorMsg.value = 'Error al cargar potrero: ' + error.value.message
  } else {
    errorMsg.value = 'Potrero no encontrado'
  }
})

const handleSubmit = async () => {
  submitting.value = true
  const { data, error } = await updatePotrero(form.value.id, form.value)
  submitting.value = false
  if (data) {
    router.push('/potreros')
  } else {
    alert('Error al actualizar potrero: ' + error.value.message)
  }
}
</script> -->

<!-- pages/potreros/editar/[id].vue -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-5xl">
    <!-- Header -->
    <div class="mb-8">
      <!-- <NuxtLink to="/potreros" class="inline-flex items-center text-green-600 hover:text-green-700 mb-4 font-medium">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
        Volver a Potreros
      </NuxtLink> -->
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Editar Potrero</h1>
      <p class="text-gray-600">Modifica la información del potrero</p>
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
    </div>

    <!-- Edit Form -->
    <div v-else-if="form" class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- ID Display (Read-only) -->
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div class="flex items-center">
            <Icon name="i-heroicons-identification" class="w-5 h-5 text-blue-600 mr-2" />
            <span class="text-sm font-medium text-blue-900">ID de Potrero: #{{ form.id }}</span>
          </div>
        </div>

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <Icon name="i-heroicons-square-3-stack-3d" class="w-4 h-4 inline mr-1" />
            Nombre del Potrero *
          </label>
          <input 
            v-model="form.nombre" 
            required
            placeholder="Nombre del potrero"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
        </div>
        
        <!-- Tamaño -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <Icon name="i-heroicons-chart-bar" class="w-4 h-4 inline mr-1" />
            Tamaño (Hectáreas) *
          </label>
          <div class="relative">
            <input 
              v-model.number="form.tamano_ha" 
              type="number" 
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              class="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">ha</span>
          </div>
        </div>

        <!-- Tipo de Pasto -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <Icon name="i-heroicons-sparkles" class="w-4 h-4 inline mr-1" />
            Tipo de Pasto
          </label>
          <input 
            v-model="form.tipo_pasto"
            placeholder="Ej: Brachiaria, Guinea, Kikuyo"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
        </div>

        <!-- Finca (Read-only) -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex items-start">
            <Icon name="i-heroicons-home-modern" class="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700 mb-1">Finca</p>
              <p class="text-sm text-gray-900">{{ form.finca?.nombre || 'No asignada' }}</p>
            </div>
          </div>
        </div>

        <!-- Coordenadas GPS (si están disponibles) -->
        <div v-if="form.latitud && form.longitud" class="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div class="flex items-start">
            <Icon name="i-heroicons-globe-alt" class="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-amber-900 mb-1">Coordenadas GPS registradas</p>
              <p class="text-xs text-amber-700">
                Lat: {{ Number(form.latitud).toFixed(6) }}, Lng: {{ Number(form.longitud).toFixed(6) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-6 border-t border-gray-200">
          <button 
            type="submit" 
            :disabled="submitting"
            class="flex-1 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon v-if="!submitting" name="heroicons:check-circle" class="w-5 h-5 mr-2" />
            <div v-else class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          
          <NuxtLink 
            to="/potreros"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold">
            Cancelar
          </NuxtLink>
        </div>

        <!-- Warning message -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
          <div class="flex items-start">
            <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-yellow-800 mb-1">Importante</p>
              <p class="text-xs text-yellow-700">
                Los cambios realizados se guardarán permanentemente. Asegúrate de verificar la información antes de guardar.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})

const { getPotreroById, updatePotrero } = usePotrero()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const form = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const submitting = ref(false)

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para editar potreros')
    router.push('/potreros')
    return
  }
  
  try {
    const id = route.params.id
    const { data, error } = await getPotreroById(id)
    loading.value = false
    
    if (data?.value) {
      form.value = { ...data.value }
    } else if (error?.value) {
      errorMsg.value = 'Error al cargar potrero: ' + error.value.message
    } else {
      errorMsg.value = 'Potrero no encontrado'
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = 'Error al cargar el potrero: ' + err.message
  }
})

const handleSubmit = async () => {
  try {
    submitting.value = true
    const { data, error } = await updatePotrero(form.value.id, form.value)
    submitting.value = false
    
    if (data) {
      router.push('/potreros')
    } else {
      alert('Error al actualizar potrero: ' + (error?.value?.message || 'Error desconocido'))
    }
  } catch (err) {
    submitting.value = false
    alert('Error al actualizar potrero: ' + err.message)
  }
}
</script>