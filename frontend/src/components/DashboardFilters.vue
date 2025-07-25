<template>
  <div class="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <div class="flex flex-wrap items-center gap-4">
      <el-radio-group 
        :model-value="period" 
        @update:model-value="$emit('update:period', $event)"
      >
        <el-radio-button value="week">Semana</el-radio-button>
        <el-radio-button value="month">Mês</el-radio-button>
        <el-radio-button value="year">Ano</el-radio-button>
      </el-radio-group>

      <el-date-picker
        v-if="period === 'week'"
        :model-value="date"
        type="week"
        format="[Semana] ww"
        placeholder="Selecione a semana"
        :clearable="false"
        @update:model-value="$emit('update:date', $event)"
      />
      <el-date-picker
        v-if="period === 'month'"
        :model-value="date"
        type="month"
        placeholder="Selecione o mês"
        :clearable="false"
        @update:model-value="$emit('update:date', $event)"
      />
      <el-date-picker
        v-if="period === 'year'"
        :model-value="date"
        type="year"
        placeholder="Selecione o ano"
        :clearable="false"
        @update:model-value="$emit('update:date', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type FilterPeriod = 'week' | 'month' | 'year';

defineProps<{
  period: FilterPeriod;
  date: Date;
}>();

defineEmits<{
  (e: 'update:period', value: FilterPeriod): void;
  (e: 'update:date', value: Date): void;
}>();
</script>