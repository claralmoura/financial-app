import { gql } from '@apollo/client/core';

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) { _id name email notificationsEnabled }
  }
`;