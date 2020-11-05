import { store } from '../store/store';

export class StatusService {
  public static readonly isLogin = (): boolean => {
    const userProfile = store.getState().user.profile;
    if (userProfile &&
      userProfile.token &&
      userProfile.id !== null &&
      userProfile.acc &&
      userProfile.name &&
      userProfile.role &&
      userProfile.exp) {

      return true;
    }
    return false;
  }
}
