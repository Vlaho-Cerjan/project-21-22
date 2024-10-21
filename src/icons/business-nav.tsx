import * as React from 'react';

function Business(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 15h-15" stroke="#323234" />
        <path d="M14.62 12.75V15" stroke="#4C4C70" />
        <rect
          x={12.75}
          y={7.5}
          width={3.75}
          height={5.25}
          rx={1.875}
          stroke="#323234"
        />
        <path
          d="M5.25 15V3A.75.75 0 016 2.25h6a.75.75 0 01.75.75v3M5.25 6.75H3a.75.75 0 00-.75.75V15M7.5 4.875h3"
          stroke="#4C4C70"
        />
        <path
          d="M7.5 7.125h3M7.5 9.375h3M7.875 15v-2.625c0-.207.168-.375.375-.375h1.5c.207 0 .375.168.375.375V15"
          stroke="#323234"
        />
      </g>
    </svg>
  );
}

const MemoBusinessNav = React.memo(Business);
export default MemoBusinessNav;
