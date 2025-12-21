import { gql } from 'graphql-request'

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: mutationOrderInput!) {
    createOrder(data: $data) {
      id
    }
  }
`
