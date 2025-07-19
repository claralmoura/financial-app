<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ title }}</h3>
    
    <div class="relative h-72"> 
      <Doughnut 
        v-if="chartData.labels && chartData.labels.length > 0" 
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
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, type ChartData } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

defineProps<{
  title: string;
  chartData: ChartData<'doughnut'>;
}>();

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>