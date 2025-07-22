import { gql } from 'graphql-tag';

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) { _id }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) { _id }
  }
`;

export const REMOVE_CATEGORY_MUTATION = gql`
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id) { _id }
  }
`;