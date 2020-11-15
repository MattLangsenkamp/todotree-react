import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  makeStyles,
  IconButton,
  useTheme,
} from "@material-ui/core";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  UPDATE_TODO,
  ADD_TODO,
  DELETE_TODO,
  GET_TODO,
} from "../../api/graphql/todo";
import ControlPoint from "@material-ui/icons/ControlPoint";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Save from "@material-ui/icons/Save";

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
    "&$checked": {
      color: theme.palette.primary.light,
    },
    fill: theme.palette.primary.light,
  },
}));

// a callback passed from the parent to the child? child calls it when it deletes itself and it removes that child from the parent?

export default function Todo({ todo, startEditing = false, parentRefresh }) {
  const classes = useStyles();
  const theme = useTheme();
  const [currentTodo, setCurrentTodo] = useState(todo);

  const [getTodo] = useLazyQuery(GET_TODO, {
    fetchPolicy: "network-only",
  });

  const [editing, setEditing] = useState(startEditing);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [addTodo] = useMutation(ADD_TODO);

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
          updateTodo({ variables: { id: todo.id, text: currentTodo.text } });
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
        scopeId: todo.scopeId,
        parentTodoId: todo.id,
      },
    })
      .then((res) => {
        console.log(res);
        parentRefreshLocal();
      })
      .catch((err) => console.log(err));
  };

  const deleteTodoLocal = () => {
    deleteTodo({ variables: { id: todo.id } })
      .then((res) => {
        parentRefresh();
      })
      .catch((err) => console.log(err));
  };

  const parentRefreshLocal = () => {
    getTodo({ variables: { id: currentTodo.id } });
  };

  const setCompleted = (completed) => {
    let newTodo = { ...currentTodo };
    newTodo.completed = completed;
    setCurrentTodo(newTodo);
  };

  const setCurrentText = (text) => {
    let newTodo = { ...currentTodo };
    newTodo.text = text;
    setCurrentTodo(newTodo);
  };

  let children;
  if (todo.childrenObjects !== void 0) {
    children = todo.childrenObjects.map((todo) => (
      <Todo key={todo.id} todo={todo} parentRefresh={parentRefreshLocal} />
    ));
  }
  return (
    <div>
      <div className={classes.todo}>
        <Checkbox
          checked={currentTodo.completed}
          className={classes.checkbox}
          color={theme.palette.primary.light}
          onChange={(e) => {
            setCompleted(e.target.checked);
            updateTodo({
              variables: { id: todo.id, completed: e.target.checked },
            });
          }}
        />
        <TextField
          value={currentTodo.text}
          disabled={!editing}
          onChange={(e) => {
            setCurrentText(e.target.value);
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
