import { Subject } from 'rxjs';

import { SharedInput } from './interface';
import { TaskData } from 'src/components/TaskList/reducer';

const taskShared = new Subject<SharedInput>();

/** task shared actions */
export const taskSharedActs = {
    addTask: 'addTask',
};

/** subscribe task shared */
export const subTaskShared = (callback: (data: SharedInput) => void) => {
    return taskShared.subscribe({ next: callback });
};

export const addTask = (tasks: TaskData[]) => {
    taskShared.next({ action: taskSharedActs.addTask, tasks });
};
