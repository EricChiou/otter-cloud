import Main from 'src/layout/main/Main';
import NoSideMenu from 'src/layout/plain/Plain';

import { Routes } from 'src/constants/routes-url';

import Home from 'src/pages/home/Home';
import Login from 'src/pages/login/Login';

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