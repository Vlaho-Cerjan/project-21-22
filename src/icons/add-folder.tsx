import * as React from 'react';

function AddFolder(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 19v-4M4 17h4M3 12V6a2 2 0 012-2h4.47a1 1 0 01.827.437l1.446 2.125A1 1 0 0012.57 7H19a2 2 0 012 2v9a2 2 0 01-2 2h-8" />
      </g>
    </svg>
  );
}

const MemoAddFolder = React.memo(AddFolder);
export default MemoAddFolder;
