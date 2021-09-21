import { createContext, useCallback, useEffect, useState } from "react";

const AuthContext = createContext({
  token: "",
  refreshToken: "",
  expiresIn: "",
  isLoggedIn: false,
  login: (token, refreshToken, expiration) => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedRefreshToken = localStorage.getItem("refreshToken");
  const storedExpiresIn = localStorage.getItem("expiresIn");

  const [loginCreds, setLoginCreds] = useState({
    token: storedToken || "",
    refreshToken: storedRefreshToken || "",
    expiresIn: storedExpiresIn || "",
  });

  const { token, refreshToken, expiresIn } = loginCreds

  const isLoggedIn = !!token;

  // console.log(token);
  // console.log(isLoggedIn);
  // console.log(refreshToken);

  const timeRemaining = useCallback((expiration) => {
    const currentTime = new Date().getTime();
    const expirationTime = new Date(expiration).getTime();
    const timeLeft = expirationTime - currentTime;
    return timeLeft;
  }, []);

  const loginHandler = (token, refreshToken, expiration) => {
    setLoginCreds({
      token,
      refreshToken,
      expiresIn: expiration
    })

    localStorage.setItem("token", token);
    localStorage.setItem("expiresIn", expiration);
    localStorage.setItem("refreshToken", refreshToken);
  };

  useEffect(() => {
    const exchangeRefreshToken = (refreshToken) => {
      fetch(
        "https://securetoken.googleapis.com/v1/token?key=AIzaSyA9IVIp1aJWAIVXrnhHjd8fzfRqean-wAE",
        {
          method: "POST",
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.expires_in) {
            const expiringIn = new Date(
              new Date().getTime() + +data.expires_in * 1000
            ).toISOString();
            loginHandler(data.id_token, data.refresh_token, expiringIn);
          }
        });
    };
    // console.log(isLoggedIn);
    // console.log(refreshToken);
    if (isLoggedIn) {
      setTimeout(exchangeRefreshToken.bind(null, refreshToken), timeRemaining(expiresIn) - 2000);
    }
  }, [isLoggedIn, refreshToken, expiresIn, timeRemaining]);

  const logoutHandler = () => {
    setLoginCreds({
      token: "",
      refreshToken: "",
      expiresIn: ""
    })

    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("refreshToken");
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
