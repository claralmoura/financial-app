import { gql } from 'graphql-tag';

export const ALL_CARD_INVOICES_QUERY = gql`
  query AllCardInvoices {
    cardInvoices {
      _id
      month
      year
      status
      creditCard {
        _id
        name
      }
    }
  }
`;

export const CARD_INVOICES_BY_CARD_ID_QUERY = gql`
  query CardInvoicesByCardId($creditCardId: ID!) {
    cardInvoices(creditCardId: $creditCardId) {
      _id
      month
      year
      status
      transactions {
        _id
        description
        value
        date
        category {
          _id
          name
        }
      }
    }
    creditCard(id: $creditCardId) {
      _id
      name
      closingDay
      dueDay
    }
  }
`;