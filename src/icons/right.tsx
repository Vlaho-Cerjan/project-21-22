import * as React from 'react';

function Right(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        className="path"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 6.5l5 5-5 5"
        fill="#fff"
      />
    </svg>
  );
}

const MemoRight = React.memo(Right);
export default MemoRight;
