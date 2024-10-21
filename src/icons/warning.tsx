import * as React from 'react';

function Warning(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g
        stroke="#E31008"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M9 2.25v0A6.75 6.75 0 0115.75 9v0A6.75 6.75 0 019 15.75v0A6.75 6.75 0 012.25 9v0A6.75 6.75 0 019 2.25z"
        />
        <path d="M9 9.375v-3.75M9 12a.188.188 0 10.002.375.188.188 0 00-.003-.375" />
      </g>
    </svg>
  );
}

const MemoWarning = React.memo(Warning);
export default MemoWarning;
