import React, {
  FunctionComponent,
  useRef,
  RefObject,
  MutableRefObject,
  useEffect,
  useCallback,
  useReducer,
} from 'react';

import Task from './Task';
import { TaskData, subTaskShared, taskSharedActs, TaskStatus } from 'src/shared/task-shared';

import styles from './style.module.scss';

const TaskList: FunctionComponent<{}> = () => {
  const listRef: RefObject<HTMLDivElement> = useRef(null);
  const taskList: MutableRefObject<TaskData[]> = useRef([]);
  const errorTaskList: MutableRefObject<TaskData[]> = useRef([]);
  const [ignored, forceUpdate] = useReducer((state: number) => (state < 1000 ? state + 1 : 0), 0);

  useEffect(() => {
    const subscribe = subTaskShared((data) => {
      if (ignored === undefined) { return; }

      if (data.action === taskSharedActs.addTask) {
        if (data.tasks && Array.isArray(data.tasks)) {
          data.tasks.forEach((task) => {
            taskList.current.push(task);
          });
          forceUpdate();
        }
      }
    });

    return () => { subscribe.unsubscribe(); };

  }, [ignored]);

  const onMouseLeave = useCallback(() => {
    if (!listRef.current) { return; }

    listRef.current.scrollTop = 0;

  }, []);

  const setProgess = useCallback((id: string, progess: number) => {
    const targetTask = taskList.current.find((task) => task.id === id);
    if (!targetTask) { return; }

    targetTask.progess = progess;
    forceUpdate();

  }, []);

  const setStatus = useCallback((id: string, status: TaskStatus) => {
    const targetTask = taskList.current.find((task) => task.id === id);
    if (!targetTask) { return; }

    targetTask.status = status;
    forceUpdate();

  }, []);

  const removeTask = useCallback((id: string) => {
    const targetIndex = taskList.current.findIndex((task) => task.id === id);
    if (targetIndex < 0) { return; }

    taskList.current.splice(targetIndex, 1);
    forceUpdate();

  }, []);

  const removeErrorTask = useCallback((id: string) => {
    const targetIndex = errorTaskList.current.findIndex((task) => task.id === id);
    if (targetIndex < 0) { return; }

    errorTaskList.current.splice(targetIndex, 1);
    forceUpdate();

  }, []);

  const move2ErrorList = useCallback((id: string) => {
    taskList.current.every((task, index) => {
      if (task.id === id) {
        errorTaskList.current.push(task);
        taskList.current.splice(index, 1);
        forceUpdate();

        return false;
      }
      return true;
    });

  }, []);

  return (
    <div id={styles.taskList}>
      {taskList.current.length + errorTaskList.current.length > 0 ?
        <div className={styles.container}>
          <div ref={listRef} className={styles.list} onMouseLeave={onMouseLeave}>
            <div className={styles.topLine}></div>
            {taskList.current.map((task, index) =>
              <Task
                key={`${index}_${task.fileName}`}
                index={index}
                task={task}
                inErrorList={false}
                setProgess={setProgess}
                setStatus={setStatus}
                remove={removeTask}
                move2ErrorList={move2ErrorList}
              ></Task>
            )}
            {errorTaskList.current.map((task, index) =>
              <Task
                key={`${index}_${task.fileName}`}
                index={index}
                task={task}
                inErrorList={true}
                setProgess={setProgess}
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
