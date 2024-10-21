import * as React from 'react';

function EditMore(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x={6} y={4} width={12} height={16} rx={2} />
        <path d="M18 6h2a2 2 0 012 2v8a2 2 0 01-2 2h-2M6 6H4a2 2 0 00-2 2v8a2 2 0 002 2h2M12 14v-4M10 12h4" />
      </g>
    </svg>
  );
}

const MemoEditMoreSignage = React.memo(EditMore);
export default MemoEditMoreSignage;
