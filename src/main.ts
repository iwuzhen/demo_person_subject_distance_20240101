import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createPinia } from 'pinia'
import App from './App.vue'

// import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

// 通用字体
import 'vfonts/Lato.css'

// 等宽字体
import 'vfonts/FiraCode.css'

const pinia = createPinia()
const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(router)
app.use(pinia)
app.mount('#app')
