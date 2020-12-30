import React, { FunctionComponent, useState, useEffect } from 'react';

import { UploadArrow, DownloadArrow, Cancel, TaskWaiting, TaskError } from 'src/components/icons';
import { TaskType } from 'src/shared/task-shared';

import styles from './style.module.scss';

enum TaskStatus {
	waiting = 'waiting',
	running = 'running',
	error = 'error',
}

interface Props {
	index: number;
	type: TaskType;
	prefix: string;
	fileName: string;
	file?: File;
	remove: (index: number) => void;
}

const Task: FunctionComponent<Props> = ({ type, prefix, fileName, index, remove }) => {
	const [progessPct, setProgessPct] = useState(0);
	const [status, setStatus] = useState(TaskStatus.waiting);

	useEffect(() => {
		setProgessPct(0);
		if (index < 5 && status !== TaskStatus.running && status !== TaskStatus.error) {
			setStatus(TaskStatus.running);
		}
	}, [index, status]);

	const removeTask = () => {
		// console.log(index);
		remove(index);
	}

	const getClassName = (): string => {
		switch (type) {
			case TaskType.upload:
				return styles.upload;

			case TaskType.download:
				return styles.download;
		}
	};

	const renderIcon = () => {
		switch (status) {
			case TaskStatus.waiting:
				return <TaskWaiting></TaskWaiting>;

			case TaskStatus.error:
				return <TaskError></TaskError>;
		}

		switch (type) {
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
			<div className={styles.fileName}>{fileName}</div>
			<div className={styles.progess}>{progessPct}%</div>
		</div>
	);
};

export default Task;
