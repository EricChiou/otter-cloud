import React, {
  FunctionComponent,
  useRef,
  RefObject,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Task from './Task';
import { subTaskShared, taskSharedActs } from 'src/shared/task-shared';
import {
  taskListReducer,
  TaskData,
  TaskType,
  TaskStatus,
  addTask,
  updateTaskProgress,
  updateTaskStatus,
  removeTask,
} from './reducer';
import { selectSharedFolderList } from 'src/store/system.slice';
import { sharedFolderPermsType } from 'src/constants/shared';
import { addMessage, MessageType } from 'src/components/Message';
import { intl, keys, IntlType } from 'src/i18n';

import styles from './style.module.scss';

const TaskList: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const listRef: RefObject<HTMLDivElement> = useRef(null);
  const [taskList, taskListDispatch] = useReducer(taskListReducer, []);
  const [errorTaskList, errorTaskListDispatch] = useReducer(taskListReducer, []);
  const sharedFolderList = useSelector(selectSharedFolderList);

  const checkPermission = useCallback((task: TaskData): boolean => {
    if (task.type === TaskType.download) { return true; }
    if (!task.prefix.sharedId) { return true; }

    const sharedFolder =
      sharedFolderList.find((sharedFolder) => sharedFolder.id === task.prefix.sharedId);
    if (!sharedFolder) { return false; }
    if (sharedFolder.permission === sharedFolderPermsType.read) { return false; }

    return true;
  }, [sharedFolderList]);

  useEffect(() => {
    const subscribe = subTaskShared((data) => {
      if (data.action === taskSharedActs.addTask) {
        if (data.tasks && Array.isArray(data.tasks)) {
          data.tasks.forEach((task) => {
            if (!checkPermission(task)) {
              dispatch(addMessage(
                intl(keys.permissionDenied, IntlType.perUpper),
                MessageType.warning,
              ));
              return;
            }
            taskListDispatch(addTask(task));
          });
        }
      }
    });

    return () => { subscribe.unsubscribe(); };
  }, [dispatch, checkPermission]);

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
              ></Task>)
            }
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
              ></Task>)
            }
          </div>
        </div> : null
      }
    </div>
  );
};

export default TaskList;
