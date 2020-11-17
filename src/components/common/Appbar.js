import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";
import { isSignedIn, logOut } from "../../api/func/auth";

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: "3em",
    [theme.breakpoints.down("md")]: {
      marginBottom: "2em",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1.25em",
    },
  },
}));

export default function Appbar() {
  const classes = useStyles();
  const [value, setValue] = useState("signin");
  let history = useHistory();

  React.useEffect(() => {
    const signedIn = isSignedIn();
    if (window.location.pathname === "/signin" && !signedIn) {
      setValue("signin");
    } else if (window.location.pathname === "/signin" && signedIn) {
      setValue("logout");
    } else if (window.location.pathname === "/signup" && !signedIn) {
      setValue("signin");
    } else if (window.location.pathname === "/signup" && signedIn) {
      setValue("logout");
    } else if (window.location.pathname === "/scopes") {
      setValue("scopes");
    }
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const logout = () => {
    logOut().then(() => {
      history.push("/signin");
      window.location.reload(true);
    });
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Tabs value={value} onChange={handleChange}>
            <Tab
              value="logout"
              disabled={!isSignedIn()}
              label="log out"
              onClick={() => {
                logout();
              }}
            ></Tab>
            <Tab
              value="signin"
              label="sign in"
              disabled={isSignedIn()}
              component={Link}
              to="/signin"
            ></Tab>
            <Tab
              value="scopes"
              label="scopes"
              disabled={!isSignedIn()}
              component={Link}
              to="/scopes"
            ></Tab>
          </Tabs>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </>
  );
}
