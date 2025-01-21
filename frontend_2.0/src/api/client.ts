import { API } from "../constants";
import { from } from "@apollo/client";
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { split, ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client';

const httpLink = createHttpLink({
    uri: `https://fabhous.com/api/viba/gql`
    // uri: "http://127.0.0.1:8000/api/viba/gql",
});

const tokenInfoLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext()
    const { response: { headers } } = context  
    return response;
  })
}) 

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
        ...headers,
        }
    }
});

export const apolloSocketLink = new GraphQLWsLink(createClient({
  url: `https://fabhous.com/ws/viba/gql`,
  // url: "ws://127.0.0.1:8000/api/viba/gql",
  connectionParams: {
    contentType: API.APPLICATION_JSON
  } 
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === "subscription"
    );
  },
  apolloSocketLink,
  from([tokenInfoLink, authLink, httpLink]),
);

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});
