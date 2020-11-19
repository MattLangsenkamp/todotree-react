import React, { useState } from "react";
import { TextField, Checkbox, makeStyles, IconButton } from "@material-ui/core";
import { useQuery, useMutation } from "@apollo/client";
import {
  UPDATE_TODO,
  ADD_TODO,
  DELETE_TODO,
  GET_TODO,
} from "../../api/graphql/no";
import ControlPoint from "@material-ui/icons/ControlPoint";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Save from "@material-ui/icons/Save";
import { cache } from "../..";

const useStyles = makeStyles((theme) => ({
  todo: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    margin: theme.spacing(2),
    position: "relative",
  },
  children: {
    paddingLeft: theme.spacing(4),
  },
  checkbox: {
    color: theme.palette.primary.light,

    fill: theme.palette.primary.light,
  },
}));

export default function Todo({ todoId, startEditing = false, parentRefresh }) {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(GET_TODO, {
    variables: { id: todoId },
  });

  const [todoText, setCurrentTodoText] = useState("load");
  const [inititaited, setinititaited] = useState(false);
  const [editing, setEditing] = useState(startEditing);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [addTodo] = useMutation(ADD_TODO);

  if (data && data.todo && data.todo !== null && data.todo.id && !inititaited) {
    setCurrentTodoText(data.todo.text);
    setinititaited(true);
  }

  let saveOrEdit;
  if (!editing) {
    saveOrEdit = (
      <IconButton
        onClick={() => {
          setEditing(true);
        }}
      >
        <Edit />
      </IconButton>
    );
  } else {
    saveOrEdit = (
      <IconButton
        onClick={() => {
          setEditing(false);
          updateTodo({
            variables: { id: data.todo.id, text: todoText },
          }).then((res) => {
            console.log(res);
            cache.writeQuery({
              query: GET_TODO,
              variables: res.data.updateTodo,
            });
          });
        }}
      >
        <Save />
      </IconButton>
    );
  }
  const addTodoLocal = () => {
    addTodo({
      variables: {
        text: "Add text here",
        completed: false,
        rootTodo: false,
        scopeId: data.todo.scopeId,
        parentTodoId: data.todo.id,
      },
    }).then((res) => {
      console.log(res);
      //cache.writeQuery({ query: GET_TODO, variables: res.data.addTodo });
      refetch();
    });
  };

  const deleteTodoLocal = () => {
    deleteTodo({ variables: { id: data.todo.id } })
      .then(() => {
        cache.evict({ id: data.todo.id });
        parentRefresh();
      })
      .catch((err) => console.log(err));
  };

  let children;
  if (loading) return "loading";
  if (error) return "error";
  if (
    data.todo !== null &&
    data.todo.children !== void 0 &&
    data.todo.children !== null
  ) {
    children = data.todo.children.map((child) => (
      <Todo key={child} todoId={child} parentRefresh={refetch} />
    ));
  }

  return (
    <div>
      <div className={classes.todo}>
        <Checkbox
          checked={data.todo.completed}
          className={classes.checkbox}
          color="primary"
          onChange={(e) => {
            updateTodo({
              variables: { id: data.todo.id, completed: e.target.checked },
            }).then((res) => {
              cache.writeQuery({
                query: GET_TODO,
                variables: res.data.addTodo,
              });
            });
          }}
        />
        <TextField
          value={todoText}
          disabled={!editing}
          onChange={(e) => {
            console.log(e);
            setCurrentTodoText(e.target.value);
          }}
        />
        {saveOrEdit}
        <IconButton onClick={deleteTodoLocal}>
          <Delete />
        </IconButton>
        <IconButton onClick={addTodoLocal}>
          <ControlPoint />
        </IconButton>
      </div>
      <div className={classes.children}>{children}</div>
    </div>
  );
}
