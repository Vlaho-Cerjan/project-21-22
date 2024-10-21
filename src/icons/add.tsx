import * as React from 'react';

function Add(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        className="path"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 8v8M16 12H8" />
        <path
          clipRule="evenodd"
          d="M12 21v0a9 9 0 01-9-9v0a9 9 0 019-9v0a9 9 0 019 9v0a9 9 0 01-9 9z"
        />
      </g>
    </svg>
  );
}

const MemoAdd = React.memo(Add);
export default MemoAdd;
