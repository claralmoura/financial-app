<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="500px"
    @close="$emit('update:visible', false)"
    class="rounded-lg"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="Nome do Cartão">
        <el-input v-model="form.name" size="large" placeholder="Ex: Cartão Inter, Nubank Ultravioleta..." />
      </el-form-item>

      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <el-form-item label="Dia do Fechamento">
          <el-input-number v-model="form.closingDay" :min="1" :max="31" class="w-full" size="large" />
        </el-form-item>
        <el-form-item label="Dia do Vencimento">
          <el-input-number v-model="form.dueDay" :min="1" :max="31" class="w-full" size="large" />
        </el-form-item>
      </div>
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
          {{ isEditMode ? 'Salvar Alterações' : 'Criar Cartão' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CreditCard } from '../types';

const props = defineProps<{
  visible: boolean;
  title: string;
  loading: boolean;
  isEditMode: boolean;
  initialData?: Partial<CreditCard>;
}>();

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', form: Partial<CreditCard>): void;
}>();

const form = ref<Partial<CreditCard>>({
  name: '',
  closingDay: 1,
  dueDay: 10,
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value._id = newData._id;
    form.value.name = newData.name || '';
    form.value.closingDay = newData.closingDay || 1;
    form.value.dueDay = newData.dueDay || 10;
  }
}, { immediate: true, deep: true });
</script>