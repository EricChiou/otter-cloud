import axios from 'axios';

import { TaskType, TaskStatus, TaskData } from 'src/components/TaskList/reducer';
import { addTask } from 'src/shared/task-shared';
import { File } from 'src/vo/common';

export class FileService {
  public static readonly uploadFiles = (prefix: string, files: FileList) => {
    // console.log('Upload Files', fileList);
    const timStamp = new Date().getTime();
    const tasks = Array.from(files).map((file, index) => {
      const task: TaskData = {
        id: `${timStamp}_${index}`,
        type: TaskType.upload,
        prefix,
        fileName: file.name,
        status: TaskStatus.waiting,
        progress: 0,
        cancelToken: axios.CancelToken.source(),
        file: file,
      }
      return task;
    });

    addTask(tasks);
  };

  public static readonly downloadFiles = (prefix: string, fileList: File[]) => {
    const files = fileList.filter((file) => file.selected);
    // console.log('Download Files', files);
    const timStamp = new Date().getTime();
    const tasks = files.map((file, index) => {
      const task: TaskData = {
        id: `${timStamp}_${index}`,
        type: TaskType.download,
        prefix,
        fileName: file.name,
        status: TaskStatus.waiting,
        progress: 0,
        cancelToken: axios.CancelToken.source(),
        contentType: file.contentType,
      }
      return task;
    });

    addTask(tasks);
  };
}
