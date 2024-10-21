import * as React from 'react';

function Avatar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" {...props}>
      <g
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 40c0-5 4-8.8 8.8-8.8H29c5 0 8.8 4 8.8 8.8M30 10.4c3.4 3.4 3.4 8.8 0 12-3.4 3.2-8.8 3.4-12 0-3.2-3.4-3.4-8.8 0-12a8.7 8.7 0 0112 0" />
      </g>
    </svg>
  );
}

const MemoAvatar = React.memo(Avatar);
export default MemoAvatar;
