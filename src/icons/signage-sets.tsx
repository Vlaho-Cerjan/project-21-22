import * as React from 'react';

function SignageSets(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 16" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x={4.636} y={0.889} width={8.727} height={14.222} rx={2} />
        <path d="M13.364 2.667h1.454c.803 0 1.455.796 1.455 1.777v7.112c0 .981-.652 1.777-1.455 1.777h-1.454M4.636 2.667H3.182c-.803 0-1.455.796-1.455 1.777v7.112c0 .981.652 1.777 1.455 1.777h1.454M9 9.778V6.222M7.545 8h2.91" />
      </g>
    </svg>
  );
}

const MemoSignageSets = React.memo(SignageSets);
export default MemoSignageSets;
