import { gql } from 'graphql-tag';

export const TRANSACTIONS_QUERY = gql`
  query Transactions {
    transactions { 
      _id 
      description 
      value 
      type 
      date 
      category { 
        _id 
        name 
      }
      cardInvoice {
        _id
        creditCard {
          _id
          name
        }
      }
    }
  }
`;