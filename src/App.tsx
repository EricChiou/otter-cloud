import React, { Dispatch, useEffect } from 'react';
import { Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { routes } from './routes';

import './App.scss';

import { setUserProfile } from './store/user.slice';

import { StatusService, UserService } from './service';
import { Routes } from './constants';

const init = (dispatch: Dispatch<any>) => {
  try {
    const token = UserService.getTokenFrCookie();
    const userProfile = UserService.parseToken(token);
    dispatch(setUserProfile(userProfile));

  } catch (error) {
    console.error(error);
  }
}

const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // init data
  init(dispatch);

  // if not login and not at login page, redirect to login page.
  useEffect(() => {
    if (location.pathname !== Routes.LOGIN && !StatusService.isLogin()) {
      history.push(Routes.LOGIN);
    }
  }, [location, history]);

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
