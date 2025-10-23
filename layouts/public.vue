<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-primary-blanco text-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between  items-center h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex  space-x-2">
          <span class="font-bold text-3xl text-green-800 font-serif hover:text-black transition">HERDIX</span>
        </NuxtLink>

        <!-- Links -->
        <nav class="md:flex space-x-2 flex justify-end gap-2 items-center">
          <NuxtLink to="/nosotros" class="font-bold text-green-800 hover:underline decoration-green-900">
            Nosotros
          </NuxtLink>

          <!-- Botón Login -->
          <NuxtLink to="/login"
            class="bg-gradient-to-t from-black to-green-500 hover:from-black hover:to-green-600 transition-all duration-300 text-white font-semibold py-2 px-4 rounded-3xl bg-green text-white-700">
            Iniciar sesión
          </NuxtLink>

          <!-- Botón registrarse -->
          <NuxtLink to="/register"
            class="bg-gradient-to-t from-black to-gray-300 hover:from-black hover:to-gray-400 transition-all duration-300 text-white font-semibold py-2 px-4 rounded-3xl bg-green text-white-700">
            Crear cuenta
          </NuxtLink>
        </nav>
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
import Footer from '~/components/Footer.vue';
</script>
