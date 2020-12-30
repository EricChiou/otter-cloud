import React, { FunctionComponent, useRef, RefObject, useState, useEffect } from 'react';

import Task from './Task';
import { TaskData, subTaskShared, taskSharedActs } from 'src/shared/task-shared';

import styles from './style.module.scss';

const TaskList: FunctionComponent<{}> = () => {
  const listRef: RefObject<HTMLDivElement> = useRef(null);
  const [taskList, setTaskList] = useState<TaskData[]>([]);

  useEffect(() => {
    const subscribe = subTaskShared((data) => {
      if (data.action === taskSharedActs.addTask) {
        if (data.taskDatas && Array.isArray(data.taskDatas)) {
          setTaskList([...taskList, ...data.taskDatas]);
        }
      }
    });

    return () => { subscribe.unsubscribe(); };
  }, [taskList]);

  const onMouseLeave = () => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  };

  const remove = (index: number) => {
    const newTaskList = [...taskList];
    newTaskList.splice(index, 1);
    setTaskList(newTaskList);
  };

  return (
    <div id={styles.taskList}>
      {taskList.length > 0 ?
        <div className={styles.container}>
          <div ref={listRef} className={styles.list} onMouseLeave={onMouseLeave}>
            <div className={styles.topLine}></div>
            {taskList.map((data, index) =>
              <Task
                key={`${index}_${data.fileName}`}
                index={index}
                type={data.type}
                prefix={data.prefix}
                fileName={data.fileName}
                remove={remove}
              ></Task>
            )}
          </div>
        </div>
        : null}
    </div>
  );
};

export default TaskList;
