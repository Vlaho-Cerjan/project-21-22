import * as React from 'react';

function Question(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M12 21v0a9 9 0 01-9-9v0a9 9 0 019-9v0a9 9 0 019 9v0a9 9 0 01-9 9z"
        />
        <path d="M12 13.25V13c0-.817.505-1.26 1.011-1.6.494-.333.989-.767.989-1.567a2 2 0 10-4 0M11.999 16a.25.25 0 10.002.5A.25.25 0 0012 16" />
      </g>
    </svg>
  );
}

const MemoQuestion = React.memo(Question);
export default MemoQuestion;
