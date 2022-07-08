import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.errorHandler = function (error) {
  // TODO replace by a modal
  console.error(error)
  alert(error)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
