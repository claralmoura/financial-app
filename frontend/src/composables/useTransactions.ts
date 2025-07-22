import { computed, type Ref } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { TRANSACTIONS_QUERY } from '@/apollo/queries/transactions';
import { CREATE_TRANSACTION_MUTATION, UPDATE_TRANSACTION_MUTATION, DELETE_TRANSACTION_MUTATION } from '@/apollo/mutations/transactions';
import type { Transaction } from '@/types';

interface Filters {
  period: 'week' | 'month' | 'year';
  date: Date;
}

export function useTransactions(activeFilters: Ref<Filters>) {
  const { result: transactionsResult, loading: transactionsLoading } = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS_QUERY);

  const { mutate: createTransaction, loading: createLoading } = useMutation(CREATE_TRANSACTION_MUTATION, { refetchQueries: [{ query: TRANSACTIONS_QUERY }] });
  const { mutate: updateTransaction, loading: updateLoading } = useMutation(UPDATE_TRANSACTION_MUTATION, { refetchQueries: [{ query: TRANSACTIONS_QUERY }] });
  const { mutate: deleteTransaction } = useMutation(DELETE_TRANSACTION_MUTATION, { refetchQueries: [{ query: TRANSACTIONS_QUERY }] });

  const transactions = computed(() => transactionsResult.value?.transactions ?? []);

  const filteredTransactions = computed(() => {
    const all = transactions.value;
    if (!all) return [];
    const selected = new Date(activeFilters.value.date);

    if (activeFilters.value.period === 'year') {
      const year = selected.getFullYear();
      return all.filter(t => new Date(t.date).getFullYear() === year);
    }
    if (activeFilters.value.period === 'month') {
      const month = selected.getMonth();
      const year = selected.getFullYear();
      return all.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
      });
    }
    if (activeFilters.value.period === 'week') {
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
      .filter(t => t.type === 'expense' || t.type === 'card_expense')
      .reduce((sum, t) => sum + t.value, 0)
  );

  const balance = computed(() => filteredIncome.value - filteredExpenses.value);

  const incomeVsExpensesChartData = computed(() => ({
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      backgroundColor: ['#4ade80', '#f87171'],
      data: [filteredIncome.value, filteredExpenses.value],
    }],
  }));

  const expensesByCategoryChartData = computed(() => {
    const expenses = filteredTransactions.value.filter(t => t.type === 'expense' || t.type === 'card_expense');
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
          } else if (t.type === 'expense' || t.type === 'card_expense') {
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
  
  return {
    transactions,
    transactionsLoading,
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
    updateLoading
  };
}