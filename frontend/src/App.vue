<template>
  <div v-if="authStore.isAuthenticated" class="bg-gray-100">
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <span class="font-bold text-xl text-primary">Minhas Finanças</span>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link to="/" class="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium" active-class="text-primary bg-orange-100">Dashboard</router-link>
              <router-link to="/categories" class="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium" active-class="text-primary bg-orange-100">Categorias</router-link>
            </div>
          </div>
          <div class="hidden md:block">
             <el-button type="danger" plain @click="handleLogout"> Sair </el-button>
          </div>
        </div>
      </nav>
    </header>
    <router-view />
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { useApolloClient } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const { client: apolloClient } = useApolloClient();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  apolloClient.resetStore();
  router.push('/login');
};
</script>