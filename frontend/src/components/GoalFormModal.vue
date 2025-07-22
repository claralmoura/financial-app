<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="500px"
    @close="$emit('update:visible', false)"
    class="rounded-lg"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="Nome da Meta">
        <el-input v-model="form.name" size="large" placeholder="Ex: Viagem para a Europa..." />
      </el-form-item>
      <el-form-item label="Valor Alvo (R$)">
        <el-input-number v-model="form.targetValue" :precision="2" :step="100" :min="1" class="w-full" size="large" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="$emit('update:visible', false)">Cancelar</el-button>
        <el-button type="primary" size="large" @click="$emit('submit', form)" :loading="loading">
          {{ isEditMode ? 'Salvar Alterações' : 'Criar Meta' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Goal } from '../types';

const props = defineProps<{
  visible: boolean;
  title: string;
  loading: boolean;
  isEditMode: boolean;
  initialData?: Partial<Goal>;
}>();

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', form: Partial<Goal>): void;
}>();

const form = ref<Partial<Goal>>({
  name: '',
  targetValue: 1000,
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value._id = newData._id;
    form.value.name = newData.name || '';
    form.value.targetValue = newData.targetValue || 1000;
  }
}, { immediate: true, deep: true });
</script>