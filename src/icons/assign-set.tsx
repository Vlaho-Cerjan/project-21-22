import * as React from 'react';

function AssignSet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g strokeWidth={1.5}>
        <path
          d="M7 13H6a1.5 1.5 0 00-1.5 1.5V18"
          stroke="#323232"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={12} cy={7} r={5} stroke="#323234" />
        <path
          d="M17 13h1a1.5 1.5 0 011.5 1.5V18M12 18v-3.5"
          stroke="#323232"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x={17.5}
          y={18}
          width={4}
          height={4}
          rx={1}
          stroke="#323232"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x={10}
          y={18}
          width={4}
          height={4}
          rx={1}
          stroke="#323232"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x={2.5}
          y={18}
          width={4}
          height={4}
          rx={1}
          stroke="#323232"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const MemoAssignSet = React.memo(AssignSet);
export default MemoAssignSet;
