import './assets/base.css'
import 'element-plus/dist/index.css'
import 'ol/ol.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
