import { computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { ALL_CARD_INVOICES_QUERY } from '@/apollo/queries/invoices';
import { CREDIT_CARDS_QUERY } from '@/apollo/queries/creditCards';
import type { CardInvoice, CreditCard } from '@/types';

export function useCardsAndInvoices() {
  const { result: invoicesResult } = useQuery<{ cardInvoices: CardInvoice[] }>(ALL_CARD_INVOICES_QUERY);
  const { result: creditCardsResult } = useQuery<{ creditCards: CreditCard[] }>(CREDIT_CARDS_QUERY);

  const allCreditCards = computed(() => creditCardsResult.value?.creditCards ?? []);
  const openInvoices = computed(() => 
    invoicesResult.value?.cardInvoices.filter(invoice => invoice.status === 'OPEN') ?? []
  );

  return {
    allCreditCards,
    openInvoices,
  };
}