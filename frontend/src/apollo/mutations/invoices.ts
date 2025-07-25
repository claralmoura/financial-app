import { gql } from "@apollo/client";

export const CREATE_INVOICE_MUTATION = gql`
  mutation CreateManualInvoice($input: CreateInvoiceInput!) {
    createManualInvoice(input: $input) { _id }
  }
`;