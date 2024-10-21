import * as React from 'react';

function AddPlaylist(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M19 21H5a2 2 0 01-2-2v-8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2z"
        />
        <path d="M5.999 6H18M6.999 3H17M10.25 15h3.5M12 16.75v-3.5" />
      </g>
    </svg>
  );
}

const MemoAddPlaylist = React.memo(AddPlaylist);
export default MemoAddPlaylist;
