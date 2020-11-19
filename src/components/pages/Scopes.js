import React, { useState } from "react";
import Layout from "../common/Layout";
import { getUserDetails } from "../../api/func/auth";
import { GET_SCOPES, ADD_SCOPE } from "../../api/graphql/scope";
import { useQuery, useMutation } from "@apollo/client";
import { List, makeStyles } from "@material-ui/core";
import Todoharness from "../common/Todoharness";
import { Scopetab } from "../common/Scopetab";
import ControlPoint from "@material-ui/icons/ControlPoint";
import { cache } from "../..";
import { GET_SCOPE } from "../../api/graphql/scope";

const useStyles = makeStyles((theme) => ({
  list: {
    flexDirection: "row",
    display: "flex",
  },
}));

export default function Scopes() {
  const classes = useStyles();
  const [currentScope, setCurrentScope] = useState(null);
  let deets = getUserDetails();
  const { data, loading, error, refetch } = useQuery(GET_SCOPES, {
    variables: { userId: deets.key },
    fetchPolicy: "network-only",
  });

  const [addScope] = useMutation(ADD_SCOPE);
  if (loading) return "loading";
  if (error) return "error";

  const addScopeLocal = () => {
    addScope({
      variables: { userId: deets.key, defaultScope: false, name: "new scope!" },
    }).then((res) => {
      cache.writeQuery({
        query: GET_SCOPE,
        variables: { id: res.data.addScope.id },
      });
      refetch();
    });
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
        {data.scopes &&
          data.scopes.map((scope) => (
            <Scopetab
              key={scope.id}
              id={scope.id}
              scope={scope}
              setCur={setCurrentScope}
              curScope={currentScope}
              parentRefresh={refetch}
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
