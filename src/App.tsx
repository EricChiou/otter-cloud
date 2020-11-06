import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { routes } from './routes';
import { setUserProfile, selectUserProfile, selectLang } from './store/user.slice';
import { StatusService, UserService } from './service';
import { Routes } from './constants';

import './App.scss';

const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const userProfile = useSelector(selectUserProfile);
  useSelector(selectLang);
  const token = UserService.getTokenFrCookie();

  // parse token from cookie
  useEffect(() => {
    try {
      const userProfile = UserService.parseToken(token);
      dispatch(setUserProfile(userProfile));

    } catch (error) {
      console.error(error);
    }
  }, [token, dispatch]);

  // if not login and not at login page, redirect to login page.
  useEffect(() => {
    if (location.pathname !== Routes.LOGIN && !StatusService.isLogin()) {
      history.push(Routes.LOGIN);
    }
  }, [location, history, userProfile]);

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
          <Redirect to={Routes.HOME} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
