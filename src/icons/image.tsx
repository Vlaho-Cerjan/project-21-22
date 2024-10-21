import * as React from 'react';

function Image(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x={21}
          y={21}
          width={18}
          height={18}
          rx={5}
          transform="rotate(-180 21 21)"
        />
        <path d="M3.36 17.867l4.282-4.281a2 2 0 012.828 0l7.147 7.147M21 14.706l-3.12-3.12a2 2 0 00-2.828 0l-3.289 3.289M8.911 8.412h0a.122.122 0 110 0" />
      </g>
    </svg>
  );
}

const MemoImage = React.memo(Image);
export default MemoImage;
