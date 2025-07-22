<template>
  <div class="p-8 font-sans">
    <header class="flex justify-between items-center mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Meus Cartões de Crédito</h1>
      <el-button type="primary" @click="openCreateDialog">
        <div class="flex items-center gap-2">
          <svg :width="20" :height="20" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          <span>Adicionar Cartão</span>
        </div>
      </el-button>
    </header>

    <main>
      <el-card shadow="never" class="bg-white">
        <el-table :data="creditCards" v-loading="loading" empty-text="Nenhum cartão encontrado.">
          <el-table-column prop="name" label="Nome do Cartão" sortable>
            <template #default="scope">
              <router-link 
                :to="`/credit-cards/${scope.row._id}`" 
                class="text-primary hover:underline font-semibold"
              >
                {{ scope.row.name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="closingDay" label="Dia do Fechamento" align="center" width="180" />
          <el-table-column prop="dueDay" label="Dia do Vencimento" align="center" width="180" />
          <el-table-column label="Ações" width="120" align="center">
            <template #default="scope">
              <div class="flex gap-2 justify-center">
                <el-button @click="openEditDialog(scope.row)" circle plain type="primary">
                  <svg :width="16" :height="16" viewBox="0 0 24 24"><path :d="mdiPencil" fill="currentColor" /></svg>
                </el-button>
                <el-button @click="handleDelete(scope.row._id)" circle plain type="danger">
                  <svg :width="16" :height="16" viewBox="0 0 24 24"><path :d="mdiDelete" fill="currentColor" /></svg>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </main>

    <CreditCardFormModal
      v-model:visible="isDialogVisible"
      :title="dialogTitle"
      :loading="createLoading || updateLoading"
      :is-edit-mode="isEditMode"
      :initial-data="form"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';
import { ElMessage, ElMessageBox } from 'element-plus';
import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';
import type { CreditCard } from '@/types';
import CreditCardFormModal from '../components/CreditCardFormModal.vue';

import { CREDIT_CARDS_QUERY } from '../apollo/queries/creditCards';
import {
  CREATE_CREDIT_CARD_MUTATION,
  UPDATE_CREDIT_CARD_MUTATION,
  REMOVE_CREDIT_CARD_MUTATION
} from '../apollo/mutations/creditCards';

const isDialogVisible = ref(false);
const isEditMode = ref(false);
const form = reactive({
  _id: undefined as string | undefined,
  name: '',
  closingDay: 1,
  dueDay: 10,
});

const { result, loading } = useQuery<{ creditCards: CreditCard[] }>(CREDIT_CARDS_QUERY);
const { mutate: createCreditCard, loading: createLoading } = useMutation(CREATE_CREDIT_CARD_MUTATION, { refetchQueries: [{ query: CREDIT_CARDS_QUERY }] });
const { mutate: updateCreditCard, loading: updateLoading } = useMutation(UPDATE_CREDIT_CARD_MUTATION, { refetchQueries: [{ query: CREDIT_CARDS_QUERY }] });
const { mutate: removeCreditCard } = useMutation(REMOVE_CREDIT_CARD_MUTATION, { refetchQueries: [{ query: CREDIT_CARDS_QUERY }] });

const creditCards = computed(() => result.value?.creditCards ?? []);
const dialogTitle = computed(() => isEditMode.value ? 'Editar Cartão' : 'Adicionar Novo Cartão');

const resetForm = () => {
  isEditMode.value = false;
  form._id = undefined;
  form.name = '';
  form.closingDay = 1;
  form.dueDay = 10;
};

const openCreateDialog = () => {
  resetForm();
  isDialogVisible.value = true;
};

const openEditDialog = (card: CreditCard) => {
  isEditMode.value = true;
  form._id = card._id;
  form.name = card.name;
  form.closingDay = card.closingDay;
  form.dueDay = card.dueDay;
  isDialogVisible.value = true;
};

const handleSubmit = async (formData: Partial<CreditCard>) => {
  if (!formData.name) {
    ElMessage.warning('O nome do cartão é obrigatório.');
    return;
  }
  
  const { _id, ...inputData } = formData;

  try {
    if (isEditMode.value) {
      if (!_id) {
        ElMessage.error('ID do cartão não encontrado para edição.');
        return;
      }
      await updateCreditCard({ input: { id: _id, ...inputData } });
      ElMessage.success('Cartão atualizado!');
    } else {
      await createCreditCard({ input: inputData });
      ElMessage.success('Cartão criado!');
    }
    isDialogVisible.value = false;
  } catch (e: unknown) {
    console.error("Erro:", e);
    ElMessage.error('Ocorreu um erro ao salvar o cartão.');
  }
};

const handleDelete = (id: string) => {
  ElMessageBox.confirm('Tem certeza que deseja excluir este cartão?', 'Confirmar Exclusão',
    { confirmButtonText: 'Sim, Excluir', cancelButtonText: 'Cancelar', type: 'warning' }
  ).then(async () => {
    try {
      await removeCreditCard({ id });
      ElMessage.success('Cartão excluído.');
    } catch (e: unknown) {
      console.error("Erro:", e);
      ElMessage.error('Ocorreu um erro ao excluir o cartão.');
    }
  }).catch(() => { ElMessage.info('Ação cancelada.'); });
};
</script>