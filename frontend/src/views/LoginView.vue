<template>
  <div class="flex items-center justify-center min-h-screen bg-dark font-sans">
    <el-card class="w-full max-w-md bg-gray-800 border-gray-700" shadow="never">
      <template #header>
        <div class="text-center">
          <h1 class="text-3xl font-bold text-white">Bem-vindo(a) de volta!</h1>
          <p class="text-gray-400">Faça login para continuar</p>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Email">
          <el-input v-model="form.email" size="large" placeholder="seu@email.com" />
        </el-form-item>

        <el-form-item label="Senha">
          <el-input
            v-model="form.password"
            type="password"
            size="large"
            placeholder="Sua senha"
            show-password
          />
        </el-form-item>

        <el-alert v-if="error" :title="error.message" type="error" class="mb-4" show-icon :closable="false" />

        <el-button
          type="primary"
          size="large"
          class="w-full bg-primary hover:bg-orange-600 border-none mt-4"
          native-type="submit"
          :loading="loading"
        >
          Entrar
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import { useAuthStore } from '../stores/auth';
import { gql } from 'graphql-tag';

const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  email: '',
  password: '',
});

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
    }
  }
`;

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