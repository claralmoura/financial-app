import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import CategoriesView from '../views/CategoriesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, title: 'Dashboard' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login' },
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView,
      meta: { requiresAuth: true, title: 'Categorias' },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  document.title = to.meta.title ? `Minhas Finanças - ${to.meta.title}` : 'Minhas Finanças';

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login';
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' };
  }
});

export default router