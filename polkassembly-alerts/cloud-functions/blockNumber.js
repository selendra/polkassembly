import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import apolloClient from 'apollo-client';
import { sendmail, fetchLastBlockNumber } from './utils.js';
import { ApiPromise, WsProvider } from '@polkadot/api'

const { ApolloClient } = apolloClient
const provider = new WsProvider(ARCHIVE_NODE_ENDPOINT);
const url = process.env.HASURA_GRAPHQL_URL || 'https://kusama.polkassembly.io/v1/graphql'
const ARCHIVE_NODE_ENDPOINT = process.env.WS_PROVIDER || 'wss://rpc1.selendra.org'

const httpLink = createHttpLink({
  uri: url,
  fetch: fetch
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

function graphqlApiCall(query) {
  return client
    .query({
      query: query
  })
  .then(
    results => {return results.data.blockNumbers[0].number}
  ).catch(e =>
    console.error('Something wrong with apollo', e));
}

async function main () {
  const blockNumber = await graphqlApiCall(fetchLastBlockNumber);

  console.log(blockNumber);
  
  const api = await ApiPromise.create({provider});

  const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Chain is at block: ${header.number}`);
    unsubscribe();
    if (header.number - blockNumber > 10){
      sendmail();
    }
    process.exit(0);
  });
}

main().catch(console.error);


