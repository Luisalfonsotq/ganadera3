<!-- pages/reproducciones/index.vue -->
<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Reproducciones</h1>
        <p class="text-sm text-gray-500 mt-1">Gestión del ciclo reproductivo del ganado</p>
      </div>
      <NuxtLink to="/reproducciones/crear"
        class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <Icon name="heroicons:plus-circle" class="w-5 h-5" />
        Nueva Reproducción
      </NuxtLink>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-100 bg-gray-50">
        <div class="h-5 bg-gray-200 rounded-md animate-pulse w-48"></div>
      </div>
      <div class="divide-y divide-gray-100">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4 px-6 py-4">
          <div class="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div class="h-6 bg-gray-200 rounded-full animate-pulse w-20 ml-auto"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
      <Icon name="heroicons:exclamation-circle" class="w-10 h-10 text-red-400 mx-auto mb-2" />
      <p class="text-red-600 font-medium">{{ error }}</p>
    </div>

    <!-- Estado Vacío -->
    <div v-else-if="reproducciones.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 text-center">
      <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:heart" class="w-10 h-10 text-green-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-1">Sin registros de reproducción</h3>
      <p class="text-sm text-gray-500 mb-5">Comienza registrando el primer ciclo reproductivo de tu ganado.</p>
      <NuxtLink to="/reproducciones/crear"
        class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-xl transition-all">
        <Icon name="heroicons:plus" class="w-4 h-4" />
        Crear primer registro
      </NuxtLink>
    </div>

    <!-- Tabla de Datos -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-600">
          <span class="font-bold text-gray-800">{{ reproducciones.length }}</span> registros encontrados
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Madre</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Padre / Toro</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo Monta</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Monta</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Parto</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Crías</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="py-3 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="repro in reproducciones" :key="repro.id"
              class="hover:bg-green-50/40 transition-colors duration-150 group">
              <td class="px-6 py-4 text-sm font-bold text-gray-400">#{{ repro.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="heroicons:heart" class="w-4 h-4 text-pink-500" />
                  </div>
                  <span class="text-sm font-semibold text-gray-800">{{ repro.madre?.identificador_unico || 'N/A' }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span v-if="repro.padre" class="flex items-center gap-1.5 text-sm text-gray-700">
                  <Icon name="heroicons:arrow-up-circle" class="w-4 h-4 text-blue-400" />
                  {{ repro.padre.identificador_unico }}
                </span>
                <span v-else class="text-xs text-gray-400 italic">Sin asignar</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="repro.tipo_monta === 'natural'"
                  class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  🐄 Natural
                </span>
                <span v-else-if="repro.tipo_monta === 'inseminacion'"
                  class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                  💉 Inseminación
                </span>
                <span v-else class="text-xs text-gray-400 italic">N/A</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(repro.fecha_monta) }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(repro.fecha_parto) }}</td>
              <td class="px-6 py-4">
                <span v-if="repro.crias_nacidas"
                  class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  🐮 {{ repro.crias_nacidas }}
                </span>
                <span v-else class="text-xs text-gray-400">—</span>
              </td>
              <td class="px-6 py-4">
                <span :class="getEstadoBadgeClass(repro)"
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ getEstadoLabel(repro) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <NuxtLink :to="`/reproducciones/${repro.id}`"
                    class="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors" title="Ver detalle">
                    <Icon name="heroicons:eye" class="w-4 h-4" />
                  </NuxtLink>
                  <NuxtLink :to="`/reproducciones/editar/${repro.id}`"
                    class="p-1.5 rounded-lg hover:bg-yellow-100 text-yellow-600 transition-colors" title="Editar">
                    <Icon name="heroicons:pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button @click="handleDelete(repro.id)"
                    class="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title="Eliminar">
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-10">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="heroicons:trash" class="w-7 h-7 text-red-500" />
        </div>
        <h3 class="text-lg font-bold text-gray-800 text-center mb-2">¿Eliminar registro?</h3>
        <p class="text-sm text-gray-500 text-center mb-6">Esta acción no se puede deshacer. El registro de reproducción será eliminado permanentemente.</p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false"
            class="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button @click="confirmDelete"
            class="flex-1 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { reproducciones, loading, error, getAllReproducciones, deleteReproduccion } = useReproduccion()

const showDeleteModal = ref(false)
const idToDelete = ref(null)

onMounted(async () => {
  await getAllReproducciones()
})

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getEstadoLabel = (repro) => {
  if (repro.fecha_parto) return 'Parida'
  if (repro.fecha_confirmacion_prenez) return 'Preñada'
  if (repro.fecha_monta) return 'Montada'
  if (repro.fecha_celo) return 'En Celo'
  return 'Registrada'
}

const getEstadoBadgeClass = (repro) => {
  if (repro.fecha_parto) return 'bg-purple-100 text-purple-700'
  if (repro.fecha_confirmacion_prenez) return 'bg-yellow-100 text-yellow-700'
  if (repro.fecha_monta) return 'bg-blue-100 text-blue-700'
  if (repro.fecha_celo) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-500'
}

const handleDelete = (id) => {
  idToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  showDeleteModal.value = false
  const { error: delError } = await deleteReproduccion(idToDelete.value)
  if (delError?.value) {
    alert('Error al eliminar: ' + delError.value.message)
  }
  idToDelete.value = null
}
</script>