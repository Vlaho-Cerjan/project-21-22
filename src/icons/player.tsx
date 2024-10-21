import * as React from 'react';

function Player(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" {...props}>
      <g stroke="#707070" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.2 6.6H1.8A1.2 1.2 0 01.637 5.109l.6-2.4A1.2 1.2 0 012.401 1.8H4.2" />
        <path d="M4.2 10.2H1.8A1.2 1.2 0 01.6 9V5.4" />
        <circle cx={8.7} cy={8.7} r={0.9} />
        <path d="M7.8 2.4h1.8" />
        <rect x={6} y={0.6} width={5.4} height={10.8} rx={2} />
        <path d="M8.01 6.3h0v0M8.01 5.1h0v0M9.51 6.3h0v0M9.51 5.1h0v0" />
      </g>
    </svg>
  );
}

const MemoPlayer = React.memo(Player);
export default MemoPlayer;
