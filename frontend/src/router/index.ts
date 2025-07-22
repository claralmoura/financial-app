import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import FixedExpensesView from '../views/FixedExpensesView.vue'
import CreditCardsView from '../views/CreditCardsView.vue'
import CardInvoiceView from '../views/CardInvoiceView.vue'
import ProfileView from '../views/ProfileView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import GoalsView from '../views/GoalsView.vue'
import RegisterView from '../views/RegisterView.vue'

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
    {
      path: '/fixed-expenses',
      name: 'fixed-expenses',
      component: FixedExpensesView,
      meta: { requiresAuth: true, title: 'Gastos Fixos' },
    },
    {
      path: '/credit-cards',
      name: 'credit-cards',
      component: CreditCardsView,
      meta: { requiresAuth: true, title: 'Cartões de Crédito' },
    },
    {
      path: '/credit-cards/:id',
      name: 'card-invoice',
      component: CardInvoiceView,
      meta: { requiresAuth: true, title: 'Fatura do Cartão' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, title: 'Meu Perfil' },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { title: 'Esqueci a Senha' },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
      meta: { title: 'Redefinir Senha' },
    },
    {
      path: '/goals',
      name: 'goals',
      component: GoalsView,
      meta: { requiresAuth: true, title: 'Minhas Metas' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Cadastro' },
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