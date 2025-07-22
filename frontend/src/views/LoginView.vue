<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl">
      <el-card shadow="lg" class="!border-0">
        <div class="grid grid-cols-1 md:grid-cols-2">
          
          <div class="p-8">
            <div class="text-center mb-8">
              <el-icon :size="40" class="text-primary mb-2">
                <svg viewBox="0 0 24 24"><path :d="mdiWallet" fill="currentColor" /></svg>
              </el-icon>
              <h1 class="text-2xl font-bold text-gray-800">Acesse sua Conta</h1>
              <p class="text-gray-500 text-sm">Bem-vindo(a) de volta!</p>
            </div>

            <el-form
              ref="formRef"
              :model="form"
              label-position="top"
              @submit.prevent="handleLogin"
            >
              <el-form-item label="Email">
                <el-input v-model="form.email" size="large" placeholder="seu@email.com">
                  <template #prefix>
                    <el-icon><svg viewBox="0 0 24 24"><path :d="mdiAt" fill="currentColor" /></svg></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="Senha">
                <el-input
                  v-model="form.password"
                  type="password"
                  size="large"
                  placeholder="Sua senha"
                  show-password
                >
                  <template #prefix>
                    <el-icon><svg viewBox="0 0 24 24"><path :d="mdiLock" fill="currentColor" /></svg></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-alert v-if="error" :title="error.message" type="error" class="mb-4" show-icon :closable="false" />

              <el-button
                type="primary"
                size="large"
                class="w-full mt-4"
                native-type="submit"
                :loading="loading"
              >
                Entrar
              </el-button>

              <div class="text-center mt-6 space-y-2">
                <p>
                  <router-link to="/register" class="text-sm text-primary hover:underline">
                    Não tem uma conta? Cadastre-se
                  </router-link>
                </p>
                <p>
                  <router-link to="/forgot-password" class="text-sm text-gray-500 hover:underline">
                    Esqueceu sua senha?
                  </router-link>
                </p>
              </div>
            </el-form>
          </div>

          <div class="hidden md:flex items-center justify-center bg-primary rounded-r-lg p-8">
            <div class="text-center text-white">
              <h2 class="text-3xl font-bold">Controle Total</h2>
              <p class="mt-4 opacity-80">
                Visualize seus gastos, acompanhe suas receitas e atinja suas metas financeiras com facilidade.
              </p>
            </div>
          </div>

        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import { useAuthStore } from '../stores/auth';
import { gql } from 'graphql-tag';
import { mdiWallet, mdiAt, mdiLock } from '@mdi/js';

import { LOGIN_MUTATION } from '../apollo/mutations/auth';

const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  email: '',
  password: '',
});

const { mutate: login, loading, error, onDone } = useMutation(LOGIN_MUTATION, () => ({
  variables: {
    input: {
      email: form.email,
      password: form.password,
    },
  },
}));

onDone(result => {
  const token = result.data.login.access_token;
  authStore.login(token);
  router.push('/'); 
});

const handleLogin = () => {
  login();
};
</script>