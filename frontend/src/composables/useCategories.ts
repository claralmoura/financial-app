import { computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { CATEGORIES_QUERY } from '@/apollo/queries/categories';
import type { Category } from '@/types';

export function useCategories() {
  const { result: categoriesResult } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY);

  const incomeCategories = computed(() => 
    categoriesResult.value?.categories.filter(c => c.type === 'income') ?? []
  );

  const expenseCategories = computed(() => 
    categoriesResult.value?.categories.filter(c => c.type === 'expense') ?? []
  );

  const allCategories = computed(() => categoriesResult.value?.categories ?? []);

  return {
    incomeCategories,
    expenseCategories,
    allCategories,
  };
}
