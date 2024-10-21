import * as React from 'react';

function CheckTick(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 8 7" fill="none" {...props}>
      <path
        d="M1 3l2 2 4-4"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

const MemoCheckTick = React.memo(CheckTick);
export default MemoCheckTick;
