<!-- pages/proveedores/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Proveedores</h1>
      <NuxtLink to="/proveedores/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Proveedor
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando proveedores...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="proveedores.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay proveedores creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Nombre</th>
            <th class="py-2 px-4 text-left">Contacto</th>
            <th class="py-2 px-4 text-left">Teléfono</th>
            <th class="py-2 px-4 text-left">Dirección</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proveedor in proveedores" :key="proveedor.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ proveedor.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ proveedor.nombre }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ proveedor.contacto || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ proveedor.telefono || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ proveedor.direccion || 'N/A' }}</td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/proveedores/${proveedor.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink :to="`/proveedores/editar/${proveedor.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button @click="handleDelete(proveedor.id)" class="text-red-500 hover:text-red-700">
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

const { proveedores, loading, error, getAllProveedores, deleteProveedor } = useProveedor()

onMounted(async () => {
  await getAllProveedores()
})

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este proveedor?')) {
    const { error: deleteError } = await deleteProveedor(id)
    if (!deleteError.value) {
      proveedores.value = proveedores.value.filter(p => p.id !== id)
    } else {
      alert('Error al eliminar: ' + deleteError.value.message)
    }
  }
}
</script>