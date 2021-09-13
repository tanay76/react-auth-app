import React, { useState } from "react";
import { makeStyles, alpha } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Layout from "../layout/Layout";
import { Typography } from "@material-ui/core";

export default function Auth() {
  const [reqdSignup, setReqdSignup] = useState(false);
  const classes = useStyles();

  const toggleLoginSignupHandler = () => {
    setReqdSignup((state) => !state);
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
                <Typography variant="h5" color='secondary'>
                  {reqdSignup ? "Signup" : "Login"}
                </Typography>

                <form noValidate autoComplete="off">
                  <TextField
                    className={classes.rootOne}
                    style={{ width: "100%" }}
                    type="text"
                    label="Email"
                  />
                  <TextField
                    className={classes.rootOne}
                    style={{ width: "100%" }}
                    type="password"
                    label="Password"
                  />

                  <div>
                    <Button variant="contained" color="secondary">
                      {reqdSignup ? "Signup" : "Login"}
                    </Button>
                  </div>

                  <div>
                    <Button
                      variant= 'text'
                      color= 'secondary'
                      disableRipple
                      className={classes.btn}
                      onClick={toggleLoginSignupHandler}
                    >
                      {reqdSignup
                        ? "Existing Customer? Login"
                        : "New Customer? Sign Up"}
                    </Button>
                  </div>
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
}));
