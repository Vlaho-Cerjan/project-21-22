import * as React from 'react';

function RightArrowTip(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10.5 6.5l5 5-5 5"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoRightArrowTip = React.memo(RightArrowTip);
export default MemoRightArrowTip;
