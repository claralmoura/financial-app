import { gql } from '@apollo/client/core';

export const GOALS_QUERY = gql`
  query Goals {
    goals { _id name targetValue currentValue }
  }
`;