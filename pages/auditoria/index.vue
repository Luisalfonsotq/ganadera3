<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAuditoria } from '@/composables/useAuditoria'
import { useFinca } from '@/composables/useFinca'

definePageMeta({
  layout: 'profile-layout'
})

const { user } = useAuth()
const { getAllFincas } = useFinca()
const { isLoading, logs, total, totalPages, error, fetchLogs } = useAuditoria()

// Pagination
const page = ref(1)
const limit = ref(15)

// Filters
const searchEntidad = ref('')
const searchAccion = ref('')

// Fincas
const fincas = ref([])
const selectedFincaId = ref(null)

// Acciones disponibles
const accionesPosibles = [
  'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'REPORT_GENERATION'
]

async function loadFincasYData() {
  // Si el perfil no se ha cargado completamente, intentamos reobtener si es necesario, 
  // pero ya asumiendo que el layout lo manejó.
  if (!user.value || !user.value.id) return
  
  try {
    const { data } = await getAllFincas(user.value.id, user.value.rol)
    if (data.value && data.value.length > 0) {
      fincas.value = data.value
      selectedFincaId.value = data.value[0].id
      loadData()
    } else {
      // error.value = 'No se encontraron fincas.' // (Opcional)
    }
  } catch(e) {
    console.error("Error cargando fincas:", e)
  }
}

function loadData() {
  if (!selectedFincaId.value) return

  fetchLogs(selectedFincaId.value, {
    page: page.value,
    limit: limit.value,
    entidad: searchEntidad.value,
    accion: searchAccion.value
  })
}

watch([page, searchEntidad, searchAccion, selectedFincaId], () => {
  loadData()
})

onMounted(() => {
  if (user.value?.rol === 'Colaborador' || user.value?.rol === 'Veterinario') {
     console.warn('Usuario no autorizado para auditoría')
  }
  
  loadFincasYData()
})

// Esperamos a que el usuario se cargue en caso de que tarde
watch(() => user.value, (newUser) => {
  if (newUser && newUser.id && fincas.value.length === 0) {
    loadFincasYData()
  }
})

// UI Helpers
const actionColors = {
  CREATE: 'bg-green-100 text-green-800 border-green-200',
  UPDATE: 'bg-blue-100 text-blue-800 border-blue-200',
  DELETE: 'bg-red-100 text-red-800 border-red-200',
  LOGIN: 'bg-purple-100 text-purple-800 border-purple-200',
  LOGOUT: 'bg-gray-100 text-gray-800 border-gray-200',
  EXPORT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  REPORT_GENERATION: 'bg-orange-100 text-orange-800 border-orange-200',
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

function getBadgeClass(accion) {
  return actionColors[accion] || 'bg-gray-100 text-gray-800 border-gray-200'
}

function previousPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 border-l-4 border-green-600 pl-4 mb-2">
          Auditoría de Actividad
        </h1>
        <p class="text-gray-500 max-w-2xl px-4">
          Visualiza quién ha realizado qué acciones dentro del sistema de gestión de la finca.
        </p>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
      <div class="w-full md:w-1/3">
        <label for="finca" class="block text-sm font-medium text-gray-700 mb-1">Finca:</label>
        <div class="relative">
          <select
            id="finca"
            v-model="selectedFincaId"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-lg"
            :disabled="fincas.length === 0"
          >
            <option v-for="finca in fincas" :key="finca.id" :value="finca.id">{{ finca.nombre }}</option>
            <option v-if="fincas.length === 0" value="" disabled>Cargando fincas...</option>
          </select>
        </div>
      </div>
      <div class="w-full md:w-1/3">
        <label for="entidad" class="block text-sm font-medium text-gray-700 mb-1">Módulo/Entidad:</label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Icon name="i-heroicons-cube" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="entidad"
            v-model="searchEntidad"
            class="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2 transition-all duration-300"
            placeholder="Ej: animales, finca, reportes..."
          />
        </div>
      </div>
      <div class="w-full md:w-1/3">
        <label for="accion" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Acción:</label>
        <div class="relative">
          <select
            id="accion"
            v-model="searchAccion"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-lg"
          >
            <option value="">Todas las acciones</option>
            <option v-for="act in accionesPosibles" :key="act" :value="act">{{ act }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 relative min-h-[400px]">
      
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-10 transition-all duration-300">
        <div class="flex flex-col items-center">
          <Icon name="i-heroicons-arrow-path" class="w-12 h-12 text-green-500 animate-spin mb-4" />
          <p class="text-gray-600 font-medium">Cargando registros de auditoría...</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha / Hora</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acción</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Módulo/ID</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dirección IP</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Detalles</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <template v-if="logs.length > 0">
              <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ formatDate(log.fecha) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase border-2 border-white shadow-sm ring-1 ring-gray-100 text-xs">
                      {{ log.usuario?.nombre?.substring(0, 2) || 'N/A' }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ log.usuario?.nombre || 'Desconocido' }}</div>
                      <div class="text-xs text-gray-500">{{ log.usuario?.email || 'N/A' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border"
                    :class="getBadgeClass(log.accion)">
                    {{ log.accion }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 capitalize font-medium">{{ log.entidad || 'N/A' }}</div>
                  <div class="text-xs text-gray-500" v-if="log.entidad_id">ID Ref: #{{ log.entidad_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {{ log.ip_address || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <details v-if="log.detalles && Object.keys(log.detalles).length > 0" class="relative group cursor-pointer inline-block text-left" tabindex="0">
                    <summary class="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-xs font-medium outline-none list-none">
                      <Icon name="i-heroicons-document-magnifying-glass" class="w-4 h-4 mr-1" />
                      Ver JSON
                    </summary>
                    <div class="absolute right-0 bottom-full mb-2 p-3 bg-gray-900 text-gray-100 rounded-lg w-64 md:w-80 shadow-xl z-50 max-h-48 overflow-y-auto hidden group-open:block">
                      <pre class="text-[10px] font-mono whitespace-pre-wrap text-left">{{ JSON.stringify(log.detalles, null, 2) }}</pre>
                    </div>
                  </details>
                  <span v-else class="text-gray-400 italic text-xs">Sin detalles</span>
                </td>
              </tr>
            </template>
            <tr v-else-if="!isLoading">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <Icon name="i-heroicons-document-magnifying-glass" class="h-16 w-16 text-gray-300 mb-4" />
                  <p class="text-lg font-medium">No hay registros</p>
                  <p class="text-sm">No se encontraron eventos de auditoría que coincidan con los filtros.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="previousPage" :disabled="page <= 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
            Anterior
          </button>
          <button @click="nextPage" :disabled="page >= totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando página <span class="font-medium text-green-700">{{ page }}</span> de <span class="font-medium text-green-700">{{ totalPages }}</span>
              <span class="mx-2 text-gray-300">|</span>
              Total registros: <span class="font-medium">{{ total }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="previousPage" :disabled="page <= 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                <span class="sr-only">Anterior</span>
                <Icon name="i-heroicons-chevron-left" class="h-5 w-5" />
              </button>
              <button @click="nextPage" :disabled="page >= totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                <span class="sr-only">Siguiente</span>
                <Icon name="i-heroicons-chevron-right" class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
