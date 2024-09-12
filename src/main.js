// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router'; 

// createApp(App)
// .use(router) // Adicione o Vue Router à aplicação
// .mount('#app');

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // Importa o CSS do Element Plus

const app = createApp(App)

app.use(router) 
app.use(ElementPlus)
app.mount('#app')
