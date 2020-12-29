import { Subject } from 'rxjs';

import { SharedInput } from './interface';

const fileShared = new Subject<SharedInput>();

/** file shared actions */
export const fileSharedActs = {
    uploadFile: 'uploadFile',
}

/** subscribe file shared */
export const subFileShared = (callback: (data: SharedInput) => void) => {
    return fileShared.subscribe({ next: callback });
};

export const uploadFileNext = () => {
    fileShared.next({ action: fileSharedActs.uploadFile });
}
