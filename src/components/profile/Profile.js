import React, { useState, useContext } from "react";
import { makeStyles, alpha } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Layout from "../layout/Layout";
import { Typography } from "@material-ui/core";
import AuthContext from "../context/AuthContext";

export default function Profile() {
  const classes = useStyles();
  const [oldPassword, setOldPassword] = useState();
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [newPassword, setNewPassword] = useState();
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordChangingError, setPasswordChangingError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const oldPasswordInputHandler = (event) => {
    setOldPasswordError(false);
    setHasError(false);
    setPasswordChangingError(false);
    setOldPassword(event.target.value);
  };

  const newPasswordInputhandler = (event) => {
    setNewPasswordError(false);
    setHasError(false);
    setPasswordChangingError(false);
    setNewPassword(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (newPassword.length < 7) {
      setNewPasswordError(true);
      setIsLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyA9IVIp1aJWAIVXrnhHjd8fzfRqean-wAE",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        const userEmail = data.users[0].email;
        fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA9IVIp1aJWAIVXrnhHjd8fzfRqean-wAE",
          {
            method: "POST",
            body: JSON.stringify({
              email: userEmail,
              password: oldPassword,
              returnSecureToken: true,
            }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setIsLoading(false);
            // console.log(data);
            if (data.idToken) {
              const expiration = new Date(
                new Date().getTime() + +data.expiresIn * 1000
              ).toISOString();
              authCtx.login(data.idToken, data.refreshToken, expiration);
              fetch(
                "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA9IVIp1aJWAIVXrnhHjd8fzfRqean-wAE",
                {
                  method: "POST",
                  body: JSON.stringify({
                    idToken: localStorage.getItem("token"),
                    password: newPassword,
                    returnSecureToken: true,
                  }),
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  if (data.idToken) {
                    const expiration = new Date(
                      new Date().getTime() + +data.expiresIn * 1000
                    ).toISOString();
                    authCtx.login(data.idToken, data.refreshToken, expiration);
                    setPasswordChanged(true);
                  } else {
                    throw new Error(data.error.message);
                  }
                });
            } else {
              setIsLoading(false);
              setPasswordChangingError(true);
              if (data.error.message === "INVALID_PASSWORD") {
                setOldPasswordError(true);
                return;
              } else {
                throw new Error(data.error.message);
              }
            }
          })
          .catch((err) => {
            setHasError(true);
          });
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
                  Your Profile
                </Typography>

                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={passwordChangeHandler}
                >
                  <TextField
                    className={classes.rootOne}
                    style={{ width: "100%" }}
                    type="password"
                    label="Old Password"
                    onChange={oldPasswordInputHandler}
                  />
                  {oldPasswordError && (
                    <Typography variant="subtitle2" color="error">
                      Password mismatch.
                    </Typography>
                  )}
                  <TextField
                    className={classes.rootOne}
                    style={{ width: "100%" }}
                    type="password"
                    label="New Password"
                    onChange={newPasswordInputhandler}
                  />
                  {newPasswordError && (
                    <Typography variant="subtitle2" color="error">
                      Password length should be of minimum 7 characters.
                    </Typography>
                  )}
                  {!isLoading && (
                    <div>
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                      >
                        Change Password
                      </Button>
                    </div>
                  )}
                  {isLoading && <CircularProgress color="secondary" />}
                  {!passwordChanged && passwordChangingError && (<Typography variant="subtitle2" color="error">
                      Password couldn't be changed. 
                  </Typography>)}
                  {hasError && (
                    <Typography variant="subtitle2" color="error">
                      Some technical issues occured. Please try later.
                    </Typography>
                  )}
                  {passwordChanged && (
                    <Typography variant="subtitle2" className={classes.successMsg}>
                      Password changed successfully.
                    </Typography>
                  )}
                </form>
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
  successMsg: {
    color: theme.palette.success.main
  }
}));
