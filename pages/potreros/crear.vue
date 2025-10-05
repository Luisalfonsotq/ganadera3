<!-- pages/potreros/crearPotrero.vue -->
<template>
  <div class="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Potrero</h2>
    
    <form @submit.prevent="handleCrearPotrero" class="space-y-4">
      
      <div>
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del Potrero</label>
        <input type="text" id="nombre" v-model="form.nombre" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
               required>
      </div>

      <div>
        <label for="tamano" class="block text-sm font-medium text-gray-700">Tamaño (Hectáreas)</label>
        <input type="number" id="tamano" v-model.number="form.tamano_ha" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
               min="0" step="0.01" required>
      </div>

      <div>
        <label for="tipo_pasto" class="block text-sm font-medium text-gray-700">Tipo de Pasto (Opcional)</label>
        <input type="text" id="tipo_pasto" v-model="form.tipo_pasto" 
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
      </div>

      <div>
        <label for="finca" class="block text-sm font-medium text-gray-700">Finca</label>
        <select id="finca" v-model.number="form.finca_id"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
                required :disabled="loadingFincas || fincas.length === 0">
          <option disabled :value="null">Selecciona una finca</option>
          <option v-for="finca in fincas" :key="finca.id" :value="finca.id">{{ finca.nombre }}</option>
        </select>
        <p v-if="loadingFincas" class="text-xs text-blue-500 mt-1">Cargando fincas...</p>
        <p v-else-if="errorMsg" class="text-xs text-red-500 mt-1">{{ errorMsg }}</p>
        <p v-else-if="fincas.length === 0" class="text-xs text-gray-500 mt-1">No hay fincas disponibles.</p>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting || fincas.length === 0"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : fincas.length === 0 ? 'No hay fincas disponibles' : 'Crear Potrero' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="potreroError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ potreroError }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })
import { ref, onMounted, watch } from 'vue';
import { usePotrero } from '~/composables/usePotrero';
import { useFinca } from '~/composables/useFinca';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';

const { createPotrero } = usePotrero();
const { getAllFincas } = useFinca();
const { user} = useAuth();
const router = useRouter();

// Define el estado del formulario con los campos que espera tu CreatePotreroDto
const form = ref({
  nombre: '',
  tamano_ha: null,
  tipo_pasto: '',
  finca_id: null, // Campo requerido para la FK
});

// Variables de estado
const fincas = ref([]);
const loading = ref(false);
const errorMsg = ref('');
const isSubmitting = ref(false);
const success = ref(null);
// const errorFincas = ref(null);
const potreroError = ref(null);

// FUNCIÓN PARA CARGAR FINCAS (SELECT)
const loadFincas = async () => {
  console.log('loadFincas called, user:', user.value)
  const userId = user.value?.id || user.value?.userId
  if (!userId) {
    console.log('No user id or userId, skipping load')
    return
  }
  loading.value = true
  errorMsg.value = ''
  console.log('Loading fincas for user id:', userId, 'rol:', user.value.rol)
  const { data, error } = await getAllFincas(userId, user.value.rol)
  loading.value = false
  console.log('data:', data, 'error:', error)
  console.log('Fincas loaded:', data.value, 'error:', error.value)
  if (data.value) {
    fincas.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar fincas: ' + error.value.message
  }
}

watch(user, loadFincas, { immediate: true })

onMounted(loadFincas)

// FUNCIÓN PARA CREAR POTRERO (POST)
const handleCrearPotrero = async () => {
  console.log('handleCrearPotrero called');
  console.log('form.value:', form.value);
  potreroError.value = null;
  success.value = null;
  isSubmitting.value = true;

  try {
    // Validación básica de que se seleccionó una finca
    if (!form.value.finca_id) {
      throw new Error('Debes seleccionar la Finca a la que pertenece el potrero.');
    }
    if (!form.value.nombre.trim()) {
      throw new Error('Debes ingresar el nombre del potrero.');
    }
    if (!form.value.tamano_ha || form.value.tamano_ha <= 0) {
      throw new Error('Debes ingresar un tamaño válido mayor a 0.');
    }

    // Preparar datos a enviar, excluyendo campos vacíos opcionales
    const dataToSend = {
      nombre: form.value.nombre,
      tamano_ha: form.value.tamano_ha,
      finca_id: form.value.finca_id,
    };
    if (form.value.tipo_pasto && form.value.tipo_pasto.trim()) {
      dataToSend.tipo_pasto = form.value.tipo_pasto.trim();
    }

    const nuevoPotrero = await createPotrero(dataToSend);
    if (nuevoPotrero) {
      success.value = `Potrero "${nuevoPotrero.nombre}" creado exitosamente. ID: ${nuevoPotrero.id}`;

      // Limpiar el formulario después del éxito (manteniendo la finca seleccionada si aplica)
      form.value = {
        nombre: '',
        tamano_ha: null,
        tipo_pasto: '',
        finca_id: form.value.finca_id
      };

      router.push('/potreros')
    } else {
      potreroError.value = 'Error al crear el potrero.';
    }
  } catch (err) {
    potreroError.value = err.message;
    console.error('Error en la creación del potrero:', err);
  } finally {
    isSubmitting.value = false;
  }
};

</script>