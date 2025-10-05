<!-- /pages/potreros/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Potreros</h1>
      <NuxtLink v-if="user.value?.rol === 'Administrador'" to="/potreros/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Potrero
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando potreros...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="potreros.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay potreros creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Nombre</th>
            <th class="py-2 px-4 text-left">Finca Asignada</th>
            <th class="py-2 px-4 text-left">Tamaño (ha)</th>
            <th class="py-2 px-4 text-left">Tipo Pasto</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="potrero in potreros" :key="potrero.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ potrero.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ potrero.nombre }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ potrero.finca ? potrero.finca.nombre : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ potrero.tamano_ha }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ potrero.tipo_pasto || 'Sin especificar' }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/potreros/${potrero.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/potreros/editar/${potrero.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete(potrero.id)" class="text-red-500 hover:text-red-700">
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
import { useAuth } from '~/composables/useAuth';
import {useFinca} from '~/composables/useFinca';
import { usePotrero} from '~/composables/usePotrero';

const { user, profile } = useAuth();
const {getAllFincas} = useFinca();
const { potreros, loading, error, getPotrerosOfFinca, deletePotrero } = usePotrero();

// Variables de estado para traer las fincas asociadas
const fincas = ref([]);
const loadingFincas = ref(false);
const errorMsg = ref('');

// Función para traer las fincas
const loadFincas = async()=> {
  const userId = user.value?.id || user.value?.userId
  console.log(userId);
  if(!userId){
    console.log('No se pudo obtener el id del usuario');
    return;
  }
  loadingFincas.value = true;
  errorMsg.value = '';
  const {data, error} = await getAllFincas(userId, user.value.rol);
  loadingFincas.value = false;

  if(data.value){
    fincas.value = data.value;
    // Cargar potreros con el primer id de finca
    if(fincas.value.length > 0){
      await getPotrerosOfFinca(fincas.value[0].id)
    }
  } else if(error.value){
    errorMsg.value = 'Error al cargar las fincas:' + error.value.message
  }
}

// Cargar potreros cuando cambian las fincas
const loadPotreros = async () => {
  if(fincas.value.length > 0){
    await getPotrerosOfFinca(fincas.value[0].id)
  }
}
watch(user, profile, loadFincas, {immediate: true});
watch(fincas, loadPotreros)
onMounted(loadFincas);

// onMounted(() => {
//   console.log('Potreros index page mounted')
//   if (user.value.id) {
//     getPotrerosOfFinca(fincas.value.id);
//   }
// });

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este potrero?')) {
    const { error } = await deletePotrero(id)
    if (!error.value) {
      potreros.value = potreros.value.filter(p => p.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>
<!-- 
<script setup>
definePageMeta({ layout: 'profile-layout' })
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth';
import {useFinca} from '~/composables/useFinca';
import { usePotrero} from '~/composables/usePotrero';

const { user } = useAuth();
const {getAllFincas} = useFinca();
const { potreros, loading, error, getPotrerosOfFinca, deletePotrero } = usePotrero();

// Variables de estado para traer las fincas asociadas
const fincas = ref([]);
const loadingFincas = ref(false);
const errorMsg = ref('');

// Función para traer las fincas
const loadFincas = async()=> {
  const userId = user.value?.id
  // const userRol = user.value?.rol
  if(!userId){
    console.log('No se pudo obtener el id del usuario');
    return;
  }
  loadingFincas.value = true;
  errorMsg.value = '';
  const {data, error} = await getAllFincas(userId, user.value?.rol);
  loadingFincas.value = false;

  if(data.value){
    fincas.value = data.value;
    // Cargar potreros con el primer id de finca
    if(fincas.value.length > 0){
      await getPotrerosOfFinca(fincas.value[0].id)
    }
  } else if(error.value){
    errorMsg.value = 'Error al cargar las fincas:' + error.value.message
  }
}

// Cargar potreros cuando cambian las fincas
const loadPotreros = async () => {
  if(fincas.value.length > 0){
    await getPotrerosOfFinca(fincas.value[0].id)
  }
}
watch(user, loadFincas, {immediate: true});
// watch(() => user.value?.rol, (newRol) => {
//   if(newRol){
//     loadFincas();
//   }
// }, {immediate: true});
watch(fincas, loadPotreros)
onMounted(loadFincas);

// onMounted(() => {
//   console.log('Potreros index page mounted')
//   if (fincas.value.id) {
//     getPotrerosOfFinca(fincas.value.id);
//   }
// });

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este potrero?')) {
    const { error } = await deletePotrero(id)
    if (!error.value) {
      potreros.value = potreros.value.filter(p => p.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script> -->
<!-- 
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Potreros</h1>
      <NuxtLink v-if="user.value?.rol === 'Administrador'" to="/potreros/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Potrero
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando potreros...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="potreros.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay potreros creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Nombre</th>
            <th class="py-2 px-4 text-left">Finca Asignada</th>
            <th class="py-2 px-4 text-left">Tamaño (ha)</th>
            <th class="py-2 px-4 text-left">Tipo Pasto</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="potrero in potreros" :key="potrero.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ potrero.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ potrero.nombre }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ potrero.finca ? potrero.finca.nombre : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ potrero.tamano_ha }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ potrero.tipo_pasto || 'Sin especificar' }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/potreros/${potrero.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/potreros/editar/${potrero.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete(potrero.id)" class="text-red-500 hover:text-red-700">
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
import { useAuth } from '~/composables/useAuth';
import {useFinca} from '~/composables/useFinca';
import { usePotrero} from '~/composables/usePotrero';
import { ref, watch } from 'vue';

const { user } = useAuth();
const {getAllFincas} = useFinca();
const { potreros, loading, error, getPotrerosOfFinca, deletePotrero } = usePotrero();

// Variables de estado para traer las fincas asociadas
const fincas = ref([]);
const loadingFincas = ref(false);
const errorMsg = ref('');

// Función para traer las fincas
const loadFincas = async()=> {
  // Las variables ya deben existir gracias al watcher
  const userId = user.value?.id
  const userRol = user.value?.rol
  
  // Eliminamos el 'return' temprano, ya que el watcher lo controla. 
  // La siguiente línea es solo un log de seguridad, pero se elimina la validación para proceder.
  console.log('loadFincas se está ejecutando con Rol:', userRol); 

  // Si a pesar del watcher el ID no está (solo como doble chequeo), salimos sin log de error.
  if(!userId || !userRol) return;
  
  loadingFincas.value = true;
  errorMsg.value = '';

  // Llamada garantizada después de que el watcher detecta el rol
  const {data, error} = await getAllFincas(userId, userRol);
  loadingFincas.value = false;

  if(data.value){
    fincas.value = data.value;
    // Cargar potreros con el primer id de finca
    if(fincas.value.length > 0){
      await getPotrerosOfFinca(fincas.value[0].id)
    }
  } else if(error.value){
    errorMsg.value = 'Error al cargar las fincas:' + error.value.message
  }
}

// Cargar potreros cuando cambian las fincas
const loadPotreros = async () => {
  if(fincas.value.length > 0){
    await getPotrerosOfFinca(fincas.value[0].id)
  }
}

// Watcher que solo llama a loadFincas cuando el rol está disponible
watch(() => user.value?.rol, (newRol) => {
  if(newRol){
    loadFincas();
  }
}, {immediate: true});

watch(fincas, loadPotreros)

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este potrero?')) {
    const { error } = await deletePotrero(id)
    if (!error.value) {
      potreros.value = potreros.value.filter(p => p.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script> -->