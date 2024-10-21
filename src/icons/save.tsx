import * as React from 'react';

function Save(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none" {...props}>
      <g
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.667 12.25V9.625c0-.483.391-.875.875-.875h2.916c.483 0 .875.392.875.875v2.625" />
        <path
          clipRule="evenodd"
          d="M11.737 4.154L9.846 2.263a1.75 1.75 0 00-1.238-.513H3.5A1.75 1.75 0 001.75 3.5v7c0 .966.784 1.75 1.75 1.75h7a1.75 1.75 0 001.75-1.75V5.392c0-.465-.184-.91-.513-1.238v0z"
        />
      </g>
    </svg>
  );
}

const MemoSave = React.memo(Save);
export default MemoSave;
