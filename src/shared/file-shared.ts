import { Subject } from 'rxjs';

import { SharedInput } from './interface';
import { File } from 'src/vo/common';

const fileShared = new Subject<SharedInput>();

/** file shared actions */
export const fileSharedActs = {
    uploadFile: 'uploadFile',
    removeFile: 'removeFile',
    fileListOnScroll: 'fileListOnScroll',
    showShareLinkDialog: 'createShareLink',
};

/** subscribe file shared */
export const subFileShared = (callback: (data: SharedInput) => void) => {
    return fileShared.subscribe({ next: callback });
};

export const uploadFileNext = () => {
    fileShared.next({ action: fileSharedActs.uploadFile });
};

export const removeFileNext = () => {
    fileShared.next({ action: fileSharedActs.removeFile });
};

export const fileListOnScroll = () => {
    fileShared.next({ action: fileSharedActs.fileListOnScroll });
};

export const createShareLink = (file: File) => {
    fileShared.next({
        action: fileSharedActs.showShareLinkDialog,
        file,
    });
};
