import * as React from 'react';

function Lock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="lock"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 21H7a2 2 0 01-2-2v-8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z"
        fill="#AAAAAC"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 9V7a4 4 0 00-8 0v2"
        fill="#AAAAAC"
      />
      <path
        d="M16 9V7a4 4 0 00-4-4v0a4 4 0 00-4 4v2"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.998 14.5a.5.5 0 10.004 1 .5.5 0 00-.004-1z"
          fill="#AAAAAC"
        />
        <path
          d="M11.998 14.5a.5.5 0 10.004 1 .5.5 0 00-.004-1"
          stroke="#323234"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const MemoLock = React.memo(Lock);
export default MemoLock;
