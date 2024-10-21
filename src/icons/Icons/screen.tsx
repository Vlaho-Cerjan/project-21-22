import * as React from 'react';

function Screen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 21" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M19.091 2.048v12c.001.281-.106.55-.294.74a.854.854 0 01-.695.256 86.225 86.225 0 00-16.203 0 .854.854 0 01-.696-.257 1.043 1.043 0 01-.294-.739v-12c-.001-.28.106-.549.294-.739a.854.854 0 01.696-.256 86.232 86.232 0 0016.203 0 .854.854 0 01.695.256c.188.19.295.458.294.74z"
        />
        <path d="M3.636 19.049a20.748 20.748 0 0112.728 0" />
      </g>
    </svg>
  );
}

const MemoScreen = React.memo(Screen);
export default MemoScreen;
