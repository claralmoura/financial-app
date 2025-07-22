<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl">
      <el-card shadow="lg" class="!border-0">
        <div class="grid grid-cols-1 md:grid-cols-2">
          
          <div class="p-8">
            <div class="text-center mb-8">
              <el-icon :size="40" class="text-primary mb-2">
                <svg viewBox="0 0 24 24"><path :d="mdiAccountPlus" fill="currentColor" /></svg>
              </el-icon>
              <h1 class="text-2xl font-bold text-gray-800">Crie sua Conta</h1>
              <p class="text-gray-500 text-sm">Rápido e fácil, comece agora mesmo.</p>
            </div>

            <el-form @submit.prevent="handleRegister">
              <el-form-item label="Nome Completo">
                <el-input v-model="form.name" size="large" placeholder="Seu nome completo">
                  <template #prefix>
                    <el-icon><svg viewBox="0 0 24 24"><path :d="mdiAccount" fill="currentColor" /></svg></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="Email">
                <el-input v-model="form.email" size="large" placeholder="seu@email.com">
                  <template #prefix>
                    <el-icon><svg viewBox="0 0 24 24"><path :d="mdiAt" fill="currentColor" /></svg></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="Senha">
                <el-input v-model="form.password" type="password" show-password size="large" placeholder="Mínimo 8 caracteres">
                  <template #prefix>
                    <el-icon><svg viewBox="0 0 24 24"><path :d="mdiLock" fill="currentColor" /></svg></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="Confirmar Senha">
                <el-input v-model="form.passwordConfirm" type="password" show-password size="large" />
              </el-form-item>
              
              <el-alert v-if="error" :title="error.message" type="error" class="mb-4" show-icon :closable="false" />

              <el-button type="primary" size="large" class="w-full mt-4" native-type="submit" :loading="loading">
                Criar Conta
              </el-button>

              <div class="text-center mt-6">
                <router-link to="/login" class="text-sm text-primary hover:underline">
                  Já tem uma conta? Faça login
                </router-link>
              </div>
            </el-form>
          </div>

          <div class="hidden md:flex items-center justify-center bg-primary rounded-r-lg p-8">
            <div class="text-center text-white">
              <h2 class="text-3xl font-bold">Organize sua Vida Financeira</h2>
              <p class="mt-4 opacity-80">
                Tenha uma visão clara de suas finanças e tome decisões mais inteligentes.
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
import { gql } from 'graphql-tag';
import { ElMessage } from 'element-plus';
import { mdiAccountPlus, mdiAccount, mdiAt, mdiLock } from '@mdi/js';

import { REGISTER_MUTATION } from '../apollo/mutations/auth';

const router = useRouter();
const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

const { mutate: register, loading, error, onDone } = useMutation(REGISTER_MUTATION);

onDone(() => {
  ElMessage.success('Conta criada com sucesso! Por favor, faça o login.');
  router.push('/login');
});

const handleRegister = () => {
  if (!form.name || !form.email || !form.password) {
    ElMessage.warning('Por favor, preencha todos os campos.');
    return;
  }
  if (form.password.length < 8) {
    ElMessage.warning('A senha deve ter no mínimo 8 caracteres.');
    return;
  }
  if (form.password !== form.passwordConfirm) {
    ElMessage.error('As senhas não conferem.');
    return;
  }

  register({
    input: {
      name: form.name,
      email: form.email,
      password: form.password,
    },
  });
};
</script>