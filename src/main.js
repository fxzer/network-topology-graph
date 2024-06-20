import { createApp } from 'vue'
import './main.scss'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

const app = createApp(App)
app.mount('#app')
