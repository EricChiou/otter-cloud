import React, { FunctionComponent, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { UploadArrow, DownloadArrow, Cancel, TaskWaiting, TaskError } from 'src/components/icons';
import { TaskType } from 'src/shared/task-shared';
import { uploadFileNext } from 'src/shared/file-shared';
import { uploadFile, downloadFile } from 'src/api/file';
import { selectUserProfile } from 'src/store/user.slice';
import { TaskStatus, TaskData } from 'src/shared/task-shared';

import styles from './style.module.scss';

interface Props {
	index: number;
	task: TaskData;
	inErrorList: boolean;
	setProgess: (id: string, progess: number) => void;
	setStatus: (id: string, status: TaskStatus) => void;
	remove: (id: string) => void;
	move2ErrorList: (id: string) => void;
}

const Task: FunctionComponent<Props> = ({
	index,
	task,
	inErrorList,
	setProgess,
	setStatus,
	remove,
	move2ErrorList,
}) => {

	const userProfile = useSelector(selectUserProfile);

	const progess = useCallback((event: ProgressEvent<EventTarget>) => {
		if (!event.lengthComputable) { return; }

		const percentage = Math.round(event.loaded * 100 / event.total);
		setProgess(task.id, percentage);

	}, [task, setProgess]);

	const dpUploadFile = useCallback(() => {
		if (!task.file) { return; }

		setStatus(task.id, TaskStatus.running);
		uploadFile(task, task.file, userProfile.token, progess).then((resp) => {
			setStatus(task.id, TaskStatus.finish);
			uploadFileNext();

		}).catch(() => {
			setStatus(task.id, TaskStatus.error);
		});

	}, [task, userProfile, progess, setStatus]);

	const doDownloadFile = useCallback(() => {
		setStatus(task.id, TaskStatus.running);
		downloadFile(task, userProfile.token, progess).then((resp) => {
			setStatus(task.id, TaskStatus.finish);
			if (resp instanceof Blob) {
				const url = URL.createObjectURL(new Blob([resp], { type: task.contentType }));
				const link = document.createElement('a');
				link.href = url;
				link.download = task.fileName;
				link.style.display = 'none';
				document.body.appendChild(link);
				link.click();
				link.parentElement?.removeChild(link);
				URL.revokeObjectURL(url);
			}

		}).catch(() => {
			setStatus(task.id, TaskStatus.error);
		});

	}, [task, userProfile, progess, setStatus]);

	const removeTask = useCallback(() => {
		if (task.status === TaskStatus.running) {
			task.cancelToken.cancel('The task was canceled.');
		}
		remove(task.id);

	}, [task, remove]);

	useEffect(() => {
		if (task.status === TaskStatus.finish) {
			remove(task.id);

		} else if (!inErrorList && task.status === TaskStatus.waiting && index < 5) {
			switch (task.type) {
				case TaskType.upload:
					dpUploadFile();
					break;

				case TaskType.download:
					doDownloadFile();
					break;
			}

		} else if (!inErrorList && task.status === TaskStatus.error) {
			move2ErrorList(task.id);
		}
	});

	const getClassName = (): string => {
		switch (task.type) {
			case TaskType.upload:
				return styles.upload;

			case TaskType.download:
				return styles.download;
		}
	};

	const renderIcon = () => {
		switch (task.status) {
			case TaskStatus.waiting:
				return <TaskWaiting></TaskWaiting>;

			case TaskStatus.error:
				return <TaskError></TaskError>;
		}

		switch (task.type) {
			case TaskType.upload:
				return <UploadArrow></UploadArrow>;

			case TaskType.download:
				return <DownloadArrow></DownloadArrow>;
		}
	};

	return (
		<div className={getClassName()} onClick={removeTask}>
			<div className={styles.statusIcon}>
				{renderIcon()}
			</div>
			<div className={styles.cancel}>
				<Cancel></Cancel>
			</div>
			<div className={styles.fileName}>{task.fileName}</div>
			<div className={styles.progess}>{task.progess}%</div>
		</div>
	);
};

export default Task;
