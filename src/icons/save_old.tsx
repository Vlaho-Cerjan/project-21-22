import * as React from 'react';

function Save(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 21v-4.5A1.5 1.5 0 019.5 15h5a1.5 1.5 0 011.5 1.5V21" />
        <path
          clipRule="evenodd"
          d="M20.121 7.121L16.88 3.88A3 3 0 0014.757 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V9.243a3 3 0 00-.879-2.122v0z"
        />
      </g>
    </svg>
  );
}

const MemoSaveOld = React.memo(Save);
export default MemoSaveOld;
