<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ title }}</h3>
    <div class="relative h-72">
      <Bar v-if="chartData.labels && chartData.labels.length" :data="chartData" :options="chartOptions" />
      <div v-else class="flex items-center justify-center h-full text-center text-gray-500">
        <p>Sem dados suficientes para exibir o gráfico.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartData } from 'chart.js';
import { useDark } from '@vueuse/core';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const isDark = useDark();

defineProps<{
  title: string;
  chartData: ChartData<'bar'>;
}>();

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: isDark.value ? '#E5E7EB' : '#4B5563',
      }
    }
  },
  scales: {
    x: {
      ticks: { color: isDark.value ? '#9CA3AF' : '#6B7280' },
      grid: { color: isDark.value ? '#374151' : '#E5E7EB' },
    },
    y: {
      ticks: { color: isDark.value ? '#9CA3AF' : '#6B7280' },
      grid: { color: isDark.value ? '#374151' : '#E5E7EB' },
    },
  },
}));
</script>