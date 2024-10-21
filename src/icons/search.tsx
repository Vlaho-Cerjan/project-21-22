import * as React from 'react';

function Search(props: React.SVGProps<SVGSVGElement>) {
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
          d="M11.05 4a7.055 7.055 0 000 14.11 7.06 7.06 0 000-14.12V4z"
        />
        <path d="M20 20l-3.95-3.95" />
      </g>
    </svg>
  );
}

const MemoSearch = React.memo(Search);
export default MemoSearch;
