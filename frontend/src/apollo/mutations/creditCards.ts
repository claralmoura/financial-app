import { gql } from '@apollo/client/core';

export const CREATE_CREDIT_CARD_MUTATION = gql`
  mutation CreateCreditCard($input: CreateCreditCardInput!) {
    createCreditCard(input: $input) { _id }
  }
`;

export const UPDATE_CREDIT_CARD_MUTATION = gql`
  mutation UpdateCreditCard($input: UpdateCreditCardInput!) {
    updateCreditCard(input: $input) { _id }
  }
`;

export const REMOVE_CREDIT_CARD_MUTATION = gql`
  mutation RemoveCreditCard($id: ID!) {
    removeCreditCard(id: $id) { _id }
  }
`;