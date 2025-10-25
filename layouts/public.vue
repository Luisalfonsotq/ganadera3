<!-- layouts/public.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white">
    <!-- Header Mejorado -->
    <header class="bg-white shadow-md sticky top-0 z-50 border-b-2 border-green-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-20">
          <!-- Logo con Animación -->
          <NuxtLink to="/" class="flex items-center space-x-2 group">
            <div class="flex items-center gap-2">
              <!-- Icono de Vaca -->
              <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <span class="text-white text-lg md:text-xl">🐄</span>
              </div>
              <!-- Texto HERDIX -->
              <span class="font-bold text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-900 font-serif hover:from-green-800 hover:to-black transition-all duration-300">
                HERDIX
              </span>
            </div>
          </NuxtLink>

          <!-- Menu Desktop -->
          <nav class="hidden md:flex items-center space-x-6">
            <NuxtLink 
              to="/nosotros" 
              class="font-semibold text-gray-700 hover:text-green-700 transition-colors duration-300 relative group text-lg">
              Nosotros
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </NuxtLink>

            <!-- Botón Login -->
            <NuxtLink 
              to="/login"
              class="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Iniciar sesión
            </NuxtLink>

            <!-- Botón Registrarse -->
            <NuxtLink 
              to="/register"
              class="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Crear cuenta
            </NuxtLink>
          </nav>

          <!-- Botón Hamburguesa Mobile -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors duration-300"
            :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'">
            <svg v-if="!mobileMenuOpen" class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Menu Mobile (Colapsable) -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0">
          <div v-show="mobileMenuOpen" class="md:hidden pb-4 space-y-3 overflow-hidden">
            <NuxtLink 
              to="/nosotros" 
              @click="mobileMenuOpen = false"
              class="block w-full text-center font-semibold text-gray-700 hover:text-green-700 hover:bg-green-50 py-3 px-4 rounded-lg transition-all duration-300">
              Nosotros
            </NuxtLink>

            <NuxtLink 
              to="/login"
              @click="mobileMenuOpen = false"
              class="block w-full text-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              Iniciar sesión
            </NuxtLink>

            <NuxtLink 
              to="/register"
              @click="mobileMenuOpen = false"
              class="block w-full text-center bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              Crear cuenta
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </header>

    <!-- Contenido dinámico -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- Footer -->
    <Footer/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Footer from '~/components/Footer.vue'

// Estado para el menú mobile
const mobileMenuOpen = ref(false)

// Cerrar el menú cuando se cambia de ruta
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
/* Animación suave para el underline en hover */
nav a {
  position: relative;
}

/* Asegurar que el header sea sticky correctamente */
header {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.98);
}

/* Mejorar la transición del menú móvil */
.max-h-0 {
  max-height: 0;
}

.max-h-96 {
  max-height: 24rem;
}
</style>