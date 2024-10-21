import * as React from 'react';

function AddItem(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 21.004h4M10 2.996h4M2.996 10v4M21.004 10v4M12 15V9M15 12H9M6.998 21.004v0a4.002 4.002 0 01-4.002-4.002v0M6.998 21.004a4.002 4.002 0 01-4.002-4.002M17.002 2.996a4.002 4.002 0 014.002 4.002M2.996 6.998a4.002 4.002 0 014.002-4.002M21.004 17.002a4.002 4.002 0 01-4.002 4.002" />
      </g>
    </svg>
  );
}

const MemoAddItem = React.memo(AddItem);
export default MemoAddItem;
