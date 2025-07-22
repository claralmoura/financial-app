<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="500px"
    @close="$emit('update:visible', false)"
    class="rounded-lg"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="Descrição do Gasto">
        <el-input v-model="form.description" size="large" placeholder="Ex: Aluguel, Netflix..." />
      </el-form-item>

      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <el-form-item label="Valor Fixo (R$)">
          <el-input-number v-model="form.value" :precision="2" :step="10" :min="0" class="w-full" size="large" />
        </el-form-item>

        <el-form-item label="Dia do Vencimento">
          <el-input-number v-model="form.dueDate" :min="1" :max="31" class="w-full" size="large" />
        </el-form-item>
      </div>

      <el-form-item label="Categoria">
        <el-select 
          v-model="form.categoryId" 
          placeholder="Selecione uma categoria de despesa" 
          class="w-full"
          size="large"
        >
          <el-option
            v-for="category in expenseCategories"
            :key="category._id"
            :label="category.name"
            :value="category._id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Status">
        <el-switch v-model="form.isActive" />
        <span class="ml-2 text-gray-500">{{ form.isActive ? 'Ativo' : 'Inativo' }}</span>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="$emit('update:visible', false)">Cancelar</el-button>
        <el-button
          type="primary"
          size="large"
          @click="$emit('submit', form)"
          :loading="loading"
        >
          {{ isEditMode ? 'Salvar Alterações' : 'Criar Gasto Fixo' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Category } from '../types';

interface FixedExpenseForm {
  _id?: string;
  description: string;
  value: number;
  dueDate: number;
  categoryId: string | null;
  isActive: boolean;
}

const props = defineProps<{
  visible: boolean;
  title: string;
  loading: boolean;
  isEditMode: boolean;
  initialData?: Partial<FixedExpenseForm>;
  expenseCategories: Category[];
}>();

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', form: FixedExpenseForm): void;
}>();

const form = ref<FixedExpenseForm>({
  description: '',
  value: 0,
  dueDate: 10,
  categoryId: null,
  isActive: true,
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value._id = newData._id;
    form.value.description = newData.description || '';
    form.value.value = newData.value || 0;
    form.value.dueDate = newData.dueDate || 10;
    form.value.categoryId = newData.categoryId || null;
    form.value.isActive = newData.isActive !== undefined ? newData.isActive : true;
  }
}, { immediate: true, deep: true });
</script>