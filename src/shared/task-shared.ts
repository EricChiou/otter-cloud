import { Subject } from 'rxjs';
import { CancelTokenSource } from 'axios';

import { SharedInput } from './interface';

export enum TaskType {
    upload = 'upload',
    download = 'download',
}

export enum TaskStatus {
    waiting = 'waiting',
    running = 'running',
    error = 'error',
    finish = 'finish',
}

export interface TaskData {
    id: string;
    type: TaskType;
    prefix: string;
    fileName: string;
    status: TaskStatus;
    progess: number;
    cancelToken: CancelTokenSource;
    contentType?: string;
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

export const addTask = (tasks: TaskData[]) => {
    taskShared.next({ action: taskSharedActs.addTask, tasks });
}

export const removeTask = (index: number) => {
    taskShared.next({ action: taskSharedActs.removeTask, index });
}
