import * as React from 'react';

function ArrowCircleRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.5 12H4h11.5z" />
      <path
        d="M15.5 12H4"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 8.5l3.5 3.5-3.5 3.5" />
      <path
        d="M12 8.5l3.5 3.5-3.5 3.5"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.636 5.636a9 9 0 110 12.728"
        />
        <path
          d="M5.636 5.636a9 9 0 110 12.728"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const MemoArrowCircleRight = React.memo(ArrowCircleRight);
export default MemoArrowCircleRight;
