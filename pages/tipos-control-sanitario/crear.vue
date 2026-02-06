<!-- pages/tipos-control-sanitario/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Tipo de Control Sanitario</h2>

    <form @submit.prevent="handleCrear" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Seleccionar Base (Opcional)</label>
        <select @change="prellenarFormulario($event)"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
          <option value="">-- Personalizado --</option>
          <option v-for="base in controlesSanitariosBase" :key="base.id" :value="base.id">
            {{ base.nombre }} ({{ base.categoria }})
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre del Control *</label>
        <input type="text" v-model="form.nombre" required class="..." placeholder="Ej: Vacunación Aftosa">
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre *</label>
          <input type="text" v-model="form.nombre" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: Vacunación, Desparasitación">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea v-model="form.descripcion" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Descripción del tipo de control sanitario"></textarea>
        </div>

        <div class="flex items-center">
          <input type="checkbox" v-model="form.aplica_a_sexo" id="aplica_a_sexo"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
          <label for="aplica_a_sexo" class="ml-2 block text-sm text-gray-700">
            Aplica a sexo específico
          </label>
        </div>

        <div class="flex items-center">
          <input type="checkbox" v-model="form.requiere_medicamento" id="requiere_medicamento"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
          <label for="requiere_medicamento" class="ml-2 block text-sm text-gray-700">
            Requiere medicamento
          </label>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : 'Crear Tipo de Control Sanitario' }}
        </button>
      </div>
    </form>

    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="errorMsg" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ errorMsg }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

import { controlesSanitariosBase } from '@/utils/controlesSanitarios'

const prellenarFormulario = (event) => {
  const seleccionado = controlesSanitariosBase.find(c => c.id == event.target.value)
  if (seleccionado) {
    form.value.nombre = seleccionado.nombre
    form.value.aplica_a_sexo = seleccionado.aplica_a_sexo
    form.value.requiere_medicamento = seleccionado.requiere_medicamento
    form.value.descripcion = `Control base de ${seleccionado.categoria}`
  }
}

const { createTipoControlSanitario } = useTipoControlSanitario()
const { user } = useAuth()
const router = useRouter()

const form = ref({
  nombre: '',
  descripcion: '',
  aplica_a_sexo: false,
  requiere_medicamento: false,
})

const isSubmitting = ref(false)
const success = ref(null)
const errorMsg = ref(null)

onMounted(() => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para crear tipos de control sanitario')
    router.push('/tipos-control-sanitario')
  }
})

const handleCrear = async () => {
  errorMsg.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.nombre || !form.value.nombre.trim()) {
      throw new Error('Debes ingresar el nombre del tipo de control sanitario.')
    }

    const dataToSend = {
      nombre: form.value.nombre.trim(),
      aplica_a_sexo: form.value.aplica_a_sexo,
      requiere_medicamento: form.value.requiere_medicamento,
    }

    if (form.value.descripcion && form.value.descripcion.trim()) {
      dataToSend.descripcion = form.value.descripcion.trim()
    }

    const nuevoTipo = await createTipoControlSanitario(dataToSend)
    if (nuevoTipo) {
      success.value = 'Tipo de control sanitario creado exitosamente.'
      setTimeout(() => {
        router.push('/tipos-control-sanitario')
      }, 1500)
    } else {
      errorMsg.value = 'Error al crear el tipo de control sanitario.'
    }
  } catch (err) {
    console.error('Error con más detalles:', err)
    if (err.data?.message) {
      errorMsg.value = err.data.message
    } else {
      errorMsg.value = err.message || 'Error al crear el tipo de control sanitario.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>