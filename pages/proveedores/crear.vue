<!-- pages/proveedores/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Proveedor</h2>
    
    <form @submit.prevent="handleCrearProveedor" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre *</label>
          <input type="text" v-model="form.nombre" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
            required>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Contacto</label>
          <input type="text" v-model="form.contacto" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" v-model="form.telefono" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: 3001234567">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Dirección</label>
          <input type="text" v-model="form.direccion" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Observaciones</label>
          <textarea v-model="form.observaciones" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Información adicional sobre el proveedor..."></textarea>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : 'Crear Proveedor' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="proveedorError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ proveedorError }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { createProveedor } = useProveedor()
const router = useRouter()

const form = ref({
  nombre: '',
  contacto: '',
  telefono: '',
  direccion: '',
  observaciones: '',
})

const isSubmitting = ref(false)
const success = ref(null)
const proveedorError = ref(null)

const handleCrearProveedor = async () => {
  proveedorError.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.nombre.trim()) {
      throw new Error('Debes ingresar el nombre del proveedor.')
    }

    const dataToSend = {
      nombre: form.value.nombre.trim(),
    }

    if (form.value.contacto && form.value.contacto.trim()) {
      dataToSend.contacto = form.value.contacto.trim()
    }
    if (form.value.telefono && form.value.telefono.trim()) {
      dataToSend.telefono = form.value.telefono.trim()
    }
    if (form.value.direccion && form.value.direccion.trim()) {
      dataToSend.direccion = form.value.direccion.trim()
    }
    if (form.value.observaciones && form.value.observaciones.trim()) {
      dataToSend.observaciones = form.value.observaciones.trim()
    }

    const nuevoProveedor = await createProveedor(dataToSend)
    if (nuevoProveedor) {
      success.value = `Proveedor "${nuevoProveedor.nombre}" creado exitosamente.`
      setTimeout(() => {
        router.push('/proveedores')
      }, 1500)
    } else {
      proveedorError.value = 'Error al crear el proveedor.'
    }
  } catch (err) {
    proveedorError.value = err.message
    console.error('Error en la creación del proveedor:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>