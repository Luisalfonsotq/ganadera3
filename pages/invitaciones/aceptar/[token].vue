<!-- pages/invitaciones/aceptar/[token].vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-6">
    <div class="max-w-2xl w-full">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-3xl shadow-2xl p-12 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-6"></div>
        <p class="text-gray-600 font-medium">Verificando invitación...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMsg" class="bg-white rounded-3xl shadow-2xl p-12 text-center border-t-4 border-red-500">
        <div class="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Icon name="i-heroicons-x-circle" class="w-12 h-12 text-red-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Error</h2>
        <p class="text-gray-600 mb-8">{{ errorMsg }}</p>
        <NuxtLink 
          to="/login"
          class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-all">
          Ir a Iniciar Sesión
        </NuxtLink>
      </div>

      <!-- Success State (después de aceptar) -->
      <div v-else-if="aceptada" class="bg-white rounded-3xl shadow-2xl p-12 text-center border-t-4 border-green-500">
        <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Icon name="i-heroicons-check-circle" class="w-12 h-12 text-green-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">¡Invitación Aceptada!</h2>
        <p class="text-gray-600 mb-2">
          Te has unido exitosamente a <strong>{{ invitacion?.finca?.nombre }}</strong>
        </p>
        <p class="text-gray-500 text-sm mb-8">
          Como {{ invitacion?.rol }}
        </p>
        <NuxtLink 
          to="/dashboard"
          class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-all">
          <Icon name="i-heroicons-arrow-right" class="w-5 h-5 mr-2" />
          Ir a Mi Panel
        </NuxtLink>
      </div>

      <!-- Invitation Details -->
      <div v-else-if="invitacion" class="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-green-500">
        <!-- Logo/Icon -->
        <div class="text-center mb-8">
          <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Icon name="i-heroicons-envelope-open" class="w-10 h-10 text-green-600" />
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Has sido invitado</h1>
          <p class="text-gray-600">a unirte como colaborador</p>
        </div>

        <!-- Finca Details -->
        <div class="bg-gradient-to-r from-green-50 to-amber-50 rounded-2xl p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">
            🏡 {{ invitacion.finca.nombre }}
          </h2>
          
          <div class="space-y-2 text-sm">
            <div class="flex items-center text-gray-700">
              <Icon name="i-heroicons-map-pin" class="w-5 h-5 mr-2 text-green-600" />
              <span>{{ invitacion.finca.ubicacion || 'Ubicación no especificada' }}</span>
            </div>
            
            <div class="flex items-center text-gray-700">
              <Icon name="i-heroicons-briefcase" class="w-5 h-5 mr-2 text-amber-600" />
              <span>Rol asignado: <strong>{{ invitacion.rol }}</strong></span>
            </div>
          </div>
        </div>

        <!-- User Status Check -->
        <div v-if="!user" class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <Icon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-blue-900 mb-1">
                Necesitas iniciar sesión
              </p>
              <p class="text-xs text-blue-700">
                Debes tener una cuenta con el email <strong>{{ invitacion.email }}</strong>
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="user.email !== invitacion.email" class="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-yellow-900 mb-1">
                Email incorrecto
              </p>
              <p class="text-xs text-yellow-700">
                Esta invitación es para <strong>{{ invitacion.email }}</strong>
                <br>
                Estás conectado como <strong>{{ user.email }}</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- DEBUG INFO -->
        <div class="mb-4 p-4 bg-gray-100 rounded text-xs">
          <p>User email: {{ user?.email }}</p>
          <p>Invitacion email: {{ invitacion.email }}</p>
          <p>Match: {{ user?.email === invitacion.email }}</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            v-if="user?.email === invitacion.email"
            @click="handleAceptar"
            :disabled="isProcessing"
            class="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50">
            <span v-if="!isProcessing">✓ Aceptar Invitación</span>
            <span v-else>Procesando...</span>
          </button>

          <NuxtLink 
            v-else-if="!user"
            to="/login"
            class="flex-1 text-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            Iniciar Sesión
          </NuxtLink>

          <button 
            v-else
            @click="handleLogoutAndRedirect"
            class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            Cambiar de Cuenta
          </button>

          <button 
            @click="handleRechazar"
            :disabled="isProcessing"
            class="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50">
            Rechazar
          </button>
        </div>

        <!-- Expiration Info -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            Esta invitación expira el {{ formatDate(invitacion.expira_en) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'public' });

const route = useRoute();
const router = useRouter();
const { getInvitacionByToken, aceptarInvitacion, rechazarInvitacion } = useInvitacion();
const { user, logout } = useAuth();

const token = ref(route.params.token);
const invitacion = ref(null);
const loading = ref(true);
const errorMsg = ref('');
const isProcessing = ref(false);
const aceptada = ref(false);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const loadInvitacion = async () => {
  loading.value = true;
  
  // ✅ Esperar a que el user esté cargado
  const { profile } = useAuth();
  if (!user.value) {
    try {
      await profile();
    } catch (error) {
      console.log('No authenticated user');
    }
  }
  
  const { data, error } = await getInvitacionByToken(token.value);
  loading.value = false;

  if (error?.value) {
    errorMsg.value = error.value;
  } else if (data?.value) {
    invitacion.value = data.value;
  }
};

const handleAceptar = async () => {
  isProcessing.value = true;
  const { data, error } = await aceptarInvitacion(token.value);
  isProcessing.value = false;

  if (error?.value) {
    alert('Error: ' + error.value);
  } else {
    aceptada.value = true;
  }
};

const handleRechazar = async () => {
  if (confirm('¿Estás seguro de rechazar esta invitación?')) {
    isProcessing.value = true;
    const { error } = await rechazarInvitacion(token.value);
    isProcessing.value = false;

    if (!error?.value) {
      router.push('/');
    }
  }
};

const handleLogoutAndRedirect = async () => {
  await logout();
  // La invitación se recargará automáticamente
};

onMounted(loadInvitacion);
</script>