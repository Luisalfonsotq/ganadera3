<!-- /pages/potreros/index.vue
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Potreros</h1>
      <NuxtLink to="/potreros/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Potrero
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando potreros...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="potreros.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay potreros creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Nombre</th>
            <th class="py-2 px-4 text-left">Finca Asignada</th>
            <th class="py-2 px-4 text-left">Tamaño (ha)</th>
            <th class="py-2 px-4 text-left">Tipo Pasto</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="potrero in potreros" :key="potrero.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ potrero.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ potrero.nombre }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ potrero.finca ? potrero.finca.nombre : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ potrero.tamano_ha }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ potrero.tipo_pasto || 'Sin especificar' }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/potreros/${potrero.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink  :to="`/potreros/editar/${potrero.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button @click="handleDelete(potrero.id)" class="text-red-500 hover:text-red-700">
                <Icon name="i-heroicons-trash" class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup>
definePageMeta({ layout: 'profile-layout' })
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth';
import {useFinca} from '~/composables/useFinca';
import { usePotrero} from '~/composables/usePotrero';

const { user } = useAuth();
console.log(user.value);
const {getAllFincas} = useFinca();
const { potreros, loading, error, getPotrerosOfFinca, deletePotrero } = usePotrero();

// Variables de estado para traer las fincas asociadas
const fincas = ref([]);
const loadingFincas = ref(false);
const errorMsg = ref('');

// Función para traer las fincas
const loadFincas = async()=> {
  const userId = user.value?.id || user.value?.userId
  console.log(userId);
  if(!userId){
    console.log('No se pudo obtener el id del usuario');
    return;
  }
  loadingFincas.value = true;
  errorMsg.value = '';
  const {data, error} = await getAllFincas(userId, user.value.rol);
  loadingFincas.value = false;

  if(data.value){
    fincas.value = data.value;
    // Cargar potreros con el primer id de finca
    if(fincas.value.length > 0){
      await getPotrerosOfFinca(fincas.value[0].id)
    }
  } else if(error.value){
    errorMsg.value = 'Error al cargar las fincas:' + error.value.message
  }
}

// Cargar potreros cuando cambian las fincas
const loadPotreros = async () => {
  if(fincas.value.length > 0){
    await getPotrerosOfFinca(fincas.value[0].id)
  }
}
watch(user, loadFincas, {immediate: true});
watch(fincas, loadPotreros)
onMounted(loadFincas);

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este potrero?')) {
    const { error } = await deletePotrero(id)
    if (!error.value) {
      potreros.value = potreros.value.filter(p => p.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script> -->

<!-- /pages/potreros/index.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Mis Potreros</h1>
          <p class="text-gray-600">Administra y monitorea tus áreas de pastoreo</p>
        </div>
        <NuxtLink 
          to="/potreros/crear" 
          class="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
          <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" /> 
          Nuevo Potrero
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-700 text-sm font-medium mb-1">Total Potreros</p>
            <p class="text-3xl font-bold text-green-800">{{ potreros.length }}</p>
          </div>
          <div class="bg-green-200 rounded-full p-3">
            <Icon name="i-heroicons-square-3-stack-3d" class="w-8 h-8 text-green-700" />
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
            <p class="text-amber-700 text-sm font-medium mb-1">Promedio por Potrero</p>
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
      <p class="text-gray-600 font-medium">Cargando potreros...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500 mr-3" />
        <div>
          <h3 class="text-red-800 font-semibold">Error al cargar</h3>
          <p class="text-red-700 text-sm mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Potreros Grid -->
    <div v-else-if="potreros.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="potrero in potreros" 
        :key="potrero.id" 
        class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group">
        
        <!-- Header Image/Icon -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 h-32 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <Icon name="i-heroicons-square-3-stack-3d" class="w-16 h-16 text-white opacity-80" />
        </div>

        <!-- Content -->
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-1">{{ potrero.nombre }}</h3>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-start text-sm text-gray-600">
              <Icon name="i-heroicons-home-modern" class="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
              <span class="line-clamp-2">{{ potrero.finca?.nombre || 'Sin finca' }}</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
              <Icon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2 text-blue-600" />
              <span class="font-semibold">{{ potrero.tamano_ha || 'N/A' }} hectáreas</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
              <Icon name="i-heroicons-sparkles" class="w-5 h-5 mr-2 text-purple-600" />
              <span>{{ potrero.tipo_pasto || 'Sin especificar' }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-4 border-t border-gray-100">
            <NuxtLink 
              :to="`/potreros/${potrero.id}`" 
              class="flex-1 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
              <Icon name="i-heroicons-eye" class="w-4 h-4 mr-1" />
              Ver
            </NuxtLink>
            
            <NuxtLink 
              :to="`/potreros/editar/${potrero.id}`" 
              class="flex-1 flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
              <Icon name="i-heroicons-pencil" class="w-4 h-4 mr-1" />
              Editar
            </NuxtLink>
            
            <button 
              @click="handleDelete(potrero.id)" 
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
          <Icon name="i-heroicons-square-3-stack-3d" class="w-12 h-12 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">No hay potreros registrados</h3>
        <p class="text-gray-600 mb-6">Comienza agregando tu primer potrero para gestionar tus áreas de pastoreo</p>
        <NuxtLink 
          to="/potreros/crear" 
          class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
          <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" /> 
          Crear Primer Potrero
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth';
import {useFinca} from '~/composables/useFinca';
import { usePotrero} from '~/composables/usePotrero';

const { user } = useAuth();
const {getAllFincas} = useFinca();
const { potreros, loading, error, getPotrerosOfFinca, deletePotrero } = usePotrero();

const fincas = ref([]);
const loadingFincas = ref(false);
const errorMsg = ref('');

const totalHectareas = computed(() => {
  return potreros.value.reduce((sum, potrero) => sum + (parseFloat(potrero.tamano_ha) || 0), 0)
})

const promedioHectareas = computed(() => {
  return potreros.value.length > 0 ? totalHectareas.value / potreros.value.length : 0
})

const loadFincas = async()=> {
  const userId = user.value?.id || user.value?.userId
  if(!userId){
    return;
  }
  loadingFincas.value = true;
  errorMsg.value = '';
  const {data, error} = await getAllFincas(userId, user.value.rol);
  loadingFincas.value = false;

  if(data.value){
    fincas.value = data.value;
    if(fincas.value.length > 0){
      await getPotrerosOfFinca(fincas.value[0].id)
    }
  } else if(error.value){
    errorMsg.value = 'Error al cargar las fincas:' + error.value.message
  }
}

const loadPotreros = async () => {
  if(fincas.value.length > 0){
    await getPotrerosOfFinca(fincas.value[0].id)
  }
}

watch(user, loadFincas, {immediate: true});
watch(fincas, loadPotreros)
onMounted(loadFincas);

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este potrero? Esta acción no se puede deshacer.')) {
    const { error } = await deletePotrero(id)
    if (!error.value) {
      potreros.value = potreros.value.filter(p => p.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>