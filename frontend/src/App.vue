<template>
  <div v-if="authStore.isAuthenticated" class="bg-gray-100 dark:bg-gray-900 min-h-screen">
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center gap-3">
              <img :src="logo" alt="Minhas Finanças Logo" class="h-8 w-8">
              <span class="font-bold text-xl text-dark dark:text-primary 0 hidden sm:block">
                Minhas Finanças
              </span>
            </router-link>
            <div class="hidden md:flex items-baseline space-x-1 ml-10">
              <router-link to="/" class="nav-link" active-class="nav-link-active">Dashboard</router-link>
              <router-link to="/categories" class="nav-link" active-class="nav-link-active">Categorias</router-link>
              <router-link to="/fixed-expenses" class="nav-link" active-class="nav-link-active">Gastos Fixos</router-link>
              <router-link to="/credit-cards" class="nav-link" active-class="nav-link-active">Cartões</router-link>
              <router-link to="/goals" class="nav-link" active-class="nav-link-active">Metas</router-link>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-4">
            <el-button @click="toggleDark()" text circle class="!text-gray-600 dark:!text-gray-300">
              <el-icon :size="20">
                <svg v-if="isDark" viewBox="0 0 24 24"><path :d="mdiWeatherSunny" fill="currentColor"/></svg>
                <svg v-else viewBox="0 0 24 24"><path :d="mdiWeatherNight" fill="currentColor"/></svg>
              </el-icon>
            </el-button>
            <el-dropdown>
              <span class="el-dropdown-link flex items-center cursor-pointer">
                {{ user?.name || 'Usuário' }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/profile" class="w-full">Meu Perfil</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">Sair</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class="md:hidden">
            <el-button @click="isMobileMenuOpen = !isMobileMenuOpen" text class="!text-gray-600 dark:!text-gray-300">
              <el-icon :size="24"><svg viewBox="0 0 24 24"><path :d="mdiMenu" fill="currentColor"/></svg></el-icon>
            </el-button>
          </div>
        </div>
      </nav>

      <transition name="el-fade-in-linear">
        <div v-show="isMobileMenuOpen" class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <router-link to="/" class="nav-link-mobile" active-class="nav-link-active">Dashboard</router-link>
            <router-link to="/categories" class="nav-link-mobile" active-class="nav-link-active">Categorias</router-link>
            <router-link to="/fixed-expenses" class="nav-link-mobile" active-class="nav-link-active">Gastos Fixos</router-link>
            <router-link to="/credit-cards" class="nav-link-mobile" active-class="nav-link-active">Cartões</router-link>
            <router-link to="/goals" class="nav-link-mobile" active-class="nav-link-active">Metas</router-link>
            <router-link to="/profile" class="nav-link-mobile" active-class="nav-link-active">Meu Perfil</router-link>
          </div>
          <div class="px-2 pt-3 pb-3 border-t border-gray-200 dark:border-gray-700">
            <el-button type="danger" plain @click="handleLogout" class="w-full"> Sair </el-button>
          </div>
        </div>
      </transition>
    </header>
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <router-view />
    </div>
  </div>
  
  <div v-else>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from './stores/auth';
import { useApolloClient, useQuery } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { mdiMenu, mdiWeatherNight, mdiWeatherSunny } from '@mdi/js';
import { ArrowDown } from '@element-plus/icons-vue';
import { gql } from 'graphql-tag';
import { useDark, useToggle } from '@vueuse/core';
import logo from '@/assets/logo.png';

import { ME_QUERY } from '@/apollo/queries/user';

const isDark = useDark();
const toggleDark = useToggle(isDark);

const authStore = useAuthStore();
const { client: apolloClient } = useApolloClient();
const router = useRouter();
const isMobileMenuOpen = ref(false);

const meQueryOptions = computed(() => ({
  enabled: authStore.isAuthenticated,
}));

const { result: meResult } = useQuery(ME_QUERY, null, meQueryOptions);

const user = computed(() => meResult.value?.me);

const handleLogout = () => {
  authStore.logout();
  apolloClient.resetStore();
  router.push('/login');
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
.nav-link {
  @apply text-gray-500 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors;
}
.nav-link-mobile {
  @apply text-gray-600 dark:text-gray-200 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors;
}
.nav-link-active {
  @apply text-primary bg-orange-50 dark:bg-gray-700 font-semibold;
}
.el-dropdown-link {
  @apply text-gray-600 dark:text-gray-300 hover:text-primary transition-colors;
}
</style>