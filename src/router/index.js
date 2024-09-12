import { createRouter, createWebHistory } from 'vue-router';
// import App from '@/App.vue'; // Ajuste o caminho conforme necessário
import App from '../App.vue'
import MonthEdit from '../components/editMonth.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: App,
  },
  {
    path: '/edit/:month',
    name: 'MonthEdit',
    component: MonthEdit,
    props: true, // Permite passar parâmetros como props
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
