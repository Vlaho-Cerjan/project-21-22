import * as React from 'react';

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x={5.25}
        y={5.25}
        width={13.5}
        height={13.5}
        rx={2.75}
        fill="#fff"
        stroke="#E1E1E2"
        strokeWidth={1.5}
      />
    </svg>
  );
}

const MemoCheck = React.memo(Check);
export default MemoCheck;
