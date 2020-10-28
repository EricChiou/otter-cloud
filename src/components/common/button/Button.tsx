import React, { FunctionComponent } from 'react';

import styles from './Button.module.scss';

export enum ButtonType {
  normal = 'normal',
  success = 'success',
  danger = 'danger',
  warning = 'warning',
  info = 'info',
}

interface Props {
  value?: string,
  type?: ButtonType,
  style?: object,
  onClick?: () => void,
}

const button: FunctionComponent<Props> = ({ value, type, style, onClick }) => {
  let className = styles.btn;

  switch (type) {
    case ButtonType.success:
      className += ` ${styles.success}`;
      break;

    case ButtonType.danger:
      className += ` ${styles.danger}`;
      break;

    case ButtonType.warning:
      className += ` ${styles.warning}`;
      break;

    case ButtonType.info:
      className += ` ${styles.info}`;
      break;

    default:
      className += ` ${styles.normal}`;
      break;
  }

  return (
    <button className={className} style={style} onClick={onClick}>{value}</button>
  )
};

export const Button = button;
