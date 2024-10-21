import * as React from 'react';

function Enter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 10 9" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.75 1A.75.75 0 009 .25l-.102.007A.75.75 0 008.25 1v4.25H3V3L0 6l3 3V6.75h6.75V1z"
        fill="#323234"
      />
    </svg>
  );
}

const MemoEnter = React.memo(Enter);
export default MemoEnter;
