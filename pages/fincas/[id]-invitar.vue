<!-- pages/fincas/[id]-invitar.vue -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink :to="`/fincas/${fincaId}`" class="inline-flex items-center text-green-600 hover:text-green-700 mb-4 font-medium">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
        Volver a Finca
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Invitar Colaboradores</h1>
      <p class="text-gray-600">Invita a veterinarios, supervisores o colaboradores a tu finca</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Formulario de Invitación -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Icon name="i-heroicons-envelope" class="w-6 h-6 mr-2 text-green-600" />
          Nueva Invitación
        </h2>

        <form @submit.prevent="handleInvitar" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input 
              v-model="form.email" 
              type="email"
              placeholder="usuario@ejemplo.com"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300"
            />
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Rol en la Finca *
            </label>
            <select 
              v-model="form.rol"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white">
              <option value="" disabled>Selecciona un rol</option>
              <option value="Veterinario">🧑‍⚕️ Veterinario</option>
              <option value="Supervisor">👷 Supervisor</option>
              <option value="Colaborador">🧑‍🌾 Colaborador</option>
            </select>
          </div>

          <!-- Botón -->
          <button 
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!isSubmitting">Enviar Invitación</span>
            <span v-else>Enviando...</span>
          </button>

          <!-- Success/Error Messages -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform -translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0">
            <div v-if="success" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p class="text-green-700 font-semibold text-sm">{{ success }}</p>
            </div>
          </Transition>

          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform -translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0">
            <div v-if="errorMsg" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p class="text-red-700 font-semibold text-sm">{{ errorMsg }}</p>
            </div>
          </Transition>
        </form>
      </div>

      <!-- Lista de Invitaciones -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
          <span class="flex items-center">
            <Icon name="i-heroicons-users" class="w-6 h-6 mr-2 text-blue-600" />
            Invitaciones Enviadas
          </span>
          <button @click="loadInvitaciones" class="text-sm text-blue-600 hover:text-blue-800">
            <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          </button>
        </h2>

        <!-- Loading -->
        <div v-if="loadingInvitaciones" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="invitaciones.length === 0" class="text-center py-8">
          <Icon name="i-heroicons-inbox" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No hay invitaciones enviadas</p>
        </div>

        <!-- Lista -->
        <div v-else class="space-y-3 max-h-[500px] overflow-y-auto">
          <div 
            v-for="inv in invitaciones" 
            :key="inv.id"
            class="border-2 border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">{{ inv.email }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  Rol: <span class="font-medium text-gray-700">{{ inv.rol }}</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Estado: <span 
                    :class="{
                      'text-yellow-600': inv.estado === 'Pendiente',
                      'text-green-600': inv.estado === 'Aceptada',
                      'text-red-600': inv.estado === 'Rechazada',
                      'text-gray-600': inv.estado === 'Expirada'
                    }"
                    class="font-medium">{{ inv.estado }}</span>
                </p>
              </div>
              
              <button 
                v-if="inv.estado === 'Pendiente'"
                @click="handleCancelar(inv.id)"
                class="text-red-500 hover:text-red-700 transition-colors">
                <Icon name="i-heroicons-trash" class="w-5 h-5" />
              </button>
            </div>

            <!-- Link de invitación -->
            <div v-if="inv.estado === 'Pendiente'" class="mt-3 pt-3 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <input 
                  :value="getInvitacionUrl(inv.token)"
                  readonly
                  class="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600"
                />
                <button 
                  @click="copiarLink(inv.token)"
                  class="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Copiar enlace">
                  <Icon name="i-heroicons-clipboard-document" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' });

const route = useRoute();
const router = useRouter();
const { createInvitacion, getInvitacionesByFinca, cancelarInvitacion } = useInvitacion();
const { user } = useAuth();

// ✅ Extraer ID de la ruta [id]-invitar
const fincaId = computed(() => {
  const id = route.params.id;
  // Si el id viene como "3-invitar", extraer solo el número
  return typeof id === 'string' ? parseInt(id.split('-')[0]) : parseInt(id);
});

const form = ref({
  email: '',
  rol: ''
});

const invitaciones = ref([]);
const loadingInvitaciones = ref(false);
const isSubmitting = ref(false);
const success = ref('');
const errorMsg = ref('');

const getInvitacionUrl = (token) => {
  return `${window.location.origin}/invitaciones/aceptar/${token}`;
};

const copiarLink = async (token) => {
  const url = getInvitacionUrl(token);
  try {
    await navigator.clipboard.writeText(url);
    alert('¡Enlace copiado al portapapeles!');
  } catch (err) {
    console.error('Error al copiar:', err);
  }
};

const loadInvitaciones = async () => {
  loadingInvitaciones.value = true;
  const { data, error } = await getInvitacionesByFinca(fincaId.value);
  loadingInvitaciones.value = false;
  
  if (data?.value) {
    invitaciones.value = data.value;
  }
};

const handleInvitar = async () => {
  success.value = '';
  errorMsg.value = '';
  isSubmitting.value = true;

  const { data, error } = await createInvitacion(fincaId.value, form.value);
  isSubmitting.value = false;

  if (error?.value) {
    errorMsg.value = error.value;
  } else {
    success.value = '¡Invitación enviada exitosamente!';
    form.value = { email: '', rol: '' };
    await loadInvitaciones();
    
    setTimeout(() => {
      success.value = '';
    }, 3000);
  }
};

const handleCancelar = async (id) => {
  if (confirm('¿Estás seguro de cancelar esta invitación?')) {
    const { error } = await cancelarInvitacion(id, fincaId.value);
    
    if (!error?.value) {
      await loadInvitaciones();
    } else {
      alert('Error al cancelar invitación');
    }
  }
};

onMounted(async () => {
  console.log('📍 Finca ID:', fincaId.value);
  console.log('👤 User:', user.value);
  console.log('🔑 Rol:', user.value?.rol);
  
  // Esperar a que el user esté cargado
  if (!user.value) {
    console.warn('⚠️ User not loaded yet, waiting...');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  if (user.value?.rol !== 'Administrador') {
    console.error('❌ Not authorized. User rol:', user.value?.rol);
    alert('No autorizado. Solo administradores pueden invitar colaboradores.');
    router.push('/fincas');
    return;
  }
  
  console.log('✅ Authorized, loading invitations...');
  loadInvitaciones();
});
</script>