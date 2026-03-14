<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header del Perfil Supervisor -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div class="flex items-center space-x-6">
        <div class="relative">
          <img
            :src="userAvatar"
            alt="Avatar"
            class="w-20 h-20 rounded-full border-4 border-white object-cover bg-white"
            @error="handleAvatarError"
          />
          <span class="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></span>
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold">{{ currentUser?.nombre || 'Supervisor' }}</h1>
          <p class="text-blue-100">Supervisión de Operaciones</p>
          <span class="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            👁️ {{ currentUser?.rol || 'Supervisor' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Cargando información de supervisión...</p>
    </div>

    <!-- CONTENEDOR PRINCIPAL FIX: Añadido space-y-6 para separar MÉTricas de Contenido Princial -->
    <div v-else class="space-y-6">
      <!-- Métricas Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Tareas Completadas -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Tareas Completadas</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ tareasCompletadas }}/{{ tareasTotales }}</p>
              <p class="text-xs text-green-600 mt-1 font-medium">{{ porcentajeCompletado }}% del total</p>
            </div>
            <div class="bg-green-100 rounded-full p-3 transform hover:scale-110 transition-transform">
              <Icon name="i-heroicons-check-circle" class="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Personal Activo -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Personal Activo</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ personalActivo }}/{{ personalTotal }}</p>
              <p class="text-xs text-blue-500 mt-1 font-medium">Trabajando hoy</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3 transform hover:scale-110 transition-transform">
              <Icon name="i-heroicons-users" class="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Alertas Pendientes -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Alertas Pendientes</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ alertasPendientes }}</p>
              <p class="text-xs mt-1 font-medium" :class="alertasCriticas > 0 ? 'text-red-500' : 'text-orange-500'">{{ alertasCriticas > 0 ? alertasCriticas + ' críticas' : 'Avisos regulares' }}</p>
            </div>
            <div class="bg-orange-100 rounded-full p-3 transform hover:scale-110 transition-transform">
              <Icon name="i-heroicons-bell-alert" class="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Eficiencia -->
        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Eficiencia</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ eficienciaGeneral }}%</p>
              <p class="text-xs text-purple-600 mt-1 font-medium">+{{ mejoraEficiencia }}% vs mes pasado</p>
            </div>
            <div class="bg-purple-100 rounded-full p-3 transform hover:scale-110 transition-transform">
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
                Actividades Recientes
              </h2>
              <NuxtLink to="/tareas" class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                Ver todas &rarr;
              </NuxtLink>
            </div>

            <div class="space-y-3">
              <div v-for="tarea in actividadesDelDia" :key="tarea.id" 
                   :class="`border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-50 border-gray-200 ${getEstadoBorderClass(tarea.estado)}`">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-gray-800 text-base flex items-center gap-2">
                       <Icon :name="getCategoriaIcon(tarea.categoria)" class="w-5 h-5 text-gray-500" />
                       {{ tarea.titulo }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <Icon name="i-heroicons-user" class="w-4 h-4 text-gray-400" /> Asignado a: <span class="font-medium inline-block">{{ tarea.asignado_a?.nombre || 'Equipo General' }}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-2 italic max-w-lg line-clamp-1">{{ tarea.descripcion?.substring(0, 80) }}...</p>
                  </div>
                  <span :class="`px-3 py-1 rounded-full text-[11px] font-bold border ${getEstadoClass(tarea.estado)} shrink-0`">
                    {{ getEstadoLabel(tarea.estado).toUpperCase() }}
                  </span>
                </div>
              </div>

              <div v-if="actividadesDelDia.length === 0" class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Icon name="i-heroicons-clipboard-document-check" class="w-12 h-12 text-gray-300 mb-2" />
                <p class="text-gray-500 font-medium">No se encontraron actividades recientes.</p>
              </div>
            </div>
          </div>

          <!-- Alertas Activas -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 mr-2 text-red-600" />
                Alertas Activas
              </h2>
            </div>

            <div class="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="(notif, index) in notifications.slice(0, 5)" :key="index" 
                   :class="['border p-4 rounded-lg shadow-sm hover:shadow-md transition-all', 
                            notif.type === 'urgent' ? 'border-red-200 bg-red-50' : 
                            notif.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50']">
                <div class="flex items-start">
                  <div :class="['rounded-full p-2 mr-3 shrink-0 shadow-sm', 
                               notif.type === 'urgent' ? 'bg-red-100 text-red-600' : 
                               notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600']">
                    <Icon name="i-heroicons-exclamation-circle" class="w-6 h-6" />
                  </div>
                  <div class="w-full">
                    <div class="flex justify-between items-start">
                       <p :class="['font-bold text-sm', notif.type === 'urgent' ? 'text-red-800' : notif.type === 'warning' ? 'text-yellow-800' : 'text-blue-800']">
                         {{ notif.title }}
                       </p>
                       <span class="text-[10px] font-medium text-gray-500 bg-white ml-2 px-2 py-0.5 rounded-full shadow-sm">{{ notif.time }}</span>
                    </div>
                    <p :class="['text-sm mt-1 mb-1', notif.type === 'urgent' ? 'text-red-700' : notif.type === 'warning' ? 'text-yellow-700' : 'text-blue-700']">
                      {{ notif.message }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Icon name="i-heroicons-bell-slash" class="w-12 h-12 text-gray-300 mb-2" />
                <p class="text-gray-500 font-medium">Todo bajo control. Sin alertas activas.</p>
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
              Personal Registrado
            </h3>

            <div class="space-y-3">
              <div v-for="persona in personalDelDia" :key="persona.id" class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow hover:border-gray-300 transition-all">
                <div class="flex items-center">
                  <div class="relative">
                    <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3 border-2 border-white shadow-sm">
                      {{ (persona.nombre || 'A').substring(0, 1).toUpperCase() }}
                    </div>
                    <span class="absolute bottom-0 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-800">{{ persona.nombre }}</span>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{{ persona.rol }}</span>
                  </div>
                </div>
                <span class="text-xs px-2 py-1 bg-green-100 text-green-700 font-semibold rounded-full border border-green-200">Activo</span>
              </div>
              
              <div v-if="personalDelDia.length === 0" class="text-center p-4">
                 <p class="text-sm text-gray-500">No hay personal registrado en este momento.</p>
              </div>
            </div>
          </div>

          <!-- Resumen Semanal -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white relative z-0 overflow-hidden">
            <div class="absolute -right-10 -top-10 bg-white/10 w-32 h-32 rounded-full blur-xl"></div>
            <div class="absolute -left-10 -bottom-10 bg-blue-400/20 w-32 h-32 rounded-full blur-xl"></div>
            <h3 class="text-lg font-bold mb-5 flex items-center relative z-10">
              <Icon name="i-heroicons-calendar-days" class="w-5 h-5 mr-2 opacity-80" />
              Resumen Global
            </h3>
            <div class="space-y-4 relative z-10">
              <div class="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <span class="text-sm font-medium text-blue-50">Total de Actividades:</span>
                <span class="text-2xl font-bold">{{ tareasTotales }}</span>
              </div>
              <div class="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <span class="text-sm font-medium text-blue-50">Eficiencia Promedio:</span>
                <span class="text-2xl font-bold flex items-center">{{ eficienciaGeneral }}% <Icon name="i-heroicons-arrow-trending-up" class="w-4 h-4 ml-1 text-green-300" /></span>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="bg-white rounded-lg shadow-md p-6 relative z-0 overflow-hidden">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
               <Icon name="i-heroicons-bolt" class="w-5 h-5 mr-2 text-yellow-500" />
               Acciones Rápidas
            </h3>
            <div class="space-y-3 z-10 relative">
              <NuxtLink to="/tareas" class="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition duration-200 text-blue-700 font-semibold shadow-sm hover:shadow object-cover group">
                <span class="flex items-center">
                  <div class="bg-white p-1.5 rounded-md mr-3 group-hover:scale-110 transition-transform shadow-sm">
                     <Icon name="i-heroicons-plus" class="w-5 h-5 text-blue-600" />
                  </div>
                  Centro de Tareas
                </span>
                <Icon name="i-heroicons-chevron-right" class="w-5 h-5 opacity-70" />
              </NuxtLink>

              <NuxtLink to="/alertas" class="flex items-center justify-between w-full p-3 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-lg transition duration-200 text-orange-700 font-semibold shadow-sm hover:shadow group">
                <span class="flex items-center">
                  <div class="bg-white p-1.5 rounded-md mr-3 group-hover:scale-110 transition-transform shadow-sm">
                     <Icon name="i-heroicons-bell" class="w-5 h-5 text-orange-600" />
                  </div>
                  Ver Alertas
                </span>
                <Icon name="i-heroicons-chevron-right" class="w-5 h-5 opacity-70" />
              </NuxtLink>

              <NuxtLink to="/reportes" class="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition duration-200 text-gray-700 font-semibold shadow-sm hover:shadow group">
                <span class="flex items-center">
                  <div class="bg-white p-1.5 rounded-md mr-3 group-hover:scale-110 transition-transform shadow-sm">
                     <Icon name="i-heroicons-document-chart-bar" class="w-5 h-5 text-gray-600" />
                  </div>
                  Ver Análiticas
                </span>
                <Icon name="i-heroicons-chevron-right" class="w-5 h-5 opacity-70" />
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
import { useTarea } from '@/composables/useTarea';
import { useNotifications } from '@/composables/useNotifications';
import { useUsuario } from '@/composables/useUsuario';

const { user } = useAuth();
const { tareas, getTareas, getEstadoClass, getEstadoBorderClass, getEstadoLabel, getCategoriaIcon } = useTarea();
const { notifications, fetchNotifications } = useNotifications();
const { usuarios, getAllUsuarios } = useUsuario();

const currentUser = ref(null);
const loading = ref(true);

const tareasCompletadas = computed(() => tareas.value.filter(t => t.estado === 'completada').length);
const tareasTotales = computed(() => tareas.value.length);
const porcentajeCompletado = computed(() => {
  if (tareasTotales.value === 0) return 0;
  return Math.round((tareasCompletadas.value / tareasTotales.value) * 100);
});

// Personal total y activo. Filtramos por colaboradores y veterinarios
const personalTotalList = computed(() => usuarios.value.filter(u => u.rol === 'Colaborador' || u.rol === 'Veterinario' || u.rol === 'Supervisor'));
const personalTotal = computed(() => personalTotalList.value.length);
const personalActivo = computed(() => personalTotal.value > 0 ? personalTotal.value : 0); 

const alertasPendientes = computed(() => notifications.value.length);
const alertasCriticas = computed(() => notifications.value.filter(n => n.type === 'urgent').length);

const eficienciaGeneral = computed(() => porcentajeCompletado.value); 
const mejoraEficiencia = ref(5); // Arbitrary static as placeholder

// Actividades del día: últimas tareas
const actividadesDelDia = computed(() => tareas.value.slice(0, 5));

// Personal del Día: primeros 5 usuarios
const personalDelDia = computed(() => personalTotalList.value.slice(0, 5));

const userAvatar = computed(() => {
  return user.value?.avatar || 'https://ui-avatars.com/api/?name=' + (user.value?.nombre || 'S') + '&background=random';
});

const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=S';
};

onMounted(async () => {
  try {
    currentUser.value = user.value;
    loading.value = true;
    
    // Carga de datos reales concurrentemente.
    await Promise.allSettled([
      getTareas(),
      fetchNotifications(),
      getAllUsuarios()
    ]);
  } catch (error) {
    console.error('Error al cargar datos del supervisor:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>