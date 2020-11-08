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

Todos.fragment = {
  TodoRecursive: gql`
    fragment TodoRecursive on Todo {
      ...SubTodoFields
      childrenObjects {
        ...SubTodoFields
        childrenObjects {
          ...SubTodoFields
          childrenObjects {
            ...SubTodoFields
          }
        }
      }
    }
    ${Todos.fragment.SubTodoFields}
  `,
};

export const GET_TODO = gql`
  query GetTodo($id: String!) {
    todo(id: $id) {
      ...TodoRecursive
    }
  }
  ${Todos.fragment.TodoRecursive}
`;

export const GET_TODOS = gql`
  query GetTodos($userId: String, $scopeId: String, $rootTodo: Boolean) {
    todos(userId: $userId, scopeId: $scopeId, rootTodo: $rootTodo) {
      ...TodoRecursive
    }
  }
  ${Todos.fragment.TodoRecursive}
`;

export const ADD_TODO = gql`
  mutation AddTodo(
    $text: String!
    $completed: Boolean!
    $scopeId: String!
    $rootTodo: Boolean!
    $children: [String!]!
    $parentTodoId: String
  ) {
    addTodo(
      text: $text
      completed: $completed
      scopeId: $scopeId
      rootTodo: $rootTodo
      children: $children
      parentTodoId: $parentTodoId
    ) {
      ...TodoRecursive
    }
  }
  ${Todos.fragment.TodoRecursive}
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!) {
    deleteTodo(id: $id) {
      ...TodoRecursive
    }
  }
  ${Todos.fragment.TodoRecursive}
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: String!
    $userId: String
    $text: String
    $completed: Boolean
    $scopeId: String
    $children: [String!]
  ) {
    updateTodo(
      id: $id
      userId: $userId
      text: $text
      completed: $completed
      scopeId: $scopeId
      children: $children
    ) {
      ...TodoRecursive
    }
  }
  ${Todos.fragment.TodoRecursive}
`;
