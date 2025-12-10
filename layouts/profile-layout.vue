<!-- layouts/profile-layout.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { roleSidebarConfig, btnCrear } from '@/utils/roleConfig'
import { useNotifications } from '@/composables/useNotifications'

const { user, logout, profile } = useAuth()
const router = useRouter()
const { notifications, fetchNotifications } = useNotifications()

// Estados reactivos
const isSidebarOpen = ref(false)
const isCrearOpen = ref(false)
const isUserOpen = ref(false)
const isNotificationsOpen = ref(false)
const searchQuery = ref('')
const openSubMenus = ref([])
const activeNavItem = ref('dashboard')
const isLoadingUser = ref(false)

// Datos computados
const sidebarItems = computed(() => {
  if (!user.value || !user.value.rol) {
    console.warn('⚠️ No user or rol for sidebar:', user.value)
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
  
  for (const item of sidebarItems.value) {
    if (currentRoute === item.path || currentRoute.startsWith(item.path + '/')) {
      activeNavItem.value = item.key
      return
    }
    
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

// ✅ CARGA MEJORADA DEL USUARIO
onMounted(async () => {
  console.log('🔄 Layout mounted, checking user...')
  
  if (!user.value) {
    console.log('⚠️ No user found, fetching profile...')
    isLoadingUser.value = true
    
    try {
      await profile()
      console.log('✅ Profile loaded in layout:', user.value)
    } catch (error) {
      console.error('❌ Error fetching profile in layout:', error)
      // El middleware redirigirá a login si es necesario
    } finally {
      isLoadingUser.value = false
    }
  } else {
    console.log('✅ User already loaded:', user.value)
  }
  
  // Cargar notificaciones
  if (user.value) {
    fetchNotifications()
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
watch(user, (newUser, oldUser) => {
  console.log('👤 User changed in layout:', { 
    old: oldUser?.rol, 
    new: newUser?.rol,
    id: newUser?.id 
  })
  
  // Reinicializar navegación cuando cambia el usuario
  if (newUser && newUser !== oldUser) {
    initializeOpenSubMenus()
    updateActiveNavItem()
    fetchNotifications()
  }
}, { deep: true })

watch(() => router.currentRoute.value.path, () => {
  updateActiveNavItem()
  initializeOpenSubMenus()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <!-- Loading Overlay si el usuario está cargando -->
    <div v-if="isLoadingUser" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Cargando sesión...</p>
      </div>
    </div>

    <!-- Header / Top Navigation Bar -->
    <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
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

      <div class="flex items-center space-x-4 relative">
        <!-- Search Bar -->
        <div class="hidden md:block relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          />
          <Icon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <!-- Create Button -->
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

        <!-- Notifications -->
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
            class="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-20 custom-scrollbar">
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

        <!-- User Profile -->
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
              to="/dashboard"
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
    <div class="h-full flex flex-1 relative overflow-hidden">
      <!-- Left Sidebar -->
      <aside
        class="bg-white w-72 flex flex-col border-r border-gray-200 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        style="top:76px; height: calc(100vh - 76px);">
        
        <!-- Mobile Close Button -->
        <button
          class="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none lg:hidden"
          @click="closeSidebar">
          <Icon name="i-heroicons-x-mark" class="h-5 w-5 text-gray-500" />
        </button>
        
        <!-- User Profile Summary -->
        <div class="px-6 py-6 border-b border-gray-50 flex items-center space-x-4 bg-gradient-to-r from-white to-gray-50">
          <div class="relative">
            <img 
              :src="userAvatar" 
              class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" 
              alt="Avatar"
              @error="handleAvatarError" 
            />
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div class="overflow-hidden">
            <h3 class="font-bold text-gray-800 text-sm truncate">{{ userName }}</h3>
            <p class="text-xs text-gray-500 capitalize truncate">{{ user?.rol || 'Usuario' }}</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          <template v-for="item in sidebarItems" :key="item.key">
            <!-- Item with Submenu -->
            <div v-if="item.subItems" class="space-y-1">
              <button
                @click="toggleSubMenu(item.key)"
                class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group border border-transparent"
                :class="[
                  isActiveNavItem(item.key) || isParentActive(item.key)
                    ? 'bg-green-50 text-green-700 border-green-100 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-100'
                ]">
                <div class="flex items-center">
                  <div 
                    class="p-1.5 rounded-lg mr-3 transition-colors duration-200"
                    :class="isActiveNavItem(item.key) || isParentActive(item.key) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm'">
                    <Icon :name="item.icon" class="w-5 h-5" />
                  </div>
                  <span>{{ item.name }}</span>
                </div>
                <Icon
                  name="i-heroicons-chevron-right"
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-90': openSubMenus.includes(item.key) }" />
              </button>

              <!-- Submenu -->
              <div 
                v-show="openSubMenus.includes(item.key)" 
                class="pl-12 pr-2 space-y-1 pt-1 pb-2">
                <NuxtLink
                  v-for="subItem in item.subItems"
                  :key="subItem.key"
                  :to="subItem.path"
                  class="block px-3 py-2 text-sm rounded-lg transition-all duration-200 relative"
                  :class="[
                    isActiveNavItem(subItem.key)
                      ? 'text-green-700 font-medium bg-green-50/50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  ]"
                  @click="closeSidebar">
                  <span 
                    v-if="isActiveNavItem(subItem.key)"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-green-500 rounded-r-full">
                  </span>
                  {{ subItem.name }}
                </NuxtLink>
              </div>
            </div>

            <!-- Simple Item -->
            <NuxtLink
              v-else
              :to="item.path"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group border border-transparent"
              :class="[
                isActiveNavItem(item.key)
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-100'
              ]"
              @click="closeSidebar">
              <div 
                class="p-1.5 rounded-lg mr-3 transition-colors duration-200"
                :class="isActiveNavItem(item.key) ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm'">
                <Icon :name="item.icon" class="w-5 h-5" />
              </div>
              <span>{{ item.name }}</span>
            </NuxtLink>
          </template>

          <div v-if="sidebarItems.length === 0" class="text-center py-8">
            <p class="text-gray-400 text-sm">No hay opciones disponibles</p>
          </div>
        </nav>

        <!-- Footer Links -->
        <div class="p-6 border-t border-gray-100 bg-gray-50/30">
          <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 justify-center">
            <NuxtLink to="/ayuda" class="hover:text-green-600 transition-colors">Ayuda</NuxtLink>
            <NuxtLink to="/privacidad" class="hover:text-green-600 transition-colors">Privacidad</NuxtLink>
            <NuxtLink to="/politicas" class="hover:text-green-600 transition-colors">Términos</NuxtLink>
          </div>
          <p class="text-[10px] text-gray-400 mt-4 text-center font-medium">HERDIX &copy; {{ new Date().getFullYear() }}</p>
        </div>
      </aside>

      <div class="flex-1 flex flex-col h-full overflow-y-auto lg:ml-72 transition-all duration-300">
        <main class="flex-1 p-6 lg:p-8">
          <slot />
        </main>
        <Footer/>
      </div>
    </div>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none;
}

.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>