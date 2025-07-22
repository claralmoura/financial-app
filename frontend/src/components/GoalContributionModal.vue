<template>
  <el-dialog
    :model-value="visible"
    :title="`Adicionar à Meta: ${goalName}`"
    width="400px"
    @close="$emit('update:visible', false)"
    class="rounded-lg"
  >
    <el-form :model="form" label-position="top" @submit.prevent="$emit('submit', form.value)">
      <el-form-item label="Valor da Contribuição (R$)">
        <el-input-number v-model="form.value" :precision="2" :step="50" :min="0.01" class="w-full" size="large" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="$emit('update:visible', false)">Cancelar</el-button>
        <el-button
          type="primary"
          size="large"
          @click="$emit('submit', form.value)"
          :loading="loading"
        >
          Adicionar Valor
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

defineProps<{
  visible: boolean;
  loading: boolean;
  goalName: string;
}>();

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', value: number): void;
}>();

const form = reactive({
  value: 50,
});
</script>