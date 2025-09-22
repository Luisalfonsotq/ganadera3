import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-09-22',
  
  // Módulos
  modules: [
    '@nuxtjs/tailwindcss', '@nuxt/icon'
  ],
  
  // Devtools
  devtools: { enabled: false },
  
})