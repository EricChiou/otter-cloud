import React, { FunctionComponent } from 'react';

interface Props {
  onClick?: () => void;
}

const List: FunctionComponent<Props> = ({ onClick }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" onClick={onClick}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
    </svg>
  );
};

export { List };
