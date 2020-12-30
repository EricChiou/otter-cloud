import { Subject } from 'rxjs';

import { SharedInput } from './interface';

export enum TaskType {
    upload = 'upload',
    download = 'download',
}

export interface TaskData {
    type: TaskType;
    prefix: string;
    fileName: string;
    file?: File;
}

const taskShared = new Subject<SharedInput>();

/** task shared actions */
export const taskSharedActs = {
    addTask: 'addTask',
    removeTask: 'removeTask',
}

/** subscribe task shared */
export const subTaskShared = (callback: (data: SharedInput) => void) => {
    return taskShared.subscribe({ next: callback });
};

export const addTask = (taskDatas: TaskData[]) => {
    taskShared.next({ action: taskSharedActs.addTask, taskDatas });
}

export const removeTask = (index: number) => {
    taskShared.next({ action: taskSharedActs.removeTask, index });
}
