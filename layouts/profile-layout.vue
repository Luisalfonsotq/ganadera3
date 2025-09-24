<!-- / layouts/profile-layout.vue
<template>
  <div class="flex min-h-screen bg-white flex-col">
    <header class="bg-white shadow h-16 w-full flex items-center gap-4 px-4 justify-between">
      <button class="md:hidden px-2 py-1" v-on:click="isSidebarOpen = !isSidebarOpen">
        <Icon name="heroicons-bars-3" class="w-8 h-8 text-primary-verde hover:text-black transition" />
      </button>

      <NuxtLink to="/">
        <button class="text-green-800 hover:text-black font-bold text-3xl font-serif">HERDIX</button>
      </NuxtLink>

      <nav class="flex gap-2 justify-end md:flex space-x-2 items-center">
        <NuxtLink to="#" class="hover:text-red-500">
          <button class="bg-primary-verde rounded-3xl p-2 font-bold text-white">+ Crear</button>
        </NuxtLink>

        <!-- BOTÓN CREAR 
        <div class="relative" @keydown.esc="isCrearOpen = false">
          <button
            class="bg-gradient-to-b from-emerald-600 to-emerald-900 hover:from-red-500 hover:to-red-700 
         text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 flex items-center space-x-2"
            @click="isCrearOpen = !isCrearOpen">
            <Icon name="heroicons-plus" class="font-bold text-white"/>
            <i-tabler-plus></i-tabler-plus>
            <span>Crear</span>
          </button>

          <!-- Menú desplegable -
          <div v-show="isCrearOpen" v-cloak
            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div class="py-1">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                @click="isCrearOpen = false">
                Opción 1
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                @click="isCrearOpen = false">
                Opción 2
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                @click="isCrearOpen = false">
                Opción 3
              </a>
            </div>
          </div>
        </div>


        <button>
          <Icon name="heroicons-bell" class="w-8 h-8 text-primary-verde hover:text-black transition" />
        </button>
      </nav>
    </header>

    <!-- Contenedor principal -
    <div class="flex flex-1 relative overflow-hidden">
      <!-- Sidebar --
      <aside
        class="w-64 p-2 bg-white transition-transform duration-300 absolute md:static inset-y-0 left-0 z-10 md:translate-x-0 border border-red-600 border-solid rounded-xl shadow"
        v-bind:class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
        <div class="flex justify-between mb-4">
          <h2 class="font-semibold">Menú</h2>
          <button class="md:hidden text-slate-400 font-semibold" v-on:click="isSidebarOpen = !isSidebarOpen">
            <Icon name="heroicons-arrow-left-circle" class="size-4" />
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
      <!-- Overlay para móvil -
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { roleSidebarConfig } from '@/utils/roleConfig';
import { $fetch } from 'ofetch';

const isCrearOpen = ref(false)

// cerrar al hacer click afuera
function handleClickOutside(event) {
  const target = event.target
  if (!target.closest('.relative')) {
    isCrearOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})


const isSidebarOpen = ref(false);
const { user } = useAuth();

const sidebarItems = computed(() => {
  console.log('User in sidebarItems:', user.value); // Depuración
  return user.value && user.value.rol ? roleSidebarConfig[user.value.rol] || [] : [];
});

onMounted(async () => {
  console.log('Layout mounted, initial user:', user.value); // Depuración
  if (!user.value) {
    try {
      const profile = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/auth/profile`, {
        credentials: 'include',
      })
      user.value = profile;
      console.log('Profile fetched in layout:', profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }
});

watch(user, (newUser) => {
  console.log('User changed:', newUser); // Depuración
});
</script> -->


<template>
  <div class="flex min-h-screen bg-white flex-col">
    <header class="bg-primary-blanco shadow h-16 w-full flex items-center gap-4 px-4 justify-between">
      <button class="md:hidden px-2 py-1" @click="isSidebarOpen = !isSidebarOpen">
        <Icon name="i-tabler-menu-2" class="w-8 h-8 text-primary-verde hover:text-black transition" />
      </button>

      <NuxtLink to="/">
        <button class="text-emerald-900 hover:text-black font-bold text-3xl font-serif">HERDIX</button>
      </NuxtLink>

      <nav class="flex gap-2 justify-end md:flex space-x-2 items-center">
        <!-- BOTÓN CREAR -->
        <div class="relative" @keydown.esc="isCrearOpen = false">
          <button
            class="bg-gradient-to-t from-emerald-900 to-emerald-600 hover:from-red-700 hover:to-red-500 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 flex items-center space-x-2"
            @click="isCrearOpen = !isCrearOpen">
            <Icon name="i-tabler-plus" class="w-4 h-4" />
            <span>Crear</span>
          </button>

          <!-- Menú desplegable -->
          <div v-show="isCrearOpen" v-cloak
            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div class="py-1" v-if="btnCrearItems.length > 0">
              <NuxtLink
                v-for="item in btnCrearItems"
                :key="item.name"
                :to="item.path"
                class="flex items-center p-2 hover:bg-gray-100 rounded transition-colors"
                @click="isCrearOpen = false">
                <Icon :name="item.icon" class="w-5 h-5 mr-2 text-gray-500" />
                <span>{{ item.name }}</span>
              </NuxtLink>
            </div>
            <div v-else class="p-2 text-gray-500 text-sm">No hay opciones disponibles</div>
          </div>
        </div>

        <!-- Campanita de notificaciones -->
        <button>
          <Icon name="i-tabler-bell" class="w-8 h-8 text-primary-verde hover:text-black transition" />
        </button>
      </nav>
    </header>

    <!-- Contenedor principal -->
    <div class="flex flex-1 relative overflow-hidden">
      <!-- Sidebar -->
      <aside
        class="w-64 p-2 bg-white transition-transform duration-300 absolute md:static inset-y-0 left-0 z-10 md:translate-x-0 border border-red-600 border-solid rounded-xl shadow"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
        <div class="flex justify-between mb-4">
          <h2 class="font-semibold">Menú</h2>
          <button class="md:hidden text-black" @click="isSidebarOpen = !isSidebarOpen">
            <Icon name="i-tabler-circle-x" class="size-4" />
          </button>
        </div>
        <nav>
          <ul>
            <li v-for="item in sidebarItems" :key="item.name" class="mb-2">
              <NuxtLink
                :to="item.path"
                class="flex items-center p-2 hover:bg-gray-100 rounded transition-colors">
                <Icon :name="item.icon" class="w-5 h-5 mr-2 text-gray-500" />
                <span>{{ item.name }}</span>
              </NuxtLink>
            </li>
            <li v-if="sidebarItems.length === 0" class="text-red-500 p-2">No hay opciones disponibles</li>
          </ul>
        </nav>
      </aside>
      <!-- Overlay para móvil -->
      <div v-if="isSidebarOpen" class="absolute inset-0 bg-black bg-opacity-40 md:hidden"
        @click="isSidebarOpen = false"></div>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { roleSidebarConfig, btnCrear } from '@/utils/roleConfig'
import { $fetch } from 'ofetch'

// Botón crear
const isCrearOpen = ref(false)

// Sidebar
const isSidebarOpen = ref(false)
const { user } = useAuth()

const sidebarItems = computed(() => {
  console.log('User in sidebarItems:', user.value)
  if (!user.value || !user.value.rol) {
    return []
  }
  return roleSidebarConfig[user.value.rol] || []
})

const btnCrearItems = computed(() => {
  if (!user.value || !user.value.rol) {
    return []
  }
  return btnCrear[user.value.rol] || []
})

// Cerrar menú crear al hacer click afuera
function handleClickOutside(event) {
  const target = event.target
  if (!target.closest('.relative')) {
    isCrearOpen.value = false
  }
}

onMounted(async () => {
  console.log('Layout mounted, initial user:', user.value)
  // Asegurar que los iconos estén disponibles
  
  if (!user.value) {
    try {
      const profile = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/auth/profile`, {
        credentials: 'include',
      })
      user.value = profile
      console.log('Profile fetched in layout:', profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
  
  // Agregar listener para click fuera
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(user, (newUser) => {
  console.log('User changed:', newUser)
})
</script>

<style scoped>
/* Estilos adicionales para el menú desplegable */
.relative {
  position: relative;
}

[v-cloak] {
  display: none;
}

/* Asegurar transiciones suaves */
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>