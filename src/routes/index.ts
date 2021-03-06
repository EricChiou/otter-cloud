import Main from 'src/layout/Main';
import Plain from 'src/layout/Plain';

import { Routes } from 'src/constants';

import Home from 'src/pages/Home';
import Login from 'src/pages/Login';
import SignUp from 'src/pages/SignUp';
import ShareLink from 'src/pages/ShareLink';
import Activate from 'src/pages/Activate';
import Other from 'src/pages/Other';

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
  {
    path: Routes.SIGN_UP,
    layout: Plain,
    component: SignUp,
  },
  {
    path: Routes.SHARE_LINK,
    layout: Plain,
    component: ShareLink,
  },
  {
    path: Routes.ACTIVATE_LINK,
    layout: Plain,
    component: Activate,
  },
  {
    path: Routes.OTHER_LINK,
    layout: Plain,
    component: Other,
  },
];