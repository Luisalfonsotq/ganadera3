<!-- components/dashboards/DashboardAdmin.vue -->
<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Welcome -->
    <div
      class="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-yellow-400 opacity-20 rounded-full blur-2xl">
      </div>

      <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div class="relative group">
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur">
          </div>
          <img :src="userAvatar" alt="Avatar"
            class="relative w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
            @error="handleAvatarError" />
          <span class="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
        <div class="text-center md:text-left">
          <h1 class="text-3xl font-bold tracking-tight">Hola, {{ currentUser?.nombre || 'Administrador' }}</h1>
          <p class="text-emerald-100 mt-1 text-lg">Bienvenido a tu panel de control de HERDIX.</p>
          <div class="flex items-center justify-center md:justify-start gap-3 mt-4">
            <span
              class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
              {{ currentUser?.rol }}
            </span>
            <span
              class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 flex items-center">
              <Icon name="i-heroicons-calendar" class="w-4 h-4 mr-1" /> {{ new Date().toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-20 text-center">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mb-4">
      </div>
      <p class="text-slate-500 font-medium">Cargando información del sistema...</p>
    </div>

    <template v-else>
      <!-- Stats Overview Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Stat Card 1 -->
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Total Animales</p>
              <h3 class="text-3xl font-bold text-slate-800 mt-2">{{ totalAnimales }}</h3>
            </div>
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Icon name="i-heroicons-user-group" class="w-6 h-6" />
            </div>
          </div>
        </div>

        <!-- Stat Card 2 -->
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Fincas Activas</p>
              <h3 class="text-3xl font-bold text-slate-800 mt-2">{{ fincas.length }}</h3>
            </div>
            <div class="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Icon name="i-heroicons-home-modern" class="w-6 h-6" />
            </div>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Total Hectáreas</p>
              <h3 class="text-3xl font-bold text-slate-800 mt-2">{{ totalHectareas }}</h3>
            </div>
            <div class="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Icon name="i-heroicons-map" class="w-6 h-6" />
            </div>
          </div>
        </div>

        <!-- Stat Card 4 (Alerts Summary) -->
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
          <div class="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-sm font-medium text-slate-500">Alertas Sanitarias</p>
              <h3 class="text-3xl font-bold text-red-600 mt-2">{{ animalesEnfermos + animalesEnTratamiento }}</h3>
            </div>
            <div class="p-3 bg-red-50 text-red-600 rounded-lg animate-pulse">
              <Icon name="i-heroicons-bell-alert" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Left Column: Fincas List -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-800 flex items-center">
              <span class="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
              Mis Fincas
            </h2>
            <button class="text-sm text-emerald-600 font-medium hover:text-emerald-700">
              Ver todas &rarr;
            </button>
          </div>

          <div v-if="fincas.length === 0"
            class="bg-white rounded-xl shadow-sm p-12 text-center border-dashed border-2 border-slate-200">
            <Icon name="i-heroicons-home" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p class="text-slate-500 text-lg">No tienes fincas registradas aún.</p>
            <button class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
              Registrar Finca
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="finca in fincas" :key="finca.id"
              class="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              @click="selectFinca(finca)">
              <div class="h-2 bg-emerald-500 w-0 group-hover:w-full transition-all duration-500"></div>
              <div class="p-5">
                <div class="flex justify-between items-start mb-4">
                  <div class="bg-emerald-50 p-3 rounded-full">
                    <Icon name="i-heroicons-building-storefront" class="w-6 h-6 text-emerald-600" />
                  </div>
                  <span
                    class="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    ID: {{ finca.id.toString().padStart(4, '0') }}
                  </span>
                </div>

                <h3 class="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition">{{
                  finca.nombre }}</h3>
                <p class="text-sm text-slate-500 mb-4 flex items-center">
                  <Icon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
                  {{ finca.ubicacion || 'Sin ubicación' }}
                </p>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div>
                    <span class="block text-2xl font-bold text-slate-700">{{ finca.totalAnimales || 0 }}</span>
                    <span class="text-xs text-slate-400 uppercase tracking-wider">Animales</span>
                  </div>
                  <div>
                    <span class="block text-2xl font-bold text-slate-700">{{ finca.tamano_ha || 0 }}</span>
                    <span class="text-xs text-slate-400 uppercase tracking-wider">Hectáreas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Alerts & Details -->
        <div class="space-y-2">
          <!-- Sanitary Status Card -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 class="font-bold text-slate-800 mb-4 flex items-center">
              <Icon name="i-heroicons-chart-pie" class="w-5 h-5 mr-2 text-slate-400" />
              Estado Sanitario
            </h3>

            <div class="space-y-4">
              <div class="flex items-center p-3 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition">
                <div class="p-2 bg-red-200 rounded-full mr-3 text-red-700">
                  <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-red-900">Enfermos</p>
                  <p class="text-xs text-red-700">Requieren atención veterinaria</p>
                </div>
                <span class="text-2xl font-bold text-red-700">{{ animalesEnfermos }}</span>
              </div>

              <div
                class="flex items-center p-3 rounded-lg bg-orange-50 border border-orange-100 hover:bg-orange-100 transition">
                <div class="p-2 bg-orange-200 rounded-full mr-3 text-orange-700">
                  <Icon name="i-heroicons-plus-circle" class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-orange-900">En Tratamiento</p>
                  <p class="text-xs text-orange-700">Seguimiento activo</p>
                </div>
                <span class="text-2xl font-bold text-orange-700">{{ animalesEnTratamiento }}</span>
              </div>

              <div class="text-center pt-2">
                <button class="text-sm text-slate-500 hover:text-emerald-600 font-medium underline">Ver reporte
                  sanitario completo</button>
              </div>
            </div>
          </div>

          <!-- Selected Finca Quick View -->
          <div v-if="selectedFinca"
            class="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 animate-fade-in-up">
            <div class="flex justify-between items-start mb-4 border-b border-slate-50 pb-4">
              <div>
                <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Detalle Rápido</span>
                <h3 class="text-xl font-bold text-slate-800 mt-1">{{ selectedFinca.nombre }}</h3>
              </div>
              <button @click="selectedFinca = null" class="text-slate-400 hover:text-red-500 transition">
                <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-semibold text-slate-500 mb-2">Distribución</h4>
                <div class="flex gap-2 text-xs font-medium text-white">
                  <!-- Mock visual bar -->
                  <div class="bg-blue-500 h-2 rounded flex-1"></div>
                  <div class="bg-pink-500 h-2 rounded w-1/3"></div>
                </div>
                <div class="flex justify-between mt-1 text-sm text-slate-600">
                  <span class="flex items-center"><span class="w-2 h-2 bg-blue-500 rounded-full mr-1"></span> Machos: {{
                    selectedFinca.stats?.machos }}</span>
                  <span class="flex items-center"><span class="w-2 h-2 bg-pink-500 rounded-full mr-1"></span> Hembras:
                    {{ selectedFinca.stats?.hembras }}</span>
                </div>
              </div>

              <h4 class="text-sm font-semibold text-slate-500 pt-2">Productividad</h4>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-slate-50 rounded-lg text-center">
                  <span class="block text-lg font-bold text-slate-700">{{ selectedFinca.stats?.prenadas || 0 }}</span>
                  <span class="text-xs text-slate-500">Preñadas</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-lg text-center">
                  <span class="block text-lg font-bold text-slate-700">{{ selectedFinca.stats?.lactando || 0 }}</span>
                  <span class="text-xs text-slate-500">Lactando</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
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
  return user.value?.avatar || 'https://ui-avatars.com/api/?name=' + (user.value?.nombre || 'U') + '&background=10b981&color=fff';
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
  // Safe navigation for stats
  return fincas.value.reduce((sum, f) => sum + (f.stats?.enTratamiento || 0), 0);
});

const animalesEnfermos = computed(() => {
  return fincas.value.reduce((sum, f) => sum + (f.stats?.enfermos || 0), 0);
});

const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=U';
};

const selectFinca = async (finca) => {
  // If already selected, verify if we need to reload or just show
  if (selectedFinca.value?.id === finca.id) {
    // Optional: Deselect if clicking again? Or just stay.
    // selectedFinca.value = null; 
    return;
  }

  // Show base data immediately while loading more stats if necessary
  selectedFinca.value = finca;

  try {
    const { data: animales } = await getAnimalesOfFinca(finca.id);

    if (animales.value) {
      const stats = {
        machos: animales.value.filter(a => a.sexo === 'macho').length,
        hembras: animales.value.filter(a => a.sexo === 'hembra').length,
        prenadas: animales.value.filter(a => a.estado_reproductivo === 'prenada').length,
        lactando: animales.value.filter(a => a.estado_reproductivo === 'lactando').length,
        sanos: animales.value.filter(a => a.estado_salud === 'sano').length,
        enTratamiento: animales.value.filter(a => a.estado_salud === 'rubella').length + animales.value.filter(a => a.estado_salud === 'en_tratamiento').length, // Adjust as per real enums avoiding strict failures
        enfermos: animales.value.filter(a => a.estado_salud === 'diagnosticado_enfermo').length,
      };

      // Update with full stats
      selectedFinca.value = { ...finca, stats };
    }
  } catch (error) {
    console.error('Error al cargar estadísticas de finca:', error);
  }
};

onMounted(async () => {
  try {
    currentUser.value = user.value;

    if (user.value?.id && user.value?.rol) {
      const { data: fincasData } = await getAllFincas(user.value.id, user.value.rol);

      if (fincasData.value) {
        // Parallelize fetching for performance
        const processedFincas = await Promise.all(fincasData.value.map(async (finca) => {
          const { data: animales } = await getAnimalesOfFinca(finca.id);
          const { data: potreros } = await getPotrerosOfFinca(finca.id);

          const stats = animales.value ? {
            enTratamiento: animales.value.filter(a => a.estado_salud === 'en_tratamiento').length,
            enfermos: animales.value.filter(a => a.estado_salud === 'diagnosticado_enfermo').length
          } : { enTratamiento: 0, enfermos: 0 };

          return {
            ...finca,
            totalAnimales: animales.value?.length || 0,
            totalPotreros: potreros.value?.length || 0,
            stats
          };
        }));

        fincas.value = processedFincas;
      }
    }
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>