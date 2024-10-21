import * as React from 'react';

function MusicVideosNav(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g stroke="#4C4C70" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 3.75h9M6 1.5h6" />
        <path
          clipRule="evenodd"
          d="M14.88 16.5H3.12a1.62 1.62 0 01-1.62-1.62V7.62C1.5 6.725 2.225 6 3.12 6h11.76c.895 0 1.62.725 1.62 1.62v7.26a1.62 1.62 0 01-1.62 1.62z"
        />
        <path d="M7.358 12.601a1.125 1.125 0 11-1.591 1.591 1.125 1.125 0 011.591-1.591M11.483 11.851a1.125 1.125 0 11-1.591 1.591 1.125 1.125 0 011.591-1.591" />
        <path d="M7.688 13.396V9.78c0-.307.186-.583.471-.696l2.625-1.05a.75.75 0 011.028.696v3.918" />
      </g>
    </svg>
  );
}

const MemoMusicVideosNav = React.memo(MusicVideosNav);
export default MemoMusicVideosNav;
