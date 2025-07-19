// src/plugins/apollo.ts
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

// Link para a nossa API GraphQL no backend
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', // URL do seu backend NestJS
})

// Cache para otimizar as requisições
const cache = new InMemoryCache()

// Este 'link' adiciona o token JWT no header de cada requisição
const authLink = setContext((_, { headers }) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('auth_token')

  // Retorna os headers para o contexto da requisição
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Cria o cliente Apollo
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})