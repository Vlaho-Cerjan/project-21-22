import * as React from 'react';

function Trash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        className="path"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18.5 7v12a2 2 0 01-2 2h-9a2 2 0 01-2-2V7M20 7H4M8.5 7v-.5a3.5 3.5 0 117 0V7M10 16v-4M14 16v-4" />
      </g>
    </svg>
  );
}

const MemoTrash = React.memo(Trash);
export default MemoTrash;
