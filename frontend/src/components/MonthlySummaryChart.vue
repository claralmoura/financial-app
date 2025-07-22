<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ title }}</h3>
    
    <div class="relative h-72"> 
      <Doughnut 
        v-if="chartData.labels && chartData.labels.length" 
        :data="chartData" 
        :options="chartOptions" 
      />
      <div v-else class="flex items-center justify-center h-full text-center text-gray-500">
        <div>
          <p>Sem dados suficientes para exibir o gráfico.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, type ChartData } from 'chart.js';
import { useDark } from '@vueuse/core';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const isDark = useDark();

defineProps<{
  title: string;
  chartData: ChartData<'doughnut'>;
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
  }
}));
</script>