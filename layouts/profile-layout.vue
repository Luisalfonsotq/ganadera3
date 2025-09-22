<template>
  <div class="min-h-screen flex flex-col">
    <header class="h-16 w-full flex items-center bg-white gap-4  text-green-600 px-4 shadow-2xl">
      <button class="md:hidden px-2 py-1 rounded-xl bg-pink-600 hover:bg-pink-700" v-on:click="isSidebarOpen= !isSidebarOpen" >Sidebar</button>
      <a class="ml-2 text-3xl font-normal font-serif">HERDIX</a>
    </header>

    <!-- Contenedor principal -->
    <div class="flex flex-1">
      <aside class="w-52 p-4 bg-pink-700 text-white transition-transform duration-300 fixed md:static inset-y-0 left-0 z-20 md:translate-x-0" v-bind:class="isSidebarOpen ? 'translate-x-0' :'-translate-x-full'">
        <button v-on:click="isSidebarOpen = !isSidebarOpen" class="md:hidden">Cerrar sidebar</button>
        <p class="font-bold mt-2">Sidebar</p>
        <ul class="mt-4 space-y-2">
          <li><a href="#">Example item</a></li>
          <li><a href="#">Perfil</a></li>
          <li><a href="#">Configuración</a></li>
        </ul>
      </aside>

      <!-- Overlay para móvil -->
       <div v-if="isSidebarOpen" class="fixed inset-0"></div>
      <main class="flex-1 p-4 bg-gray-100">
        <slot></slot>
      </main>
    </div>
    <footer class="h-40 flex bg-slate-500">
      <nav>
        <ul class="flex gap-4 p-2">
          <li>contacto</li>
          <li>preguntanos</li>
          <li>item</li>
          <li>item</li>
        </ul>
      </nav>
    </footer>
  </div>
</template>
<script setup>
const isSidebarOpen = ref(false)

</script>