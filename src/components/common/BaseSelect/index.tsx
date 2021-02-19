import React, { ChangeEvent, FunctionComponent } from 'react';

import styles from './style.module.scss';

interface Props {
  placeholder?: string;
  options?: {
    label: string;
    value: string | number | readonly string[] | undefined;
  }[];
  style?: object;
  optionStyle?: object;
  defaultSelect?: boolean;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const BaseSelect: FunctionComponent<Props> = ({
  placeholder,
  options,
  style,
  optionStyle,
  defaultSelect,
  onChange,
}: Props) => {
  const getDefaultValue = () => {
    if (placeholder) { return 'select-placeholder'; }
    if (defaultSelect && options && options[0]) { return options[0].value; }

    return undefined;
  };

  return (
    <select
      className={styles.select}
      style={style}
      defaultValue={getDefaultValue()}
      onChange={(e) => { if (onChange) { onChange(e); } }}
    >
      {placeholder ?
        <option
          className={styles.option}
          style={optionStyle}
          disabled
          hidden
          value={'select-placeholder'}
        >
          {placeholder}
        </option> : null
      }
      {options?.map((option, i) => {
        if (!placeholder && defaultSelect && i === 0) {
          return (
            <option
              key={i}
              className={styles.option}
              value={option.value}
              style={optionStyle}
            >
              {option.label}
            </option>
          );
        }
        return (
          <option
            key={i}
            className={styles.option}
            value={option.value}
            style={optionStyle}
          >
            {option.label}
          </option>
        );
      })}
    </select>
  );
};

export { BaseSelect };
