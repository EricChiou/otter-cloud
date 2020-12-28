import React, {
  FunctionComponent,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  RefObject,
  useEffect
} from 'react';

import styles from './style.module.scss';

interface Props {
  type?: string;
  style?: object
  placeholder?: string;
  disabled?: boolean;
  onFocus?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyPerss?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const BaseInput: FunctionComponent<Props> = ({
  type,
  style,
  placeholder,
  disabled,
  onFocus,
  onChange,
  onKeyDown,
  onKeyPerss,
  onKeyUp,
}) => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    if (onFocus) {
      inputRef.current?.focus();
    }

  }, [onFocus, inputRef]);

  return (
    <input ref={inputRef} className={styles.input}
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

export { BaseInput };
