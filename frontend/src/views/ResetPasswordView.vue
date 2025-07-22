<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <el-card shadow="hover" class="!border-0">
        <div class="p-8">

          <div v-if="success" class="text-center">
            <el-icon :size="40" class="text-green-500 mb-4">
              <svg viewBox="0 0 24 24"><path :d="mdiLockCheck" fill="currentColor" /></svg>
            </el-icon>
            <h1 class="text-2xl font-bold text-gray-800">Senha Redefinida!</h1>
            <p class="text-gray-500 mt-2">
              Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.
            </p>
            <el-button type="primary" class="mt-6 w-full" size="large" @click="$router.push('/login')">Ir para o Login</el-button>
          </div>
          
          <div v-else-if="!token" class="text-center">
            <el-icon :size="40" class="text-red-500 mb-4">
               <svg viewBox="0 0 24 24"><path :d="mdiAlertCircle" fill="currentColor" /></svg>
            </el-icon>
            <h1 class="text-2xl font-bold text-gray-800">Link Inválido</h1>
            <p class="text-gray-500 mt-2">
              O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo.
            </p>
             <el-button class="mt-6 w-full" size="large" @click="$router.push('/forgot-password')">Solicitar Novo Link</el-button>
          </div>

          <div v-else>
            <div class="text-center mb-8">
              <el-icon :size="40" class="text-primary mb-2">
                <svg viewBox="0 0 24 24"><path :d="mdiKey" fill="currentColor" /></svg>
              </el-icon>
              <h1 class="text-2xl font-bold text-gray-800">Crie sua Nova Senha</h1>
              <p class="text-gray-500 text-sm">Escolha uma senha forte e segura.</p>
            </div>
            <el-form @submit.prevent="handleResetPassword">
              <el-form-item label="Nova Senha">
                <el-input v-model="form.password" type="password" show-password size="large">
                  <template #prefix>
                    <el-icon><svg viewBox="0 0 24 24"><path :d="mdiLock" fill="currentColor" /></svg></el-icon>
                  </template>
                </el-input>
                <el-text type="info" size="small" class="mt-1">Mínimo de 8 caracteres.</el-text>
              </el-form-item>
              <el-form-item label="Confirmar Senha">
                <el-input v-model="form.passwordConfirm" type="password" show-password size="large">
                   <template #prefix>
                    <el-icon><svg viewBox="0 0 24 24"><path :d="mdiLock" fill="currentColor" /></svg></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-alert v-if="error" :title="error.message" type="error" class="mb-4" show-icon :closable="false" />
              <el-button type="primary" size="large" class="w-full mt-4" native-type="submit" :loading="loading">
                Salvar Nova Senha
              </el-button>
            </el-form>
          </div>

        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';
import { ElMessage } from 'element-plus';
import { mdiLockCheck, mdiKey, mdiLock, mdiAlertCircle } from '@mdi/js';

import { RESET_PASSWORD_MUTATION } from '../apollo/mutations/auth';

const route = useRoute();
const router = useRouter();

const token = ref<string | null>(null);
const success = ref(false);
const form = reactive({
  password: '',
  passwordConfirm: '',
});

const { mutate: resetPassword, loading, error, onDone } = useMutation(RESET_PASSWORD_MUTATION);

onMounted(() => {
  const routeToken = Array.isArray(route.query.token) ? route.query.token[0] : route.query.token;
  if (routeToken) {
    token.value = routeToken;
  }
});

onDone(() => {
  success.value = true;
});

const handleResetPassword = () => {
  if (!form.password || !form.passwordConfirm) {
    ElMessage.warning('Por favor, preencha e confirme sua nova senha.');
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
  if (!token.value) {
    ElMessage.error('Token de redefinição não encontrado.');
    return;
  }

  resetPassword({
    input: {
      token: token.value,
      password: form.password,
    },
  });
};
</script>