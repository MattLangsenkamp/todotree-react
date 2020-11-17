import React, { useState } from "react";
import { TextField, Checkbox, makeStyles, IconButton } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { UPDATE_TODO, ADD_TODO, DELETE_TODO } from "../../api/graphql/todo";
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

    fill: theme.palette.primary.light,
  },
}));

// a callback passed from the parent to the child? child calls it when it deletes itself and it removes that child from the parent?

export default function Todo({ todo, startEditing = false, refetch }) {
  const classes = useStyles();
  const [currentTodo, setCurrentTodo] = useState(todo);

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
          updateTodo({
            variables: { id: todo.id, text: currentTodo.text },
          }).then((res) => {
            setCurrentTodo(res.data.updateTodo);
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
        scopeId: todo.scopeId,
        parentTodoId: todo.id,
      },
    })
      .then((res) => {
        let newTodo = { ...currentTodo };
        newTodo.childrenObjects = [
          ...newTodo.childrenObjects,
          res.data.addTodo,
        ];
        newTodo.children = [...newTodo.children, res.data.addTodo.id];
        setCurrentTodo(newTodo);
      })
      .catch((err) => console.log(err));
  };

  const deleteTodoLocal = () => {
    deleteTodo({ variables: { id: todo.id } })
      .then((res) => {
        refetch();
      })
      .catch((err) => console.log(err));
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

  if (
    currentTodo !== null &&
    currentTodo.childrenObjects !== void 0 &&
    currentTodo.childrenObjects !== null
  ) {
    children = currentTodo.childrenObjects.map((todo) => (
      <Todo key={todo.id} todo={todo} refetch={refetch} />
    ));
  }
  return (
    <div>
      <div className={classes.todo}>
        <Checkbox
          checked={currentTodo.completed}
          className={classes.checkbox}
          color="primary"
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
