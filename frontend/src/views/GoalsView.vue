<template>
  <div class="p-8 font-sans">
    <header class="flex justify-between items-center mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Minhas Metas</h1>
      <el-button type="primary" @click="openCreateDialog">
        <div class="flex items-center gap-2">
          <svg :width="20" :height="20" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          <span>Adicionar Meta</span>
        </div>
      </el-button>
    </header>

    <main>
      <div v-if="loading" class="text-center">Carregando metas...</div>
      <div v-else-if="!goals.length">
        <el-empty description="Você ainda não tem nenhuma meta. Que tal criar uma?" />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GoalCard 
          v-for="goal in goals" 
          :key="goal._id"
          :goal="goal"
          @edit="openEditDialog"
          @delete="handleDelete"
          @add-contribution="openContributionDialog"
          @subtract-contribution="openSubtractDialog"
        />
      </div>
    </main>

    <GoalFormModal
      v-model:visible="isDialogVisible"
      :title="dialogTitle"
      :loading="createLoading || updateLoading"
      :is-edit-mode="isEditMode"
      :initial-data="form"
      @submit="handleSubmit"
    />

    <GoalContributionModal
      v-if="selectedGoal"
      v-model:visible="isContributionDialogVisible"
      :loading="addToGoalLoading || subtractFromGoalLoading"
      :goal-name="selectedGoal.name"
      :mode="contributionMode"
      @submit="handleContributionSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';
import type { Goal } from '../types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { mdiPlus } from '@mdi/js';
import GoalCard from '../components/GoalCard.vue';
import GoalFormModal from '../components/GoalFormModal.vue';
import GoalContributionModal from '../components/GoalContributionModal.vue';

import { GOALS_QUERY } from '../apollo/queries/goals';
import {
  CREATE_GOAL_MUTATION,
  UPDATE_GOAL_MUTATION,
  REMOVE_GOAL_MUTATION,
  ADD_TO_GOAL_MUTATION,
  SUBTRACT_FROM_GOAL_MUTATION
} from '../apollo/mutations/goals';

const isDialogVisible = ref(false);
const isEditMode = ref(false);
const form = reactive({
  _id: undefined as string | undefined,
  name: '',
  targetValue: 1000,
});

const isContributionDialogVisible = ref(false);
const selectedGoal = ref<Goal | null>(null);
const contributionMode = ref<'add' | 'subtract'>('add');

const { result, loading } = useQuery<{ goals: Goal[] }>(GOALS_QUERY);
const { mutate: createGoal, loading: createLoading } = useMutation(CREATE_GOAL_MUTATION, { refetchQueries: [{ query: GOALS_QUERY }]});
const { mutate: updateGoal, loading: updateLoading } = useMutation(UPDATE_GOAL_MUTATION, { refetchQueries: [{ query: GOALS_QUERY }]});
const { mutate: removeGoal } = useMutation(REMOVE_GOAL_MUTATION, { refetchQueries: [{ query: GOALS_QUERY }]});
const { mutate: addToGoal, loading: addToGoalLoading } = useMutation(ADD_TO_GOAL_MUTATION);
const { mutate: subtractFromGoal, loading: subtractFromGoalLoading } = useMutation(SUBTRACT_FROM_GOAL_MUTATION);

const goals = computed(() => result.value?.goals ?? []);
const dialogTitle = computed(() => isEditMode.value ? 'Editar Meta' : 'Criar Nova Meta');
const contributionDialogTitle = computed(() => `Movimentar Meta: ${selectedGoal.value?.name}`);

const resetForm = () => {
  isEditMode.value = false;
  form._id = undefined;
  form.name = '';
  form.targetValue = 1000;
};

const openCreateDialog = () => {
  resetForm();
  isDialogVisible.value = true;
};

const openEditDialog = (goal: Goal) => {
  isEditMode.value = true;
  form._id = goal._id;
  form.name = goal.name;
  form.targetValue = goal.targetValue;
  isDialogVisible.value = true;
};

const openContributionDialog = (goal: Goal) => {
  contributionMode.value = 'add';
  selectedGoal.value = goal;
  isContributionDialogVisible.value = true;
};

const openSubtractDialog = (goal: Goal) => {
  contributionMode.value = 'subtract';
  selectedGoal.value = goal;
  isContributionDialogVisible.value = true;
};

const handleSubmit = async (formData: Partial<Goal>) => {
  if (!formData.name || !formData.targetValue || formData.targetValue <= 0) {
    ElMessage.warning('Preencha todos os campos corretamente.');
    return;
  }
  try {
    if (isEditMode.value) {
      const input = { id: formData._id, name: formData.name, targetValue: formData.targetValue };
      await updateGoal({ input });
      ElMessage.success('Meta atualizada!');
    } else {
      const input = { name: formData.name, targetValue: formData.targetValue };
      await createGoal({ input });
      ElMessage.success('Meta criada!');
    }
    isDialogVisible.value = false;
  } catch (e: unknown) {
    if (e instanceof Error) ElMessage.error(e.message);
  }
};

const handleContributionSubmit = async (value: number) => {
  if (!selectedGoal.value) return;

  const input = { id: selectedGoal.value._id, value: Math.abs(value) };
  const mutation = value > 0 ? addToGoal : subtractFromGoal;
  const successMessage = value > 0 ? 'Valor adicionado com sucesso!' : 'Valor removido com sucesso!';

  try {
    await mutation({ input });
    ElMessage.success(successMessage);
    isContributionDialogVisible.value = false;
  } catch (e: unknown) {
    if (e instanceof Error) ElMessage.error(e.message);
  }
};

const handleDelete = (id: string) => {
  ElMessageBox.confirm('Tem certeza que deseja excluir esta meta?', 'Confirmar Exclusão',
    { confirmButtonText: 'Sim, Excluir', cancelButtonText: 'Cancelar', type: 'warning' }
  ).then(async () => {
    try {
      await removeGoal({ id });
      ElMessage.success('Meta excluída.');
    } catch (e: unknown) {
      if (e instanceof Error) ElMessage.error(e.message);
    }
  }).catch(() => {});
};
</script>