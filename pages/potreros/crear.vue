<!-- pages/potreros/crearPotrero.vue
<template>
  <div class="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Potrero</h2>
    
    <form @submit.prevent="handleCrearPotrero" class="space-y-4">
      
      <div>
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del Potrero</label>
        <input type="text" id="nombre" v-model="form.nombre" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
               required>
      </div>

      <div>
        <label for="tamano" class="block text-sm font-medium text-gray-700">Tamaño (Hectáreas)</label>
        <input type="number" id="tamano" v-model.number="form.tamano_ha" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
               min="0" step="0.01" required>
      </div>

      <div>
        <label for="tipo_pasto" class="block text-sm font-medium text-gray-700">Tipo de Pasto (Opcional)</label>
        <input type="text" id="tipo_pasto" v-model="form.tipo_pasto" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
      </div>

      <div>
        <label for="finca" class="block text-sm font-medium text-gray-700">Finca</label>
        <select id="finca" v-model.number="form.finca_id"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
                required :disabled="loadingFincas || fincas.length === 0">
          <option disabled :value="null">Selecciona una finca</option>
          <option v-for="finca in fincas" :key="finca.id" :value="finca.id">{{ finca.nombre }}</option>
        </select>
        <p v-if="loadingFincas" class="text-xs text-blue-500 mt-1">Cargando fincas...</p>
        <p v-else-if="errorMsg" class="text-xs text-red-500 mt-1">{{ errorMsg }}</p>
        <p v-else-if="fincas.length === 0" class="text-xs text-gray-500 mt-1">No hay fincas disponibles.</p>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting || fincas.length === 0"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : fincas.length === 0 ? 'No hay fincas disponibles' : 'Crear Potrero' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="potreroError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ potreroError }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })
import { ref, onMounted, watch } from 'vue';
import { usePotrero } from '~/composables/usePotrero';
import { useFinca } from '~/composables/useFinca';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';

const { createPotrero } = usePotrero();
const { getAllFincas } = useFinca();
const { user} = useAuth();
const router = useRouter();

// Define el estado del formulario con los campos que espera tu CreatePotreroDto
const form = ref({
  nombre: '',
  tamano_ha: null,
  tipo_pasto: '',
  finca_id: null, // Campo requerido para la FK
});

// Variables de estado
const fincas = ref([]);
const loading = ref(false);
const errorMsg = ref('');
const isSubmitting = ref(false);
const success = ref(null);
// const errorFincas = ref(null);
const potreroError = ref(null);

// FUNCIÓN PARA CARGAR FINCAS (SELECT)
const loadFincas = async () => {
  console.log('loadFincas called, user:', user.value)
  const userId = user.value?.id || user.value?.userId
  if (!userId) {
    console.log('No user id or userId, skipping load')
    return
  }
  loading.value = true
  errorMsg.value = ''
  console.log('Loading fincas for user id:', userId, 'rol:', user.value.rol)
  const { data, error } = await getAllFincas(userId, user.value.rol)
  loading.value = false
  console.log('data:', data, 'error:', error)
  console.log('Fincas loaded:', data.value, 'error:', error.value)
  if (data.value) {
    fincas.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar fincas: ' + error.value.message
  }
}

watch(user, loadFincas, { immediate: true })

onMounted(loadFincas)

// FUNCIÓN PARA CREAR POTRERO (POST)
const handleCrearPotrero = async () => {
  console.log('handleCrearPotrero called');
  console.log('form.value:', form.value);
  potreroError.value = null;
  success.value = null;
  isSubmitting.value = true;

  try {
    // Validación básica de que se seleccionó una finca
    if (!form.value.finca_id) {
      throw new Error('Debes seleccionar la Finca a la que pertenece el potrero.');
    }
    if (!form.value.nombre.trim()) {
      throw new Error('Debes ingresar el nombre del potrero.');
    }
    if (!form.value.tamano_ha || form.value.tamano_ha <= 0) {
      throw new Error('Debes ingresar un tamaño válido mayor a 0.');
    }

    // Preparar datos a enviar, excluyendo campos vacíos opcionales
    const dataToSend = {
      nombre: form.value.nombre,
      tamano_ha: form.value.tamano_ha,
      finca_id: form.value.finca_id,
    };
    if (form.value.tipo_pasto && form.value.tipo_pasto.trim()) {
      dataToSend.tipo_pasto = form.value.tipo_pasto.trim();
    }

    const nuevoPotrero = await createPotrero(dataToSend);
    if (nuevoPotrero) {
      success.value = `Potrero "${nuevoPotrero.nombre}" creado exitosamente. ID: ${nuevoPotrero.id}`;

      // Limpiar el formulario después del éxito (manteniendo la finca seleccionada si aplica)
      form.value = {
        nombre: '',
        tamano_ha: null,
        tipo_pasto: '',
        finca_id: form.value.finca_id
      };

      router.push('/potreros')
    } else {
      potreroError.value = 'Error al crear el potrero.';
    }
  } catch (err) {
    potreroError.value = err.message;
    console.error('Error en la creación del potrero:', err);
  } finally {
    isSubmitting.value = false;
  }
};

</script> -->

<!-- pages/potreros/crearPotrero.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Potrero</h2>
    
    <form @submit.prevent="handleCrearPotrero" class="space-y-4">
      
      <div>
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del Potrero</label>
        <input type="text" id="nombre" v-model="form.nombre" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
               required>
      </div>

      <div>
        <label for="tamano" class="block text-sm font-medium text-gray-700">Tamaño (Hectáreas)</label>
        <input type="number" id="tamano" v-model.number="form.tamano_ha" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
               min="0" step="0.01" required>
      </div>

      <div>
        <label for="tipo_pasto" class="block text-sm font-medium text-gray-700">Tipo de Pasto (Opcional)</label>
        <input type="text" id="tipo_pasto" v-model="form.tipo_pasto" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
      </div>

      <div>
        <label for="finca" class="block text-sm font-medium text-gray-700">Finca</label>
        <select id="finca" v-model.number="form.finca_id"
                @change="onFincaChange"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
                required :disabled="loadingFincas || fincas.length === 0">
          <option disabled :value="null">Selecciona una finca</option>
          <option v-for="finca in fincas" :key="finca.id" :value="finca.id">{{ finca.nombre }}</option>
        </select>
        <p v-if="loadingFincas" class="text-xs text-blue-500 mt-1">Cargando fincas...</p>
        <p v-else-if="errorMsg" class="text-xs text-red-500 mt-1">{{ errorMsg }}</p>
        <p v-else-if="fincas.length === 0" class="text-xs text-gray-500 mt-1">No hay fincas disponibles.</p>
      </div>

      <!-- Mapa para ubicación del potrero -->
      <div v-if="form.finca_id">
        <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación del Potrero</label>
        <div class="space-y-2">
          <div class="relative">
            <div id="map" class="w-full h-96 rounded-md border border-gray-300 z-0"></div>
            <div class="mt-2 text-xs text-gray-500">
              <p v-if="fincaSeleccionada && fincaSeleccionada.latitud" class="text-blue-600 mb-1">
                🏠 Ubicación de la finca: {{ fincaSeleccionada.nombre }}
              </p>
              <p v-if="!coordinates.lat && !coordinates.lng" class="text-gray-600">
                📍 Haz clic en el mapa para marcar la ubicación específica del potrero
              </p>
              <p v-else class="text-green-600 font-medium">
                ✓ Potrero ubicado en: {{ coordinates.lat.toFixed(6) }}, {{ coordinates.lng.toFixed(6) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting || fincas.length === 0"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : fincas.length === 0 ? 'No hay fincas disponibles' : 'Crear Potrero' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="potreroError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ potreroError }}
    </div>
  </div>
</template>

<script setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

definePageMeta({ layout: 'profile-layout' })
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import { usePotrero } from '~/composables/usePotrero';
import { useFinca } from '~/composables/useFinca';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';

const { createPotrero } = usePotrero();
const { getAllFincas } = useFinca();
const { user } = useAuth();
const router = useRouter();

// Define el estado del formulario
const form = ref({
  nombre: '',
  tamano_ha: null,
  tipo_pasto: '',
  finca_id: null,
});

// Coordenadas del potrero
const coordinates = ref({
  lat: null,
  lng: null
});

// Variables de estado
const fincas = ref([]);
const loadingFincas = ref(false);
const errorMsg = ref('');
const isSubmitting = ref(false);
const success = ref(null);
const potreroError = ref(null);

// Variables del mapa
let map = null;
let potreroMarker = null;
let fincaMarker = null;

// Computed para obtener la finca seleccionada
const fincaSeleccionada = computed(() => {
  return fincas.value.find(f => f.id === form.value.finca_id);
});

// FUNCIÓN PARA CARGAR FINCAS
const loadFincas = async () => {
  const userId = user.value?.id || user.value?.userId;
  if (!userId) return;
  
  loadingFincas.value = true;
  errorMsg.value = '';
  
  const { data, error } = await getAllFincas(userId, user.value.rol);
  loadingFincas.value = false;
  
  if (data.value) {
    fincas.value = data.value;
  } else if (error.value) {
    errorMsg.value = 'Error al cargar fincas: ' + error.value.message;
  }
};

watch(user, loadFincas, { immediate: true });
onMounted(loadFincas);

// Inicializar mapa cuando se selecciona una finca
const onFincaChange = () => {
  coordinates.value = { lat: null, lng: null };
  
  if (form.value.finca_id) {
    setTimeout(() => {
      initMap();
    }, 100);
  }
};

// Inicializar el mapa
const initMap = () => {
  // Si el mapa ya existe, removerlo
  if (map) {
    map.remove();
    map = null;
  }
  
  const finca = fincaSeleccionada.value;
  
  // Coordenadas por defecto (Colombia)
  let centerLat = 4.5709;
  let centerLng = -74.2973;
  let zoom = 6;
  
  // Si la finca tiene coordenadas, centrar ahí
  if (finca && finca.latitud && finca.longitud) {
    centerLat = parseFloat(finca.latitud);
    centerLng = parseFloat(finca.longitud);
    zoom = 14;
  }
  
  // Crear el mapa
  map = L.map('map').setView([centerLat, centerLng], zoom);
  
  // Añadir capa de tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  
  // Marcador de la finca (si tiene coordenadas)
  if (finca && finca.latitud && finca.longitud) {
    const fincaIcon = L.divIcon({
      className: 'custom-finca-marker',
      html: '<div style="background-color: #3b82f6; width: 35px; height: 35px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 18px;">🏠</div>',
      iconSize: [35, 35],
      iconAnchor: [17, 17]
    });
    
    fincaMarker = L.marker([centerLat, centerLng], { icon: fincaIcon }).addTo(map);
    fincaMarker.bindPopup(`
      <div class="text-center">
        <strong>Finca: ${finca.nombre}</strong><br>
        <small class="text-gray-600">Ubicación de la finca</small>
      </div>
    `);
  }
  
  // Icono del potrero
  const potreroIcon = L.divIcon({
    className: 'custom-potrero-marker',
    html: '<div style="background-color: #22c55e; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
  
  // Evento de clic en el mapa
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    
    // Actualizar coordenadas
    coordinates.value = { lat, lng };
    
    // Remover marcador anterior del potrero si existe
    if (potreroMarker) {
      map.removeLayer(potreroMarker);
    }
    
    // Añadir nuevo marcador del potrero
    potreroMarker = L.marker([lat, lng], { icon: potreroIcon }).addTo(map);
    potreroMarker.bindPopup(`
      <div class="text-center">
        <strong>Ubicación del Potrero</strong><br>
        Lat: ${lat.toFixed(6)}<br>
        Lng: ${lng.toFixed(6)}
      </div>
    `).openPopup();
  });
};

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});

// FUNCIÓN PARA CREAR POTRERO
const handleCrearPotrero = async () => {
  potreroError.value = null;
  success.value = null;
  isSubmitting.value = true;

  try {
    // Validaciones
    if (!form.value.finca_id) {
      throw new Error('Debes seleccionar la Finca a la que pertenece el potrero.');
    }
    if (!form.value.nombre.trim()) {
      throw new Error('Debes ingresar el nombre del potrero.');
    }
    if (!form.value.tamano_ha || form.value.tamano_ha <= 0) {
      throw new Error('Debes ingresar un tamaño válido mayor a 0.');
    }

    // Preparar datos a enviar
    const dataToSend = {
      nombre: form.value.nombre,
      tamano_ha: form.value.tamano_ha,
      finca_id: form.value.finca_id,
    };
    
    if (form.value.tipo_pasto && form.value.tipo_pasto.trim()) {
      dataToSend.tipo_pasto = form.value.tipo_pasto.trim();
    }
    
    // Agregar coordenadas si fueron seleccionadas
    if (coordinates.value.lat && coordinates.value.lng) {
      dataToSend.latitud = coordinates.value.lat;
      dataToSend.longitud = coordinates.value.lng;
    }

    const nuevoPotrero = await createPotrero(dataToSend);
    
    if (nuevoPotrero) {
      success.value = `Potrero "${nuevoPotrero.nombre}" creado exitosamente. ID: ${nuevoPotrero.id}`;

      // Limpiar el formulario
      form.value = {
        nombre: '',
        tamano_ha: null,
        tipo_pasto: '',
        finca_id: form.value.finca_id
      };
      
      coordinates.value = { lat: null, lng: null };
      
      if (potreroMarker) {
        map.removeLayer(potreroMarker);
        potreroMarker = null;
      }

      setTimeout(() => {
        router.push('/fincas');
      }, 1500);
    } else {
      potreroError.value = 'Error al crear el potrero.';
    }
  } catch (err) {
    potreroError.value = err.message;
    console.error('Error en la creación del potrero:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style>
/* Estilos para el mapa */
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

.custom-finca-marker,
.custom-potrero-marker {
  background: transparent;
  border: none;
}
</style>