import * as React from 'react';

function Info(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.009 11.25h1.15v4.25M11 15.5h2.31" />
        <path
          clipRule="evenodd"
          d="M6.82 19.828l-2.657-2.66-.01-.01a4.031 4.031 0 01-1.18-2.83V9.63l-.01-.01c-.01-1.07.42-2.08 1.17-2.83l2.65-2.66h-.01c.74-.76 1.76-1.18 2.82-1.18h4.68-.01a3.94 3.94 0 012.82 1.17l2.65 2.65v0c.75.74 1.17 1.76 1.17 2.82v4.68c0 1.06-.43 2.07-1.18 2.82l-2.657 2.65v-.01c-.76.74-1.77 1.17-2.83 1.17h-4.69v0c-1.07 0-2.08-.43-2.83-1.18l.104.108z"
        />
        <path d="M12.1 8.24h-.01c-.01.13-.12.24-.26.24a.263.263 0 01-.25-.26c0-.14.11-.25.24-.25h-.01c.13-.01.25.11.25.24v0" />
      </g>
    </svg>
  );
}

const MemoInfo = React.memo(Info);
export default MemoInfo;
