import Main from '../layout/main/Main';
import NoSideMenu from '../layout/plain/Plain';

import { Routes } from '../constants/routes';

import Home from '../pages/home/Home';
import Login from '../pages/login/Login';

export const routes = [
  {
    path: Routes.HOME,
    layout: Main,
    component: Home,
  },
  {
    path: Routes.LOGIN,
    layout: NoSideMenu,
    component: Login,
  },
];