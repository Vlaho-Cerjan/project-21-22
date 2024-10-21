import * as React from 'react';

function TapHere(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M20.388 17.394l-1.734.729a.988.988 0 00-.528.527l-.731 1.738a1 1 0 01-1.881-.106l-1.472-4.998a1 1 0 011.242-1.242l4.998 1.47a1 1 0 01.106 1.882z"
        />
        <path d="M20 8.5h-3.5a2 2 0 01-2-2V3" />
        <path d="M20 12V8.51a3 3 0 00-.879-2.122l-2.509-2.51A3 3 0 0014.491 3H7a3 3 0 00-3 3v12a3 3 0 003 3h5" />
      </g>
    </svg>
  );
}

const MemoTapHere = React.memo(TapHere);
export default MemoTapHere;
