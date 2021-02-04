import React, { FunctionComponent } from 'react';

interface Props {
  onClick?: () => void;
}

const ErrorCircle: FunctionComponent<Props> = ({ onClick }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" onClick={onClick}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" transform="translate(12, -5) rotate(45)" />
    </svg>
  );
};

export { ErrorCircle };
