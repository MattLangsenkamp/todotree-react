import React, { useState } from "react";
import { TextField, makeStyles, IconButton, Paper } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { UPDATE_SCOPE, DELETE_SCOPE } from "../../api/graphql/scope";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Save from "@material-ui/icons/Save";
import { cache } from "../..";

const useStyles = makeStyles((theme) => ({
  scope: {
    height: "100%",
    width: "20em",
    flexDirection: "row",
    position: "relative",
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}));

export function Scopetab({
  scope,
  startEditing = false,
  setCur,
  curScope,
  parentRefresh,
}) {
  const [currentName, setCurrentName] = useState(scope.name);
  const [editing, setEditing] = useState(startEditing);
  const [updateScope] = useMutation(UPDATE_SCOPE);
  const [deleteScope] = useMutation(DELETE_SCOPE);

  const classes = useStyles();

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
          updateScope({ variables: { id: scope.id, name: scope.name } });
        }}
      >
        <Save />
      </IconButton>
    );
  }
  const deleteScopeLocal = (e) => {
    deleteScope({
      variables: {
        id: scope.id,
      },
    }).then(() => {
      cache.evict({
        id: scope.id,
      });
      parentRefresh();
    });
  };

  return (
    <Paper
      className={classes.scope}
      onClick={() => setCur(scope.id)}
      elevation={scope.id === curScope ? 5 : 1}
    >
      <TextField
        value={currentName}
        disabled={!editing}
        onChange={(e) => {
          setCurrentName(e.target.value);
        }}
      />
      {saveOrEdit}
      <IconButton onClick={deleteScopeLocal}>
        <Delete />
      </IconButton>
    </Paper>
  );
}
