<!-- components/dashboards/DashboardPending.vue -->
<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-lg p-6 text-white">
      <div class="flex items-center space-x-4">
        <div class="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <Icon name="i-heroicons-clock" class="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold">Solicitud en Revisión</h1>
          <p class="text-yellow-100 text-sm">Tu cuenta está pendiente de aprobación</p>
        </div>
      </div>
    </div>

    <!-- Información del Usuario -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center space-x-6 mb-6">
        <div class="relative">
          <img
            :src="userAvatar"
            alt="Avatar"
            class="w-20 h-20 rounded-full border-4 border-gray-200"
            @error="handleAvatarError"
          />
          <span class="absolute bottom-0 right-0 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
            <Icon name="i-heroicons-clock" class="w-4 h-4 text-white" />
          </span>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ currentUser?.nombre || 'Usuario' }}</h2>
          <p class="text-gray-600">{{ currentUser?.email }}</p>
          <span class="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            ⏳ Pendiente de Aprobación
          </span>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Estado de tu Solicitud</h3>
        
        <!-- Timeline -->
        <div class="space-y-4">
          <!-- Paso 1: Completado -->
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="i-heroicons-check" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-semibold text-gray-800">Registro Completado</p>
              <p class="text-xs text-gray-600">Tu cuenta ha sido creada exitosamente</p>
            </div>
          </div>

          <!-- Paso 2: En Progreso -->
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Icon name="i-heroicons-clock" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-semibold text-gray-800">Revisión del Administrador</p>
              <p class="text-xs text-gray-600">Esperando aprobación y asignación de rol</p>
            </div>
          </div>

          <!-- Paso 3: Pendiente -->
          <div class="flex items-start opacity-50">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <Icon name="i-heroicons-user-circle" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-semibold text-gray-800">Acceso al Sistema</p>
              <p class="text-xs text-gray-600">Podrás acceder una vez aprobado</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Información Importante -->
    <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <Icon name="i-heroicons-information-circle" class="w-6 h-6 text-blue-500 mt-0.5" />
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">¿Qué sigue?</h3>
          <ul class="space-y-2 text-sm text-blue-800">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Un administrador revisará tu solicitud y te asignará un rol apropiado</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Recibirás un correo electrónico cuando tu cuenta sea aprobada</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>El proceso de aprobación suele tomar entre 24-48 horas</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Una vez aprobado, tendrás acceso completo según tu rol asignado</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Contacto -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Icon name="i-heroicons-envelope" class="w-6 h-6 mr-2 text-green-600" />
        ¿Necesitas Ayuda?
      </h3>
      
      <p class="text-gray-600 mb-4">
        Si tienes alguna pregunta o tu solicitud toma más tiempo del esperado, puedes contactar al administrador:
      </p>

      <div class="bg-gray-50 rounded-lg p-4 space-y-2">
        <div class="flex items-center text-sm">
          <Icon name="i-heroicons-envelope" class="w-5 h-5 mr-2 text-gray-500" />
          <span class="text-gray-700">admin@herdix.com</span>
        </div>
        <div class="flex items-center text-sm">
          <Icon name="i-heroicons-phone" class="w-5 h-5 mr-2 text-gray-500" />
          <span class="text-gray-700">+57 300 123 4567</span>
        </div>
      </div>
    </div>

    <!-- Acceso Limitado -->
    <div class="bg-gray-50 rounded-lg shadow-md p-6 text-center">
      <Icon name="i-heroicons-lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Acceso Limitado</h3>
      <p class="text-sm text-gray-600 mb-4">
        Actualmente solo puedes ver esta página. Una vez aprobado, tendrás acceso completo al sistema según tu rol.
      </p>
      
      <div class="flex justify-center space-x-3">
        <button 
          @click="handleRefresh"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition duration-200 flex items-center">
          <Icon name="i-heroicons-arrow-path" class="w-5 h-5 mr-2" />
          Verificar Estado
        </button>
        
        <button 
          @click="handleLogout"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition duration-200">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { user, logout, profile } = useAuth();
const router = useRouter();

const currentUser = ref(null);

const userAvatar = computed(() => {
  return user.value?.avatar || 'https://ui-avatars.com/api/?name=' + (user.value?.nombre || 'P');
});

const handleAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=P';
};

const handleRefresh = async () => {
  try {
    await profile();
    
    // Si el rol cambió, recargar la página
    if (user.value?.rol !== 'PENDING') {
      window.location.reload();
    } else {
      alert('Tu cuenta aún está pendiente de aprobación. Por favor intenta más tarde.');
    }
  } catch (error) {
    console.error('Error al verificar estado:', error);
    alert('Error al verificar el estado de tu cuenta');
  }
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

onMounted(() => {
  currentUser.value = user.value;
});
</script>