<template>
  <div class="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-md">
    <el-radio-group v-model="filterPeriod">
      <el-radio-button value="week">Semana</el-radio-button>
      <el-radio-button value="month">Mês</el-radio-button>
      <el-radio-button value="year">Ano</el-radio-button>
    </el-radio-group>

    <el-date-picker
      v-if="filterPeriod === 'week'"
      v-model="selectedDate"
      type="week"
      format="[Semana] ww"
      placeholder="Selecione a semana"
      :clearable="false"
    />
    <el-date-picker
      v-if="filterPeriod === 'month'"
      v-model="selectedDate"
      type="month"
      placeholder="Selecione o mês"
      :clearable="false"
    />
    <el-date-picker
      v-if="filterPeriod === 'year'"
      v-model="selectedDate"
      type="year"
      placeholder="Selecione o ano"
      :clearable="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

type FilterPeriod = 'week' | 'month' | 'year';

const emit = defineEmits<{
  (e: 'filter-change', filters: { period: FilterPeriod, date: Date }): void;
}>();

const filterPeriod = ref<FilterPeriod>('month');
const selectedDate = ref(new Date());

const emitFilters = () => {
  emit('filter-change', {
    period: filterPeriod.value,
    date: selectedDate.value,
  });
};

watch([filterPeriod, selectedDate], emitFilters);

onMounted(emitFilters);
</script>