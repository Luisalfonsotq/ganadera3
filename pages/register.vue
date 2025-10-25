<!-- <template>
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
</script> -->

<!-- pages/register.vue -->
<template>
  <div class="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
    <!-- Panel Izquierdo - Formulario -->
    <div class="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 order-2 lg:order-1">
      <div class="w-full max-w-md">
        <!-- Logo Mobile -->
        <div class="lg:hidden mb-8 text-center animate-fade-in">
          <div class="inline-flex items-center gap-3 bg-gradient-to-br from-green-600 to-green-800 text-white px-6 py-3 rounded-2xl shadow-lg">
            <span class="text-3xl">🐄</span>
            <span class="font-bold text-2xl">HERDIX</span>
          </div>
        </div>

        <!-- Card del Formulario -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-t-4 border-amber-500 animate-slide-up">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
            <p class="text-gray-600">Únete a la revolución ganadera</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- Nombre -->
            <div class="relative group">
              <label for="nombre" class="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <input 
                  id="nombre"
                  v-model="nombre" 
                  type="text" 
                  placeholder="Juan Pérez"
                  required
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-gray-700"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="relative group">
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
                <input 
                  id="email"
                  v-model="email" 
                  type="email" 
                  placeholder="correo@ejemplo.com"
                  required
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-gray-700"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="relative group">
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input 
                  id="password"
                  v-model="password" 
                  type="password" 
                  placeholder="Mínimo 8 caracteres"
                  required
                  minlength="8"
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-gray-700"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">Debe tener al menos 8 caracteres</p>
            </div>

            <!-- Rol -->
            <div class="relative group">
              <label for="rol" class="block text-sm font-semibold text-gray-700 mb-2">
                Rol en la Finca
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <select 
                  id="rol" 
                  v-model="rol"
                  required
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-gray-700 appearance-none cursor-pointer bg-white"
                  style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em;">
                  <option value="" disabled>Seleccione su rol</option>
                  <option value="administrador">👔 Administrador</option>
                  <option value="veterinario">🧑‍⚕️ Veterinario</option>
                  <option value="supervisor">👷 Supervisor</option>
                  <option value="colaborador">🧑‍🌾 Colaborador</option>
                </select>
              </div>
            </div>

            <!-- Botón Submit -->
            <button 
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-6">
              <span class="relative z-10 flex items-center justify-center gap-2">
                <span v-if="!isLoading">CREAR CUENTA</span>
                <span v-else>REGISTRANDO...</span>
                <svg v-if="!isLoading" class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>

            <!-- Error Message -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 transform -translate-y-2"
              enter-to-class="opacity-100 transform translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 transform translate-y-0"
              leave-to-class="opacity-0 transform -translate-y-2">
              <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <p class="text-red-700 font-semibold">{{ error }}</p>
                </div>
              </div>
            </Transition>
          </form>

          <!-- Divider -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-center text-gray-600 text-sm">
              ¿Ya tienes cuenta? 
              <NuxtLink 
                to="/login" 
                class="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors duration-300">
                Inicia sesión aquí
              </NuxtLink>
            </p>
          </div>
        </div>

        <!-- Info adicional -->
        <div class="mt-6 text-center text-sm text-gray-500">
          <p>© 2024 HERDIX - Desarrollado por SENA</p>
        </div>
      </div>
    </div>

    <!-- Panel Derecho - Hero Section -->
    <div class="hidden lg:flex flex-col justify-center items-center w-1/2 p-8 relative overflow-hidden order-1 lg:order-2">
      <!-- Fondo con imagen y overlay -->
      <div class="absolute inset-0 bg-cover bg-center" 
           style="background-image: url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2070');">
      </div>
      <div class="absolute inset-0 bg-gradient-to-br from-green-600/95 via-amber-600/90 to-green-800/95"></div>
      
      <!-- Patrón decorativo -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <!-- Contenido -->
      <div class="z-10 text-center flex flex-col items-center animate-fade-in">
        <!-- Logo con animación -->
        <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 transform hover:scale-105 transition-all duration-300 animate-slide-up">
          <img class="w-64 h-auto" src="../assets/img/HERDIX.svg" alt="HERDIX Logo">
        </div>
        
        <!-- Texto Hero -->
        <div class="space-y-4 animate-slide-up" style="animation-delay: 0.2s">
          <h1 class="text-5xl font-bold text-white tracking-wide drop-shadow-lg">
            ¡BIENVENIDO!
          </h1>
          <h2 class="text-3xl font-bold text-amber-100 tracking-wide">
            Únete a HERDIX
          </h2>
          <p class="text-xl text-green-100 max-w-md leading-relaxed">
            Haz que tu finca vaya al siguiente nivel. Gestión inteligente para el campo moderno.
          </p>
        </div>

        <!-- Beneficios -->
        <div class="mt-12 space-y-4 w-full max-w-lg animate-fade-in" style="animation-delay: 0.4s">
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all duration-300">
            <div class="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">✅</span>
            </div>
            <div class="text-left">
              <h3 class="text-white font-bold">Registro Gratis</h3>
              <p class="text-green-100 text-sm">Sin tarjeta de crédito requerida</p>
            </div>
          </div>

          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all duration-300">
            <div class="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">⚡</span>
            </div>
            <div class="text-left">
              <h3 class="text-white font-bold">Configuración Rápida</h3>
              <p class="text-green-100 text-sm">Empieza en menos de 5 minutos</p>
            </div>
          </div>

          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all duration-300">
            <div class="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">🎯</span>
            </div>
            <div class="text-left">
              <h3 class="text-white font-bold">Resultados Inmediatos</h3>
              <p class="text-green-100 text-sm">Optimiza tu finca desde el día 1</p>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-12 grid grid-cols-3 gap-6 w-full max-w-lg animate-fade-in" style="animation-delay: 0.6s">
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-1">500+</div>
            <div class="text-green-100 text-sm">Ganaderos</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-1">50K+</div>
            <div class="text-green-100 text-sm">Animales</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-1">98%</div>
            <div class="text-green-100 text-sm">Satisfacción</div>
          </div>
        </div>
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
const password = ref('');
const rol = ref('');
const error = ref('');
const isLoading = ref(false);
const router = useRouter();
const { register } = useAuth();

async function handleRegister() {
  error.value = '';
  
  // Validación básica
  if (!nombre.value || !email.value || !password.value || !rol.value) {
    error.value = 'Por favor, completa todos los campos';
    return;
  }

  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres';
    return;
  }

  isLoading.value = true;
  
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
    error.value = err.message === 'Fail to fetch' 
      ? 'Error de conexión. Por favor, verifica tu internet.' 
      : 'No se pudo completar el registro. Verifica tus datos.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

/* Custom select arrow color on focus */
select:focus {
  outline: none;
}

/* Smooth transitions for all interactive elements */
input, select, button {
  transition: all 0.3s ease;
}

/* Remove default select arrow in IE */
select::-ms-expand {
  display: none;
}

/* Ensure proper spacing on mobile */
@media (max-width: 640px) {
  .animate-slide-up {
    animation-duration: 0.4s;
  }
}
</style>