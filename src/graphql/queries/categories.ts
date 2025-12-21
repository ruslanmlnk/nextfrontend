import { gql } from 'graphql-request'

export const GET_CATEGORIES = gql`
  query GetCategories($limit: Int = 100) {
    Categories(limit: $limit, sort: "title") {
      docs {
        id
        title
        slug
        image {
          url
          width
          height
          alt
        }
      }
    }
  }
`
