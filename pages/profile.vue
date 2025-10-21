<!-- // pages/profile.vue
<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4 text-center text-gray-800">Perfil del Usuario</h1>
    <div v-if="pending" class="text-center text-gray-500">
      <p>Cargando el perfil...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>Error: {{ error }}</p>
      <p class="mt-2"><a href="/login" class="text-blue-500 hover:underline">Inicia sesión</a></p>
    </div>
    <div v-else-if="currentUser" class="space-y-4">
      <div class="p-4 bg-gray-50 rounded-lg">
        <p><strong>Nombre:</strong> {{ currentUser.nombre }}</p>
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p><strong>Rol:</strong> {{ currentUser.rol }}</p>
      </div>
      <div class="p-4 border-t border-gray-400">
        <button @click="handleLogout">Cerrar Sesión</button>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      <p>No se encontraron datos de usuario.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useApi } from '~/composables/useApi';

definePageMeta({
    layout: 'profile-layout'
})

const { user, logout } = useAuth();
const currentUser = ref(null);
const { data, pending, error } = useApi('/auth/profile', { credentials: 'include' });

watchEffect(() => {
  if (data.value) {
    currentUser.value = data.value;
  }
});

const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
</script> -->

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
        <button
          @click="handleLogout"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200">
          Cerrar Sesión
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando información...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Mis Fincas -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
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
            <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
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
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
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

definePageMeta({
  layout: 'profile-layout'
});

const { user, logout } = useAuth();
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

const handleLogout = async () => {
  await logout();
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