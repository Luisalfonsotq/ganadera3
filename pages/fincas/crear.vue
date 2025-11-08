<!-- pages/fincas/crear.vue -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-5xl">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/fincas" class="inline-flex items-center text-green-600 hover:text-green-700 mb-4 font-medium">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
        Volver a Fincas
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Crear Nueva Finca</h1>
      <p class="text-gray-600">Complete la información para registrar una nueva propiedad</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <Icon name="i-heroicons-home-modern" class="w-4 h-4 inline mr-1" />
            Nombre de la Finca *
          </label>
          <input 
            v-model="form.nombre" 
            required
            placeholder="Ej: Hacienda El Paraíso"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
        </div>
        
        <!-- Ubicación -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <Icon name="i-heroicons-map-pin" class="w-4 h-4 inline mr-1" />
            Ubicación
          </label>
          <input 
            v-model="form.ubicacion" 
            placeholder="Ej: Vereda El Bosque, Municipio de San Juan"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
        </div>

        <!-- Mapa -->
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            <Icon name="i-heroicons-map" class="w-4 h-4 inline mr-1" />
            Ubicación en el Mapa
          </label>
          
          <div id="map" class="w-full h-96 rounded-lg border-2 border-gray-300 shadow-inner mb-3"></div>
          
          <div class="flex items-start bg-white rounded-lg p-4 border border-gray-200">
            <Icon 
              :name="coordinates.lat ? 'i-heroicons-check-circle' : 'i-heroicons-information-circle'" 
              :class="coordinates.lat ? 'text-green-600' : 'text-blue-600'" 
              class="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div class="flex-1">
              <p v-if="!coordinates.lat" class="text-sm text-gray-700">
                Haz clic en el mapa para seleccionar la ubicación exacta de la finca
              </p>
              <div v-else>
                <p class="text-sm font-semibold text-green-700 mb-1">✓ Ubicación seleccionada</p>
                <p class="text-xs text-gray-600">
                  Latitud: {{ coordinates.lat.toFixed(6) }} | Longitud: {{ coordinates.lng.toFixed(6) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tamaño -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <Icon name="i-heroicons-chart-bar" class="w-4 h-4 inline mr-1" />
            Tamaño (Hectáreas)
          </label>
          <div class="relative">
            <input 
              v-model.number="form.tamano_ha" 
              type="number" 
              step="0.01"
              placeholder="0.00"
              class="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">ha</span>
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
            {{ submitting ? 'Creando...' : 'Crear Finca' }}
          </button>
          
          <NuxtLink 
            to="/fincas"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold">
            Cancelar
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

definePageMeta({layout: 'profile-layout'})

const { createFinca } = useFinca()
const { user } = useAuth()
const router = useRouter()

const form = ref({
  nombre: '',
  ubicacion: '',
  tamano_ha: null
})

const coordinates = ref({
  lat: null,
  lng: null
})

const submitting = ref(false)
let map = null
let marker = null

onMounted(() => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para crear fincas')
    router.push('/fincas')
    return
  }
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})

const initMap = () => {
  const defaultLat = 4.5709
  const defaultLng = -74.2973
  
  map = L.map('map').setView([defaultLat, defaultLng], 6)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)
  
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #16a34a; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  })
  
  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    coordinates.value = { lat, lng }
    
    if (marker) {
      map.removeLayer(marker)
    }
    
    marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
    marker.bindPopup(`
      <div class="text-center p-2">
        <strong class="text-green-700">Ubicación de la Finca</strong><br>
        <span class="text-sm text-gray-600">Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}</span>
      </div>
    `).openPopup()
  })
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        map.setView([latitude, longitude], 10)
      },
      (error) => {
        console.log('No se pudo obtener la ubicación:', error)
      }
    )
  }
}

const handleSubmit = async () => {
  if (!user.value) return
  
  submitting.value = true
  const userId = user.value.id || user.value.userId
  
  const fincaData = { 
    ...form.value, 
    propietario_id: userId
  }
  
  if (coordinates.value.lat && coordinates.value.lng) {
    fincaData.latitud = coordinates.value.lat
    fincaData.longitud = coordinates.value.lng
  }
  
  const { data, error } = await createFinca(fincaData)
  submitting.value = false
  
  if (data.value) {
    router.push('/fincas')
  } else {
    alert('Error al crear finca: ' + error.value.message)
  }
}
</script>

<style>
#map {
  position: relative;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}

.leaflet-popup-content {
  margin: 10px;
  font-size: 13px;
}
</style>