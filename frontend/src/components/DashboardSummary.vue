<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <el-card shadow="hover" class="!bg-white">
      <div class="flex flex-col">
        <span class="text-gray-400">Receita do Mês</span>
        <span class="text-3xl font-bold text-green-400 mt-2">
          {{ formatCurrency(income) }}
        </span>
      </div>
    </el-card>
    <el-card shadow="hover" class="!bg-white">
      <div class="flex flex-col">
        <span class="text-gray-400">Despesa do Mês</span>
        <span class="text-3xl font-bold text-red-400 mt-2">
          {{ formatCurrency(expenses) }}
        </span>
      </div>
    </el-card>
    <el-card shadow="hover" class="!bg-white">
      <div class="flex flex-col">
        <span class="text-gray-400">Saldo do Mês</span>
        <span class="text-3xl font-bold text-grey-800 mt-2">
          {{ formatCurrency(balance) }}
        </span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  income: number;
  expenses: number;
  balance: number;
}>();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
</script>