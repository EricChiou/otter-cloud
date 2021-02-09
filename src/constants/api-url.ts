const mainUrl = '/otter-cloud-ws';

const userGroupUrl = '/user';
const fileGroupUrl = '/file';

export class ApiUrl {
    // user
    public static readonly SIGN_UP = mainUrl + userGroupUrl + '/signUp';
    public static readonly SIGN_IN = mainUrl + userGroupUrl + '/signIn';

    // file
    public static readonly GET_FILE_LIST = mainUrl + fileGroupUrl + '/list';
    public static readonly UPLOAD_FILES = mainUrl + fileGroupUrl + '/upload';
    public static readonly GET_PREVIEW_URL = mainUrl + fileGroupUrl + '/preview';
    public static readonly DOWNLOAD_FILE = mainUrl + fileGroupUrl + '/download';
    public static readonly REMOVE_FILE = mainUrl + fileGroupUrl + '/remove';
    public static readonly REMOVE_FOLDER = mainUrl + fileGroupUrl + '/remove/folder';
    public static readonly GET_SHAREABLE_LINK_URL = mainUrl + fileGroupUrl + '/shareableLink';
    public static readonly GET_OBJECT_BY_SHAREABLE_LINK_URL = mainUrl + fileGroupUrl + '/object/shareableLink';
    public static readonly RENAME_FILE_URL = mainUrl + fileGroupUrl + '/rename';
    public static readonly MOVE_FILES_URL = mainUrl + fileGroupUrl + '/move';
};