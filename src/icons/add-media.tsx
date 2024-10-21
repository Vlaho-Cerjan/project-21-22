import * as React from 'react';

function AddMedia(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19v-7M9.833 14L12 11.833 14.167 14" />
        <path d="M16 19h2.56c1.928 0 3.5-1.572 3.5-3.5s-1.572-3.5-3.5-3.5h-.435v-1c0-3.31-2.69-6-6-6-2.977 0-5.445 2.178-5.913 5.023-2.377.121-4.272 2.07-4.272 4.477a4.5 4.5 0 004.5 4.5H8" />
      </g>
    </svg>
  );
}

const MemoAddMedia = React.memo(AddMedia);
export default MemoAddMedia;
