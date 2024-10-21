import * as React from 'react';

function AddItemV4(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3.523a8.865 8.865 0 00-6 0M3.157 10.358a8.98 8.98 0 013-5.196M6.157 18.837a8.981 8.981 0 01-3-5.195M9 20.477c1.94.697 4.06.697 6 0M20.843 10.358a8.98 8.98 0 00-3-5.196M17.843 18.837a8.981 8.981 0 003-5.195M9 12h6M12 15V9" />
      </g>
    </svg>
  );
}

const MemoAddItemV4 = React.memo(AddItemV4);
export default MemoAddItemV4;
