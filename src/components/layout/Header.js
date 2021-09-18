import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

function ElevationScroll(props) {
  const { children } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Header() {
  const classes = useStyles();
  const authCtx = useContext(AuthContext);

  const { isLoggedIn, logout } = authCtx;

  const logoutHandler = () => {
    logout();
  };

  return (
    <Fragment>
      <ElevationScroll>
        <AppBar>
          <Toolbar>
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
            <Typography variant="h6" className={classes.title}>
              <Link className={classes.link} to="/">
                React Auth
              </Link>
            </Typography>
            {!isLoggedIn && <Link className={classes.link} to="/login">
              <Button className={classes.menuButton} color="inherit">
                Login
              </Button>
            </Link>}
            {isLoggedIn && <Link className={classes.link} to="/profile">
              <Button className={classes.menuButton} color="inherit">
                Profile
              </Button>
            </Link>}
            {isLoggedIn && <Button className={classes.menuButton} color="inherit" onClick={logoutHandler}>
              Logout
            </Button>}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
}));
