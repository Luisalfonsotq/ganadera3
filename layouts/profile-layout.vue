<!-- profile-layout -->
<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <!-- Header / Top Navigation Bar -->
    <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <!-- Logo and Mobile Sidebar Toggle -->
      <div class="flex items-center">
        <button
          class="lg:hidden p-2 mr-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          @click="isSidebarOpen = !isSidebarOpen">
          <Icon name="i-heroicons-bars-3" class="h-6 w-6 text-gray-700" />
        </button>
        <NuxtLink to="/">
          <h1 class="text-2xl font-bold text-green-700 hover:text-green-800 transition-colors">HERDIX</h1>
        </NuxtLink>
      </div>

      <!-- Right side of the Header -->
      <div class="flex items-center space-x-4 relative">
        <!-- Search Bar (Optional) -->
        <div class="hidden md:block relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          />
          <Icon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <!-- Create Button with Dropdown -->
        <div class="relative create-dropdown-container" @keydown.esc="isCrearOpen = false">
          <button
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 flex items-center space-x-2"
            @click="isCrearOpen = !isCrearOpen">
            <Icon name="i-heroicons-plus" class="h-5 w-5" />
            <span>Crear</span>
          </button>
          <div
            v-show="isCrearOpen"
            v-cloak
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
            <div v-if="btnCrearItems.length > 0">
              <NuxtLink
                v-for="item in btnCrearItems"
                :key="item.name"
                :to="item.path"
                class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                @click="isCrearOpen = false">
                <div class="flex items-center">
                  <Icon :name="item.icon" class="w-4 h-4 mr-2 text-gray-500" />
                  <span class="text-sm">{{ item.name }}</span>
                </div>
              </NuxtLink>
            </div>
            <div v-else class="px-4 py-2 text-gray-500 text-sm">No hay opciones disponibles</div>
          </div>
        </div>

        <!-- Notifications Icon with Badge -->
        <div class="relative notifications-panel-container" @keydown.esc="isNotificationsOpen = false">
          <button
            class="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            @click="isNotificationsOpen = !isNotificationsOpen">
            <Icon name="i-heroicons-bell" class="h-6 w-6 text-gray-700" />
            <span
              v-if="notificationCount > 0"
              class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {{ notificationCount }}
            </span>
          </button>
          <div
            v-show="isNotificationsOpen"
            v-cloak
            class="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-20">
            <div class="px-4 py-2 font-semibold text-gray-800 border-b border-gray-200">Notificaciones</div>
            <div v-if="notifications.length > 0" class="max-h-64 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.title"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                <p class="font-medium" :class="{
                  'text-red-600': notification.type === 'urgent',
                  'text-orange-600': notification.type === 'warning',
                  'text-blue-600': notification.type === 'info'
                }">{{ notification.title }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
              </div>
            </div>
            <div v-else class="px-4 py-2 text-gray-500 text-sm">No hay notificaciones</div>
            <NuxtLink
              to="/notificaciones"
              class="block text-center text-green-600 hover:text-green-800 py-2 border-t border-gray-200 text-sm"
              @click="isNotificationsOpen = false">
              Ver todas
            </NuxtLink>
          </div>
        </div>

        <!-- User Profile Dropdown -->
        <div class="relative user-dropdown-container" @keydown.esc="isUserOpen = false">
          <button
            class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            @click="isUserOpen = !isUserOpen">
            <img
              :src="userAvatar"
              :alt="userName"
              class="w-8 h-8 rounded-full border-2 border-green-500"
              @error="handleAvatarError"
            />
            <span class="hidden md:block text-gray-700 font-medium">{{ userName }}</span>
            <Icon name="i-heroicons-chevron-down" class="h-4 w-4 text-gray-500" />
          </button>
          <div
            v-show="isUserOpen"
            v-cloak
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              @click="isUserOpen = false">
              Mi Perfil
            </NuxtLink>
            <NuxtLink
              to="/configuracion/cuenta"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              @click="isUserOpen = false">
              Configuración de Cuenta
            </NuxtLink>
            <div class="border-t border-gray-200 my-1"></div>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="h-full flex flex-1 relative overflow-auto">
      <!-- Left Sidebar (Desktop and Mobile) -->
      <aside
        class="bg-white w-64 p-6 shadow-lg lg:block fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out rounded-xl"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        style="top:76px; height: calc(100vh - 76px);"
        >
        <!-- Close button for mobile sidebar -->
        <button
          class="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 lg:hidden"
          @click="closeSidebar">
          <Icon name="i-heroicons-x-mark" class="h-6 w-6 text-gray-700" />
        </button>
        
        <h2 class="text-lg font-semibold text-gray-800 mb-6">Navegación Principal</h2>
        <nav>
          <ul>
            <li v-for="item in sidebarItems" :key="item.key" class="mb-2">
              <!-- Main navigation item -->
              <button
                v-if="item.subItems"
                @click="toggleSubMenu(item.key)"
                class="flex items-center w-full py-2 px-4 rounded-md text-left transition duration-200 text-gray-700 hover:bg-gray-100"
                :class="{
                  'bg-green-100 text-green-700 font-semibold': isActiveNavItem(item.key),
                  'bg-gray-100 text-gray-700 font-semibold': isParentActive(item.key)
                }">
                <Icon :name="item.icon" class="w-5 h-5 mr-3" />
                <span class="flex-1">{{ item.name }}</span>
                <Icon
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': openSubMenus.includes(item.key) }" />
              </button>
              
              <NuxtLink
                v-else
                :to="item.path"
                class="flex items-center w-full py-2 px-4 rounded-md text-left transition duration-200 text-gray-700 hover:bg-gray-100"
                :class="{ 'bg-green-100 text-green-700 font-semibold': isActiveNavItem(item.key) }"
                @click="closeSidebar">
                <Icon :name="item.icon" class="w-5 h-5 mr-3" />
                <span>{{ item.name }}</span>
              </NuxtLink>

              <!-- Sub-items -->
              <ul
                v-if="item.subItems"
                v-show="openSubMenus.includes(item.key)"
                class="ml-8 mt-1 space-y-1">
                <li v-for="subItem in item.subItems" :key="subItem.key">
                  <NuxtLink
                    :to="subItem.path"
                    class="block w-full py-1 px-3 rounded-md text-left text-sm transition duration-200 text-gray-600 hover:bg-gray-50"
                    :class="{ 'bg-green-50 text-green-600 font-medium': isActiveNavItem(subItem.key) }"
                    @click="closeSidebar">
                    {{ subItem.name }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
            <li v-if="sidebarItems.length === 0" class="text-red-500 p-2">No hay opciones disponibles</li>
          </ul>
        </nav>

        <!-- Sidebar Footer Links -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
          <NuxtLink to="/privacidad" class="block hover:text-green-700">Condiciones de privacidad</NuxtLink>
          <NuxtLink to="/politicas" class="block hover:text-green-700">Políticas y seguridad</NuxtLink>
          <NuxtLink to="/como-funciona" class="block hover:text-green-700">Cómo funciona HERDIX</NuxtLink>
          <NuxtLink to="/funciones-nuevas" class="block hover:text-green-700">Prueba funciones nuevas</NuxtLink>
        </div>
      </aside>

      <!-- Overlay para móvil -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
        @click="closeSidebar"></div>

      <!-- Main Content Area - Dashboard View -->
      <main class="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-64">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-green-800 text-white py-4 text-center text-sm mt-auto rounded-t-lg">
      <p>HERDIX todos los derechos reservados. 2025.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { roleSidebarConfig, btnCrear, roleNotifications } from '@/utils/roleConfig'
import { $fetch } from 'ofetch'

const { user, logout } = useAuth()
const router = useRouter()

// Estados reactivos
const isSidebarOpen = ref(false)
const isCrearOpen = ref(false)
const isUserOpen = ref(false)
const isNotificationsOpen = ref(false)
const searchQuery = ref('')
const openSubMenus = ref([])
const activeNavItem = ref('dashboard')

// Datos computados
const sidebarItems = computed(() => {
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

const notifications = computed(() => {
  if (!user.value || !user.value.rol) {
    return []
  }
  return roleNotifications[user.value.rol] || []
})

const notificationCount = computed(() => {
  return notifications.value.length
})

const userName = computed(() => {
  return user.value?.nombre || user.value?.email || 'Usuario'
})

const userAvatar = computed(() => {
  return user.value?.avatar || 'https://placehold.co/40x40/aabbcc/ffffff?text=U'
})

// Métodos
function closeSidebar() {
  isSidebarOpen.value = false
}

function toggleSubMenu(key) {
  const index = openSubMenus.value.indexOf(key)
  if (index > -1) {
    openSubMenus.value.splice(index, 1)
  } else {
    openSubMenus.value.push(key)
  }
}

function isActiveNavItem(key) {
  return activeNavItem.value === key
}

function isParentActive(parentKey) {
  const currentRoute = router.currentRoute.value.path
  const parentItem = sidebarItems.value.find(item => item.key === parentKey)
  if (parentItem && parentItem.subItems) {
    return parentItem.subItems.some(subItem => currentRoute.startsWith(subItem.path))
  }
  return false
}

function handleAvatarError(event) {
  event.target.src = 'https://placehold.co/40x40/aabbcc/ffffff?text=U'
}

async function handleLogout() {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Cerrar menús al hacer click afuera
function handleClickOutside(event) {
  const target = event.target
  
  if (!target.closest('.create-dropdown-container')) {
    isCrearOpen.value = false
  }
  if (!target.closest('.notifications-panel-container')) {
    isNotificationsOpen.value = false
  }
  if (!target.closest('.user-dropdown-container')) {
    isUserOpen.value = false
  }
}

// Inicializar submenús abiertos basado en la ruta actual
function initializeOpenSubMenus() {
  const currentRoute = router.currentRoute.value.path
  sidebarItems.value.forEach(item => {
    if (item.subItems) {
      const hasActiveSubItem = item.subItems.some(subItem =>
        currentRoute.startsWith(subItem.path)
      )
      if (hasActiveSubItem && !openSubMenus.value.includes(item.key)) {
        openSubMenus.value.push(item.key)
      }
    }
  })
}

// Actualizar elemento activo basado en la ruta
function updateActiveNavItem() {
  const currentRoute = router.currentRoute.value.path
  
  // Buscar en elementos principales
  for (const item of sidebarItems.value) {
    if (currentRoute === item.path || currentRoute.startsWith(item.path + '/')) {
      activeNavItem.value = item.key
      return
    }
    
    // Buscar en subelementos
    if (item.subItems) {
      for (const subItem of item.subItems) {
        if (currentRoute === subItem.path || currentRoute.startsWith(subItem.path + '/')) {
          activeNavItem.value = subItem.key
          return
        }
      }
    }
  }
}

onMounted(async () => {
  console.log('Layout mounted, initial user:', user.value)
  
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
  
  // Inicializar navegación
  initializeOpenSubMenus()
  updateActiveNavItem()
  
  // Agregar listeners
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watchers
watch(user, (newUser) => {
  console.log('User changed:', newUser)
})

watch(() => router.currentRoute.value.path, () => {
  updateActiveNavItem()
  initializeOpenSubMenus()
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

<style scoped>
/* Estilos adicionales para el layout */
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

/* Custom transition for card hover effect */
.card-transition {
  transition: all 0.3s ease-in-out;
}

.card-transition:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

/* Sidebar animations */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

/* Dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-in-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Notification badge pulse animation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.notification-badge {
  animation: pulse 2s infinite;
}

/* Scrollbar personalizado para el panel de notificaciones */
.notifications-scroll::-webkit-scrollbar {
  width: 4px;
}

.notifications-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.notifications-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.notifications-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Efectos de hover mejorados */
.nav-item-hover {
  position: relative;
  overflow: hidden;
}

.nav-item-hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.nav-item-hover:hover::before {
  left: 100%;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sidebar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 30;
  }
}

/* Focus states mejorados */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
}

/* Loading states */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Dark mode support (preparación futura) */
@media (prefers-color-scheme: dark) {
  .dark-mode-ready {
    transition: background-color 0.3s ease, color 0.3s ease;
  }
}
</style>