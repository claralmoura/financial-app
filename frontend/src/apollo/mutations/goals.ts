import { gql } from '@apollo/client/core';

export const CREATE_GOAL_MUTATION = gql`
  mutation CreateGoal($input: CreateGoalInput!) {
    createGoal(input: $input) { _id }
  }
`;

export const UPDATE_GOAL_MUTATION = gql`
  mutation UpdateGoal($input: UpdateGoalInput!) {
    updateGoal(input: $input) { _id }
  }
`;

export const REMOVE_GOAL_MUTATION = gql`
  mutation RemoveGoal($id: ID!) {
    removeGoal(id: $id) { _id }
  }
`;

export const ADD_TO_GOAL_MUTATION = gql`
  mutation AddToGoal($input: AddToGoalInput!) {
    addToGoal(input: $input) { _id currentValue }
  }
`;