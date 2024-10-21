import * as React from 'react';

function ClearDark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.83 9.17l-5.66 5.66M14.83 14.83L9.17 9.17" />
        <path
          clipRule="evenodd"
          d="M12 21v0a9 9 0 01-9-9v0a9 9 0 019-9v0a9 9 0 019 9v0a9 9 0 01-9 9z"
        />
      </g>
    </svg>
  );
}

const MemoClearDark = React.memo(ClearDark);
export default MemoClearDark;
