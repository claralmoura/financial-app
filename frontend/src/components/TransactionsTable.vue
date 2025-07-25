<template>
  <el-card shadow="never" class="bg-white dark:bg-gray-800">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 shrink-0">Suas Transações</h2>
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <el-input v-model="searchQuery" placeholder="Buscar por descrição..." clearable class="w-full sm:w-40" />
        <el-select v-model="selectedCategories" multiple clearable placeholder="Filtrar por categoria" class="w-full sm:w-40">
          <el-option v-for="category in categories" :key="category._id" :label="category.name" :value="category._id" />
        </el-select>
        <el-button @click="$emit('export-transactions')">Exportar</el-button>
        <el-button type="primary" @click="$emit('create-transaction')" class="w-full sm:w-auto">
          <div class="flex items-center gap-2 justify-center">
            <svg :width="20" :height="20" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
            <span class="hidden sm:block">Adicionar</span>
          </div>
        </el-button>
      </div>
    </div>

    <el-table :data="filteredTransactions" :loading="loading" empty-text="Nenhuma transação encontrada." class="hidden md:table w-full">
      <el-table-column prop="date" label="Data" sortable width="140">
        <template #default="scope">
          <span>{{ formatDate(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Descrição" />
      <el-table-column label="Tipo / Fonte" width="200">
        <template #default="scope">
          <div class="flex flex-col">
            <el-tag :type="getTransactionType(scope.row.type).type" effect="light" size="small" class="w-fit">
              {{ getTransactionType(scope.row.type).label }}
            </el-tag>
            <span v-if="scope.row.type === 'card_expense'" class="text-xs text-gray-500 mt-1">
              {{ scope.row.cardInvoice?.creditCard?.name }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Categoria" width="150" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.category" effect="plain" size="small">
            {{ scope.row.category.name }}
          </el-tag>
          <span v-else class="text-gray-400">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="Valor" sortable align="right">
        <template #default="scope">
          <span :class="scope.row.type === 'income' ? 'text-green-500' : 'text-red-500'" class="font-bold">
            {{ scope.row.type === 'income' ? '+' : '-' }} R$ {{ scope.row.value.toFixed(2) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Ações" width="120" align="center">
        <template #default="scope">
          <div class="flex gap-2 justify-center">
            <el-button @click="$emit('edit-transaction', scope.row)" circle plain type="primary">
              <svg :width="16" :height="16" viewBox="0 0 24 24"><path :d="mdiPencil" fill="currentColor" /></svg>
            </el-button>
            <el-button @click="$emit('delete-transaction', scope.row._id)" circle plain type="danger">
              <svg :width="16" :height="16" viewBox="0 0 24 24"><path :d="mdiDelete" fill="currentColor" /></svg>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="md:hidden space-y-4">
      <div v-if="loading">Carregando...</div>
      <div v-if="!loading && !filteredTransactions.length" class="text-center text-gray-500 py-10">Nenhuma transação encontrada.</div>
      <el-card v-for="item in filteredTransactions" :key="item._id" shadow="never" class="bg-gray-50 dark:bg-gray-700">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="font-semibold text-gray-800 dark:text-gray-100">{{ item.description }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(item.date) }}</p>
            <div class="mt-2">
              <el-tag :type="getTransactionType(item.type).type" effect="light" size="small">
                {{ getTransactionType(item.type).label }}
              </el-tag>
              <p v-if="item.type === 'card_expense'" class="text-xs text-gray-500 mt-1">
                {{ item.cardInvoice?.creditCard?.name }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <span :class="item.type === 'income' ? 'text-green-500' : 'text-red-500'" class="font-bold text-lg">
              {{ item.type === 'income' ? '+' : '-' }} R$ {{ item.value.toFixed(2) }}
            </span>
            <div class="flex gap-2 mt-2">
              <el-button @click="$emit('edit-transaction', item)" circle plain type="primary" size="small">
                <svg :width="14" :height="14" viewBox="0 0 24 24"><path :d="mdiPencil" fill="currentColor" /></svg>
              </el-button>
              <el-button @click="$emit('delete-transaction', item._id)" circle plain type="danger" size="small">
                <svg :width="14" :height="14" viewBox="0 0 24 24"><path :d="mdiDelete" fill="currentColor" /></svg>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';
import type { Transaction, Category } from '../types';
import { formatDate } from '@/utils/formatters';
import { ElButton, ElIcon } from 'element-plus';

const props = defineProps<{
  transactions: Transaction[] | undefined;
  loading: boolean;
  categories: Category[];
}>();

defineEmits<{
  (e: 'create-transaction'): void;
  (e: 'edit-transaction', transaction: Transaction): void;
  (e: 'delete-transaction', id: string): void;
  (e: 'export-transactions'): void;
}>();

const searchQuery = ref('');
const selectedCategories = ref<string[]>([]);

const filteredTransactions = computed(() => {
  let filtered = props.transactions;

  if (searchQuery?.value) {
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  if (selectedCategories?.value?.length) {
    filtered = filtered.filter(t => 
      t.category._id && selectedCategories.value.includes(t.category._id)
    );
  }

  return filtered;
});

const getTransactionType = (type: Transaction['type']) => {
  if (type === 'income') return { label: 'Receita', type: 'success' };
  if (type === 'expense') return { label: 'Despesa', type: 'danger' };
  if (type === 'card_expense') return { label: 'Cartão de Crédito', type: 'warning' };
  return { label: 'N/A', type: 'info' };
};
</script>