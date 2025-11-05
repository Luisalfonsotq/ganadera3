<!-- pages/fincas/crear.vue
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Crear Finca</h1>
    <div class="bg-white p-6 rounded-lg shadow">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="form.nombre" required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ubicación</label>
          <input v-model="form.ubicacion"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tamaño (ha)</label>
          <input v-model.number="form.tamano_ha" type="number" step="0.01"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <button type="submit" :disabled="submitting"
          class="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
          <Icon name="heroicons:plus-circle" class="w-5 h-5 mr-2" /> {{ submitting ? 'Creando...' : 'Crear' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})
const { createFinca } = useFinca()
const { user } = useAuth()
const router = useRouter()
const form = ref({
  nombre: '',
  ubicacion: '',
  tamano_ha: null
})
const submitting = ref(false)

onMounted(() => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para crear fincas')
    router.push('/fincas')
  }
})

const handleSubmit = async () => {
  if (!user.value) return
  submitting.value = true
  const userId = user.value.id || user.value.userId
  const fincaData = { ...form.value, propietario_id: userId }
  const { data, error } = await createFinca(fincaData)
  submitting.value = false
  if (data.value) {
    router.push('/fincas')
  } else {
    alert('Error al crear finca: ' + error.value.message)
  }
}
</script> -->

<!-- pages/fincas/crear.vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Crear Finca</h1>
    <div class="bg-white p-6 rounded-lg shadow">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="form.nombre" required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
          <div class="space-y-2">
            <!-- Input de texto para ubicación -->
            <input v-model="form.ubicacion" placeholder="Ej: Vereda El Bosque, Municipio..."
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border" />
            
            <!-- Mapa -->
            <div class="relative">
              <div id="map" class="w-full h-96 rounded-md border border-gray-300 z-0"></div>
              <div class="mt-2 text-xs text-gray-500">
                <p v-if="!coordinates.lat && !coordinates.lng">
                  📍 Haz clic en el mapa para seleccionar la ubicación de la finca
                </p>
                <p v-else class="text-green-600 font-medium">
                  ✓ Ubicación seleccionada: {{ coordinates.lat.toFixed(6) }}, {{ coordinates.lng.toFixed(6) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tamaño (ha)</label>
          <input v-model.number="form.tamano_ha" type="number" step="0.01"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border" />
        </div>

        <button type="submit" :disabled="submitting"
          class="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
          <Icon name="heroicons:plus-circle" class="w-5 h-5 mr-2" /> 
          {{ submitting ? 'Creando...' : 'Crear' }}
        </button>
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
  // Coordenadas iniciales (Colombia - centro aproximado)
  const defaultLat = 4.5709
  const defaultLng = -74.2973
  
  // Crear el mapa
  map = L.map('map').setView([defaultLat, defaultLng], 6)
  
  // Añadir capa de tiles (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)
  
  // Crear icono personalizado para el marcador
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #22c55e; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  })
  
  // Evento de clic en el mapa
  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    
    // Actualizar coordenadas
    coordinates.value = { lat, lng }
    
    // Remover marcador anterior si existe
    if (marker) {
      map.removeLayer(marker)
    }
    
    // Añadir nuevo marcador
    marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
    marker.bindPopup(`
      <div class="text-center">
        <strong>Ubicación de la Finca</strong><br>
        Lat: ${lat.toFixed(6)}<br>
        Lng: ${lng.toFixed(6)}
      </div>
    `).openPopup()
  })
  
  // Intentar obtener ubicación del usuario
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
  
  // Preparar datos de la finca
  const fincaData = { 
    ...form.value, 
    propietario_id: userId
  }
  
  // Agregar coordenadas si fueron seleccionadas
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
/* Estilos adicionales para el mapa */
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