<template>
  <div v-if="goals && goals.length > 0">
    <el-card shadow="never" class="bg-white dark:bg-gray-800">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Progresso das Metas</h3>
        <router-link to="/goals" class="text-sm text-primary hover:underline">
          Ver Todas
        </router-link>
      </div>
      <div class="space-y-4">
        <div v-for="goal in goals" :key="goal._id">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium text-gray-600 dark:text-gray-300">{{ goal.name }}</span>
            <span class="text-gray-500 dark:text-gray-400">{{ formatCurrency(goal.currentValue) }} / {{ formatCurrency(goal.targetValue) }}</span>
          </div>
          <el-progress :percentage="getPercentage(goal)" :color="getProgressColor(goal)" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '@/types';
import { formatCurrency } from '@/utils/formatters';

defineProps<{
  goals: Goal[];
}>();

const getPercentage = (goal: Goal) => {
  if (goal.targetValue === 0) return 0;
  const percentage = (goal.currentValue / goal.targetValue) * 100;
  return Math.min(percentage, 100);
};

const getProgressColor = (goal: Goal) => {
  const percentage = getPercentage(goal);
  if (percentage < 40) return '#f87171';
  if (percentage < 75) return '#fbbf24';
  return '#4ade80';
};
</script>