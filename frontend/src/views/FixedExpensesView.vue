<template>
  <div class="p-8 font-sans">
    <header class="flex justify-between items-center mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Gerenciar Gastos Fixos</h1>
      <el-button type="primary" @click="openCreateDialog">
        <div class="flex items-center gap-2">
          <svg :width="20" :height="20" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          <span>Adicionar Gasto Fixo</span>
        </div>
      </el-button>
    </header>

    <main>
      <el-card shadow="never" class="bg-white">
        <el-table :data="fixedExpenses" v-loading="loading" empty-text="Nenhum gasto fixo encontrado.">
          <el-table-column prop="description" label="Descrição" sortable />
          <el-table-column prop="value" label="Valor" sortable>
             <template #default="scope">R$ {{ scope.row.value.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="category.name" label="Categoria" />
          <el-table-column prop="dueDate" label="Dia do Venc." align="center" width="150" sortable />
          <el-table-column prop="isActive" label="Status" align="center" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.isActive ? 'success' : 'info'" effect="light">
                {{ scope.row.isActive ? 'Ativo' : 'Inativo' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Ações" width="120" align="center">
            <template #default="scope">
              <div class="flex gap-2 justify-center">
                <el-button @click="openEditDialog(scope.row)" circle plain type="primary">
                  <el-icon><svg viewBox="0 0 24 24"><path :d="mdiPencil" fill="currentColor"/></svg></el-icon>
                </el-button>
                <el-button @click="handleDelete(scope.row._id)" circle plain type="danger">
                  <el-icon><svg viewBox="0 0 24 24"><path :d="mdiDelete" fill="currentColor"/></svg></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </main>

    <FixedExpenseFormModal
      v-model:visible="isDialogVisible"
      :title="dialogTitle"
      :loading="createLoading || updateLoading"
      :is-edit-mode="isEditMode"
      :initial-data="form"
      :expense-categories="expenseCategories"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';
import type { Category } from '../types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';
import FixedExpenseFormModal from '../components/FixedExpenseFormModal.vue';

import { FIXED_EXPENSES_QUERY } from '../apollo/queries/fixedExpenses';
import { CATEGORIES_QUERY } from '../apollo/queries/categories';
import {
  CREATE_FIXED_EXPENSE_MUTATION,
  UPDATE_FIXED_EXPENSE_MUTATION,
  REMOVE_FIXED_EXPENSE_MUTATION
} from '../apollo/mutations/fixedExpenses';

interface FixedExpense {
  _id: string;
  description: string;
  value: number;
  dueDate: number;
  isActive: boolean;
  category: Category;
  categoryId: string;
}

const isDialogVisible = ref(false);
const isEditMode = ref(false);
const form = reactive({
  _id: undefined as string | undefined,
  description: '',
  value: 0,
  dueDate: 10,
  categoryId: null as string | null,
  isActive: true,
});

const { result, loading } = useQuery<{ fixedExpenses: FixedExpense[] }>(FIXED_EXPENSES_QUERY);
const { result: categoriesResult } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY);

const { mutate: createFixedExpense, loading: createLoading } = useMutation(CREATE_FIXED_EXPENSE_MUTATION, { refetchQueries: [{ query: FIXED_EXPENSES_QUERY }] });
const { mutate: updateFixedExpense, loading: updateLoading } = useMutation(UPDATE_FIXED_EXPENSE_MUTATION, { refetchQueries: [{ query: FIXED_EXPENSES_QUERY }] });
const { mutate: removeFixedExpense } = useMutation(REMOVE_FIXED_EXPENSE_MUTATION, { refetchQueries: [{ query: FIXED_EXPENSES_QUERY }] });

const fixedExpenses = computed(() => result.value?.fixedExpenses ?? []);
const expenseCategories = computed(() => categoriesResult.value?.categories.filter(c => c.type === 'expense') ?? []);
const dialogTitle = computed(() => isEditMode.value ? 'Editar Gasto Fixo' : 'Adicionar Novo Gasto Fixo');

const resetForm = () => {
  isEditMode.value = false;
  form._id = undefined;
  form.description = '';
  form.value = 0;
  form.dueDate = 10;
  form.categoryId = null;
  form.isActive = true;
};

const openCreateDialog = () => {
  resetForm();
  isDialogVisible.value = true;
};

const openEditDialog = (expense: FixedExpense) => {
  isEditMode.value = true;
  form._id = expense._id;
  form.description = expense.description;
  form.value = expense.value;
  form.dueDate = expense.dueDate;
  form.categoryId = expense.categoryId;
  form.isActive = expense.isActive;
  isDialogVisible.value = true;
};

const handleSubmit = async (formData: any) => {
  if (!formData.description || !formData.categoryId || formData.value <= 0) {
    ElMessage.warning('Preencha todos os campos obrigatórios.');
    return;
  }

  try {
    if (isEditMode.value) {
      const { _id, ...updateData } = formData;
      await updateFixedExpense({ input: { id: _id, ...updateData } });
      ElMessage.success('Gasto Fixo atualizado!');
    } else {
      const createInput = {
        description: formData.description,
        value: formData.value,
        dueDate: formData.dueDate,
        categoryId: formData.categoryId,
      };
      await createFixedExpense({ input: createInput });
      ElMessage.success('Gasto Fixo criado!');
    }
    isDialogVisible.value = false;
  } catch (e: unknown) {
    console.error("Erro:", e);
    if (e instanceof Error) {
        ElMessage.error(e.message);
    } else {
        ElMessage.error('Ocorreu um erro ao salvar o gasto fixo.');
    }
  }
};

const handleDelete = (id: string) => {
  ElMessageBox.confirm( 'Tem certeza que deseja excluir este gasto fixo?', 'Confirmar Exclusão',
    { confirmButtonText: 'Sim, Excluir', cancelButtonText: 'Cancelar', type: 'warning' }
  ).then(async () => {
    try {
      await removeFixedExpense({ id });
      ElMessage.success('Gasto Fixo excluído.');
    } catch (e: unknown) {
      if (e instanceof Error) ElMessage.error(e.message);
    }
  }).catch(() => {});
};
</script>