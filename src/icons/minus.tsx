import * as React from 'react';

function Minus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 2" fill="none" {...props}>
      <path
        d="M1 1h16"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

const MemoMinus = React.memo(Minus);
export default MemoMinus;
