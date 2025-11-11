<!-- components/dashboards/DashboardVeterinario.vue -->
<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header del Perfil Veterinario -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
      <div class="flex items-center space-x-6">
        <div class="relative">
          <img
            :src="userAvatar"
            alt="Avatar"
            class="w-20 h-20 rounded-full border-4 border-white"
            @error="handleAvatarError"
          />
          <span class="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></span>
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold">{{ currentUser?.nombre || 'Veterinario' }}</h1>
          <p class="text-green-100">Gestión de Salud Animal</p>
          <span class="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            🩺 {{ currentUser?.rol }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Cargando información veterinaria...</p>
    </div>

    <div v-else>
      <!-- Métricas Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1: Controles del Mes -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Controles del Mes</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ controlesDelMes }}</p>
              <p class="text-xs text-gray-500 mt-1">+{{ controlDelDia }} hoy</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <Icon name="i-heroicons-clipboard-document-check" class="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Card 2: Animales Bajo Tratamiento -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Bajo Tratamiento</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ animalesBajoTratamiento }}</p>
              <p class="text-xs text-gray-500 mt-1">Requieren seguimiento</p>
            </div>
            <div class="bg-orange-100 rounded-full p-3">
              <Icon name="i-heroicons-heart" class="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Card 3: Vacunaciones Pendientes -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Vacunaciones Pendientes</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ vacunacionesPendientes }}</p>
              <p class="text-xs text-red-500 mt-1">{{ vacunacionesUrgentes }} urgentes</p>
            </div>
            <div class="bg-purple-100 rounded-full p-3">
              <Icon name="i-heroicons-beaker" class="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Card 4: Emergencias Activas -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Emergencias</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ emergenciasActivas }}</p>
              <p class="text-xs text-gray-500 mt-1">Atención inmediata</p>
            </div>
            <div class="bg-red-100 rounded-full p-3">
              <Icon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Principal: Dos Columnas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Columna Izquierda: Controles Recientes y Alertas -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Controles Sanitarios Recientes -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <Icon name="i-heroicons-clipboard-document-list" class="w-6 h-6 mr-2 text-green-600" />
                Controles Recientes
              </h2>
              <NuxtLink to="/controles-sanitarios" class="text-green-600 hover:text-green-700 text-sm font-medium">
                Ver todos →
              </NuxtLink>
            </div>

            <div v-if="controlesRecientes.length === 0" class="text-center py-8 text-gray-500">
              No hay controles registrados recientemente
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="control in controlesRecientes"
                :key="control.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <span class="font-semibold text-gray-800">{{ control.animal?.identificador_unico || 'N/A' }}</span>
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {{ control.tipo_control?.nombre || 'N/A' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ control.medicamento || 'Sin medicamento' }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(control.fecha) }}</p>
                  </div>
                  <NuxtLink 
                    :to="`/controles-sanitarios/${control.id}`"
                    class="text-green-600 hover:text-green-700">
                    <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Alertas Sanitarias -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="i-heroicons-bell-alert" class="w-6 h-6 mr-2 text-red-600" />
              Alertas Sanitarias
            </h2>

            <div v-if="alertasSanitarias.length === 0" class="text-center py-8 text-gray-500">
              No hay alertas activas
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="alerta in alertasSanitarias"
                :key="alerta.id"
                class="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-semibold text-gray-800">{{ alerta.animal?.identificador_unico }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ alerta.descripcion }}</p>
                    <p class="text-xs text-gray-500 mt-2">Estado: {{ alerta.animal?.estado_salud }}</p>
                  </div>
                  <span class="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-bold">
                    URGENTE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Calendario y Estadísticas -->
        <div class="space-y-6">
          
          <!-- Próximas Vacunaciones -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="i-heroicons-calendar-days" class="w-5 h-5 mr-2 text-purple-600" />
              Próximas Vacunaciones
            </h3>

            <div v-if="proximasVacunaciones.length === 0" class="text-center py-4 text-gray-500 text-sm">
              No hay vacunaciones programadas
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="vacuna in proximasVacunaciones"
                :key="vacuna.id"
                class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p class="font-semibold text-sm text-gray-800">{{ vacuna.tipo }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ vacuna.cantidadAnimales }} animales</p>
                <p class="text-xs text-purple-600 font-medium mt-1">{{ vacuna.fecha }}</p>
              </div>
            </div>
          </div>

          <!-- Estadísticas del Mes -->
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <h3 class="text-lg font-semibold mb-4">Estadísticas del Mes</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm">Controles realizados:</span>
                <span class="text-2xl font-bold">{{ controlesDelMes }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">Animales atendidos:</span>
                <span class="text-2xl font-bold">{{ animalesAtendidos }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">Recuperaciones:</span>
                <span class="text-2xl font-bold">{{ recuperaciones }}</span>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
            <div class="space-y-2">
              <NuxtLink 
                to="/controles-sanitarios/crear"
                class="flex items-center justify-between w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg transition duration-200 text-green-700 font-medium">
                <span class="flex items-center">
                  <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" />
                  Nuevo Control
                </span>
                <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
              </NuxtLink>

              <NuxtLink 
                to="/animales"
                class="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 text-blue-700 font-medium">
                <span class="flex items-center">
                  <Icon name="i-heroicons-shield-check" class="w-5 h-5 mr-2" />
                  Ver Animales
                </span>
                <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
              </NuxtLink>

              <NuxtLink 
                to="/tipos-control-sanitario"
                class="flex items-center justify-center w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200 text-gray-700 font-medium">
                <Icon name="i-heroicons-cog-6-tooth" class="w-5 h-5 mr-2" />
                Tipos de Control
              </NuxtLink>
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
import { useControlSanitario } from '@/composables/useControlSanitario';
import { useAnimal } from '@/composables/useAnimal';
import { useFinca } from '@/composables/useFinca';

const { user } = useAuth();
const { getAllControles } = useControlSanitario();
const { getAnimalesOfFinca } = useAnimal();
const { getAllFincas } = useFinca();

const currentUser = ref(null);
const loading = ref(true);
const controles = ref([]);
const animales = ref([]);

const userAvatar = computed(() => {
  return user.value?.avatar || 'https://ui-avatars.com/api/?name=' + (user.value?.nombre || 'V');
});

// Métricas calculadas
const controlesDelMes = computed(() => {
  const now = new Date();
  const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
  return controles.value.filter(c => new Date(c.fecha) >= primerDiaMes).length;
});

const controlDelDia = computed(() => {
  const hoy = new Date().toDateString();
  return controles.value.filter(c => new Date(c.fecha).toDateString() === hoy).length;
});

const animalesBajoTratamiento = computed(() => {
  return animales.value.filter(a => a.estado_salud === 'en_tratamiento').length;
});

const vacunacionesPendientes = computed(() => {
  // Lógica simplificada - puedes mejorarla según tu backend
  return Math.floor(animales.value.length * 0.15); // 15% aproximado
});

const vacunacionesUrgentes = computed(() => {
  return Math.floor(vacunacionesPendientes.value * 0.3);
});

const emergenciasActivas = computed(() => {
  return animales.value.filter(a => a.estado_salud === 'diagnosticado_enfermo').length;
});

const controlesRecientes = computed(() => {
  return controles.value
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);
});

const alertasSanitarias = computed(() => {
  return animales.value
    .filter(a => a.estado_salud === 'diagnosticado_enfermo' || a.estado_salud === 'en_tratamiento')
    .slice(0, 3)
    .map(a => ({
      id: a.id,
      animal: a,
      descripcion: a.estado_salud === 'diagnosticado_enfermo' 
        ? 'Animal enfermo - Requiere atención urgente'
        : 'Animal en tratamiento - Seguimiento requerido'
    }));
});

const proximasVacunaciones = computed(() => {
  // Datos de ejemplo - deberías obtenerlos del backend
  return [
    { id: 1, tipo: 'Fiebre Aftosa', cantidadAnimales: 12, fecha: 'Mañana' },
    { id: 2, tipo: 'Brucelosis', cantidadAnimales: 8, fecha: 'En 3 días' },
    { id: 3, tipo: 'Rabia', cantidadAnimales: 5, fecha: 'Próxima semana' },
  ];
});

const animalesAtendidos = computed(() => {
  const now = new Date();
  const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
  const controlesDelMesActual = controles.value.filter(c => new Date(c.fecha) >= primerDiaMes);
  const animalesUnicos = new Set(controlesDelMesActual.map(c => c.animal_id));
  return animalesUnicos.size;
});

const recuperaciones = computed(() => {
  // Lógica simplificada - mejorar según necesidad
  return Math.floor(controlesDelMes.value * 0.7);
});

const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=V';
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  if (d.toDateString() === hoy.toDateString()) return 'Hoy';
  if (d.toDateString() === ayer.toDateString()) return 'Ayer';
  
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

onMounted(async () => {
  try {
    currentUser.value = user.value;
    
    // Cargar controles sanitarios
    const { data: controlesData } = await getAllControles();
    if (controlesData.value) {
      controles.value = controlesData.value;
    }

    // Cargar animales de todas las fincas del usuario
    if (user.value?.id) {
      const { data: fincasData } = await getAllFincas(user.value.id, user.value.rol);
      
      if (fincasData.value) {
        const allAnimales = [];
        for (const finca of fincasData.value) {
          const { data: animalesData } = await getAnimalesOfFinca(finca.id);
          if (animalesData.value) {
            allAnimales.push(...animalesData.value);
          }
        }
        animales.value = allAnimales;
      }
    }
  } catch (error) {
    console.error('Error al cargar datos del veterinario:', error);
  } finally {
    loading.value = false;
  }
});
</script>