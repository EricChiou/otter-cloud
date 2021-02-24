import React, {
  FunctionComponent,
  ChangeEvent,
  KeyboardEvent,
  useState,
  useRef,
  RefObject,
  useEffect,
} from 'react';

import styles from './style.module.scss';

interface Props {
  type?: string;
  style?: object;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  readonly?: boolean;
  disabled?: boolean;
  onFocus?: boolean;
  autoComplete?: (inputValue: string) => Promise<string[]>;
  onChange?: (e: ChangeEvent<HTMLInputElement> | null, value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyPerss?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const BaseInput: FunctionComponent<Props> = ({
  type,
  style,
  placeholder,
  value,
  defaultValue,
  readonly,
  disabled,
  onFocus,
  autoComplete,
  onChange,
  onKeyDown,
  onKeyPerss,
  onKeyUp,
}) => {
  const inputContainerRef: RefObject<HTMLInputElement> = useRef(null);
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const [options, setOptions] = useState<string[]>([]);
  const [position, setPosition] = useState({ top: 0, right: 0, left: 0 });
  const optionsRef: RefObject<HTMLInputElement> = useRef(null);

  const setValue = (value: string) => {
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  };

  useEffect(() => {
    if (value) { setValue(value); }

  }, [value]);

  useEffect(() => {
    if (onFocus) { inputRef.current?.focus(); }

  }, [onFocus, inputRef]);

  const getOptions = () => {
    if (!autoComplete || !inputRef.current || !inputContainerRef.current) { return; }

    const clientRect = inputContainerRef.current.getBoundingClientRect();
    setPosition({
      top: clientRect.top + inputContainerRef.current.clientHeight + 4,
      right: window.innerWidth - clientRect.right + 1,
      left: clientRect.left + 1,
    });

    autoComplete(inputRef.current.value).then((options) => {
      setOptions(options);
    });
  };

  const setActiveOption = (variable: number) => {
    if (!optionsRef.current) { return; }

    const optionEles = Array.from(optionsRef.current.getElementsByClassName(styles.option));

    let index = optionEles.findIndex((ele) => (ele.className.indexOf(styles.active) > -1));
    if (index > -1) {
      optionEles[index].classList.remove(styles.active);
    }

    index = index + variable;
    index = index < 0 ? 0 : index;
    index = index > (optionEles.length - 1) ? (optionEles.length - 1) : index;

    optionEles[index].classList.add(styles.active);
  };

  const keyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        setActiveOption(-1);
        break;
      case 'ArrowDown':
        setActiveOption(1);
        break;
      case 'Enter':
        if (optionsRef.current && inputRef.current) {
          const optionEles = Array.from(optionsRef.current.getElementsByClassName(styles.option));
          optionEles.forEach((ele, i) => {
            if (ele.className.indexOf(styles.active) > -1) {
              setValue(options[i]);
              setOptions([]);

              if (onChange) { onChange(null, options[i]); }
            }
          });
        }
        break;
      case 'Escape':
        setValue('');
        setOptions([]);
        break;
    }

    if (onKeyUp) { onKeyUp(e); }
  };

  return (
    <span ref={inputContainerRef} className={styles.inputContainer} style={style}>
      <input ref={inputRef} className={styles.input}
        type={type ? type : 'text'}
        placeholder={placeholder ? placeholder : ''}
        defaultValue={defaultValue ? defaultValue : undefined}
        readOnly={readonly ? true : false}
        disabled={disabled !== undefined ? disabled : false}
        onChange={(e) => {
          getOptions();
          if (onChange) { onChange(e, e.target.value); }
        }}
        onKeyDown={(e) => { if (onKeyDown) { onKeyDown(e); } }}
        onKeyPress={(e) => { if (onKeyPerss) { onKeyPerss(e); } }}
        onKeyUp={keyUp}
      ></input>
      {options.length ?
        <div
          ref={optionsRef}
          className={styles.autoComplete}
          style={{ top: position.top, right: position.right, left: position.left }}
        >
          {options.map((option) => {
            return (
              <div
                key={option}
                className={styles.option}
                onClick={() => {
                  setValue(option);
                  setOptions([]);

                  if (onChange) { onChange(null, option); }
                }}
              >{option}
              </div>
            );
          })}
        </div> : null
      }
    </span >
  );
};

export { BaseInput };
