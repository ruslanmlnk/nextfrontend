import { gql } from 'graphql-request'

export const GET_COLORS = gql`
  query GetColors($limit: Int = 500) {
    Colors(limit: $limit) {
      docs {
        id
        title
        slug
        hex
      }
    }
  }
`

