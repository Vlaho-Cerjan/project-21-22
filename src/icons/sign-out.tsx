import * as React from 'react';

function SignOut(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        className="path"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M14.163 21l4.444-.988A1.777 1.777 0 0020 18.277V5.766c0-.833-.579-1.555-1.392-1.735l-4.444-.988A1.778 1.778 0 0012 4.779v14.486A1.777 1.777 0 0014.163 21v0z"
        />
        <path d="M15 10.98v2M4 16v2.042a2 2 0 002 2h3M4 8V6a2 2 0 012-2h3M4 12h5M7 14l2-2-2-2" />
      </g>
    </svg>
  );
}

const MemoSignOut = React.memo(SignOut);
export default MemoSignOut;
