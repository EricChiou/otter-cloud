import Main from 'src/layout/Main';
import Plain from 'src/layout/Plain';

import { Routes } from 'src/constants/routes-url';

import Home from 'src/pages/Home';
import Login from 'src/pages/Login';

export const routes = [
  {
    path: Routes.HOME,
    layout: Main,
    component: Home,
  },
  {
    path: Routes.LOGIN,
    layout: Plain,
    component: Login,
  },
];