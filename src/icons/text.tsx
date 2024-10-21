import * as React from 'react';

function Text(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.043 15.01l-2.85-6.63-2.86 6.63.51-1.19h4.69" />
        <path
          clipRule="evenodd"
          d="M17.334 21h-10a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4z"
        />
        <path d="M17.494 11.579a2.01 2.01 0 11-2.843 2.844 2.01 2.01 0 012.843-2.844M18.084 11v4" />
      </g>
    </svg>
  );
}

const MemoText = React.memo(Text);
export default MemoText;
