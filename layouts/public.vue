<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-primary-blanco text-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between  items-center h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex  space-x-2">
          <span class="font-bold text-2xl text-primary-verde hover:text-black transition">HERDIX</span>
        </NuxtLink>

        <!-- Links -->
        <nav class="md:flex space-x-2 flex justify-end gap-2 items-center">
          <NuxtLink to="/nosotros" class="font-bold text-primary-verde hover:text-black">
            Nosotros
          </NuxtLink>

          <!-- Botón Login -->
          <NuxtLink to="/login"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl bg-green text-white-700 transition">
            Iniciar sesión
          </NuxtLink>

          <!-- Botón registrarse -->
          <NuxtLink to="/register"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl bg-green text-white-700 transition">
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
    <!-- <footer class="bg-primary-verde text-white font-bold py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-xl">&copy; {{ new Date().getFullYear() }} Herdix. Todos los derechos reservados.</p>
      </div>
    </footer> -->

    <footer class="bg-green-600 text-white">
    <div class="container mx-auto py-4 px-6 md:px-12 flex justify-center items-center">
        <ul class="flex space-x-8 text-sm md:text-base font-medium">
            <li><a href="#" class="hover:underline">HOME</a></li>
            <li><a href="#" class="hover:underline">ABOUT US</a></li>
            <li><a href="#" class="hover:underline">PRICING</a></li>
            <li><a href="#" class="hover:underline">TESTIMONIALS</a></li>
            <li><a href="#" class="hover:underline">BLOG</a></li>
            <li><a href="#" class="hover:underline">CONTACT</a></li>
        </ul>
    </div>

    <div class="bg-black text-white py-4 px-6 md:px-12">
        <div class="container mx-auto flex flex-col md:flex-row items-center text-xs md:text-sm text-gray-400 justify-center">
            <div class="text-center md:text-left mb-2 md:mb-0">
                <p>&copy; Todos los derechos reservados - HERDIX </p>
                <div class="mt-1 space-x-4">
                    <a href="#" class="hover:underline">Legal notice</a>
                    <span>|</span>
                    <a href="#" class="hover:underline">Privacy Policy</a>
                    <span>|</span>
                    <a href="#" class="hover:underline">Cookies Policy</a>
                </div>
            </div>
            
            <div class="flex space-x-4">
                <a href="#" aria-label="Facebook" class="hover:text-white">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="LinkedIn" class="hover:text-white">
                    <i class="fab fa-linkedin-in"></i>
                </a>
            </div>
        </div>
    </div>
</footer>
  </div>
</template>
