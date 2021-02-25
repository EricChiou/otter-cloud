export class Routes {
  public static readonly HOME = process.env.PUBLIC_URL + '/home';
  public static readonly LOGIN = process.env.PUBLIC_URL + '/login';
  public static readonly SIGN_UP = process.env.PUBLIC_URL + '/sign-up';
  public static readonly SHARE_LINK = process.env.PUBLIC_URL + '/share-link';
  public static readonly ACTIVATE_LINK = process.env.PUBLIC_URL + '/activate/:avtiveCode';
}