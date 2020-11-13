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
import * as yup from "yup";
import Layout from "../common/Layout";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "../../api/graphql/auth";

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
  confirmPassword: yup
    .string()
    .required("Must confirm password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
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

export default function SignUp() {
  let history = useHistory();
  const [signUp] = useMutation(SIGN_UP);

  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleChange = (event) => {
    let newValues = { ...values };
    let newTouched = { ...touched };
    let newErrors = { ...errors };
    newValues[event.target.name] = event.target.value;
    newTouched[event.target.name] = true;
    setTouched(newTouched);
    setValues(newValues);
    console.log(errors);

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
    event.preventDefault();
  };

  const submit = (event) => {
    event.preventDefault();
    schema
      .validate(values)
      .then(() => {
        signUp({
          variables: { email: values.email, password: values.password },
        })
          .then(() => {
            history.push("/scopes");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        //display error message
      });
    event.preventDefault();
  };

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={submit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              onChange={handleChange}
              value={values.email}
              helperText={errors.email}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={values.password}
              onChange={handleChange}
              helperText={errors.password}
              name="password"
              label="Password"
              type="password"
              id="password"
              error={!!errors.password}
              autoComplete="current-password"
            />

            <TextField
              variant="outlined"
              margin="normal"
              value={values.confirmPassword}
              required
              fullWidth
              onChange={handleChange}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              autoComplete="confirmPassword"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container className={classes.new} justify="center">
              <Grid item>
                <Link component={llink} to="/signin" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Layout>
  );
}
