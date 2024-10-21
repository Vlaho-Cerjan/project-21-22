import * as React from 'react';

function AddVideo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 8H3M7 13H3M14 8h4M17 21a5 5 0 11.001-10.001A5 5 0 0117 21M17 14v4M19 16h-4M14 12V3M7 18V3" />
        <path d="M18 11.101V5a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2h7.418" />
      </g>
    </svg>
  );
}

const MemoAddVideo = React.memo(AddVideo);
export default MemoAddVideo;
