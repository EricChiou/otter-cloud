import React, { FunctionComponent } from 'react';

interface Props {
  onClick?: () => void;
}

const DownloadArrow: FunctionComponent<Props> = ({ onClick }) => {
  return (
    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" onClick={onClick}>
      <path fill="currentColor" d="M176 32h96c13.3 0 24 10.7 24 24v200h103.8c21.4 0 32.1 25.8 17 41L241 473c-9.4 9.4-24.6 9.4-34 0L31.3 297c-15.1-15.1-4.4-41 17-41H152V56c0-13.3 10.7-24 24-24z"></path>
    </svg>
  );
}

export { DownloadArrow };
