import { Subject } from 'rxjs';

import { SharedInput } from './interface';

const userShared = new Subject<SharedInput>();

/** user shared actions */
export const userSharedActs = {
    tokenError: 'tokenError',
};

/** subscribe user shared */
export const subUserShared = (callback: (data: SharedInput) => void) => {
    return userShared.subscribe({ next: callback });
};

export const tokenErrorNext = () => {
    userShared.next({ action: userSharedActs.tokenError });
};
