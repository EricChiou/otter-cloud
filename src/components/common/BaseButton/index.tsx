import React, { FunctionComponent } from 'react';

import styles from './style.module.scss';

export enum ButtonType {
  default = 'default',
  normal = 'normal',
  success = 'success',
  danger = 'danger',
  warning = 'warning',
  info = 'info',
}

interface Props {
  type?: ButtonType;
  style?: object;
  disabled?: boolean;
  onClick?: () => void;
}

const BaseButton: FunctionComponent<Props> = ({ children, type, style, disabled, onClick }) => {
  let className = styles.btn;

  switch (type) {
    case ButtonType.normal:
      className += ` ${styles.normal}`;
      break;

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
      className += ` ${styles.default}`;
      break;
  }

  return (
    <button
      className={`${className} ${disabled ? styles.inactive : styles.active}`}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { BaseButton };
