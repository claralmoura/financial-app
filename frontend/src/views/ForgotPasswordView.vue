<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <el-card shadow="hover" class="!border-0">
        <div class="p-8">
          
          <div v-if="formSubmitted" class="text-center">
            <el-icon :size="40" class="text-green-500 mb-4">
              <svg viewBox="0 0 24 24"><path :d="mdiEmailCheck" fill="currentColor" /></svg>
            </el-icon>
            <h1 class="text-2xl font-bold text-gray-800">Verifique seu E-mail</h1>
            <p class="text-gray-500 mt-2">
              Se uma conta com o e-mail <strong>{{ form.email }}</strong> existir, enviamos um link para você redefinir sua senha.
            </p>
            <el-button type="primary" class="mt-6 w-full" @click="$router.push('/login')">Voltar para o Login</el-button>
          </div>

          <div v-else>
            <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-800">Redefinir Senha</h1>
              <p class="text-gray-500 text-sm">Insira seu e-mail para continuar</p>
            </div>

            <el-form @submit.prevent="handleForgotPassword">
              <el-form-item>
                <el-input v-model="form.email" size="large" placeholder="seu@email.com">
                  <template #prefix>
                    <el-icon><svg viewBox="0 0 24 24"><path :d="mdiAt" fill="currentColor" /></svg></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-alert v-if="error" :title="error.message" type="error" class="mb-4" show-icon :closable="false" />

              <el-button type="primary" size="large" class="w-full mt-4" native-type="submit" :loading="loading">
                Enviar Link de Redefinição
              </el-button>
            </el-form>
          </div>

        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';
import { ElMessage } from 'element-plus';
import { mdiAt, mdiEmailCheck } from '@mdi/js';

import { FORGOT_PASSWORD_MUTATION } from '../apollo/mutations/auth';

const form = reactive({ email: '' });
const formSubmitted = ref(false);

const { mutate: forgotPassword, loading, error, onDone } = useMutation(FORGOT_PASSWORD_MUTATION);

onDone(result => {
  if (result.data) {
    ElMessage.success('Link de redefinição enviado com sucesso!');
    formSubmitted.value = true;
  }
});

const handleForgotPassword = () => {
  if (!form.email) {
    ElMessage.warning('Por favor, insira seu e-mail.');
    return;
  }
  forgotPassword({ email: form.email });
};
</script>