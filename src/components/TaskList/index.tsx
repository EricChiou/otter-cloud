import React, {
  FunctionComponent,
  useRef,
  RefObject,
  useEffect,
  useCallback,
  useReducer,
} from 'react';

import Task from './Task';
import { subTaskShared, taskSharedActs } from 'src/shared/task-shared';
import {
  taskListReducer,
  TaskStatus,
  addTask,
  updateTaskProgress,
  updateTaskStatus,
  removeTask,
} from './reducer';

import styles from './style.module.scss';

const TaskList: FunctionComponent<{}> = () => {
  const listRef: RefObject<HTMLDivElement> = useRef(null);
  const [taskList, taskListDispatch] = useReducer(taskListReducer, []);
  const [errorTaskList, errorTaskListDispatch] = useReducer(taskListReducer, []);

  useEffect(() => {
    const subscribe = subTaskShared((data) => {
      if (data.action === taskSharedActs.addTask) {
        if (data.tasks && Array.isArray(data.tasks)) {
          data.tasks.forEach((task) => {
            taskListDispatch(addTask(task));
          });
        }
      }
    });

    return () => { subscribe.unsubscribe(); };
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!listRef.current) { return; }

    listRef.current.scrollTop = 0;
  }, []);

  const setProgress = useCallback((id: string, progress: number) => {
    taskListDispatch(updateTaskProgress(id, progress));
  }, []);

  const setStatus = useCallback((id: string, status: TaskStatus) => {
    taskListDispatch(updateTaskStatus(id, status));
  }, []);

  const doRemoveTask = useCallback((id: string) => {
    taskListDispatch(removeTask(id));
  }, []);

  const removeErrorTask = useCallback((id: string) => {
    errorTaskListDispatch(removeTask(id));
  }, []);

  const move2ErrorList = useCallback((id: string) => {
    const targetTask = taskList.find((task) => task.id === id);
    if (targetTask) {
      taskListDispatch(removeTask(id));
      errorTaskListDispatch(addTask(targetTask));
    }
  }, [taskList]);

  return (
    <div id={styles.taskList}>
      {taskList.length + errorTaskList.length > 0 ?
        <div className={styles.container}>
          <div ref={listRef} className={styles.list} onMouseLeave={onMouseLeave}>
            <div className={styles.topLine}></div>
            {taskList.map((task, index) =>
              <Task
                key={`${index}_${task.fileName}`}
                index={index}
                task={task}
                inErrorList={false}
                setProgress={setProgress}
                setStatus={setStatus}
                remove={doRemoveTask}
                move2ErrorList={move2ErrorList}
              ></Task>
            )}
            {errorTaskList.map((task, index) =>
              <Task
                key={`${index}_${task.fileName}`}
                index={index}
                task={task}
                inErrorList={true}
                setProgress={setProgress}
                setStatus={setStatus}
                remove={removeErrorTask}
                move2ErrorList={move2ErrorList}
              ></Task>
            )}
          </div>
        </div>
        : null}
    </div>
  );
};

export default TaskList;
