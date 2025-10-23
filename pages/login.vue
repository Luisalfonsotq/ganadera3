<!-- pages/login.vue -->
<template>
  <div class="flex min-h-screen bg-white">
    <div class="hidden md:flex flex-col justify-center items-center w-1/2 p-8 text-white relative bg-blue-500 overflow-hidden rounded-xl">
      <div class="absolute inset-0 bg-gradient-to-b from-green-600 to-black transform -skew-y-6 scale-125"></div>
      
      <div class="z-10 text-center flex flex-col items-center">
        <img class="p-2 size-[300px]" src="../assets/img/herdixCompleto.svg" alt="logo">
        <h1 class="text-4xl font-bold mb-4 tracking-widest">BIENVENIDO DE NUEVO</h1>
        <p class="mt-4 text-lg max-w-sm text-gray-200">
          De vuelta al campo, de vuelta al progreso.
        </p>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
      <div class="max-w-md w-full p-8">
        <h1 class="text-2xl text-center font-semibold mb-6 text-gray-700">Iniciar Sesión</h1>
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label for="email" class="block text-gray-600 text-sm mb-1">Correo</label>
            <input v-model="email" type="email" placeholder="email@example.com" class="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full p-2 text-sm" />
          </div>
          <div>
            <label for="password" class="block text-gray-600 text-sm mb-1">Contraseña</label>
            <input v-model="password" type="password" placeholder="********" class="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full p-2 text-sm" />
          </div>
          
          <div class="flex justify-between items-center text-sm">
            <label class="flex items-center text-gray-600">
              <input type="checkbox" class="form-checkbox text-blue-500 mr-2 rounded" />
              Mantener sesión activa
            </label>
            <a href="register" class="text-blue-500 hover:underline">Ya tienes cuenta?</a>
          </div>
          
          <button type="submit" class="w-full bg-gradient-to-t from-black to-green-500  hover:from-black hover:to-green-600 transition-all duration-300 text-white font-bold py-3 px-4 rounded-full mt-6">
            INICIAR SESIÓN
          </button>
        </form>
        <p v-if="error" class="text-red-500 mt-4 text-sm text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'public' });

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function login() {
  error.value = '';
  try {
    const res = await $fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
      credentials: 'include',
    });
    router.push('/profile');
  } catch (err) {
    console.error('Error:', err);
    error.value = err.message === 'Fail to fetch' ? 'Error de conexión' : 'Credenciales incorrectas';
  }
}
</script>