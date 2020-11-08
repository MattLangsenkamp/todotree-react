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
}));

// a callback passed from the parent to the child? child calls it when it deletes itself and it removes that child from the parent?

export default function Todo({ todo, startEditing = false }) {
  const classes = useStyles();
  const [currentText, setCurrentText] = useState(todo.text);
  const [completed, setCompleted] = useState(todo.completed);
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
          updateTodo({ variables: { id: todo.id, text: currentText } });
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
        children: [],
      },
    }).then((res) => {
      console.log(res);
      window.location.reload(true);
    });
  };
  const deleteTodoLocal = () => {
    deleteTodo({ variables: { id: todo.id } });
    window.location.reload(true);
  };

  return (
    <div>
      <div className={classes.todo}>
        <Checkbox
          checked={completed}
          onChange={(e) => {
            setCompleted(e.target.checked);
            updateTodo({
              variables: { id: todo.id, completed: e.target.checked },
            });
          }}
        />
        <TextField
          value={currentText}
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
      <div className={classes.children}>
        {todo.childrenObjects.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
