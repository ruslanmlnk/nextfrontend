import { GraphQLClient } from 'graphql-request'

// Base URL for Payload CMS; adjust via env if needed.
export const PAYLOAD_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_URL ??
  process.env.NEXT_PUBLIC_CMS_URL ??
  'http://ostriv-backend-pss7wq-99f886-46-175-148-52.traefik.me'

export const GRAPHQL_URL = `${PAYLOAD_URL}/api/graphql`

export const graphqlClient = new GraphQLClient(GRAPHQL_URL, {
  fetch: (url, init) =>
    fetch(url, {
      ...init,
      cache: 'no-store',
    }),
})
