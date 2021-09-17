import { createContext, useState } from "react";

const AuthContext = createContext({
  token: '',
  refreshToken: '',
  expiresIn: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = ({children}) => {
  const initialValue = localStorage.getItem({
    token: 'token',
    refreshToken: 'refreshToken',
    expiresIn: 'expiresIn'
  });
  const [token, setToken] = useState(initialValue ? initialValue.token : '');
  const [refreshToken, setRefreshToken] = useState(initialValue ? initialValue.refreshToken : '');
  const [expiresIn, setExpiresIn] = useState(initialValue ? initialValue.expiresIn : '');

  const isLoggedIn = !!token;

  const loginHandler = (token, refreshToken, expiration) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setExpiresIn(expiration);

    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiration);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logoutHandler = () => {
    setToken('');
    setRefreshToken('');
    setExpiresIn('');

    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('refreshToken');
  };

  const contextValue = {
    token: token,
    refreshToken: refreshToken,
    expiresIn: expiresIn,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;