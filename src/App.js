import { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Auth from "./components/auth/Auth";
import AuthContext from './components/context/AuthContext';
import Home from './components/layout/Home';
import Profile from "./components/profile/Profile";


function App() {
  const authCtx = useContext(AuthContext);

  const { isLoggedIn } = authCtx;

  return (
    <div>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/login'>
          <Auth />
        </Route>
        <Route path='/profile'>
          {isLoggedIn && <Profile />}
          {!isLoggedIn && <Redirect to='/login'/>}
        </Route>
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
