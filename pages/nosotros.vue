<template>
  <div class="container flex flex-col items-center bg-fondoNosotros aspect-video bg-cover max-w-full relative h-auto">
    <img src="../assets/img/HERDIX.svg" alt="logo" class="w-1/4">

    <div class="max-w-6xl mx-auto px-6">
      <h2 class="font-bold text-3xl text-center mb-12">Nosotros</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="font-bold mb-2">Developers</h3>
          <p>Somos un equipo SENA de desarrolladores web y hemos creado HERDIX para ayudarte a llevar el control de tu
            finca dedicada al ganado.</p>
        </div>
        <div class="bg-green-600 p-6 rounded-lg shadow text-white">
          <h3 class="font-bold mb-2">Herdix</h3>
          <p>Crea potreros virtulaes, gestiona eventos clave y te envía notificaciones de tus
            procesos.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="font-bold mb-2">Regístrate ya</h3>
          <p>¡Lleva tu negocio al siguiente nivel!</p>
          <i-tabler-mood-smile class="size-12"></i-tabler-mood-smile>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
definePageMeta({
  layout: 'public'
})
</script>