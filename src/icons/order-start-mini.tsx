import * as React from 'react';

function OrderStartMini(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" fill="none" viewBox="0 0 96 16" {...props}>
      <circle
        id="step1"
        cx={8}
        cy={8}
        r={6.75}
        fill="#007DFF"
        fillOpacity={0.32}
        stroke="#007DFF"
        strokeWidth={1.5}
      />
      <circle
        id="step3"
        cy={8}
        r={6.75}
        fill="#fff"
        stroke="#C8C8CA"
        strokeWidth={1.5}
        cx={61}
      />
      <circle
        id="step2"
        cy={8}
        r={6.75}
        fill="#E1E1E2"
        stroke="#C8C8CA"
        strokeWidth={1.5}
        cx={35}
      />
      <path
        stroke="#C8C8CA"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={1}
        d="M19 8h5m21.5 0h5"
      />
      <circle
        id="step4"
        cy={8}
        r={6.75}
        fill="#fff"
        stroke="#C8C8CA"
        strokeWidth={1.5}
        cx={87.5}
      />
      <path
        stroke="#C8C8CA"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={1}
        d="M71.5 8h5"
      />
    </svg>
  );
}

const MemoOrderStartMini = React.memo(OrderStartMini);
export default MemoOrderStartMini;
