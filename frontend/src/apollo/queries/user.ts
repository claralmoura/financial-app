import { gql } from '@apollo/client/core';

export const ME_QUERY = gql`
  query Me {
    me { _id name email notificationsEnabled }
  }
`;