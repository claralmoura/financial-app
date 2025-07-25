<template>
  <div class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen p-8 font-sans">
    <header class="flex justify-between items-center mb-10">
      <h1 class="text-3xl font-bold">Meu Dashboard</h1>
    </header>

    <main>
      <DashboardFilters 
        v-model:period="activeFilters.period"
        v-model:date="activeFilters.date"
      />
      
      <DashboardSummary 
        :income="filteredIncome"
        :expenses="filteredExpenses"
        :balance="balance"
      />
      
      <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlySummaryChart 
          title="Receitas vs. Despesas (Período)"
          :chart-data="incomeVsExpensesChartData" 
        />
        <MonthlySummaryChart 
          title="Despesas por Categoria (Período)"
          :chart-data="expensesByCategoryChartData" 
        />
      </div>
      
      <div class="mt-10">
        <BarChart
          title="Tendência (Últimos 6 Meses)"
          :chart-data="monthlyTrendChartData"
        />
      </div>

      <div class="mt-10">
        <GoalsSummary :goals="goals" />
      </div>
      
      <TransactionsTable
        class="mt-10"
        :transactions="filteredTransactions"
        :loading="transactionsLoading || exportLoading"
        :categories="allCategories"
        @create-transaction="openCreateDialog"
        @edit-transaction="openEditDialog"
        @delete-transaction="handleDelete"
        @export-transactions="handleExport"
      />
    </main>
    
    <TransactionFormModal
      v-model:visible="isDialogVisible"
      :title="dialogTitle"
      :loading="createLoading || updateLoading"
      :is-edit-mode="isEditMode"
      :initial-data="form"
      :income-categories="incomeCategories"  
      :expense-categories="expenseCategories"
      :open-invoices="openInvoices"
      :credit-cards="allCreditCards"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApolloClient, useQuery } from '@vue/apollo-composable';
import { useAuthStore } from '../stores/auth';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Transaction, Goal } from '../types';

import DashboardFilters from '../components/DashboardFilters.vue';
import DashboardSummary from '../components/DashboardSummary.vue';
import TransactionsTable from '../components/TransactionsTable.vue';
import TransactionFormModal from '../components/TransactionFormModal.vue';
import MonthlySummaryChart from '../components/MonthlySummaryChart.vue';
import BarChart from '../components/BarChart.vue';

import { useTransactions } from '../composables/useTransactions';
import { useCategories } from '../composables/useCategories';
import { useCardsAndInvoices } from '../composables/useCardsAndInvoices';
import { GOALS_QUERY } from '../apollo/queries/goals';

const router = useRouter();
const authStore = useAuthStore();
const { client: apolloClient } = useApolloClient();

const isDialogVisible = ref(false);
const isEditMode = ref(false);
const form = reactive({
  _id: undefined as string | undefined,
  description: '',
  value: 0,
  type: 'expense' as 'income' | 'expense' | 'card_expense',
  date: new Date().toISOString().split('T')[0],
  categoryId: null as string | null,
  cardInvoiceId: null as string | null,
});
const activeFilters = ref({
  period: 'month' as 'week' | 'month' | 'year',
  date: new Date(),
});

const { 
  transactions, 
  transactionsLoading,
  filteredTransactions,
  filteredIncome,
  filteredExpenses,
  balance,
  incomeVsExpensesChartData,
  expensesByCategoryChartData,
  monthlyTrendChartData,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  createLoading,
  updateLoading,
  exportTransactions,
  exportLoading,
} = useTransactions(activeFilters);

const { 
  incomeCategories, 
  expenseCategories, 
  allCategories 
} = useCategories();

const { 
  allCreditCards, 
  openInvoices 
} = useCardsAndInvoices();

const dialogTitle = computed(() => isEditMode.value ? 'Editar Transação' : 'Adicionar Nova Transação');

const { result: goalsResult } = useQuery<{ goals: Goal[] }>(GOALS_QUERY);
const goals = computed(() => goalsResult.value?.goals ?? []);

const resetForm = () => {
  isEditMode.value = false;
  form._id = undefined;
  form.description = '';
  form.value = 0;
  form.type = 'expense';
  form.date = new Date().toISOString().split('T')[0];
  form.categoryId = null;
  form.cardInvoiceId = null;
};

const openCreateDialog = () => {
  resetForm();
  isDialogVisible.value = true;
};

const openEditDialog = (transaction: Transaction) => {
  isEditMode.value = true;
  form._id = transaction._id;
  form.description = transaction.description;
  form.value = transaction.value;
  form.type = transaction.type;
  form.categoryId = transaction.categoryId || null;
  form.cardInvoiceId = transaction.cardInvoice?._id || null;
  const transactionDate = new Date(Number(transaction.date));
  if (!isNaN(transactionDate.getTime())) {
    form.date = transactionDate.toISOString().split('T')[0];
  } else {
    form.date = new Date().toISOString().split('T')[0];
  }
  isDialogVisible.value = true;
};

const handleSubmit = async (formData: any) => {
  if (!formData.description || formData.value <= 0) {
    ElMessage.warning('Preencha a descrição e um valor maior que zero.');
    return;
  }
  const input = {
    description: formData.description,
    value: formData.value,
    type: formData.type,
    date: formData.date,
    categoryId: formData.categoryId,
    cardInvoiceId: formData.cardInvoiceId,
  };
  try {
    if (isEditMode.value) {
      await updateTransaction({ input: { id: formData._id, ...input } });
      ElMessage.success('Transação atualizada!');
    } else {
      await createTransaction({ input });
      ElMessage.success('Transação criada!');
    }
    isDialogVisible.value = false;
  } catch (e: unknown) {
    if (e instanceof Error) ElMessage.error(e.message);
  }
};

const handleDelete = (id: string) => {
  ElMessageBox.confirm('Você tem certeza que deseja excluir esta transação?', 'Confirmar Exclusão',
    { confirmButtonText: 'Sim, Excluir', cancelButtonText: 'Cancelar', type: 'warning' }
  ).then(async () => {
    try {
      await deleteTransaction({ id });
      ElMessage.success('Transação excluída.');
    } catch (e: unknown) {
      if (e instanceof Error) ElMessage.error(e.message);
    }
  }).catch(() => { ElMessage.info('Ação cancelada.'); });
};

const handleExport = () => {
  exportTransactions();
};

const handleLogout = () => {
  authStore.logout();
  apolloClient.resetStore();
  router.push('/login');
};
</script>