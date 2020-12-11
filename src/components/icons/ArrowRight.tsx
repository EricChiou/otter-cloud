import React, { FunctionComponent } from 'react';

interface Props {
  onClick?: () => void;
}

const ArrowRight: FunctionComponent<Props> = ({ onClick }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" onClick={onClick}>
      <path d="M0 24V0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M10 17l5-5-5-5v10z" />
    </svg>
  );
};

export { ArrowRight };
