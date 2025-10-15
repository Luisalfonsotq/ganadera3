<!-- <template>
  <div class="flex min-h-screen bg-white flex-col">
    <header class="bg-primary-blanco shadow h-16 w-full flex items-center gap-4 px-4 justify-between">
      <button class="md:hidden px-2 py-1" v-on:click="isSidebarOpen = !isSidebarOpen">
        <i-tabler-menu-2 class="w-8 h-8 text-primary-verde hover:text-black transition" />
      </button>

      <NuxtLink to="/">
        <button class="text-primary-verde hover:text-black font-bold text-3xl font-serif">HERDIX</button>
      </NuxtLink>

      <nav class="flex gap-2 justify-end md:flex space-x-2 items-center">
        <NuxtLink to="#" class="hover:text-red-500 ">
          <button class="bg-primary-verde rounded-3xl p-2 font-bold text-white">+ Crear</button>
        </NuxtLink>

        <button>
          <i-tabler:bell class="w-8 h-8 text-primary-verde hover:text-black transition" />
        </button>
      </nav>
    </header>

    <!-- Contenedor principal 
    <div class="flex flex-1 relative overflow-hidden">
      <!-- Sidebar 
      <aside
        class="w-64 p-2 bg-white transition-transform duration-300 absolute md:static inset-y-0 left-0 z-10 md:translate-x-0 border border-red-600 border-solid rounded-xl shadow"
        v-bind:class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">

        <div class="flex justify-between mb-4">
          <h2 class="font-semibold">Menú</h2>
          <button class="md:hidden text-black" v-on:click="isSidebarOpen = !isSidebarOpen">
            <i-tabler-circle-x class="size-4" />
          </button>
        </div>
      </aside>
      <!-- Overlay para móvil
      <div v-if="isSidebarOpen" class="absolute inset-0 bg-black bg-opacity-40 md:hidden"
        v-on:click="isSidebarOpen = false"></div>
      <main class="flex-grow container mx-auto px-4 py-6">
        <slot />
      </main>
    </div>

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
        <div
          class="container mx-auto flex flex-col md:flex-row items-center text-xs md:text-sm text-gray-400 justify-center">
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
    <!-- <footer class="bg-primary-verde text-white py-6 font-bold text-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-xl"> &copy; {{ new Date().getFullYear() }} Herdix. Todos los derechos reservados.</p>
      </div>

    </footer> 
  </div>
</template>

<script setup>
const isSidebarOpen = ref(false);
</script> -->

<!-- layouts/default.vue -->
<template>
  <div class="flex min-h-screen bg-white flex-col">
    <header class="bg-white shadow h-16 w-full flex items-center gap-4 px-4 justify-between">
      <button class="md:hidden px-2 py-1" v-on:click="isSidebarOpen = !isSidebarOpen">
        <i-tabler-menu-2 class="w-8 h-8 text-primary-verde hover:text-black transition" />
      </button>

      <NuxtLink to="/">
        <button class="text-primary-verde hover:text-black font-bold text-3xl font-serif">HERDIX</button>
      </NuxtLink>

      <nav class="flex gap-2 justify-end md:flex space-x-2 items-center">
        <NuxtLink to="#" class="hover:text-red-500">
          <button class="bg-primary-verde rounded-3xl p-2 font-bold text-white">+ Crear</button>
        </NuxtLink>

        <button>
          <i-tabler-bell class="w-8 h-8 text-primary-verde hover:text-black transition" />
        </button>
      </nav>
    </header>

    <!-- Contenedor principal -->
    <div class="flex flex-1 relative overflow-hidden">
      <!-- Sidebar -->
      <aside
        class="w-64 p-2 bg-white transition-transform duration-300 absolute md:static inset-y-0 left-0 z-10 md:translate-x-0 border border-red-600 border-solid rounded-xl shadow"
        v-bind:class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
        <div class="flex justify-between mb-4">
          <h2 class="font-semibold">Menú</h2>
          <button class="md:hidden text-black" v-on:click="isSidebarOpen = !isSidebarOpen">
            <i-tabler-circle-x class="size-4" />
          </button>
        </div>
        <nav>
          <ul>
            <li v-for="item in sidebarItems" :key="item.name" class="mb-2">
              <router-link :to="item.path" class="flex items-center p-2 hover:bg-gray-100 rounded">
                <component :is="item.icon" class="w-5 h-5 mr-2" />
                {{ item.name }}
              </router-link>
            </li>
            <li v-if="sidebarItems.length === 0" class="text-red-500">No hay opciones disponibles</li>
          </ul>
        </nav>
      </aside>
      <!-- Overlay para móvil -->
      <div v-if="isSidebarOpen" class="absolute inset-0 bg-black bg-opacity-40 md:hidden" v-on:click="isSidebarOpen = false"></div>
      <main class="flex-grow container mx-auto px-4 py-6">
        <slot />
      </main>
    </div>

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

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { roleSidebarConfig } from '@/utils/roleConfig';
import {$fetch} from 'ofetch';

const isSidebarOpen = ref(false);
const { user } = useAuth();

const sidebarItems = computed(() => {
  console.log('User in sidebarItems:', user.value); // Depuración
  return user.value && user.value.rol ? roleSidebarConfig[user.value.rol] || [] : [];
});

onMounted(async () => {
  console.log('Layout mounted, initial user:', user.value); // Depuración
  if(!user.value){
    try {
      const profile = await $fetch (`${useRuntimeConfig().public.apiBaseUrl}/auth/profile`, {
        credentials: 'include',
      })
      user.value = profile;
      console.log('Profile fetched in layout:', profile);
    } catch(error){
      console.error('Error fetching profile:', error);
    }
  }
});

watch(user, (newUser) => {
  console.log('User changed:', newUser); // Depuración
});
</script>