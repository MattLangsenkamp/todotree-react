import { gql } from "@apollo/client";
import jwt_decode from "jwt-decode";
import { client, cache } from "./../../index";

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn
  }
`;

export function isSignedIn() {
  const data = client.readQuery({ query: IS_LOGGED_IN });
  const option2 =
    !!localStorage.getItem("AccessToken") &&
    !!localStorage.getItem("RefreshToken");
  if (data === null) return option2;

  return data.isLoggedIn;
}

export async function logOut() {
  localStorage.removeItem("AccessToken");
  localStorage.removeItem("RefreshToken");
  client.writeQuery({
    query: IS_LOGGED_IN,
    data: {
      isLoggedIn: false,
    },
  });
  client.resetStore();
  cache.gc();
}

export function signIn(accessToken, refreshToken) {
  localStorage.setItem("AccessToken", accessToken);
  localStorage.setItem("RefreshToken", refreshToken);
  client.writeQuery({
    query: IS_LOGGED_IN,
    data: {
      isLoggedIn:
        !!localStorage.getItem("AccessToken") &&
        !!localStorage.getItem("RefreshToken"),
    },
  });
}

export function getUserDetails() {
  const accessTokenEncoded = localStorage.getItem("AccessToken");
  const accessTokenDecoded = jwt_decode(accessTokenEncoded);
  return {
    key: `${accessTokenDecoded.key}`,
    permissionLevel: `${accessTokenDecoded.permissionLevel}`,
  };
}
