import * as React from 'react';

function Home(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 21 20" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.417 11.667V10H11.75" />
        <path
          clipRule="evenodd"
          d="M18 14.167V8.89a3 3 0 00-1.126-2.343l-4.031-3.225a3.75 3.75 0 00-4.686 0L4.126 6.547A3 3 0 003 8.89v5.277A3.333 3.333 0 006.333 17.5h8.334A3.333 3.333 0 0018 14.167z"
        />
        <path d="M13.417 10l-2.5 2.5-2.084-1.667L7.167 12.5" />
      </g>
    </svg>
  );
}

const MemoHome = React.memo(Home);
export default MemoHome;
