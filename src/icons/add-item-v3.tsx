import * as React from 'react';

function AddItemV3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 3.23A9.028 9.028 0 1020.77 10M17.25 5.251h3M18.75 6.75v-3" />
        <path d="M11.999 11.25a.25.25 0 10.002.5.25.25 0 00-.002-.5" />
        <path
          clipRule="evenodd"
          d="M8.5 11.5v0A3.5 3.5 0 0112 8v0a3.5 3.5 0 013.5 3.5v0c0 1.639-1.788 3.389-2.808 4.254-.403.328-.98.328-1.383 0C10.288 14.89 8.5 13.14 8.5 11.5z"
        />
      </g>
    </svg>
  );
}

const MemoAddItemV3 = React.memo(AddItemV3);
export default MemoAddItemV3;
