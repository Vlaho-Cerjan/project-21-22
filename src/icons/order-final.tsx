import * as React from 'react';

function OrderFinal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 127 16" fill="none" {...props}>
      <circle
        cx={8}
        cy={8}
        r={6.75}
        fill="#007DFF"
        fillOpacity={0.32}
        stroke="#007DFF"
        strokeWidth={1.5}
      />
      <circle
        cx={82}
        cy={8}
        r={6.75}
        fill="#007DFF"
        fillOpacity={0.32}
        stroke="#007DFF"
        strokeWidth={1.5}
      />
      <circle
        cx={45}
        cy={8}
        r={6.75}
        fill="#007DFF"
        fillOpacity={0.32}
        stroke="#007DFF"
        strokeWidth={1.5}
      />
      <path
        d="M19 8h15M56 8h15"
        stroke="#C8C8CA"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={3}
      />
      <circle
        cx={119}
        cy={8}
        r={6.75}
        fill="#007DFF"
        fillOpacity={0.32}
        stroke="#007DFF"
        strokeWidth={1.5}
      />
      <path
        d="M93 8h15"
        stroke="#C8C8CA"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={3}
      />
    </svg>
  );
}

const MemoOrderFinal = React.memo(OrderFinal);
export default MemoOrderFinal;
