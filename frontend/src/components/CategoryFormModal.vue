<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="500px"
    @close="$emit('update:visible', false)"
    class="rounded-lg"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="Nome da Categoria">
        <el-input v-model="form.name" size="large" placeholder="Ex: Moradia, Lazer...">
          <template #prefix>
            <el-icon><svg viewBox="0 0 24 24"><path :d="mdiTag" fill="currentColor" /></svg></el-icon>
          </template>
        </el-input>
      </el-form-item>

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
          {{ isEditMode ? 'Salvar Alterações' : 'Criar Categoria' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Category } from '../types';
import { mdiTag, mdiArrowUpCircle, mdiArrowDownCircle } from '@mdi/js';

const props = defineProps<{
  visible: boolean;
  title: string;
  loading: boolean;
  isEditMode: boolean;
  initialData?: Partial<Category>;
}>();

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', form: Partial<Category>): void;
}>();

const form = ref({
  _id: undefined as string | undefined,
  name: '',
  type: 'expense' as 'income' | 'expense',
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value._id = newData._id;
    form.value.name = newData.name || '';
    form.value.type = newData.type || 'expense';
  }
}, { immediate: true, deep: true });
</script>