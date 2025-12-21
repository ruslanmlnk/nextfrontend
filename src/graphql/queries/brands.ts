import { gql } from 'graphql-request'

export const GET_BRANDS = gql`
  query GetBrands($limit: Int = 200) {
    Brands(limit: $limit) {
      docs {
        id
        title
        slug
      }
    }
  }
`

