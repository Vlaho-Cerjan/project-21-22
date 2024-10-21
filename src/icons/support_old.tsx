import * as React from 'react';

function Support(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M19 17h-1a1 1 0 01-1-1v-5a1 1 0 011-1h1a2 2 0 012 2v3a2 2 0 01-2 2zM6 17H5a2 2 0 01-2-2v-3a2 2 0 012-2h1a1 1 0 011 1v5a1 1 0 01-1 1z"
        />
        <path d="M18.5 10v-.5A6.5 6.5 0 0012 3v0a6.5 6.5 0 00-6.5 6.5v.5" />
        <path
          clipRule="evenodd"
          d="M12.625 21.25h-1.25c-.69 0-1.25-.56-1.25-1.25v0c0-.69.56-1.25 1.25-1.25h1.25c.69 0 1.25.56 1.25 1.25v0c0 .69-.56 1.25-1.25 1.25z"
        />
        <path d="M13.875 20H16a2 2 0 002-2v-1" />
      </g>
    </svg>
  );
}

const MemoSupportOld = React.memo(Support);
export default MemoSupportOld;
