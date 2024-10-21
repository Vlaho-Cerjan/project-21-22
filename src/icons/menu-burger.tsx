import * as React from 'react';

function MenuBurger(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 12H5M16 9l3 3-3 3" stroke="#007DFF" />
        <path d="M13 17H5m8-10H5" stroke="#323232" />
      </g>
    </svg>
  );
}

const MemoMenuBurger = React.memo(MenuBurger);
export default MemoMenuBurger;
