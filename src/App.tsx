import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { routes } from './routes';
import { setUserProfile, selectUserProfile, selectLang, logout } from './store/user.slice';
import { selectPrefix, setPrefix } from 'src/store/system.slice';
import { StatusService, UserService } from './service';
import { Routes } from './constants';
import { Dialog } from 'src/components/common';
import { subUserShared, userSharedActs } from 'src/shared/user-shared';
import { addMessage, MessageType } from 'src/components/Message';
import { intl, keys } from 'src/i18n';
import { getSearch } from 'src/util/location.util';

import './App.scss';

const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const prefix = useSelector(selectPrefix);
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

  useEffect(() => {
    const search = getSearch();
    if (search.prefix) {
      if (search.prefix !== prefix.path) {
        const sharedId = parseInt(search.sharedId);
        dispatch(setPrefix(sharedId ? sharedId : null, search.prefix));
      }

    } else if (prefix.path !== '') {
      dispatch(setPrefix(null, ''));
    }
  }, [dispatch, location, prefix]);

  // if not login and not at login page or sign up page or share link page, redirect to login page.
  useEffect(() => {
    if (
      location.pathname !== Routes.LOGIN &&
      location.pathname !== Routes.SIGN_UP &&
      location.pathname !== Routes.SHARE_LINK &&
      location.pathname.indexOf('/activate') < 0 &&
      location.pathname !== Routes.OTHER_LINK &&
      !StatusService.isLogin()
    ) {
      history.push({ pathname: Routes.LOGIN, search: '' });
    }
  }, [location, history, userProfile]);

  // handle token error
  useEffect(() => {
    const subscribe = subUserShared((data) => {
      if (data.action === userSharedActs.tokenError) {
        if (StatusService.isLogin() && location.pathname.indexOf('/activate') < 0) {
          dispatch(logout());
          dispatch(addMessage(intl(keys.tokenErrorMsg), MessageType.info));
        }
      }
    });

    return () => { subscribe.unsubscribe(); };
  }, [history, dispatch, location]);

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
      <Dialog></Dialog>
    </div>
  );
};

export default App;
