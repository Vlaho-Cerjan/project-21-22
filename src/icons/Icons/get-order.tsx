import * as React from 'react';

function GetOrder(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 22" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 20.078H3a2 2 0 01-2-2v-10.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 011.5 1.5v4.5" />
        <path d="M12.5 6.078v-1a3.5 3.5 0 00-3.5-3.5v0a3.5 3.5 0 00-3.5 3.5v1" />
        <path
          clipRule="evenodd"
          d="M13.214 19.18l2.89-2.888a.5.5 0 00-.22-.836l-4-1.11a.5.5 0 00-.615.616l1.11 3.999a.5.5 0 00.835.22z"
        />
        <path d="M16.25 19.328l-1.591-1.592M9 12.078l-.5-.5M12.5 11.578l.5-.5M8 16.078l.5-.5" />
      </g>
    </svg>
  );
}

const MemoGetOrder = React.memo(GetOrder);
export default MemoGetOrder;
