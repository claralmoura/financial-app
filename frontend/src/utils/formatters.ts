/**
 * Formata um valor numérico para a moeda brasileira (R$).
 * @param value O número a ser formatado.
 * @returns A string formatada, ex: "R$ 1.234,56".
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma string de timestamp numérico para uma data legível (dd/mm/aaaa).
 * @param dateString A string de timestamp vinda do backend.
 * @returns A data formatada, ou uma string de fallback em caso de erro.
 */
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '—';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};