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

export default function Todoharness({ scopeId, userId }) {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_TODOS, {
    variables: {
      rootTodo: true,
      userId: userId,
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
        children: [],
      },
    }).then((res) => {
      console.log(res);
      window.location.reload(true);
    });
  };

  return (
    <div className={classes.Todoharness}>
      <ControlPoint onClick={addTodoLocal}></ControlPoint>
      {data.todos.map((todo) => (
        <Todo todo={todo} key={todo.id} />
      ))}
    </div>
  );
}