import { gql } from "@apollo/client";

export const FIXED_EXPENSES_QUERY = gql`
  query FixedExpenses {
    fixedExpenses { _id description value dueDate isActive category { _id name } }
  }
`;