export default defineNuxtConfig({
  app: {
    head: {
      title: 'JWT',
    },
  },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@pinia/nuxt'],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      'storeToRefs',
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  imports: {
    dirs: ['stores'],
  },
  runtimeConfig: {
    public: {
      postsApiBase: `http://${process.env.HOST}:${process.env.POSTS_SERVER_PORT}/`,
      authApiBase: `http://${process.env.HOST}:${process.env.AUTH_SERVER_PORT}/`,
    },
  },
});
