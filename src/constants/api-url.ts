/* eslint-disable max-len */
const mainUrl = '/otter-cloud-ws';

const userGroupUrl = mainUrl + '/user';
const fileGroupUrl = mainUrl + '/file';
const shareGroupUrl = mainUrl + '/shared';

export class ApiUrl {
    // user
    public static readonly SIGN_UP = userGroupUrl + '/signUp';
    public static readonly SIGN_IN = userGroupUrl + '/signIn';
    public static readonly GET_USER_FUZZY_LIST = userGroupUrl + '/fuzzy/list';
    public static readonly ACTIVATE_ACCOUNT = userGroupUrl + '/activate';

    // file
    public static readonly GET_FILE_LIST = fileGroupUrl + '/list';
    public static readonly UPLOAD_FILES = fileGroupUrl + '/upload';
    public static readonly GET_PREVIEW_URL = fileGroupUrl + '/preview';
    public static readonly DOWNLOAD_FILE = fileGroupUrl + '/download';
    public static readonly REMOVE_FILE = fileGroupUrl + '/remove';
    public static readonly REMOVE_FOLDER = fileGroupUrl + '/remove/folder';
    public static readonly GET_SHAREABLE_LINK = fileGroupUrl + '/shareableLink';
    public static readonly GET_OBJECT_BY_SHAREABLE_LINK_URL = fileGroupUrl + '/shareableLink/object';
    public static readonly RENAME_FILE_URL = fileGroupUrl + '/rename';
    public static readonly MOVE_FILES_URL = fileGroupUrl + '/move';

    // share
    public static readonly ADD_SHARED_FOLDER_URL = shareGroupUrl + '/add';
    public static readonly UPDATE_SHARED_FOLDER_URL = shareGroupUrl + '/update';
    public static readonly REMOVE_SHARED_FOLDER_URL = shareGroupUrl + '/remove';
    public static readonly GET_SHARED_FOLDER_LIST_URL = shareGroupUrl;
    public static readonly GET_SHARED_FILE_LIST_URL = shareGroupUrl + '/file/list';
    public static readonly GET_SHARED_FILE_PREVIEW_URL = shareGroupUrl + '/file/preview';
    public static readonly DOWNLOAD_SHARED_FILE = shareGroupUrl + '/file/download';
    public static readonly GET_SHARED_FILE_SHAREABLE_LINK = shareGroupUrl + '/file/shareableLink';
    public static readonly UPLOAD_SHARED_FILE = shareGroupUrl + '/file/upload';
    public static readonly REMOVE_SHARED_FILE = shareGroupUrl + '/file';
    public static readonly REMOVE_SHARED_FOLDER = shareGroupUrl + '/folder';
    public static readonly RENAME_SHARED_FILE = shareGroupUrl + '/file/rename';
    public static readonly MOVE_SHARED_FILES = shareGroupUrl + '/file/move';
}
