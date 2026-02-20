<!-- pages/login.vue -->
<template>
  <div class="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
    <!-- Panel Izquierdo - Hero Section -->
    <div class="hidden lg:flex flex-col justify-center items-center w-1/2 p-8 relative overflow-hidden">
      <!-- Fondo con imagen y overlay -->
      <div class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074');">
      </div>
      <div class="absolute inset-0 bg-gradient-to-br from-green-600/95 via-green-700/95 to-green-900/95"></div>

      <!-- Patrón decorativo -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20">
      </div>

      <!-- Contenido -->
      <div class="z-10 text-center flex flex-col items-center animate-fade-in">
        <!-- Logo con animación -->
        <div
          class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 transform hover:scale-105 transition-all duration-300 animate-slide-up">
          <img class="w-64 h-auto" src="../assets/img/HERDIX.svg" alt="HERDIX Logo">
        </div>

        <!-- Texto Hero -->
        <div class="space-y-4 animate-slide-up" style="animation-delay: 0.2s">
          <h1 class="text-5xl font-bold text-white tracking-wide drop-shadow-lg">
            ¡BIENVENIDO DE NUEVO!
          </h1>
          <p class="text-xl text-green-100 max-w-md leading-relaxed">
            De vuelta al campo, de vuelta al progreso. Gestiona tu finca de manera inteligente.
          </p>
        </div>

        <!-- Características -->
        <div class="mt-12 grid grid-cols-3 gap-6 w-full max-w-lg animate-fade-in" style="animation-delay: 0.4s">
          <div class="text-center transform hover:scale-110 transition-all duration-300">
            <div
              class="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              <span class="text-3xl">🐄</span>
            </div>
            <p class="text-white text-sm font-semibold">Control Total</p>
          </div>
          <div class="text-center transform hover:scale-110 transition-all duration-300">
            <div
              class="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              <span class="text-3xl">📊</span>
            </div>
            <p class="text-white text-sm font-semibold">Datos en Tiempo Real</p>
          </div>
          <div class="text-center transform hover:scale-110 transition-all duration-300">
            <div
              class="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              <span class="text-3xl">🚀</span>
            </div>
            <p class="text-white text-sm font-semibold">Máxima Eficiencia</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Derecho - Formulario -->
    <div class="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-8 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Logo Mobile -->
        <div class="lg:hidden mb-8 text-center animate-fade-in">
          <div
            class="inline-flex items-center gap-3 bg-gradient-to-br from-green-600 to-green-800 text-white px-6 py-3 rounded-2xl shadow-lg">
            <span class="text-3xl">🐄</span>
            <span class="font-bold text-2xl">HERDIX</span>
          </div>
        </div>

        <!-- Card del Formulario -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-t-4 border-green-600 animate-slide-up">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
            <p class="text-gray-600">Accede a tu cuenta de HERDIX</p>
          </div>

          <form @submit.prevent="login" class="space-y-6">
            <!-- Email -->
            <div class="relative group">
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input id="email" v-model="email" type="email" placeholder="correo@ejemplo.com" required
                  class="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                  :class="errors.email ? 'border-red-300 focus:border-red-600 focus:ring-red-200' : 'border-gray-200 focus:border-green-600 focus:ring-green-200'" />
                <p v-if="errors.email" class="mt-1 text-xs text-red-600 font-medium animate-pulse">{{ errors.email }}
                </p>
              </div>
            </div>

            <!-- Password -->
            <div class="relative group">
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••" required
                  class="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                  :class="errors.password ? 'border-red-300 focus:border-red-600 focus:ring-red-200' : 'border-gray-200 focus:border-green-600 focus:ring-green-200'" />
                <p v-if="errors.password" class="mt-1 text-xs text-red-600 font-medium animate-pulse">{{ errors.password
                }}
                </p>
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Opciones -->
            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center text-gray-600 cursor-pointer group">
                <input type="checkbox"
                  class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer" />
                <span class="ml-2 group-hover:text-green-700 transition-colors duration-300">
                  Recordarme
                </span>
              </label>
              <NuxtLink to="/register"
                class="text-green-600 hover:text-green-800 font-semibold hover:underline transition-all duration-300">
                ¿No tienes cuenta?
              </NuxtLink>
            </div>

            <!-- Botón Submit -->
            <button type="submit" :disabled="isLoading"
              class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group">
              <span class="relative z-10 flex items-center justify-center gap-2">
                <span v-if="!isLoading">INICIAR SESIÓN</span>
                <span v-else>INICIANDO...</span>
                <svg v-if="!isLoading" class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left">
              </div>
            </button>

            <!-- Error Message -->
            <Transition enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 transform -translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 transform translate-y-0"
              leave-to-class="opacity-0 transform -translate-y-2">
              <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd" />
                  </svg>
                  <p class="text-red-700 font-semibold">{{ error }}</p>
                </div>
              </div>
            </Transition>
          </form>

          <!-- Divider -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <p class="text-center text-gray-600 text-sm">
              ¿Necesitas ayuda?
              <a href="#"
                class="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors duration-300">
                Contáctanos
              </a>
            </p>
          </div>
        </div>

        <!-- Info adicional -->
        <div class="mt-6 text-center text-sm text-gray-500">
          <p>© HERDIX</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'public' });

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const error = ref('');
const isLoading = ref(false);
const router = useRouter();

// Errores específicos por campo para consistencia con register
const errors = ref({
  email: '',
  password: ''
});

// Uso del composable de validación
const { validateEmail, validateRequired } = useFormValidation();

// Limpiar errores al escribir
watch([email, password], () => {
  errors.value = { email: '', password: '' };
  error.value = '';
});

async function login() {
  error.value = '';
  errors.value.email = ''
  errors.value.password = ''

  // 1. Validaciones locales antes de la petición
  const emailError = validateEmail(email.value);
  const passwordError = validateRequired(password.value, 'Contraseña');

  // Si hay errores, no continuar
  if (emailError || passwordError) {
    errors.value.email = emailError;
    errors.value.password = passwordError;
    return;
  }

  isLoading.value = true;
  try {
    // 2. Intento de autenticación
    const res = await $fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
      credentials: 'include',
    });
    router.push('/dashboard');
  } catch (err) {
    // 3. Manejo de errores
    console.error('Detalle del error:', err);

    // Verificamos el status de la respuesta desde ofetch/Nuxt
    const status = err.status || err.statusCode || err.response?.status;
    const errorData = err.data || err.response?._data;

    if (status === 401 || status === 404) {
      error.value = 'Credenciales incorrectas. Verifica tu correo electrónico y contraseña.';
    } else if (status === 403) {
      error.value = 'Tu cuenta aún no ha sido aprobada por un administrador.';
    } else if (errorData && errorData.message) {
      error.value = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
    } else {
      error.value = 'No se pudo conectar con el servidor. Por favor, revisa tus datos o tu conexión e intenta de nuevo más tarde.';
    }
    console.error('Error capturado, status:', status);
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
</style>