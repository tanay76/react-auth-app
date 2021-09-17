import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { makeStyles, alpha } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography } from "@material-ui/core";
import Layout from "../layout/Layout";
import AuthContext from "../context/AuthContext";

export default function Auth() {
  const [reqdSignup, setReqdSignup] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswodError] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const classes = useStyles();

  const toggleLoginSignupHandler = () => {
    setReqdSignup((state) => !state);
  };

  const emailChangeHandler = (event) => {
    setEmailError(false);
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPasswodError(false);
    setPassword(event.target.value);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    console.log("39");
    setIsLoading(true);
    if (!email.includes("@")) {
      setEmailError(true);
      setIsLoading(false);
      return;
    }
    if (password.length < 7) {
      setPasswodError(true);
      setIsLoading(false);
      return;
    }
    let url;
    if (reqdSignup) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA9IVIp1aJWAIVXrnhHjd8fzfRqean-wA";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA9IVIp1aJWAIVXrnhHjd8fzfRqean-wA";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        console.log(data);
        if (data.token) {
          const expiration = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          ).toISOString();
          authCtx.login(data.token, data.refreshToken, expiration);
          history.replace("/");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.errors?.status === "INVALID_ARGUMENT") {
          setHasError(true);
        }
      });
  };

  return (
    <Layout>
      <div className={classes.root}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid
            container
            className={classes.container}
            style={{ height: "100vh", width: "100%" }}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h5" color="secondary">
                  {reqdSignup ? "Signup" : "Login"}
                </Typography>

                <form
                  // noValidate
                  // autoComplete="off"
                  onSubmit={formSubmitHandler}
                >
                  <TextField
                    className={classes.rootOne}
                    style={{ width: "100%" }}
                    type="text"
                    label="Email"
                    onChange={emailChangeHandler}
                  />
                  {emailError && (
                    <Typography variant="subtitle1" color="error">
                      Please enter a valid email.
                    </Typography>
                  )}
                  <TextField
                    className={classes.rootOne}
                    style={{ width: "100%" }}
                    type="password"
                    label="Password"
                    onChange={passwordChangeHandler}
                  />
                  {passwordError && (
                    <Typography variant="subtitle1" color="error">
                      Password should be atleast of 7 characters.
                    </Typography>
                  )}
                  <div>
                    {!isLoading && (
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                      >
                        {reqdSignup ? "Signup" : "Login"}
                      </Button>
                    )}
                    {isLoading && <CircularProgress color="secondary" />}
                  </div>
                  {hasError && (
                    <Typography variant="subtitle2" color="error">
                      Some technical issues occured.
                    </Typography>
                  )}
                </form>
                <div>
                  <Button
                    variant="text"
                    color="secondary"
                    disableRipple
                    className={classes.btn}
                    onClick={toggleLoginSignupHandler}
                  >
                    {reqdSignup
                      ? "Existing Customer? Login"
                      : "New Customer? Sign Up"}
                  </Button>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.5
    )}, ${alpha(theme.palette.primary.main, 0.2)} 60%, #fff 100%)`,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  rootOne: {
    marginBottom: theme.spacing(1),
    height: 70,
    // width: "25ch",
  },
  btn: {
    marginTop: 10,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));
