import * as React from 'react';

function PlaylistsNav(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.75 6h-7.5M6.89 11.625H5.25M6.89 9H5.25" stroke="#4C4C70" />
        <path
          clipRule="evenodd"
          d="M9.75 9.188a.563.563 0 01.852-.482l1.875 1.124a.562.562 0 010 .965l-1.875 1.124a.563.563 0 01-.852-.482V9.188z"
          stroke="#4C4C70"
        />
        <rect
          x={2.25}
          y={2.25}
          width={13.5}
          height={13.5}
          rx={5}
          stroke="#323234"
        />
      </g>
    </svg>
  );
}

const MemoPlaylistsNav = React.memo(PlaylistsNav);
export default MemoPlaylistsNav;
