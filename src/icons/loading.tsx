import * as React from 'react';

function Loading(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g strokeWidth={1.5}>
        <circle
          className="whiteCircle"
          cx={12}
          cy={12}
          r={8}
          stroke="#E1E1E2"
        />
        <circle
          className="greyCircle"
          cx={6.873}
          cy={9.609}
          r={4}
          transform="rotate(-20 6.873 9.61)"
          stroke="#323234"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

const MemoLoading = React.memo(Loading);
export default MemoLoading;
