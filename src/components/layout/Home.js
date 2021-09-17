import { useContext } from "react";
import { makeStyles, alpha, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Layout from "./Layout";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const authCtx = useContext(AuthContext);
  const classes = useStyles();

  const { isLoggedIn } = authCtx;
  return (
    <Layout>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          container
          className={classes.container}
          style={{ height: "100vh", width: "100%" }}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h4">Welcome on board!</Typography>
          {isLoggedIn && (
            <Typography variant="h5">You're logged in.</Typography>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;

const useStyles = makeStyles((theme) => ({
  container: {
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.5
    )}, ${alpha(theme.palette.primary.main, 0.2)} 60%, #fff 100%)`,
  },
}));
