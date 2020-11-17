import { useQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core";
import React from "react";
import { GET_TODOS, ADD_TODO } from "../../api/graphql/todo";
import Todo from "./Todo";
import ControlPoint from "@material-ui/icons/ControlPoint";

const useStyles = makeStyles({
  Todoharness: {
    width: "100%",
    height: "100%",
  },
});

export default function Todoharness({ scopeId }) {
  const classes = useStyles();
  console.log(scopeId);
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
      refetch().then((res) => {
        console.log(res);
      });
    });
  };

  let todos;
  if (data.todos) {
    todos = data.todos.map((todo) => (
      <Todo todo={todo} key={todo.id} refetch={refetch} />
    ));
  }

  return (
    <div className={classes.Todoharness}>
      <ControlPoint onClick={addTodoLocal}></ControlPoint>
      {todos}
    </div>
  );
}
