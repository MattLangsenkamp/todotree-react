import React, { useState } from "react";
import Layout from "../common/Layout";
import { getUserDetails } from "../../api/func/auth";
import { GET_SCOPES, ADD_SCOPE } from "../../api/graphql/scope";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { List, makeStyles } from "@material-ui/core";
import Todoharness from "../common/Todoharness";
import { Scopetab } from "../common/Scopetab";
import ControlPoint from "@material-ui/icons/ControlPoint";

const useStyles = makeStyles((theme) => ({
  list: {
    flexDirection: "row",
    display: "flex",
  },
}));

export default function Scopes() {
  const classes = useStyles();
  const [currentScope, setCurrentScope] = useState(null);
  const [getScopes] = useLazyQuery(GET_SCOPES, {
    fetchPolicy: "network-only",
  });
  let deets = getUserDetails();
  const { data, loading, error } = useQuery(GET_SCOPES, {
    variables: { userId: deets.key },
  });
  const parentRefreshLocal = () => {
    getScopes({
      variables: { userId: deets.key },
    });
  };

  const [addScope] = useMutation(ADD_SCOPE);
  if (loading) return "loading";
  if (error) return "error";

  const addScopeLocal = (e) => {
    addScope({
      variables: { userId: deets.key, defaultScope: false, name: "new scope!" },
    }).then(parentRefreshLocal());
  };

  let todoHarness;
  if (currentScope === null) {
    todoHarness = "Select a scope to add tasks!";
  } else {
    todoHarness = <Todoharness userId={deets.key} scopeId={currentScope} />;
  }

  return (
    <Layout>
      <List className={classes.list}>
        {data.scopes.map((scope) => (
          <Scopetab
            key={scope.id}
            id={scope.id}
            scope={scope}
            setCur={setCurrentScope}
            curScope={currentScope}
            parentRefresh={parentRefreshLocal}
          >
            {scope.name}
          </Scopetab>
        ))}
        <ControlPoint onClick={addScopeLocal}></ControlPoint>
      </List>
      {todoHarness}
    </Layout>
  );
}
