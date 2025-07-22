<template>
  <div class="p-4 sm:p-8 font-sans">
    <header v-if="card" class="mb-8">
      <div class="flex items-center gap-4">
        <el-icon :size="32" class="text-primary">
          <svg viewBox="0 0 24 24"><path :d="mdiCreditCard" fill="currentColor"/></svg>
        </el-icon>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ card.name }}</h1>
          <p class="text-gray-500">Vencimento dia {{ card.dueDay }} / Fechamento dia {{ card.closingDay }}</p>
        </div>
      </div>
    </header>

    <div v-if="loading" class="text-center text-gray-500">Carregando faturas...</div>

    <main v-if="card && card.invoices.length">
      <el-tabs v-model="activeInvoiceId" type="border-card" class="rounded-lg shadow-md">
        <el-tab-pane
          v-for="invoice in card.invoices"
          :key="invoice._id"
          :name="invoice._id"
        >
          <template #label>
            <div class="flex items-center gap-2">
              <span>{{ formatInvoiceDate(invoice.month, invoice.year) }}</span>
              <el-tag :type="getInvoiceStatusType(invoice.status)" size="small" effect="light">{{ invoice.status }}</el-tag>
            </div>
          </template>

          <div class="p-2 md:p-4">
            <div class="flex justify-between items-baseline mb-4">
              <h3 class="text-xl font-semibold text-gray-700">Detalhes da Fatura</h3>
              <div v-if="invoice.status === 'CLOSED'" class="flex items-center gap-2">
                <el-button type="success">Marcar como Paga</el-button>
              </div>
            </div>
            
            <el-table :data="invoice.transactions" empty-text="Nenhum gasto nesta fatura." stripe>
              <el-table-column prop="date" label="Data" width="120">
                <template #default="scope">{{ formatDate(scope.row.date) }}</template>
              </el-table-column>
              <el-table-column prop="description" label="Descrição" />
              <el-table-column prop="category.name" label="Categoria" />
              <el-table-column prop="value" label="Valor" align="right">
                <template #default="scope">{{ formatCurrency(scope.row.value) }}</template>
              </el-table-column>
            </el-table>

            <div class="flex justify-end items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <span class="text-lg text-gray-600 mr-4">Total da Fatura:</span>
              <span class="text-2xl font-bold text-red-500">
                {{ formatCurrency(calculateInvoiceTotal(invoice.transactions)) }}
              </span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </main>

    <div v-if="!loading && card && !card.invoices.length" class="text-center text-gray-500 mt-16">
      <el-empty description="Nenhuma fatura encontrada para este cartão." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';
import { formatDate, formatCurrency } from '@/utils/formatters';
import type { Transaction, Category } from '../types';
import { mdiCreditCard } from '@mdi/js';

import { CARD_INVOICES_BY_CARD_ID_QUERY } from '../apollo/queries/invoices';

interface CardInvoice {
  _id: string;
  month: number;
  year: number;
  status: 'OPEN' | 'CLOSED' | 'PAID';
  transactions: Transaction[];
}

interface CreditCardWithInvoices {
  _id: string;
  name: string;
  closingDay: number;
  dueDay: number;
  invoices: CardInvoice[];
}

const route = useRoute();
const cardId = route.params.id as string;
const activeInvoiceId = ref<string>('');

const { result, loading } = useQuery<{ cardInvoices: CardInvoice[], creditCard: CreditCardWithInvoices }>(
  CARD_INVOICES_BY_CARD_ID_QUERY, 
  { creditCardId: cardId }
);

const card = computed(() => {
  if (!result.value?.creditCard) return null;
  const cardData = {
    ...result.value.creditCard,
    invoices: result.value.cardInvoices || [],
  };
  if (cardData.invoices.length && !activeInvoiceId.value) {
    activeInvoiceId.value = cardData.invoices[0]._id;
  }
  return cardData;
});

const formatInvoiceDate = (month: number, year: number) => {
  const date = new Date(year, month);
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(date).replace(' de ', '/');
};

const getInvoiceStatusType = (status: string) => {
  if (status === 'PAID') return 'success';
  if (status === 'CLOSED') return 'warning';
  return 'info';
};

const calculateInvoiceTotal = (transactions: Transaction[] | undefined) => {
  if (!transactions) return 0;
  return transactions.reduce((sum, t) => sum + t.value, 0);
};
</script>