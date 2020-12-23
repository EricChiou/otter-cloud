import { store } from 'src/store/store';

export class StatusService {
  public static readonly isLogin = (): boolean => {
    const userProfile = store.getState().user.profile;
    if (userProfile &&
      userProfile.token &&
      userProfile.id !== null &&
      userProfile.acc &&
      userProfile.name &&
      userProfile.roleCode &&
      userProfile.roleName &&
      userProfile.bucketName &&
      userProfile.exp) {

      return true;
    }
    return false;
  }
}
