import * as React from 'react';

function Down(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <path
        className="path"
        d="M5.25 7.5L9 11.25l3.75-3.75"
        stroke="#69696A"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoDown = React.memo(Down);
export default MemoDown;
