import { gql } from '@apollo/client/core';

export const CREDIT_CARDS_QUERY = gql`
  query CreditCards {
    creditCards { _id name closingDay dueDay }
  }
`;