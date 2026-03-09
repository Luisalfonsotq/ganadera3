<!-- pages/controles-sanitarios/index.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span
            class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Icon name="heroicons:shield-check" class="w-6 h-6 text-white" />
          </span>
          Controles Sanitarios
        </h1>
        <p class="text-gray-500 mt-1">Registro de todos los controles sanitarios aplicados al ganado</p>
      </div>
      <NuxtLink v-if="user?.rol === 'Veterinario'" to="/controles-sanitarios/crear"
        class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition duration-200">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Nuevo Control
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Icon name="heroicons:magnifying-glass"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input v-model="busqueda" type="text" placeholder="Buscar por animal, control, veterinario..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" />
        </div>
        <select v-model="filtroCategoria"
          class="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-white">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categoriasDisponibles" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-flex flex-col items-center gap-3">
        <div class="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500">Cargando controles sanitarios...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p class="text-red-600 font-medium">{{ error }}</p>
    </div>

    <!-- Sin datos -->
    <div v-else-if="controles.length === 0"
      class="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
      <Icon name="heroicons:clipboard-document-list" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Sin controles sanitarios</h3>
      <p class="text-gray-400 text-sm mb-4">Aún no se han registrado controles para los animales.</p>
      <NuxtLink v-if="user?.rol === 'Veterinario'" to="/controles-sanitarios/crear"
        class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
        <Icon name="heroicons:plus" class="w-4 h-4" />
        Registrar Primer Control
      </NuxtLink>
    </div>

    <!-- Tabla de Controles -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Animal</th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo de
                Control</th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Veterinario
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicamento
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Costo</th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50">
            <tr v-for="control in controlesFiltrados" :key="control.id"
              class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <span class="text-xs font-bold text-blue-600">
                      {{ control.animal?.identificador_unico?.charAt(0) || '?' }}
                    </span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">
                    {{ control.animal?.identificador_unico || 'N/A' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ control.tipo_control?.nombre || 'N/A' }}</p>
                  <span v-if="getCategoriaDeControl(control.tipo_control?.nombre)" :class="['text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block',
                    getCategoriaColor(getCategoriaDeControl(control.tipo_control?.nombre)).bg,
                    getCategoriaColor(getCategoriaDeControl(control.tipo_control?.nombre)).text]">
                    {{ getCategoriaDeControl(control.tipo_control?.nombre) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatDate(control.fecha) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ control.veterinario?.nombre || 'N/A' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <span v-if="control.medicamento"
                  class="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100">
                  <Icon name="heroicons:beaker" class="w-3 h-3" />
                  {{ control.medicamento }}
                </span>
                <span v-else class="text-gray-400 text-xs">—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span v-if="control.costo" class="font-medium text-green-700">
                  ${{ Number(control.costo).toLocaleString('es-ES') }}
                </span>
                <span v-else class="text-gray-400 text-xs">—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <NuxtLink :to="`/controles-sanitarios/${control.id}`"
                    class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Ver detalles">
                    <Icon name="heroicons:eye" class="w-4 h-4" />
                  </NuxtLink>
                  <NuxtLink v-if="user?.rol === 'Veterinario'" :to="`/controles-sanitarios/editar/${control.id}`"
                    class="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition" title="Editar">
                    <Icon name="heroicons:pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button v-if="user?.rol === 'Veterinario'" @click="handleDelete(control.id)"
                    class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resultados vacíos con filtro -->
      <div v-if="controlesFiltrados.length === 0 && controles.length > 0"
        class="py-8 text-center border-t border-gray-100">
        <p class="text-gray-400 text-sm">No hay controles que coincidan con tu búsqueda o filtro.</p>
        <button @click="busqueda = ''; filtroCategoria = ''" class="mt-2 text-sm text-green-600 hover:underline">Limpiar
          filtros</button>
      </div>

      <!-- Footer con conteo -->
      <div class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-500">
          Mostrando {{ controlesFiltrados.length }} de {{ controles.length }} controles
        </p>
        <NuxtLink to="/historial-animal" class="text-xs text-blue-600 hover:underline flex items-center gap-1">
          <Icon name="heroicons:clipboard-document-list" class="w-3.5 h-3.5" />
          Ver Historial Clínico
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

import { controlesSanitariosBase, getCategoriasControl, getCategoriaColor } from '~/utils/controlesSanitarios.js'

const { controles, loading, error, getAllControles, deleteControl } = useControlSanitario()
const { user } = useAuth()

const busqueda = ref('')
const filtroCategoria = ref('')

onMounted(async () => {
  await getAllControles()
})

// Categorías disponibles desde controlesSanitariosBase
const categoriasDisponibles = computed(() => getCategoriasControl())

// Obtener categoría de un nombre de control buscando en controlesSanitariosBase
const getCategoriaDeControl = (nombreControl) => {
  if (!nombreControl) return null
  const found = controlesSanitariosBase.find(c =>
    c.nombre.toLowerCase() === nombreControl.toLowerCase()
  )
  return found?.categoria || null
}

// Controles filtrados
const controlesFiltrados = computed(() => {
  return controles.value.filter(control => {
    const matchBusqueda = !busqueda.value ||
      control.animal?.identificador_unico?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      control.tipo_control?.nombre?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      control.veterinario?.nombre?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      control.medicamento?.toLowerCase().includes(busqueda.value.toLowerCase())

    const categoria = getCategoriaDeControl(control.tipo_control?.nombre)
    const matchCategoria = !filtroCategoria.value || categoria === filtroCategoria.value

    return matchBusqueda && matchCategoria
  })
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este control sanitario?')) {
    const { error } = await deleteControl(id)
    if (!error.value) {
      controles.value = controles.value.filter(c => c.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>