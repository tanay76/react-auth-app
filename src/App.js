import { Route, Switch } from 'react-router-dom';
import Auth from "./components/auth/Auth";
import Home from './components/layout/Home';
import Profile from "./components/profile/Profile";


function App() {
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
          <Profile />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
