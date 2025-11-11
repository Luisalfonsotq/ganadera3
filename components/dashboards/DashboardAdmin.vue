<!-- components/dashboards/DashboardAdmin.vue -->
<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header del Perfil -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center space-x-6">
        <div class="relative">
          <img
            :src="userAvatar"
            alt="Avatar"
            class="w-24 h-24 rounded-full border-4 border-green-500"
            @error="handleAvatarError"
          />
          <span class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-800">{{ currentUser?.nombre || 'Usuario' }}</h1>
          <p class="text-gray-600">{{ currentUser?.email }}</p>
          <span class="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            {{ currentUser?.rol }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Cargando información...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Mis Fincas -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Icon name="i-heroicons-home-modern" class="w-6 h-6 mr-2 text-green-600" />
          Mis Fincas ({{ fincas.length }})
        </h2>
        
        <div v-if="fincas.length === 0" class="text-center py-8 text-gray-500">
          No tienes fincas registradas
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="finca in fincas"
            :key="finca.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition duration-200 cursor-pointer"
            @click="selectFinca(finca)">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-800">{{ finca.nombre }}</h3>
                <p class="text-sm text-gray-600">{{ finca.ubicacion || 'Sin ubicación' }}</p>
                <p class="text-sm text-gray-500">{{ finca.tamano_ha }} hectáreas</p>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold text-green-600">{{ finca.totalAnimales || 0 }}</span>
                <p class="text-xs text-gray-500">Animales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen Rápido -->
      <div class="space-y-6">
        <!-- Totales -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <h3 class="text-lg font-semibold mb-4">Resumen Total</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span>Total Animales:</span>
              <span class="text-2xl font-bold">{{ totalAnimales }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Total Potreros:</span>
              <span class="text-2xl font-bold">{{ totalPotreros }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Hectáreas:</span>
              <span class="text-2xl font-bold">{{ totalHectareas }}</span>
            </div>
          </div>
        </div>

        <!-- Alertas -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 mr-2 text-red-500" />
            Alertas Sanitarias
          </h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span class="text-sm text-gray-700">En Tratamiento</span>
              <span class="font-bold text-red-600">{{ animalesEnTratamiento }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span class="text-sm text-gray-700">Enfermos</span>
              <span class="font-bold text-orange-600">{{ animalesEnfermos }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalle de Finca Seleccionada -->
    <div v-if="selectedFinca" class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ selectedFinca.nombre }}</h2>
        <button
          @click="selectedFinca = null"
          class="text-gray-500 hover:text-gray-700">
          <Icon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Animales por Sexo -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3">Por Sexo</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Machos:</span>
              <span class="font-bold text-blue-600">{{ selectedFinca.stats?.machos || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Hembras:</span>
              <span class="font-bold text-pink-600">{{ selectedFinca.stats?.hembras || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Estado Reproductivo -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3">Estado Reproductivo</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Preñadas:</span>
              <span class="font-bold">{{ selectedFinca.stats?.prenadas || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Lactando:</span>
              <span class="font-bold">{{ selectedFinca.stats?.lactando || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Estado de Salud -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3">Salud</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Sanos:</span>
              <span class="font-bold text-green-600">{{ selectedFinca.stats?.sanos || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">En Tratamiento:</span>
              <span class="font-bold text-orange-600">{{ selectedFinca.stats?.enTratamiento || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useFinca } from '@/composables/useFinca';
import { useAnimal } from '@/composables/useAnimal';
import { usePotrero } from '@/composables/usePotrero';

const { user } = useAuth();
const { getAllFincas } = useFinca();
const { getAnimalesOfFinca } = useAnimal();
const { getPotrerosOfFinca } = usePotrero();

const currentUser = ref(null);
const fincas = ref([]);
const selectedFinca = ref(null);
const loading = ref(true);

const userAvatar = computed(() => {
  return user.value?.avatar || 'https://ui-avatars.com/api/?name=' + (user.value?.nombre || 'U');
});

const totalAnimales = computed(() => {
  return fincas.value.reduce((sum, f) => sum + (f.totalAnimales || 0), 0);
});

const totalPotreros = computed(() => {
  return fincas.value.reduce((sum, f) => sum + (f.totalPotreros || 0), 0);
});

const totalHectareas = computed(() => {
  return fincas.value.reduce((sum, f) => sum + (parseFloat(f.tamano_ha) || 0), 0).toFixed(2);
});

const animalesEnTratamiento = computed(() => {
  return fincas.value.reduce((sum, f) => sum + (f.stats?.enTratamiento || 0), 0);
});

const animalesEnfermos = computed(() => {
  return fincas.value.reduce((sum, f) => sum + (f.stats?.enfermos || 0), 0);
});

const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=U';
};

const selectFinca = async (finca) => {
  loading.value = true;
  try {
    const { data: animales } = await getAnimalesOfFinca(finca.id);
    
    if (animales.value) {
      const stats = {
        machos: animales.value.filter(a => a.sexo === 'macho').length,
        hembras: animales.value.filter(a => a.sexo === 'hembra').length,
        prenadas: animales.value.filter(a => a.estado_reproductivo === 'prenada').length,
        lactando: animales.value.filter(a => a.estado_reproductivo === 'lactando').length,
        sanos: animales.value.filter(a => a.estado_salud === 'sano').length,
        enTratamiento: animales.value.filter(a => a.estado_salud === 'en_tratamiento').length,
        enfermos: animales.value.filter(a => a.estado_salud === 'diagnosticado_enfermo').length,
      };
      
      selectedFinca.value = { ...finca, stats };
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    currentUser.value = user.value;
    
    if (user.value?.id && user.value?.rol) {
      const { data: fincasData } = await getAllFincas(user.value.id, user.value.rol);
      
      if (fincasData.value) {
        for (const finca of fincasData.value) {
          const { data: animales } = await getAnimalesOfFinca(finca.id);
          const { data: potreros } = await getPotrerosOfFinca(finca.id);
          
          finca.totalAnimales = animales.value?.length || 0;
          finca.totalPotreros = potreros.value?.length || 0;
          
          if (animales.value) {
            finca.stats = {
              enTratamiento: animales.value.filter(a => a.estado_salud === 'en_tratamiento').length,
              enfermos: animales.value.filter(a => a.estado_salud === 'diagnosticado_enfermo').length,
            };
          }
        }
        fincas.value = fincasData.value;
      }
    }
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
  } finally {
    loading.value = false;
  }
});
</script>