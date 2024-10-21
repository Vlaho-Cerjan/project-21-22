import * as React from 'react';

function LayoutNav(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <rect x={4.5} y={3} width={9} height={12} rx={2} stroke="#323234" />
        <path
          d="M13.5 4.5H15A1.5 1.5 0 0116.5 6v6a1.5 1.5 0 01-1.5 1.5h-1.5"
          stroke="#323234"
        />
        <path
          d="M4.5 4.5H3A1.5 1.5 0 001.5 6v6A1.5 1.5 0 003 13.5h1.5M9 10.5v-3M7.5 9h3"
          stroke="#4C4C70"
        />
      </g>
    </svg>
  );
}

const MemoLayoutNav = React.memo(LayoutNav);
export default MemoLayoutNav;
