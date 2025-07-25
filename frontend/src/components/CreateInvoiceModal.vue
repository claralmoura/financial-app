<template>
  <el-dialog
    :model-value="visible"
    title="Criar Fatura Manualmente"
    width="400px"
    @close="$emit('update:visible', false)"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="Selecione o Mês e Ano">
        <el-date-picker
          v-model="form.date"
          type="month"
          placeholder="Selecione o período"
          class="w-full"
          size="large"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="large" @click="$emit('update:visible', false)">Cancelar</el-button>
      <el-button type="primary" size="large" @click="handleSubmit" :loading="loading">
        Criar Fatura
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  visible: boolean;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', value: { month: number; year: number }): void;
}>();

const form = reactive({
  date: new Date(),
});

const handleSubmit = () => {
  if (!form.date) {
    ElMessage.warning('Por favor, selecione um período.');
    return;
  }
  const selectedDate = new Date(form.date);
  emit('submit', {
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
};
</script>