import { gql } from "@apollo/client";
import Scopes from "../../components/pages/Scopes";

const SCOPE_FIELDS = gql`
  fragment ScopeFields on Scope {
    id
    userId
    defaultScope
    creationTimeStamp
    name
    description
    startTime
    endTime
  }
`;

Scopes.fragment = {
  ScopeFields: SCOPE_FIELDS,
};

export const GET_SCOPE = gql`
  query GetScope($id: String!) {
    scope(id: $id) {
      ...ScopeFields
    }
  }
  ${Scopes.fragment.ScopeFields}
`;

export const GET_SCOPES = gql`
  query GetScopes {
    scopes {
      ...ScopeFields
    }
  }
  ${Scopes.fragment.ScopeFields}
`;

export const ADD_SCOPE = gql`
  mutation AddScope(
    $defaultScope: Boolean!
    $name: String!
    $description: String
    $startTime: Long
    $endTime: Long
  ) {
    addScope(
      defaultScope: $defaultScope
      name: $name
      description: $description
      startTime: $startTime
      endTime: $endTime
    ) {
      ...ScopeFields
    }
  }
  ${Scopes.fragment.ScopeFields}
`;

export const UPDATE_SCOPE = gql`
  mutation UpdateScopes(
    $id: String!
    $defaultScope: Boolean
    $name: String
    $description: String
    $startTime: Long
    $endTime: Long
  ) {
    updateScope(
      id: $id
      defaultScope: $defaultScope
      name: $name
      description: $description
      startTime: $startTime
      endTime: $endTime
    ) {
      ...ScopeFields
    }
  }
  ${Scopes.fragment.ScopeFields}
`;

export const DELETE_SCOPE = gql`
  mutation DeleteScope($id: String!) {
    deleteScope(id: $id) {
      ...ScopeFields
    }
  }
  ${Scopes.fragment.ScopeFields}
`;
