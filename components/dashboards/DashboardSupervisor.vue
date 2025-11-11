<!-- components/dashboards/DashboardSupervisor.vue -->
<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header del Perfil Supervisor -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div class="flex items-center space-x-6">
        <div class="relative">
          <img
            :src="userAvatar"
            alt="Avatar"
            class="w-20 h-20 rounded-full border-4 border-white"
            @error="handleAvatarError"
          />
          <span class="absolute bottom-0 right-0 w-5 h-5 bg-blue-400 rounded-full border-2 border-white"></span>
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold">{{ currentUser?.nombre || 'Supervisor' }}</h1>
          <p class="text-blue-100">Supervisión de Operaciones</p>
          <span class="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            👁️ {{ currentUser?.rol }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Cargando información de supervisión...</p>
    </div>

    <div v-else>
      <!-- Métricas Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Tareas Completadas -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Tareas Completadas</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ tareasCompletadas }}/{{ tareasTotales }}</p>
              <p class="text-xs text-green-600 mt-1">{{ porcentajeCompletado }}% del total</p>
            </div>
            <div class="bg-green-100 rounded-full p-3">
              <Icon name="i-heroicons-check-circle" class="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Personal Activo -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Personal Activo</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ personalActivo }}/{{ personalTotal }}</p>
              <p class="text-xs text-gray-500 mt-1">Trabajando hoy</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <Icon name="i-heroicons-users" class="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Alertas Pendientes -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Alertas Pendientes</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ alertasPendientes }}</p>
              <p class="text-xs text-red-500 mt-1">{{ alertasCriticas }} críticas</p>
            </div>
            <div class="bg-orange-100 rounded-full p-3">
              <Icon name="i-heroicons-bell-alert" class="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Eficiencia -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Eficiencia</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ eficienciaGeneral }}%</p>
              <p class="text-xs text-green-600 mt-1">+{{ mejoraEficiencia }}% vs semana pasada</p>
            </div>
            <div class="bg-purple-100 rounded-full p-3">
              <Icon name="i-heroicons-chart-bar" class="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Actividades del Día -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <Icon name="i-heroicons-clipboard-document-list" class="w-6 h-6 mr-2 text-blue-600" />
                Actividades del Día
              </h2>
              <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todas →
              </button>
            </div>

            <div class="space-y-3">
              <div class="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-semibold text-gray-800">Alimentación de ganado - Potrero 3</p>
                    <p class="text-sm text-gray-600 mt-1">Asignado a: Juan Pérez</p>
                    <p class="text-xs text-gray-500 mt-2">Completado a las 8:30 AM</p>
                  </div>
                  <span class="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-bold">
                    COMPLETADO
                  </span>
                </div>
              </div>

              <div class="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-semibold text-gray-800">Limpieza de corrales</p>
                    <p class="text-sm text-gray-600 mt-1">Asignado a: María López</p>
                    <p class="text-xs text-gray-500 mt-2">En progreso - 60% completado</p>
                  </div>
                  <span class="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-bold">
                    EN CURSO
                  </span>
                </div>
              </div>

              <div class="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-semibold text-gray-800">Revisión de cercas - Sector Norte</p>
                    <p class="text-sm text-gray-600 mt-1">Asignado a: Carlos García</p>
                    <p class="text-xs text-red-500 mt-2">Vencida - Requiere atención</p>
                  </div>
                  <span class="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-bold">
                    VENCIDA
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Alertas Activas -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 mr-2 text-red-600" />
              Alertas Activas
            </h2>

            <div class="space-y-3">
              <div class="border border-red-200 bg-red-50 p-4 rounded-lg">
                <div class="flex items-start">
                  <div class="bg-red-200 rounded-full p-2 mr-3">
                    <Icon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-red-700" />
                  </div>
                  <div>
                    <p class="font-semibold text-red-800">Falta de agua en Potrero 5</p>
                    <p class="text-sm text-red-600 mt-1">Reportado hace 30 minutos por Pedro Sánchez</p>
                  </div>
                </div>
              </div>

              <div class="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                <div class="flex items-start">
                  <div class="bg-yellow-200 rounded-full p-2 mr-3">
                    <Icon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-yellow-700" />
                  </div>
                  <div>
                    <p class="font-semibold text-yellow-800">Personal ausente</p>
                    <p class="text-sm text-yellow-600 mt-1">Luis Martínez no ha marcado entrada hoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Derecho -->
        <div class="space-y-6">
          
          <!-- Personal del Día -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="i-heroicons-user-group" class="w-5 h-5 mr-2 text-blue-600" />
              Personal del Día
            </h3>

            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-sm font-medium">Juan Pérez</span>
                </div>
                <span class="text-xs text-green-600">Activo</span>
              </div>

              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-sm font-medium">María López</span>
                </div>
                <span class="text-xs text-green-600">Activo</span>
              </div>

              <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span class="text-sm font-medium">Luis Martínez</span>
                </div>
                <span class="text-xs text-red-600">Ausente</span>
              </div>
            </div>
          </div>

          <!-- Resumen Semanal -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <h3 class="text-lg font-semibold mb-4">Resumen Semanal</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm">Tareas completadas:</span>
                <span class="text-2xl font-bold">{{ tareasSemanales }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">Eficiencia promedio:</span>
                <span class="text-2xl font-bold">{{ eficienciaGeneral }}%</span>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
            <div class="space-y-2">
              <button class="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 text-blue-700 font-medium">
                <span class="flex items-center">
                  <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" />
                  Asignar Tarea
                </span>
                <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
              </button>

              <button class="flex items-center justify-between w-full p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition duration-200 text-orange-700 font-medium">
                <span class="flex items-center">
                  <Icon name="i-heroicons-bell" class="w-5 h-5 mr-2" />
                  Crear Alerta
                </span>
                <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
              </button>

              <button class="flex items-center justify-center w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200 text-gray-700 font-medium">
                <Icon name="i-heroicons-document-chart-bar" class="w-5 h-5 mr-2" />
                Ver Reportes
              </button>
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

const { user } = useAuth();

const currentUser = ref(null);
const loading = ref(true);

// Datos de ejemplo (deberían venir del backend)
const tareasCompletadas = ref(18);
const tareasTotales = ref(25);
const personalActivo = ref(8);
const personalTotal = ref(10);
const alertasPendientes = ref(3);
const alertasCriticas = ref(1);
const eficienciaGeneral = ref(87);
const mejoraEficiencia = ref(5);
const tareasSemanales = ref(142);

const userAvatar = computed(() => {
  return user.value?.avatar || 'https://ui-avatars.com/api/?name=' + (user.value?.nombre || 'S');
});

const porcentajeCompletado = computed(() => {
  return Math.round((tareasCompletadas.value / tareasTotales.value) * 100);
});

const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=S';
};

onMounted(async () => {
  try {
    currentUser.value = user.value;
    // Aquí cargarías datos reales del backend
  } catch (error) {
    console.error('Error al cargar datos del supervisor:', error);
  } finally {
    loading.value = false;
  }
});
</script>