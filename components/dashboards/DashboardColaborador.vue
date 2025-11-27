<!-- components/dashboards/DashboardColaborador.vue -->
<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Header del Perfil Colaborador -->
    <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
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
          <h1 class="text-3xl font-bold">{{ currentUser?.nombre || 'Colaborador' }}</h1>
          <p class="text-indigo-100">Área de Trabajo</p>
          <span class="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            🧑‍🌾 {{ currentUser?.rol }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Cargando tus tareas...</p>
    </div>

    <div v-else>
      <!-- Resumen de Tareas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Pendientes -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Tareas Pendientes</p>
              <p class="text-4xl font-bold text-gray-800 mt-2">{{ tareasPendientes }}</p>
            </div>
            <div class="bg-orange-100 rounded-full p-3">
              <Icon name="i-heroicons-clock" class="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Completadas Hoy -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Completadas Hoy</p>
              <p class="text-4xl font-bold text-gray-800 mt-2">{{ tareasCompletadasHoy }}</p>
            </div>
            <div class="bg-green-100 rounded-full p-3">
              <Icon name="i-heroicons-check-circle" class="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Vencidas -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Tareas Vencidas</p>
              <p class="text-4xl font-bold text-gray-800 mt-2">{{ tareasVencidas }}</p>
            </div>
            <div class="bg-red-100 rounded-full p-3">
              <Icon name="i-heroicons-exclamation-circle" class="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Mis Tareas -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <Icon name="i-heroicons-clipboard-document-list" class="w-7 h-7 mr-2 text-indigo-600" />
            Mis Tareas de Hoy
          </h2>
          <span class="text-sm text-gray-600">{{ tareasCompletadasHoy }}/{{ tareasDelDia }} completadas</span>
        </div>

        <div v-if="tareasDelDia === 0" class="text-center py-12">
          <Icon name="i-heroicons-check-badge" class="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p class="text-gray-600 text-lg">¡No tienes tareas pendientes por hoy!</p>
          <p class="text-gray-500 text-sm mt-2">Excelente trabajo 👏</p>
        </div>

        <div v-else class="space-y-4">
          <!-- Tarea Pendiente -->
          <div class="border-l-4 border-orange-500 bg-orange-50 p-5 rounded-lg hover:shadow-md transition duration-200">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="font-bold text-gray-800 text-lg">Alimentación de ganado - Potrero 3</h3>
                  <span class="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-bold">
                    PENDIENTE
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">
                  Suministrar alimento balanceado y verificar agua en bebederos
                </p>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span class="flex items-center">
                    <Icon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                    Vence: 2:00 PM
                  </span>
                  <span class="flex items-center">
                    <Icon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
                    Potrero 3
                  </span>
                </div>
              </div>
              <button class="ml-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-200">
                Completar
              </button>
            </div>
          </div>

          <!-- Tarea Completada -->
          <div class="border-l-4 border-green-500 bg-green-50 p-5 rounded-lg opacity-75">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="font-bold text-gray-800 text-lg line-through">Limpieza de corrales - Sector A</h3>
                  <span class="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-bold">
                    COMPLETADA
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">
                  Limpiar y desinfectar corrales del sector A
                </p>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span class="flex items-center">
                    <Icon name="i-heroicons-check" class="w-4 h-4 mr-1" />
                    Completada: 9:45 AM
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarea Vencida -->
          <div class="border-l-4 border-red-500 bg-red-50 p-5 rounded-lg">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="font-bold text-gray-800 text-lg">Revisión de cercas - Sector Norte</h3>
                  <span class="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-bold">
                    VENCIDA
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">
                  Inspeccionar y reparar cercas dañadas
                </p>
                <div class="flex items-center space-x-4 text-xs text-red-600">
                  <span class="flex items-center">
                    <Icon name="i-heroicons-exclamation-circle" class="w-4 h-4 mr-1" />
                    Venció: Ayer, 5:00 PM
                  </span>
                </div>
              </div>
              <button class="ml-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition duration-200">
                Completar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Inferior -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Checklists del Día -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="i-heroicons-clipboard-document-check" class="w-6 h-6 mr-2 text-green-600" />
            Checklist Matutino
          </h3>

          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked class="w-5 h-5 text-green-600 rounded" disabled />
              <span class="text-gray-700 line-through">Verificar niveles de agua</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked class="w-5 h-5 text-green-600 rounded" disabled />
              <span class="text-gray-700 line-through">Revisar estado de animales</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-5 h-5 text-green-600 rounded" />
              <span class="text-gray-700">Limpiar comederos</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-5 h-5 text-green-600 rounded" />
              <span class="text-gray-700">Reportar novedades al supervisor</span>
            </label>
          </div>
        </div>

        <!-- Reportar Incidencia -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 mr-2 text-orange-600" />
            Reportar Incidencia
          </h3>

          <p class="text-sm text-gray-600 mb-4">
            ¿Encontraste algún problema? Repórtalo inmediatamente
          </p>

          <div class="space-y-3">
            <button class="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition duration-200 text-red-700 font-medium">
              <span class="flex items-center">
                <Icon name="i-heroicons-exclamation-circle" class="w-5 h-5 mr-2" />
                Animal Enfermo
              </span>
              <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
            </button>

            <button class="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition duration-200 text-orange-700 font-medium">
              <span class="flex items-center">
                <Icon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 mr-2" />
                Equipo Dañado
              </span>
              <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
            </button>

            <button class="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 text-blue-700 font-medium">
              <span class="flex items-center">
                <Icon name="i-heroicons-chat-bubble-left" class="w-5 h-5 mr-2" />
                Otra Observación
              </span>
              <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
            </button>
          </div>
        </div>
          </div>
        </div>

        <!-- Completadas Hoy -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Completadas Hoy</p>
              <p class="text-4xl font-bold text-gray-800 mt-2">{{ tareasCompletadasHoy }}</p>
            </div>
            <div class="bg-green-100 rounded-full p-3">
              <Icon name="i-heroicons-check-circle" class="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Vencidas -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Tareas Vencidas</p>
              <p class="text-4xl font-bold text-gray-800 mt-2">{{ tareasVencidas }}</p>
            </div>
            <div class="bg-red-100 rounded-full p-3">
              <Icon name="i-heroicons-exclamation-circle" class="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Mis Tareas -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <Icon name="i-heroicons-clipboard-document-list" class="w-7 h-7 mr-2 text-indigo-600" />
            Mis Tareas de Hoy
          </h2>
          <span class="text-sm text-gray-600">{{ tareasCompletadasHoy }}/{{ tareasDelDia }} completadas</span>
        </div>

        <div v-if="animalesAtencion.length === 0" class="text-center py-12">
          <Icon name="i-heroicons-check-badge" class="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p class="text-gray-600 text-lg">¡No tienes tareas pendientes por hoy!</p>
          <p class="text-gray-500 text-sm mt-2">Excelente trabajo 👏</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="animal in animalesAtencion"
            :key="animal.id"
            :class="[
              'border-l-4 p-5 rounded-lg hover:shadow-md transition duration-200',
              animal.prioridad === 'Alta' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="font-bold text-gray-800 text-lg">{{ animal.nombre }} (ID: {{ animal.identificador }})</h3>
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-bold',
                      animal.prioridad === 'Alta' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                    ]"
                  >
                    {{ animal.tipo_tarea }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">
                  Finca: {{ animal.finca_nombre }} - Estado: {{ animal.estado_salud }}
                </p>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span class="flex items-center">
                    <Icon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                    {{ animal.estado_salud === 'diagnosticado_enfermo' ? 'Diagnosticado:' : 'Tratamiento desde:' }} {{ formatDate(animal.fecha_diagnostico || animal.fecha_inicio_tratamiento) }}
                  </span>
                </div>
              </div>
              <button
                @click="navegarAAnimal(animal.id)"
                class="ml-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-200"
              >
                Ver Detalle
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Inferior -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Checklists del Día -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="i-heroicons-clipboard-document-check" class="w-6 h-6 mr-2 text-green-600" />
            Checklist Matutino
          </h3>

          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked class="w-5 h-5 text-green-600 rounded" disabled />
              <span class="text-gray-700 line-through">Verificar niveles de agua</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked class="w-5 h-5 text-green-600 rounded" disabled />
              <span class="text-gray-700 line-through">Revisar estado de animales</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-5 h-5 text-green-600 rounded" />
              <span class="text-gray-700">Limpiar comederos</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-5 h-5 text-green-600 rounded" />
              <span class="text-gray-700">Reportar novedades al supervisor</span>
            </label>
          </div>
        </div>

        <!-- Reportar Incidencia -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 mr-2 text-orange-600" />
            Reportar Incidencia
          </h3>

          <p class="text-sm text-gray-600 mb-4">
            ¿Encontraste algún problema con un animal? Repórtalo inmediatamente.
          </p>

          <button
            @click="reportarIncidencia"
            class="w-full flex items-center justify-center p-3 bg-red-50 hover:bg-red-100 rounded-lg transition duration-200 text-red-700 font-medium"
          >
            <Icon name="i-heroicons-exclamation-circle" class="w-5 h-5 mr-2" />
            Reportar Incidencia de Animal
          </button>
        </div>
      </div>
   
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useFinca } from '@/composables/useFinca';
import { useAnimal } from '@/composables/useAnimal';
import { useRouter } from 'vue-router';

const { user } = useAuth();
const { getAllFincas } = useFinca();
const { getAnimalesOfFinca } = useAnimal();
const router = useRouter();

const currentUser = ref(null);
const loading = ref(true);
const fincas = ref([]);
const animalesAtencion = ref([]);

// Computed properties for metrics
const tareasPendientes = computed(() => animalesAtencion.value.length);
const tareasCompletadasHoy = ref(0); // Placeholder for now as we don't track task completion history yet
const tareasVencidas = ref(0); // Placeholder
const tareasDelDia = computed(() => tareasPendientes.value + tareasCompletadasHoy.value);

const userAvatar = computed(() => {
  return user.value?.avatar || 'https://ui-avatars.com/api/?name=' + (user.value?.nombre || 'C');
});

const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=C';
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const navegarAAnimal = (id) => {
  router.push(`/animales/${id}`);
};

const reportarIncidencia = () => {
  // Redirect to animal list to select one and report
  router.push('/animales');
};

onMounted(async () => {
  try {
    currentUser.value = user.value;
    
    if (user.value?.id) {
      // 1. Fetch assigned fincas
      const { data: fincasData } = await getAllFincas(user.value.id, user.value.rol);
      
      if (fincasData.value) {
        fincas.value = fincasData.value;
        
        // 2. Fetch animals for each finca to find those needing attention
        const allAnimals = [];
        for (const finca of fincasData.value) {
          const { data: animales } = await getAnimalesOfFinca(finca.id);
          if (animales.value) {
            // Filter for animals that are not 'sano'
            const enfermos = animales.value.filter(a => 
              a.estado_salud === 'diagnosticado_enfermo' || 
              a.estado_salud === 'en_tratamiento'
            ).map(a => ({
              ...a,
              finca_nombre: finca.nombre,
              tipo_tarea: a.estado_salud === 'diagnosticado_enfermo' ? 'Atención Médica' : 'Seguimiento Tratamiento',
              prioridad: a.estado_salud === 'diagnosticado_enfermo' ? 'Alta' : 'Media'
            }));
            allAnimals.push(...enfermos);
          }
        }
        animalesAtencion.value = allAnimals;
      }
    }
  } catch (error) {
    console.error('Error al cargar datos del colaborador:', error);
  } finally {
    loading.value = false;
  }
});
</script>