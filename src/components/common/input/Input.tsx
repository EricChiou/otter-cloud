import React, { FunctionComponent } from 'react';

import styles from './Input.module.scss';

interface Props {
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: object
}

const Input: FunctionComponent<Props> = ({ type, placeholder, disabled, style }) => {
  return (
    <input className={styles.input}
      type={type ? type : 'text'}
      placeholder={placeholder ? placeholder : ''}
      disabled={disabled !== undefined ? disabled : false}
      style={style}
    ></input>
  );
}

export { Input };
