import { store } from 'src/store/store';

export class StatusService {
  public static readonly isLogin = (): boolean => {
    const userProfile = store.getState().user.profile;
    if (userProfile &&
      userProfile.token &&
      userProfile.acc &&
      userProfile.name &&
      userProfile.roleCode &&
      (userProfile.exp || userProfile.ip)) {

      return true;
    }
    return false;
  }
}
