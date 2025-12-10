<!-- pages/dashboard.vue -->
<template>
  <div>
    <!-- Dashboard según rol del usuario -->
    <DashboardAdmin v-if="user?.rol === 'Administrador'" />
    <DashboardVeterinario v-else-if="user?.rol === 'Veterinario'" />
    <DashboardSupervisor v-else-if="user?.rol === 'Supervisor'" />
    <DashboardColaborador v-else-if="user?.rol === 'Colaborador'" />
    <DashboardPending v-else-if="user?.rol === 'Pending'" />
    
    <!-- Fallback para roles no reconocidos -->
    <div v-else class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <Icon name="i-heroicons-exclamation-circle" class="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Rol no reconocido</h2>
        <p class="text-gray-600 mb-4">Tu rol "{{ user?.rol }}" no tiene un dashboard configurado.</p>
        <NuxtLink to="/login" class="text-green-600 hover:text-green-700 font-medium">
          Volver al inicio de sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
import DashboardAdmin from '@/components/dashboards/DashboardAdmin.vue';
import DashboardVeterinario from '@/components/dashboards/DashboardVeterinario.vue';
import DashboardSupervisor from '@/components/dashboards/DashboardSupervisor.vue';
import DashboardColaborador from '@/components/dashboards/DashboardColaborador.vue';
import DashboardPending from '@/components/dashboards/DashboardPending.vue';

definePageMeta({
  layout: 'profile-layout'
});

const { user } = useAuth();
</script>