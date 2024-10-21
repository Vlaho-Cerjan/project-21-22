import * as React from 'react';

function MixesNav(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.006 12.003L17 15.001l-3 3.002M9 15H5a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v4" />
        <path
          clipRule="evenodd"
          d="M19 21h-8a2 2 0 01-2-2v-8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2z"
        />
        <path d="M9 15h8" />
      </g>
    </svg>
  );
}

const MemoMixesNav = React.memo(MixesNav);
export default MemoMixesNav;
