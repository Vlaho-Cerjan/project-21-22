import * as React from 'react';

function Video(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x={3.667} y={3} width={18} height={18} rx={5} />
        <path
          clipRule="evenodd"
          d="M9.416 9.502a1.5 1.5 0 012.272-1.286l4.165 2.498a1.5 1.5 0 010 2.572l-4.165 2.498a1.5 1.5 0 01-2.272-1.286V9.502z"
        />
      </g>
    </svg>
  );
}

const MemoVideo = React.memo(Video);
export default MemoVideo;
