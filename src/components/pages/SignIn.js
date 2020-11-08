import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Link as llink, useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Layout from "../common/Layout";
import * as yup from "yup"; // for everything
import { useMutation } from "@apollo/client";
import { SIGN_IN } from "../../api/graphql/auth";
import { signIn as signInFunc } from "../../api/func/auth";

const schema = yup.object({
  email: yup.string().email().required("email is required"),
  password: yup
    .string()
    .min(8, "Min password length is 8 characters.")
    .max(17, "Max password length is 17 characters")
    .matches(/(?=.*[A-Z])/, "need at least one capital letter")
    .matches(/(?=.*[a-z])/, "need at least one lower-case letter")
    .matches(/(?=.*[0-9])/, "need at least one number")
    .matches(/(?=.*[@$!%*#?&])/, "need at least one special character")
    .required("Password Required"),
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  new: {
    padding: theme.spacing(2),
  },
}));

export default function SignIn() {
  let history = useHistory();
  const [signIn] = useMutation(SIGN_IN);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleChange = (event) => {
    let newValues = { ...values };
    let newTouched = { ...touched };
    let newErrors = { ...errors };
    newValues[event.target.name] = event.target.value;
    newTouched[event.target.name] = true;
    setTouched(newTouched);
    setValues(newValues);

    schema
      .validateAt(event.target.name, newValues)
      .then(() => {
        newErrors[event.target.name] = "";
        setErrors(newErrors);
      })
      .catch((err) => {
        if (newTouched[event.target.name] === true) {
          newErrors[event.target.name] = err.message;
          setErrors(newErrors);
        }
      });
  };

  const submit = (event) => {
    event.preventDefault();
    schema
      .validate(values)
      .then(() => {
        signIn({
          variables: { email: values.email, password: values.password },
        }).then((res) => {
          console.log("just signed in ", res);
          signInFunc(res.data.signIn.AccessToken, res.data.signIn.RefreshToken);
          console.log("about to go to scopes");
          history.push("/scopes");
        });
      })
      .catch((err) => {
        //display error message
      });
  };

  const classes = useStyles();

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={values.email}
              onChange={handleChange}
              helperText={errors.email}
              error={!!errors.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={values.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={submit}
            >
              Sign In
            </Button>
            <Grid container className={classes.new} justify="center">
              <Grid item>
                <Link component={llink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Layout>
  );
}
