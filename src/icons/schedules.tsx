import * as React from 'react';

function Schedules(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.476 4.571H.762M11.81 8.381v0a3.429 3.429 0 11-3.43 3.429h0a3.429 3.429 0 013.43-3.429s0 0 0 0" />
        <path d="M9.656 14.476H3.048h0A2.286 2.286 0 01.762 12.19v0-9.142h0A2.286 2.286 0 013.048.762h9.143v0a2.286 2.286 0 012.285 2.286v6.608" />
        <path d="M11.728 10.654v1.34l1.053.641M8.952 7.2v0a.037.037 0 10.037.037v0a.037.037 0 00-.037-.037M6.285 7.2v0a.037.037 0 00-.037.037v0a.037.037 0 10.038-.037h-.001M3.618 7.2v0a.037.037 0 00-.037.038v0a.037.037 0 10.037-.037s0 0 0 0M6.285 9.486v0a.037.037 0 00-.037.037v0a.037.037 0 10.038-.037h-.001M3.618 9.486v0a.037.037 0 00-.037.038v0a.037.037 0 10.037-.038s0 0 0 0M6.285 11.772v0a.037.037 0 00-.037.037v0a.037.037 0 10.038-.037h-.001M3.618 11.772v0a.037.037 0 00-.037.037v0a.037.037 0 10.037-.037s0 0 0 0" />
      </g>
    </svg>
  );
}

const MemoSchedules = React.memo(Schedules);
export default MemoSchedules;
