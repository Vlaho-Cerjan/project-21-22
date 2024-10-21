import * as React from 'react';

function Rewards(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <g
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M14.4 4.8H1.6a.8.8 0 00-.8.8v1.6a.8.8 0 00.8.8h12.8a.8.8 0 00.8-.8V5.6a.8.8 0 00-.8-.8z"
        />
        <path d="M8 15.2V4.8M10.957 3.69c-.863.897-2.22 1.11-2.878 1.11M8.08 4.8s-.396-2.493.576-3.504M10.957 3.69a1.741 1.741 0 000-2.394 1.582 1.582 0 00-2.3 0M5.043 3.69c.863.897 2.22 1.11 2.878 1.11M7.92 4.8s.396-2.493-.576-3.504M5.043 3.69a1.741 1.741 0 010-2.394 1.582 1.582 0 012.3 0M13.6 8v6.4a.8.8 0 01-.8.8H3.2a.8.8 0 01-.8-.8V8" />
      </g>
    </svg>
  );
}

const MemoRewards = React.memo(Rewards);
export default MemoRewards;
