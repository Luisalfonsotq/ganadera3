<template>
  <div class="flex min-h-screen bg-white">
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
      <div class="max-w-md w-full p-8">
        <h1 class="text-2xl font-semibold mb-6 text-gray-700">Registrar Usuario</h1>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="nombre" class="block text-gray-600 text-sm mb-1">Nombre</label>
            <input id="nombre" v-model="nombre" type="text"
              class="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full p-2 text-sm" />
          </div>

          <div>
            <label for="email" class="block text-gray-600 text-sm mb-1">Email</label>
            <input id="email" v-model="email" type="email"
              class="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full p-2 text-sm">
          </div>

          <div>
            <label for="password" class="block text-gray-600 text-sm mb-1">Contraseña</label>
            <input id="password" v-model="password" type="password"
              class="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full p-2 text-sm transition-colors duration-300">
          </div>

          <div class="pb-2">
            <label for="rol" class="block text-gray-600 text-sm mb-1">Rol</label>
            <select id="rol" v-model="rol"
              class="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full p-2 text-sm" required>
              <option value="" disabled>Seleccione su rol</option>
              <option value="administrador">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="veterinario">Veterinario</option>
              <option value="colaborador">Colaborador</option>
            </select>
          </div>

          <button type="submit"
            class="w-full bg-gradient-to-t from-black to-green-500  hover:from-black hover:to-green-600 transition-all duration-300 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full mt-6">
            REGISTRARSE
          </button>
        </form>
        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </div>
    </div>
    <div
      class="hidden md:flex flex-col justify-center items-center w-1/2 p-8 text-white relative bg-blue-500 overflow-hidden rounded-xl">
      <div class="absolute inset-0 bg-gradient-to-t from-black to-green-600 transform -skew-y-6 scale-125"></div>

      <div class="z-10 text-center flex flex-col items-center">
        <img class="p-2 size-[300px]" src="../assets/img/herdixCompleto.svg" alt="logo">
        <h1 class="text-4xl font-bold mb-4 tracking-widest">¡BIENVENIDO!</h1>
        <h2 class="text-3xl font-bold mb-4 tracking-widest">Crea tu cuenta</h2>
        <p class="mt-4 text-lg max-w-sm text-gray-200">
          Haz que tu finca vaya al siguiente nivel
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'public' });

const nombre = ref('');
const email = ref('');
const password = ref();
const rol = ref('');
const error = ref('');
const router = useRouter();
const { register } = useAuth();

async function handleRegister() {
  error.value = '';
  try {
    await register({
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      rol: rol.value
    });
    router.push('/profile');
  } catch (err) {
    console.error('Error durante el registro:', err);
    error.value = err.message === 'Fail to fetch' ? 'Error de conexión' : 'Credenciales incorrectas';
  };
};
</script>