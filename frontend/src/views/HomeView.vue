<template>
  <div class="bg-gray-100 text-gray-800 min-h-screen p-8 font-sans">
    <header class="flex justify-between items-center mb-10">
      <h1 class="text-3xl font-bold">Meu Dashboard</h1>
    </header>

    <main>
      <DashboardFilters @filter-change="handleFilterChange" />
      
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
      
      <TransactionsTable
        class="mt-10"
        :transactions="transactions"
        :loading="transactionsLoading"
        :categories="allCategories"
        @create-transaction="openCreateDialog"
        @edit-transaction="openEditDialog"
        @delete-transaction="handleDelete"
      />
    </main>
    
    <TransactionFormModal
      v-model:visible="isDialogVisible"
      :title="dialogTitle"
      :loading="createLoading || updateLoading"
      :is-edit-mode="isEditMode"
      :initial-data="form"
      @submit="handleSubmit"
      :income-categories="incomeCategories"
      :expense-categories="expenseCategories"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';
import { useAuthStore } from '../stores/auth';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Transaction, Category } from '../types';
import DashboardFilters from '../components/DashboardFilters.vue';
import DashboardSummary from '../components/DashboardSummary.vue';
import TransactionsTable from '../components/TransactionsTable.vue';
import TransactionFormModal from '../components/TransactionFormModal.vue';
import MonthlySummaryChart from '../components/MonthlySummaryChart.vue';
import BarChart from '../components/BarChart.vue';

const router = useRouter();
const authStore = useAuthStore();
const { client: apolloClient } = useApolloClient();

const isDialogVisible = ref(false);
const isEditMode = ref(false);
const form = reactive({
  _id: undefined as string | undefined,
  description: '',
  value: 0,
  type: 'expense' as 'income' | 'expense',
  date: new Date().toISOString().split('T')[0],
  categoryId: null as string | null,
});

const activeFilters = reactive({
  period: 'month' as 'week' | 'month' | 'year',
  date: new Date(),
});

const TRANSACTIONS_QUERY = gql`
  query Transactions {
    transactions { _id description value type date category { _id name } }
  }
`;
const CATEGORIES_QUERY = gql`
  query Categories {
    categories { _id name type }
  }
`;
const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) { _id }
  }
`;
const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) { _id }
  }
`;
const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) { _id }
  }
`;

const { result: transactionsResult, loading: transactionsLoading } = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS_QUERY);
const { result: categoriesResult } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY);

const { mutate: createTransaction, loading: createLoading } = useMutation(CREATE_TRANSACTION_MUTATION, { refetchQueries: [{ query: TRANSACTIONS_QUERY }] });
const { mutate: updateTransaction, loading: updateLoading } = useMutation(UPDATE_TRANSACTION_MUTATION, { refetchQueries: [{ query: TRANSACTIONS_QUERY }] });
const { mutate: deleteTransaction } = useMutation(DELETE_TRANSACTION_MUTATION, { refetchQueries: [{ query: TRANSACTIONS_QUERY }] });

const dialogTitle = computed(() => isEditMode.value ? 'Editar Transação' : 'Adicionar Nova Transação');
const transactions = computed(() => transactionsResult.value?.transactions ?? []);
const incomeCategories = computed(() => categoriesResult.value?.categories.filter(c => c.type === 'income') ?? []);
const expenseCategories = computed(() => categoriesResult.value?.categories.filter(c => c.type === 'expense') ?? []);
const allCategories = computed(() => categoriesResult.value?.categories ?? []);

const filteredTransactions = computed(() => {
  const all = transactions.value;
  if (!all) return [];
  const selected = new Date(activeFilters.date);

  if (activeFilters.period === 'year') {
    const year = selected.getFullYear();
    return all.filter(t => new Date(t.date).getFullYear() === year);
  }

  if (activeFilters.period === 'month') {
    const month = selected.getMonth();
    const year = selected.getFullYear();
    return all.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === month && tDate.getFullYear() === year;
    });
  }

  if (activeFilters.period === 'week') {
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return all.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startOfWeek && tDate <= endOfWeek;
    });
  }
  
  return [];
});

const filteredIncome = computed(() => 
  filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.value, 0)
);

const filteredExpenses = computed(() => 
  filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.value, 0)
);

const balance = computed(() => filteredIncome.value - filteredExpenses.value);

const incomeVsExpensesChartData = computed(() => ({
  labels: ['Receitas', 'Despesas'],
  datasets: [
    {
      backgroundColor: ['#4ade80', '#f87171'],
      data: [filteredIncome.value, filteredExpenses.value],
    },
  ],
}));

const expensesByCategoryChartData = computed(() => {
  const expenses = filteredTransactions.value.filter(t => t.type === 'expense');
  const groupedExpenses = expenses.reduce((acc, transaction) => {
    const categoryName = transaction.category?.name || 'Sem Categoria';
    acc[categoryName] = (acc[categoryName] || 0) + transaction.value;
    return acc;
  }, {} as Record<string, number>);

  const labels = Object.keys(groupedExpenses);
  const data = Object.values(groupedExpenses);

  return {
    labels,
    datasets: [{
      backgroundColor: ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#38bdf8', '#818cf8', '#c084fc'],
      data,
    }],
  };
});

const monthlyTrendChartData = computed(() => {
  const labels: string[] = [];
  const incomeData: number[] = [];
  const expenseData: number[] = [];
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  for (let i = 0; i < 6; i++) {
    const date = new Date(sixMonthsAgo);
    date.setMonth(date.getMonth() + i);
    labels.push(new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date).replace('.', ''));
    incomeData.push(0);
    expenseData.push(0);
  }

  transactions.value.forEach(t => {
    const transactionDate = new Date(t.date);
    if (transactionDate >= sixMonthsAgo) {
      const monthIndex = (transactionDate.getFullYear() - sixMonthsAgo.getFullYear()) * 12 + (transactionDate.getMonth() - sixMonthsAgo.getMonth());
      if (monthIndex >= 0 && monthIndex < 6) {
        if (t.type === 'income') {
          incomeData[monthIndex] += t.value;
        } else {
          expenseData[monthIndex] += t.value;
        }
      }
    }
  });

  return {
    labels,
    datasets: [
      { label: 'Receitas', backgroundColor: '#4ade80', data: incomeData },
      { label: 'Despesas', backgroundColor: '#f87171', data: expenseData },
    ],
  };
});

const handleFilterChange = (filters: { period: 'week' | 'month' | 'year', date: Date }) => {
  activeFilters.period = filters.period;
  activeFilters.date = filters.date;
};

const resetForm = () => {
  isEditMode.value = false;
  form._id = undefined;
  form.description = '';
  form.value = 0;
  form.type = 'expense';
  form.date = new Date().toISOString().split('T')[0];
  form.categoryId = null;
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
  form.categoryId = transaction.category?._id || null;
  const transactionDate = new Date(transaction.date);
  if (!isNaN(transactionDate.getTime())) {
    form.date = transactionDate.toISOString().split('T')[0];
  } else {
    form.date = new Date().toISOString().split('T')[0];
  }
  isDialogVisible.value = true;
};

const handleSubmit = async (formData: typeof form) => {
  if (!formData.description || formData.value <= 0) {
    ElMessage.warning('Preencha a descrição e um valor maior que zero.');
    return;
  }

  try {
    if (isEditMode.value) {
      const input = {
        id: formData._id,
        description: formData.description,
        value: formData.value,
        type: formData.type,
        date: formData.date,
        categoryId: formData.categoryId,
      };
      await updateTransaction({ input });
      ElMessage.success('Transação atualizada!');
    } else {
      const input = {
        description: formData.description,
        value: formData.value,
        type: formData.type,
        date: formData.date,
        categoryId: formData.categoryId,
      };
      await createTransaction({ input });
      ElMessage.success('Transação criada!');
    }
    isDialogVisible.value = false;
  } catch (e: unknown) {
    if (e instanceof Error) {
      ElMessage.error(e.message)
    }
  }
};

const handleDelete = (id: string) => {
  ElMessageBox.confirm(
    'Você tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
    'Confirmar Exclusão',
    {
      confirmButtonText: 'Sim, Excluir',
      cancelButtonText: 'Cancelar',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deleteTransaction({ id });
      ElMessage.success('Transação excluída.');
    } catch (e: unknown) {
      if (e instanceof Error) {
        ElMessage.error(e.message)
      }
    }
  }).catch(() => { ElMessage.info('Ação de exclusão cancelada.'); });
};

const handleLogout = () => {
  authStore.logout();
  apolloClient.resetStore();
  router.push('/login');
};
</script>