import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  from,
} from "@apollo/client";

import { isSignedIn, signIn } from "./api/func/auth";

export const cache = new InMemoryCache();
let api_endpoint = "https://api.todotree.me";
if (process.env.REACT_APP_LOCAL === "local") {
  api_endpoint = "http://localhost:8080/graphql";
}
console.log(api_endpoint);
const httpLink = new HttpLink({
  uri: api_endpoint,
});

const setTokensAfterware = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;

    let accessToken = headers.get("AccessToken");
    let refreshToken = headers.get("RefreshToken");
    if (accessToken.startsWith(",")) {
      accessToken = accessToken.substr(2, accessToken.length);
    }
    if (refreshToken.startsWith(",")) {
      refreshToken = refreshToken.substr(2, refreshToken.length);
    }
    if (accessToken.startsWith("null,")) {
      accessToken = accessToken.substr(5, accessToken.length);
    }
    if (refreshToken.startsWith("null,")) {
      refreshToken = refreshToken.substr(5, refreshToken.length);
    }
    signIn(accessToken, refreshToken);
    return response;
  });
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      AccessToken: localStorage.getItem("AccessToken") || null,
      RefreshToken: localStorage.getItem("RefreshToken") || null,
    },
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  link: from([authMiddleware, setTokensAfterware, httpLink]),
  cache: cache,
  credentials: "include",
});

isSignedIn(
  localStorage.getItem("AccessToken"),
  localStorage.getItem("RefreshToken")
);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
