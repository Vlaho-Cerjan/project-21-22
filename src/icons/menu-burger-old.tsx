import * as React from 'react';

function MenuBurgerOld(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.498 12h13.005M5.498 16.002h13.005M5.497 7.998h13.005" />
      </g>
    </svg>
  );
}

const MemoMenuBurgerOld = React.memo(MenuBurgerOld);
export default MemoMenuBurgerOld;
