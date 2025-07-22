<template>
  <el-card shadow="hover" class="bg-white">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-lg font-semibold text-gray-800">{{ goal.name }}</p>
        <p class="text-sm text-gray-500">Alcançado</p>
      </div>
      <div class="flex gap-2">
        <el-button circle plain type="success" size="small" @click="$emit('add-contribution', goal)">
          <el-icon><svg viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor"/></svg></el-icon>
        </el-button>
        <el-button circle plain type="primary" size="small" @click="$emit('edit', goal)">
          <el-icon><svg viewBox="0 0 24 24"><path :d="mdiPencil" fill="currentColor"/></svg></el-icon>
        </el-button>
        <el-button circle plain type="danger" size="small" @click="$emit('delete', goal._id)">
          <el-icon><svg viewBox="0 0 24 24"><path :d="mdiDelete" fill="currentColor"/></svg></el-icon>
        </el-button>
      </div>
    </div>
    <div class="mt-4">
      <el-progress :percentage="progressPercentage" :stroke-width="10" striped :color="progressColor" />
      <div class="flex justify-between text-sm mt-2">
        <span class="font-bold text-green-500">{{ formatCurrency(goal.currentValue) }}</span>
        <span class="text-gray-500">{{ formatCurrency(goal.targetValue) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';
import type { Goal } from '../types';
import { formatCurrency } from '@/utils/formatters';

const props = defineProps<{
  goal: Goal;
}>();

defineEmits<{
  (e: 'edit', goal: Goal): void;
  (e: 'delete', id: string): void;
  (e: 'add-contribution', goal: Goal): void;
}>();

const progressPercentage = computed(() => {
  if (props.goal.targetValue === 0) return 0;
  const percentage = (props.goal.currentValue / props.goal.targetValue) * 100;
  return Math.min(percentage, 100);
});

const progressColor = computed(() => {
  if (progressPercentage.value < 40) return '#f87171';
  if (progressPercentage.value < 75) return '#fbbf24';
  return '#4ade80';
});
</script>