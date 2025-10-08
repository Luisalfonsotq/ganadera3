<!-- pages/animales/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Animales</h1>
      <NuxtLink to="/animales/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Animal
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando animales...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="animales.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay animales creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Arete</th>
            <th class="py-2 px-4 text-left">Raza</th>
            <th class="py-2 px-4 text-left">Sexo</th>
            <th class="py-2 px-4 text-left">Finca</th>
            <th class="py-2 px-4 text-left">Potrero</th>
            <th class="py-2 px-4 text-left">Estado Salud</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="animal in animales" :key="animal.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ animal.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ animal.arete_unico }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ animal.raza || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ animal.sexo }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ animal.finca ? animal.finca.nombre : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ animal.potrero ? animal.potrero.nombre : 'Sin asignar' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              <span :class="getEstadoSaludClass(animal.estado_salud)">
                {{ animal.estado_salud }}
              </span>
            </td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/animales/${animal.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink :to="`/animales/editar/${animal.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button @click="handleDelete(animal.id)" class="text-red-500 hover:text-red-700">
                <Icon name="i-heroicons-trash" class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useFinca } from '~/composables/useFinca'
import { useAnimal } from '~/composables/useAnimal'

const { user } = useAuth()
const { getAllFincas } = useFinca()
const { animales, loading, error, getAnimalesOfFinca, deleteAnimal } = useAnimal()

const fincas = ref([])
const loadingFincas = ref(false)
const errorMsg = ref('')

const loadFincas = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) {
    console.log('No se pudo obtener el id del usuario')
    return
  }
  loadingFincas.value = true
  errorMsg.value = ''
  const { data, error } = await getAllFincas(userId, user.value.rol)
  loadingFincas.value = false

  if (data.value) {
    fincas.value = data.value
    if (fincas.value.length > 0) {
      await getAnimalesOfFinca(fincas.value[0].id)
    }
  } else if (error.value) {
    errorMsg.value = 'Error al cargar las fincas: ' + error.value.message
  }
}

const loadAnimales = async () => {
  if (fincas.value.length > 0) {
    await getAnimalesOfFinca(fincas.value[0].id)
  }
}

watch(user, loadFincas, { immediate: true })
watch(fincas, loadAnimales)
onMounted(loadFincas)

const getEstadoSaludClass = (estado) => {
  const classes = {
    'sano': 'px-2 py-1 rounded-full bg-green-100 text-green-800',
    'enfermo': 'px-2 py-1 rounded-full bg-red-100 text-red-800',
    'en_tratamiento': 'px-2 py-1 rounded-full bg-yellow-100 text-yellow-800'
  }
  return classes[estado] || 'px-2 py-1 rounded-full bg-gray-100 text-gray-800'
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este animal?')) {
    const { error } = await deleteAnimal(id)
    if (!error.value) {
      animales.value = animales.value.filter(a => a.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>