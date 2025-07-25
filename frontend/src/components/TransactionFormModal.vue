<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="500px"
    @close="$emit('update:visible', false)"
    class="rounded-lg"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="Descrição">
        <el-input v-model="form.description" size="large" placeholder="Ex: Almoço, Uber..." />
      </el-form-item>
      
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <el-form-item label="Valor">
          <el-input-number v-model="form.value" :precision="2" :step="10" :min="0" class="w-full" size="large" />
        </el-form-item>
        <el-form-item label="Data">
          <el-date-picker
            v-model="form.date"
            type="date"
            class="w-full"
            size="large"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>
      </div>
      
      <el-form-item label="Tipo">
        <el-radio-group v-model="form.type">
          <el-radio-button value="income">Receita</el-radio-button>
          <el-radio-button value="expense">Despesa</el-radio-button>
          <el-radio-button value="card_expense">Cartão de Crédito</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <transition name="el-fade-in-linear">
        <el-form-item v-if="form.type === 'card_expense'" label="Lançar na Fatura">
          <el-select v-model="form.cardInvoiceId" placeholder="Selecione a fatura" class="w-full" size="large">
            <el-option
              v-for="invoice in openInvoices"
              :key="invoice._id"
              :label="`${invoice.creditCard.name} - ${formatInvoiceDate(invoice.month, invoice.year)}`"
              :value="invoice._id"
            />
          </el-select>
        </el-form-item>
      </transition>

      <transition name="el-fade-in-linear">
        <el-form-item v-if="form.type !== 'card_expense'" label="Categoria">
          <el-select v-model="form.categoryId" placeholder="Selecione uma categoria" class="w-full" size="large">
            <el-option
              v-for="category in filteredCategories"
              :key="category._id"
              :label="category.name"
              :value="category._id"
            />
          </el-select>
        </el-form-item>
      </transition>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="$emit('update:visible', false)">Cancelar</el-button>
        <el-button
          type="primary"
          size="large"
          @click="$emit('submit', form)"
          :loading="loading"
        >
          {{ isEditMode ? 'Salvar Alterações' : 'Criar Transação' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Transaction, Category, CardInvoice } from '../types';

const props = defineProps<{
  visible: boolean;
  title: string;
  loading: boolean;
  isEditMode: boolean;
  initialData?: Partial<Transaction>;
  incomeCategories: Category[];
  expenseCategories: Category[];
  openInvoices: CardInvoice[];
}>();

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', form: any): void;
}>();

const form = ref({
  _id: undefined as string | undefined,
  description: '',
  value: 0,
  type: 'expense' as 'income' | 'expense' | 'card_expense',
  date: new Date().toISOString().split('T')[0] as string | null,
  categoryId: null as string | null,
  cardInvoiceId: null as string | null,
});

const filteredCategories = computed(() => {
  if (form.value.type === 'income') {
    return props.incomeCategories;
  }
  return props.expenseCategories;
});

watch(() => form.value.type, (newType) => {
  form.value.categoryId = null;
  if (newType !== 'card_expense') form.value.cardInvoiceId = null;
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value._id = newData._id;
    form.value.description = newData.description || '';
    form.value.value = newData.value || 0;
    form.value.type = newData.type || 'expense';
    form.value.date = newData.date || new Date().toISOString().split('T')[0];
    form.value.categoryId = newData.categoryId || null;
    form.value.cardInvoiceId = newData.cardInvoiceId || null;
  }
}, { immediate: true, deep: true });

const formatInvoiceDate = (month: number, year: number) => {
  const date = new Date(year, month);
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
};
</script>