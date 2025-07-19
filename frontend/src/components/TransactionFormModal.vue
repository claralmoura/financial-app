<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="500px"
    @close="$emit('update:visible', false)"
    class="rounded-lg"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="Descrição">
        <el-input v-model="form.description" size="large" placeholder="Ex: Aluguel, Salário...">
          <template #prefix>
            <el-icon><svg viewBox="0 0 24 24"><path :d="mdiPencil" fill="currentColor" /></svg></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <el-form-item label="Valor">
          <el-input-number v-model="form.value" :precision="2" :step="10" :min="0" class="w-full" size="large" />
        </el-form-item>

        <el-form-item label="Data">
          <el-date-picker
            v-model="form.date"
            type="date"
            class="w-full"
            size="large"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </div>
      
      <el-form-item label="Tipo">
        <el-radio-group v-model="form.type" size="large">
          <el-radio-button value="expense">
            <div class="flex items-center gap-2 px-4">
              <svg :width="20" :height="20" viewBox="0 0 24 24"><path :d="mdiArrowDownCircle" fill="currentColor" /></svg>
              <span>Despesa</span>
            </div>
          </el-radio-button>
          <el-radio-button value="income">
            <div class="flex items-center gap-2 px-4">
              <svg :width="20" :height="20" viewBox="0 0 24 24"><path :d="mdiArrowUpCircle" fill="currentColor" /></svg>
              <span>Receita</span>
            </div>
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <transition name="el-fade-in-linear">
        <el-form-item v-if="form.type" label="Categoria">
          <el-select 
            v-model="form.categoryId" 
            placeholder="Selecione uma categoria" 
            class="w-full"
            size="large"
          >
             <template #prefix>
              <el-icon><svg viewBox="0 0 24 24"><path :d="mdiTag" fill="currentColor" /></svg></el-icon>
            </template>
            <el-option
              v-for="category in filteredCategories"
              :key="category._id"
              :label="category.name"
              :value="category._id"
            />
          </el-select>
        </el-form-item>
      </transition>
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
          {{ isEditMode ? 'Salvar Alterações' : 'Criar Transação' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Transaction, Category } from '../types';
import { mdiPencil, mdiTag, mdiArrowUpCircle, mdiArrowDownCircle } from '@mdi/js';

const props = defineProps<{
  visible: boolean;
  title: string;
  loading: boolean;
  isEditMode: boolean;
  initialData?: Partial<Transaction>;
  incomeCategories: Category[];
  expenseCategories: Category[];
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', form: any): void;
}>();

const form = ref({
  _id: null as string | null,
  description: '',
  value: 0,
  type: 'expense' as 'income' | 'expense',
  date: new Date().toISOString().split('T')[0],
  categoryId: null as string | null,
});

const filteredCategories = computed(() => {
  return form.value.type === 'income' ? props.incomeCategories : props.expenseCategories;
});

watch(() => form.value.type, () => {
  form.value.categoryId = null;
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value._id = newData._id || null;
    form.value.description = newData.description || '';
    form.value.value = newData.value || 0;
    form.value.type = newData.type || 'expense';
    form.value.date = newData.date || new Date().toISOString().split('T')[0];
    form.value.categoryId = newData.categoryId || null;
  }
}, { immediate: true, deep: true });
</script>