import { useQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core";
import React from "react";
import { GET_TODOS, ADD_TODO, GET_TODO } from "../../api/graphql/no";
import Todo from "./Todo";
import ControlPoint from "@material-ui/icons/ControlPoint";
import { cache } from "../../index";

const useStyles = makeStyles({
  Todoharness: {
    width: "100%",
    height: "100%",
  },
});

export default function Todoharness({ scopeId }) {
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(GET_TODOS, {
    variables: {
      rootTodo: true,
      scopeId: scopeId,
    },
  });

  const [addTodo] = useMutation(ADD_TODO);

  if (loading) return "loading";
  if (error) return "error";

  const addTodoLocal = () => {
    addTodo({
      variables: {
        text: "Add text here",
        completed: false,
        rootTodo: true,
        scopeId: scopeId,
      },
    }).then((res) => {
      refetch();
      //cache.writeQuery({ query: GET_TODO, variables: res.data.addTodo });
    });
  };

  let todos;
  if (data.todos) {
    todos = data.todos.map((todo) => (
      <Todo todoId={todo.id} key={todo.id} parentRefresh={refetch} />
    ));
  }

  return (
    <div className={classes.Todoharness}>
      <ControlPoint onClick={addTodoLocal}></ControlPoint>
      {todos}
    </div>
  );
}
