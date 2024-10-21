import * as React from 'react';

function MediaText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.71 15.01L8.86 8.38 6 15.01l.51-1.19h4.69" />
        <path
          clipRule="evenodd"
          d="M17 21H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4z"
        />
        <path d="M17.161 11.579a2.01 2.01 0 11-2.844 2.844 2.01 2.01 0 012.844-2.844M17.75 11v4" />
      </g>
    </svg>
  );
}

const MemoMediaText = React.memo(MediaText);
export default MemoMediaText;
