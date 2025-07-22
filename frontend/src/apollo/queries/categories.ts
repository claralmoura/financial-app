import { gql } from '@apollo/client/core';

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories { _id name type }
  }
`;