import { gql } from "@apollo/client";

function Todos() {
  return "yea";
}

Todos.fragment = {
  SubTodoFields: gql`
    fragment SubTodoFields on Todo {
      id
      userId
      creationTimeStamp
      text
      completed
      scopeId
      rootTodo
      parentTodoId
      children
    }
  `,
};

export const GET_TODO = gql`
  query GetTodo($id: String!) {
    todo(id: $id) {
      ...SubTodoFields
    }
  }
  ${Todos.fragment.SubTodoFields}
`;

export const GET_TODOS = gql`
  query GetTodos($scopeId: String, $rootTodo: Boolean) {
    todos(scopeId: $scopeId, rootTodo: $rootTodo) {
      ...SubTodoFields
    }
  }
  ${Todos.fragment.SubTodoFields}
`;

export const ADD_TODO = gql`
  mutation AddTodo(
    $text: String!
    $completed: Boolean!
    $scopeId: String!
    $rootTodo: Boolean!
    $parentTodoId: String
  ) {
    addTodo(
      text: $text
      completed: $completed
      scopeId: $scopeId
      rootTodo: $rootTodo
      parentTodoId: $parentTodoId
    ) {
      ...SubTodoFields
    }
  }
  ${Todos.fragment.SubTodoFields}
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!) {
    deleteTodo(id: $id) {
      ...SubTodoFields
    }
  }
  ${Todos.fragment.SubTodoFields}
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: String!
    $text: String
    $completed: Boolean
    $scopeId: String
    $children: [String!]
  ) {
    updateTodo(
      id: $id
      text: $text
      completed: $completed
      scopeId: $scopeId
      children: $children
    ) {
      ...SubTodoFields
    }
  }
  ${Todos.fragment.SubTodoFields}
`;
