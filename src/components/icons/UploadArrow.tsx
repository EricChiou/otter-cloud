import React, { FunctionComponent } from 'react';

interface Props {
  onClick?: () => void;
}

const UploadArrow: FunctionComponent<Props> = ({ onClick }) => {
  return (
    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" onClick={onClick}>
      <path fill="currentColor" d="M272 480h-96c-13.3 0-24-10.7-24-24V256H48.2c-21.4 0-32.1-25.8-17-41L207 39c9.4-9.4 24.6-9.4 34 0l175.8 176c15.1 15.1 4.4 41-17 41H296v200c0 13.3-10.7 24-24 24z"></path>
    </svg>
  );
}

export { UploadArrow };
