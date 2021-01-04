import { CancelTokenSource } from 'axios';

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
    progress: number;
    cancelToken: CancelTokenSource;
    contentType?: string;
    file?: File;
}

enum TaskListActions {
    addTask = 'addTask',
    updateTaskProgress = 'updateTaskProgress',
    updateTaskStatus = 'updateTaskStatus',
    removeTask = 'removeTask',
}

interface Action {
    type: TaskListActions;
    payload: any;
}

export const taskListReducer = (state: TaskData[], action: Action,): TaskData[] => {

    switch (action.type) {
        case TaskListActions.addTask:
            return [...state, action.payload.task];

        case TaskListActions.updateTaskProgress:
            const newProgressTaskList = [...state];
            newProgressTaskList.every((task) => {
                if (task.id === action.payload.id) {
                    task.progress = action.payload.progress;
                    return false;
                }
                return true;
            });
            return newProgressTaskList;

        case TaskListActions.updateTaskStatus:
            const newStatusTaskList = [...state];
            newStatusTaskList.every((task) => {
                if (task.id === action.payload.id) {
                    task.status = action.payload.status;
                    return false;
                }
                return true;
            });
            return newStatusTaskList;

        case TaskListActions.removeTask:
            return [...state.filter((task) => task.id !== action.payload.id)];

        default:
            return state;
    }
};

export const addTask = (task: TaskData): Action => ({
    type: TaskListActions.addTask,
    payload: { task },
});

export const updateTaskProgress = (id: string, progress: number): Action => ({
    type: TaskListActions.updateTaskProgress,
    payload: { id, progress },
});

export const updateTaskStatus = (id: string, status: TaskStatus): Action => ({
    type: TaskListActions.updateTaskStatus,
    payload: { id, status },
});

export const removeTask = (id: string): Action => ({
    type: TaskListActions.removeTask,
    payload: { id },
});
