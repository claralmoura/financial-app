import { gql } from '@apollo/client/core';

export const CREATE_FIXED_EXPENSE_MUTATION = gql`
  mutation CreateFixedExpense($input: CreateFixedExpenseInput!) {
    createFixedExpense(input: $input) { _id }
  }
`;

export const UPDATE_FIXED_EXPENSE_MUTATION = gql`
  mutation UpdateFixedExpense($input: UpdateFixedExpenseInput!) {
    updateFixedExpense(input: $input) { _id }
  }
`;

export const REMOVE_FIXED_EXPENSE_MUTATION = gql`
  mutation RemoveFixedExpense($id: ID!) {
    removeFixedExpense(id: $id) { _id }
  }
`;