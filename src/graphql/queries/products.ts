import { gql } from 'graphql-request'

export const GET_PRODUCTS = gql`
  query GetProducts($where: Product_where, $limit: Int = 100) {
    Products(where: $where, limit: $limit) {
      docs {
        id
        slug
        name
        model
        article
        meta{
          metaTitle
          metaDescription
        }
        brand {
          id
          title
          slug
        }
        price
        stock
        oldPrice
        rating
        description
        isHit
        isNew
        discount
        characteristics {
          id
          label
          value
        }
        image {
          url
          width
          height
          alt
        }
        gallery {
          url
          width
          height
          alt
        }
        category {
          id
          slug
          title
        }
        colors {
          id
          title
          slug
          hex
        }
      }
    }
  }
`
