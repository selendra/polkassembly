import fetch from "node-fetch";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import apolloClient from "apollo-client";
const { ApolloClient } = apolloClient;
import { sendmail, fetchLatestDiscussionsQuery } from "./utils.js";

const networks = [process.env.SELENDRA_NETWORK, process.env.KUSAMA_NETWORK]

let data_subject = "Error while fetching data";
let data_title =
  "Error while fetching. The api was not able to return data or returned 0 objects. \n";

function createLink(endpoint) {
  return createHttpLink({
    uri: endpoint,
    fetch: fetch,
  });
}

function client(endpoint) {
  return new ApolloClient({
    link: createLink(endpoint),
    cache: new InMemoryCache(),
  });
}

function networkCheck() {
  if (!networks) {
    text = "Kusama or selendra environment variable not found";
    subject = "Environment not set";
    sendmail(text, subject);
    process.exit(0);
  }
}

async function dataChecker(endpoint, query) {
  try {
    let response = await client(endpoint).query({
      query: query,
    });
    console.log(response);
    if (!response?.data?.posts.length) {
      data_title += endpoint + "api/v1/graphql\nquery: " + query + "\n";
      console.log(data_title);
      sendmail(data_title, data_subject);
    }
  } catch (e) {
    sendmail(data_title, data_subject);
    throw console.error("Something wrong with Network", e);
  }
}

async function main() {
  networkCheck();
  for(let i = 0; i < networks.length; i++){
    dataChecker(networks[i], fetchLatestDiscussionsQuery);
  }
}

main();
