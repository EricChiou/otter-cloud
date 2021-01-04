const userGroupUrl = '/user';
const fileGroupUrl = '/file';

export class ApiUrl {
    // user
    public static readonly SIGN_IN = userGroupUrl + '/signIn';

    // file
    public static readonly GET_FILE_LIST = fileGroupUrl + '/list';
    public static readonly UPLOAD_FILES = fileGroupUrl + '/upload';
    public static readonly GET_PREVIEW_URL = fileGroupUrl + '/preview';
    public static readonly DOWNLOAD_FILE = fileGroupUrl + '/download';
    public static readonly REMOVE_FILE = fileGroupUrl + '/remove';
    public static readonly REMOVE_FOLDER = fileGroupUrl + '/remove/folder';
};