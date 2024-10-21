import * as React from 'react';

function NavDevices(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.6 8.8H2.4A1.6 1.6 0 01.85 6.812l.8-3.2A1.6 1.6 0 013.2 2.4H5.6" />
        <path d="M5.6 13.6H2.4A1.6 1.6 0 01.8 12V7.2" />
        <circle cx={11.6} cy={11.6} r={1.2} />
        <path d="M10.4 3.2h2.4" />
        <rect x={8} y={0.8} width={7.2} height={14.4} rx={2} />
        <path d="M10.68 8.4h0v0M10.68 6.8h0v0M12.68 8.4h0v0M12.68 6.8h0v0" />
      </g>
    </svg>
  );
}

const MemoNavDevices = React.memo(NavDevices);
export default MemoNavDevices;
