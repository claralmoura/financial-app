<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ title }}</h3>
    <div class="relative h-72">
      <Bar v-if="chartData.labels && chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
      <div v-else class="flex items-center justify-center h-full text-center text-gray-500">
        <p>Sem dados suficientes para exibir o gráfico.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartData } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

defineProps<{
  title: string;
  chartData: ChartData<'bar'>;
}>();

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: true } },
  },
};
</script>