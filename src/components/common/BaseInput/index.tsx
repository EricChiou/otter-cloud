import React, { FunctionComponent, ChangeEvent, KeyboardEvent } from 'react';

import styles from './style.module.scss';

interface Props {
  type?: string;
  style?: object
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyPerss?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const Input: FunctionComponent<Props> = ({
  type,
  style,
  placeholder,
  disabled,
  onChange,
  onKeyDown,
  onKeyPerss,
  onKeyUp,
}) => {
  return (
    <input className={styles.input}
      type={type ? type : 'text'}
      style={style}
      placeholder={placeholder ? placeholder : ''}
      disabled={disabled !== undefined ? disabled : false}
      onChange={(e) => { if (onChange) { onChange(e); } }}
      onKeyDown={(e) => { if (onKeyDown) { onKeyDown(e); } }}
      onKeyPress={(e) => { if (onKeyPerss) { onKeyPerss(e); } }}
      onKeyUp={(e) => { if (onKeyUp) { onKeyUp(e); } }}
    ></input>
  );
}

export { Input };
