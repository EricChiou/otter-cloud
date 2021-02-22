import { CancelTokenSource } from 'axios';

import { Prefix } from 'src/interface/common';

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
    prefix: Prefix;
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
    payload: {
        task?: TaskData;
        id?: string;
        progress?: number;
        status?: TaskStatus;
    };
}

export const taskListReducer = (state: TaskData[], action: Action): TaskData[] => {
    const newProgressTaskList = [...state];
    const newStatusTaskList = [...state];

    switch (action.type) {
        case TaskListActions.addTask:
            return action.payload.task ? [...state, action.payload.task] : state;

        case TaskListActions.updateTaskProgress:
            newProgressTaskList.every((task) => {
                if (task.id === action.payload.id && action.payload.progress !== undefined) {
                    task.progress = action.payload.progress;
                    return false;
                }
                return true;
            });
            return newProgressTaskList;

        case TaskListActions.updateTaskStatus:
            newStatusTaskList.every((task) => {
                if (task.id === action.payload.id && action.payload.status) {
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
