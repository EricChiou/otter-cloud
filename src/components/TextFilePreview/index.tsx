import React, { FunctionComponent, useRef, RefObject, useEffect } from 'react';

import styles from './style.module.scss';

interface Props {
  textBlob: Blob;
  close: () => void;
}

const TextFilePreview: FunctionComponent<Props> = ({ textBlob, close }) => {
  const textRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keyup', onKeyPress);

    return () => { window.removeEventListener('keyup', onKeyPress); };
  }, [close]);

  useEffect(() => {
    const fileReader = new FileReader();
    fileReader.readAsText(new Blob([textBlob]));
    fileReader.onload = () => {
      if (textRef.current && fileReader.result) {
        textRef.current.innerText = fileReader.result.toString();
      }
    };
  }, [textBlob]);

  return (
    <div
      ref={textRef}
      className={styles.text}
      onClick={(e) => { e.stopPropagation(); }}
    ></div>
  );
};

export default TextFilePreview;
