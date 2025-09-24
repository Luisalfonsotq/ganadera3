<template>
  <div class="container max-w-full py-2 relative h-auto flex flex-col bg-interaccion bg-cover aspect-video">
    <div class="father w-1/3 h-auto bg-transparent p-2 absolute left-40">
      <div class="child">
        <img class="logo" src="../assets/img/HERDIX.svg" alt="logo">
      </div>
      <div class="child bg-green-700 rounded-bl-[50%] rounded-br-[50%] p-4">
        <p class="text-center text-3xl text-white">
          ¡Descubre la manera más facil y eficiente de administrar tu finca con HERDIX!
        </p>
      </div>
    </div>
  </div>

  <div>
    <!-- Hero -->
    <section
      class="  border-b-blue-600 border-l-violet-600 border-r-pink-500 border-t-purple-400  bg-gradient-to-r from-blue-500 to-yellow-500  text-white py-20 backdrop-blur-md bg-opacity-30">
      <div class="max-w-6xl mx-auto text-center px-6">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Gestión Inteligente de Ganado Bovino
        </h1>
        <p class="text-lg md:text-xl mb-6">
          Administra fincas, controla potreros, registra eventos y optimiza la crianza de tu ganado.
        </p>
      </div>
    </section>

    <!-- Roles -->
    <section class="py-16 bg-gray-100">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Roles en la plataforma</h2>
        <div class="grid md:grid-cols-4 gap-8">
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <h3 class="font-bold text-lg mb-2">Administrador</h3>
            <p>Gestiona usuarios, asigna roles y supervisa todas las operaciones.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <h3 class="font-bold text-lg mb-2">Supervisor</h3>
            <p>Supervisa potreros, controla actividades y coordina el equipo.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <h3 class="font-bold text-lg mb-2">Veterinario</h3>
            <p>Registra controles sanitarios y seguimiento de la salud animal.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <h3 class="font-bold text-lg mb-2">Colaborador</h3>
            <p>Registra eventos y apoya las labores diarias de la finca.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Funcionalidades -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Funcionalidades clave</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-green-50 p-6 rounded-lg shadow">
            <h3 class="font-bold mb-2">Gestión de fincas y potreros</h3>
            <p>Organiza la información de tus terrenos, pastos y ocupaciones.</p>
          </div>
          <div class="bg-green-50 p-6 rounded-lg shadow">
            <h3 class="font-bold mb-2">Control sanitario</h3>
            <p>Registra vacunas, medicamentos y revisiones veterinarias.</p>
          </div>
          <div class="bg-green-50 p-6 rounded-lg shadow">
            <h3 class="font-bold mb-2">Registro de eventos</h3>
            <p>Documenta nacimientos, ventas y cualquier evento importante.</p>
          </div>
          <div class="bg-green-50 p-6 rounded-lg shadow">
            <h3 class="font-bold mb-2">Control por roles</h3>
            <p>Accesos personalizados según el rol asignado en la plataforma.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="bg-gradient-to-r from-sky-500 to-purple-500  text-white py-12 text-center">
      <h2 class="text-3xl font-bold mb-4">¡Comienza a gestionar tu ganado hoy!</h2>

    </section>
  </div>
</template>

<script setup >
definePageMeta({
  layout: 'public'
})


// function definePageMeta(arg0: { layout: string; }) {
//   throw new Error('Function not implemented.');
// }
</script>