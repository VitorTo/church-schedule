import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import MonthDetail from '../views/MonthDetail.vue';
import MonthEdit from '../views/MonthEdit.vue';

// Definir as rotas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { breadcrumb: 'Início' }
  },
  {
    path: '/month/:month',
    name: 'MonthDetail',
    component: MonthDetail,
    meta: { breadcrumb: 'Detalhes da escala' },
    props: true
  },
  {
    path: '/month/:month/edit',
    name: 'MonthEdit',
    component: MonthEdit,
    meta: { breadcrumb: 'Editar escala' }
  }
];

// Criar a instância do router
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
