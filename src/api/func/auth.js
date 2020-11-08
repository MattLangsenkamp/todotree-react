import { gql } from "@apollo/client";
import jwt_decode from "jwt-decode";
import { client } from "./../../index";

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn
  }
`;

export function isSignedIn() {
  const data = client.readQuery({ query: IS_LOGGED_IN });
  if (data == null) return false;
  return data.isLoggedIn;
}

export function logOut() {
  localStorage.removeItem("AccessToken");
  localStorage.removeItem("RefreshToken");
  client.writeQuery({
    query: IS_LOGGED_IN,
    data: {
      isLoggedIn: false,
    },
  });
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
