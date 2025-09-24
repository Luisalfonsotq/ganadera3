import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-09-22',
  
  // Módulos
  modules: [
    '@nuxtjs/tailwindcss', '@nuxt/icon'
  ],
  
  // Devtools
  devtools: { enabled: false },

  // RuntimeConfig para exponer variables de entorno
  runtimeConfig: {
    public: {
      // Esta variable leerá NUXT_PUBLIC_API_BASE_URL del .env
      apiBaseUrl: ''
    }
  }
  
})