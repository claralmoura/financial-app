<template>
  <div class="p-8 font-sans">
    <header class="flex justify-between items-center mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Gerenciar Categorias</h1>
      <el-button type="primary" @click="openCreateDialog">
        <div class="flex items-center gap-2">
          <svg :width="20" :height="20" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          <span>Adicionar Categoria</span>
        </div>
      </el-button>
    </header>

    <main>
      <el-card shadow="never" class="bg-white">
        <el-table :data="categories" v-loading="loading" empty-text="Nenhuma categoria encontrada.">
          <el-table-column prop="name" label="Nome" sortable />
          <el-table-column prop="type" label="Tipo" width="150" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.type === 'income' ? 'success' : 'danger'" effect="light">
                {{ scope.row.type === 'income' ? 'Receita' : 'Despesa' }}
              </el-tag>
            </template>
          </el-table-column>
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

    <CategoryFormModal
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
import type { Category } from '../types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';
import CategoryFormModal from '../components/CategoryFormModal.vue';

const isDialogVisible = ref(false);
const isEditMode = ref(false);
const form = reactive({
  _id: undefined as string | undefined,
  name: '',
  type: 'expense' as 'income' | 'expense',
});

const CATEGORIES_QUERY = gql`
  query Categories {
    categories { _id name type }
  }
`;
const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) { _id }
  }
`;
const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) { _id }
  }
`;
const REMOVE_CATEGORY_MUTATION = gql`
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id) { _id }
  }
`;

const { result, loading } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY);
const { mutate: createCategory, loading: createLoading } = useMutation(CREATE_CATEGORY_MUTATION, { refetchQueries: [{ query: CATEGORIES_QUERY }] });
const { mutate: updateCategory, loading: updateLoading } = useMutation(UPDATE_CATEGORY_MUTATION, { refetchQueries: [{ query: CATEGORIES_QUERY }] });
const { mutate: removeCategory } = useMutation(REMOVE_CATEGORY_MUTATION, { refetchQueries: [{ query: CATEGORIES_QUERY }] });

const categories = computed(() => result.value?.categories ?? []);
const dialogTitle = computed(() => isEditMode.value ? 'Editar Categoria' : 'Adicionar Nova Categoria');

const resetForm = () => {
  isEditMode.value = false;
  form._id = undefined;
  form.name = '';
  form.type = 'expense';
};

const openCreateDialog = () => {
  resetForm();
  isDialogVisible.value = true;
};

const openEditDialog = (category: Category) => {
  isEditMode.value = true;
  form._id = category._id;
  form.name = category.name;
  form.type = category.type;
  isDialogVisible.value = true;
};

const handleSubmit = async (formData: Partial<Category>) => {
  if (!formData.name) {
    ElMessage.warning('O nome da categoria é obrigatório.');
    return;
  }

  try {
    if (isEditMode.value) {
      if (!formData._id) {
        ElMessage.error('ID da categoria não encontrado para edição.');
        return;
      }
      const input = { id: formData._id, name: formData.name, type: formData.type };
      await updateCategory({ input });
      ElMessage.success('Categoria atualizada!');
    } else {
      const input = { name: formData.name, type: formData.type };
      await createCategory({ input });
      ElMessage.success('Categoria criada!');
    }
    isDialogVisible.value = false;
  } catch (e: unknown) {
    if (e instanceof Error) ElMessage.error(e.message);
  }
};

const handleDelete = (id: string) => {
  ElMessageBox.confirm(
    'Excluir esta categoria também a removerá de todas as transações associadas. Esta ação não pode ser desfeita.',
    'Confirmar Exclusão',
    {
      confirmButtonText: 'Sim, Excluir',
      cancelButtonText: 'Cancelar',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await removeCategory({ id });
      ElMessage.success('Categoria excluída.');
    } catch (e: unknown) {
      if (e instanceof Error) ElMessage.error(e.message)
    }
  }).catch(() => {
    ElMessage.info('Ação de exclusão cancelada.');
  });
};
</script>