<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="400px"
    @close="$emit('update:visible', false)"
    class="rounded-lg"
  >
    <el-form :model="form" label-position="top" @submit.prevent="handleSubmit">
      <el-form-item label="Valor da Movimentação (R$)">
        <el-input-number v-model="form.value" :precision="2" :step="50" :min="0.01" class="w-full" size="large" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="$emit('update:visible', false)">Cancelar</el-button>
        <el-button
          :type="mode === 'add' ? 'primary' : 'warning'"
          size="large"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ mode === 'add' ? 'Adicionar Valor' : 'Remover Valor' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

type ContributionMode = 'add' | 'subtract';

const props = defineProps<{
  visible: boolean;
  loading: boolean;
  goalName: string;
  mode: ContributionMode;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', value: number): void;
}>();

const form = reactive({
  value: 50,
});

const title = `Movimentar Meta: ${props.goalName}`;

const handleSubmit = () => {
  const valueToEmit = props.mode === 'subtract' ? -form.value : form.value;
  emit('submit', valueToEmit);
};
</script>