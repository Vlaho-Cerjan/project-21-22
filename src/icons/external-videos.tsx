import * as React from 'react';

function ExternalVideos(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h12M6 1h8" />
        <path
          clipRule="evenodd"
          d="M9.259 11.071l2.717 1.607a.525.525 0 010 .904l-2.717 1.607a.525.525 0 01-.792-.452v-3.213a.525.525 0 01.792-.453v0z"
        />
        <path
          clipRule="evenodd"
          d="M17 19H3a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2z"
        />
      </g>
    </svg>
  );
}

const MemoExternalVideos = React.memo(ExternalVideos);
export default MemoExternalVideos;
