import axios from 'axios';

import { TaskType, TaskStatus, TaskData } from 'src/components/TaskList/reducer';
import { addTask } from 'src/shared/task-shared';
import { File, Prefix } from 'src/interface/common';

export interface UploadFile {
  file: globalThis.File;
  path: string;
}

export class FileService {
  public static readonly uploadFiles = (prefix: Prefix, files: UploadFile[]) => {
    const timeStamp = new Date().getTime();
    const tasks = files
      .map((file, index) => {
        const newPrefix: Prefix = {
          sharedId: prefix.sharedId,
          path: file.path,
        };

        const task: TaskData = {
          id: `${timeStamp}_${index}`,
          type: TaskType.upload,
          prefix: newPrefix,
          fileName: file.file.name,
          status: TaskStatus.waiting,
          progress: 0,
          cancelToken: axios.CancelToken.source(),
          file: file.file,
        };
        return task;
      });

    addTask(tasks);
  };

  public static readonly downloadFiles = (prefix: Prefix, fileList: File[]) => {
    const files = fileList.filter((file) => file.selected);
    // console.log('Download Files', files);
    const timeStamp = new Date().getTime();
    const tasks = files.map((file, index) => {
      const task: TaskData = {
        id: `${timeStamp}_${index}`,
        type: TaskType.download,
        prefix,
        fileName: file.name,
        status: TaskStatus.waiting,
        progress: 0,
        cancelToken: axios.CancelToken.source(),
        contentType: file.contentType,
      };
      return task;
    });

    addTask(tasks);
  };

  public static readonly isFile = (
    file: File | { contentType: string; name: string; size: number; lastModified: string },
  ): boolean => {
    if (file.contentType || file.size) {
      return true;
    }

    return false;
  };
}
