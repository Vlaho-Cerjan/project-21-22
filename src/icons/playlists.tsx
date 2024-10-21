import * as React from 'react';

function Playlists(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.2 3.2h9.6M4.8.8h6.4" />
        <path
          clipRule="evenodd"
          d="M7.407 8.857l2.174 1.285a.42.42 0 010 .724L7.407 12.15a.42.42 0 01-.633-.361V9.22a.42.42 0 01.633-.363v0z"
        />
        <path
          clipRule="evenodd"
          d="M13.6 15.2H2.4a1.6 1.6 0 01-1.6-1.6V7.2a1.6 1.6 0 011.6-1.6h11.2a1.6 1.6 0 011.6 1.6v6.4a1.6 1.6 0 01-1.6 1.6z"
        />
      </g>
    </svg>
  );
}

const MemoPlaylists = React.memo(Playlists);
export default MemoPlaylists;
