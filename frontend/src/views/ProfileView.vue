<template>
  <div class="p-4 sm:p-8 font-sans">
    <header class="mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Meu Perfil</h1>
      <p class="text-gray-500 mt-1">Atualize suas informações pessoais e de segurança.</p>
    </header>

    <main>
      <el-card shadow="never" class="bg-white">
        <div v-if="loading" class="text-center text-gray-500">Carregando perfil...</div>
        
        <el-form 
          v-if="!loading && form" 
          :model="form" 
          label-position="top"
          @submit.prevent="handleUpdateProfile"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            
            <div class="border-b md:border-b-0 md:border-r md:pr-8 pb-6 md:pb-0 mb-6 md:mb-0 border-gray-200">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Informações Pessoais</h2>
              <el-form-item label="Nome">
                <el-input v-model="form.name" size="large" />
              </el-form-item>
              <el-form-item label="Email">
                <el-input v-model="form.email" size="large" />
              </el-form-item>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Alterar Senha</h2>
              <el-form-item label="Nova Senha">
                <el-input v-model="form.password" type="password" show-password size="large" placeholder="Deixe em branco para não alterar" />
              </el-form-item>
              <el-form-item label="Confirmar Nova Senha">
                <el-input v-model="form.passwordConfirm" type="password" show-password size="large" />
              </el-form-item>
            </div>
          </div>

          <el-divider />

          <div>
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Notificações</h2>
            <el-form-item label="Receber lembretes de pagamento por e-mail">
              <el-switch v-model="form.notificationsEnabled" />
            </el-form-item>
          </div>

          <el-divider />
          
          <div class="flex justify-end">
            <el-button type="primary" native-type="submit" size="large" :loading="updateLoading">
              Salvar Alterações
            </el-button>
          </div>
        </el-form>
      </el-card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';
import { ElMessage } from 'element-plus';

import { ME_QUERY } from '../apollo/queries/user';
import { UPDATE_PROFILE_MUTATION } from '../apollo/mutations/user';

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  notificationsEnabled: true,
});

const { loading, onResult } = useQuery(ME_QUERY);
const { mutate: updateProfile, loading: updateLoading } = useMutation(UPDATE_PROFILE_MUTATION, {
  refetchQueries: [{ query: ME_QUERY }],
});

onResult(queryResult => {
  if (queryResult.data?.me) {
    form.name = queryResult.data.me.name;
    form.email = queryResult.data.me.email;
    form.notificationsEnabled = queryResult.data.me.notificationsEnabled;
  }
});

const handleUpdateProfile = async () => {
  if (form.password && form.password !== form.passwordConfirm) {
    ElMessage.warning('As senhas não conferem.');
    return;
  }

  const input: { name?: string; email?: string; password?: string, notificationsEnabled?: boolean } = {};

  if (form.name) input.name = form.name;
  if (form.email) input.email = form.email;
  if (form.password) input.password = form.password;
  input.notificationsEnabled = form.notificationsEnabled;

  try {
    await updateProfile({ input });
    ElMessage.success('Perfil atualizado com sucesso!');
    form.password = '';
    form.passwordConfirm = '';
  } catch (e: unknown) {
    console.error("Erro ao atualizar perfil:", e);
    if (e instanceof Error) ElMessage.error(e.message);
    else ElMessage.error('Ocorreu um erro ao atualizar o perfil.');
  }
};
</script>