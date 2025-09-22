<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-gray-900 text-center mb-12">
        Iconos Dinámicos
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div
          v-for="item in iconos"
          :key="item.id"
          class="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-md transition-shadow"
        >
          <Icon 
            :name="`heroicons-${item.icon}`" 
            :size="item.size" 
            :color="item.color"
            class="mx-auto mb-4"
          />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.nombre }}</h3>
          <p class="text-sm text-gray-500">{{ item.categoria }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const iconos = [
  { id: 1, nombre: 'Casa', icon: 'home', size: 48, color: '#3b82f6', categoria: 'Navegación' },
  { id: 2, nombre: 'Usuario', icon: 'user-circle', size: 48, color: '#6366f1', categoria: 'Perfil' },
  { id: 3, nombre: 'Configuración', icon: 'cog-8-tooth', size: 48, color: '#6b7280', categoria: 'Ajustes' },
  { id: 4, nombre: 'Carrito', icon: 'shopping-bag', size: 48, color: '#10b981', categoria: 'E-commerce' },
  { id: 5, nombre: 'Notificaciones', icon: 'bell', size: 48, color: '#f59e0b', categoria: 'Alertas' }
]
</script>