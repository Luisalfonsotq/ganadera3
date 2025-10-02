<!-- pages/potreros/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles de Potrero</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="potrero" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ potrero.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <p class="mt-1 text-gray-900">{{ potrero.nombre }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Finca</label>
          <p class="mt-1 text-gray-900">{{ potrero.finca?.nombre || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tamaño (ha)</label>
          <p class="mt-1 text-gray-900">{{ potrero.tamano_ha || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Pasto</label>
          <p class="mt-1 text-gray-900">{{ potrero.tipo_pasto || 'N/A' }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/potreros/editar/${potrero.id}`" class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/potreros" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
      <div v-if="potrero.animales && potrero.animales.length" class="mt-8 pt-4 border-t border-gray-200">
        <h3 class="text-xl font-semibold mb-4">Animales en este Potrero ({{ potrero.animales.length }})</h3>
        <ul class="list-disc pl-5">
          <li v-for="animal in potrero.animales" :key="animal.id" class="text-gray-700">
            ID: {{ animal.id }} - Nombre/Identificador: {{ animal.identificador || animal.nombre }}
          </li>
        </ul>
      </div>
      <p v-else class="mt-8 text-gray-500">Este potrero no tiene animales asignados.</p>
    </div>
    <div v-else class="text-gray-500">Potrero no encontrado.</div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})
import { ref, onMounted } from 'vue'
import { usePotrero } from '~/composables/usePotrero'
import { useAuth } from '~/composables/useAuth'
import { useRoute, useRouter } from 'vue-router'

const { getPotreroById, deletePotrero } = usePotrero()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const potrero = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getPotreroById(id)
  loading.value = false
  if (data.value) {
    potrero.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar potrero: ' + error.value.message
  } else {
    errorMsg.value = 'Potrero no encontrado'
  }
})

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este potrero?')) {
    const { error } = await deletePotrero(potrero.value.id)
    if (!error.value) {
      router.push('/potreros')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>