import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useLocation, useHistory } from "react-router-dom";

import { setUserProfile } from './store/userProfile';
import { routes } from './routes/routes';

import './App.scss';

import { StatusService, UserProfileService } from './service';
import { Routes } from './constants';

const App = () => {
  const history = useHistory();
  const location = useLocation();

  // if not login and not at login page, redirect to login page.
  useEffect(() => {
    const token = UserProfileService.getTokenFrCookie();
    if (token) {
      // console.log(token);
      // const userProfile = UserProfileService.parseToken(token);
      // console.log(userProfile);
      // setUserProfile(userProfile);
    }

    if (!StatusService.isLogin() && location.pathname !== Routes.LOGIN) {
      history.push(Routes.LOGIN);
    }
  }, [location]);

  return (
    <div id="app">
      <Switch>
        {routes.map((route, i) => (
          <Route path={route.path} key={i}>
            <route.layout>
              <route.component></route.component>
            </route.layout>
          </Route>
        ))}
        <Route path="/">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
